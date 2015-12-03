/*global machine:true, parser:true, $:true, ace:true*/

/**
 *  - No check is being done that we don't allocate more than 512 control stores.
 *  - Looots of things are bad.
 */

var mic1;
var stack;

var currentInstruction = null;
var highlightedInstruction = null;
var editorSession;
var editor;

// Stolen from: http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
function isInt(value) {
	var x;
	if (isNaN(value)) {
		return false;
	}
	x = parseFloat(value);
	return (x | 0) === x;
}

var stack_visualization = (function() {
	function stack(maWords) {
		this.extent = maWords;
		this.maWords = maWords;
	}

	stack.prototype.pushElement = function(val) {
		this.extent++;
		var se = $('<div>').addClass('bg-info stack-element').prop('title', this.extent).html(val);
		$('#stackarea').prepend(se);
	};

	stack.prototype.memoryWriteCallback = function(val, idx) {
		console.log("Memory offset:", idx, "value:", val, "extent:", this.extent);
		if (idx > this.extent) {
			// Assume we only write one above.
			this.pushElement(val);
		} else {
			var child = this.extent - idx;
			// Children are 1 indexed, the above calculation is not.
			$('#stackarea :nth-child(' + (child + 1) + ')').html(val);
		}
	};

	stack.prototype.registerWriteCallback = function(reg, v) {
		if (reg === 'SP') {
			console.log("SP Written:", v);
			if (v < this.extent) {
				console.log("SP Decreased");
				// Assume only one element is removed at a time.
				$('#stackarea :first-child').remove();
			} else {
				this.pushElement('#');
			}
		}
	};

	stack.prototype.reset = function() {
		$('#stackarea').html('');
		this.extent = this.maWords;
	};

	// Decrease the extent to where the stackpointer points.
	//stack.prototype.mainLabelCallback = function() {
	//};

	return stack;
}());

function assign_addresses(microinstructions) {
	var control_store = [];
	var jumps = {}, labels = {}, freeptr = 0;
	var i, na;

	// Resolve all microinstructions that have a predefined position.
	for (i = 0; i < microinstructions.length; i++) {
		na = microinstructions[i].addr;
		if (isInt(na)) {
			control_store[na] = i;
		} 
		
		na = microinstructions[i].nextaddress;
		if (!!na && na.constructor === Array) {
			jumps[na[1]] = na[0];
		}
	}

	// Layout the necesarry jumps instructions.
	var key;
	for (key in jumps) {
		if (jumps.hasOwnProperty(key)) {
			while (!!control_store[freeptr] || !!control_store[freeptr + 256]) {
				freeptr++;
			}

			labels[key] = freeptr;
			control_store[freeptr] = 0xdeadbeef; // Store non-zero value

			labels[jumps[key]] = freeptr + 256;
			control_store[freeptr + 256] = 0xdeadbeef; // Store non-zero value
			freeptr++;
		}
	}

	freeptr = 0;
	for (i = 0; i < microinstructions.length; i++) {
		na = microinstructions[i].label;

		if (labels.hasOwnProperty(na)) {
			// We have already assigned labels to these.
			control_store[labels[na]] = i;
			microinstructions[i].addr = labels[na];
		} else if(!isInt(microinstructions[i].nextaddress)) {
			while (!!control_store[freeptr]) {
				freeptr++;
			}

			control_store[freeptr] = i;
			microinstructions[i].addr = freeptr;
			if (!!na) {
				labels[na] = freeptr;
			}
		}
	}

	for (i = 0; i < microinstructions.length; i++) {
		na = microinstructions[i].nextaddress;
		if (!!na && !isInt(na)) {
			if (na.constructor === Array) {
				microinstructions[i].nextaddress = labels[na[1]];
			} else {
				microinstructions[i].nextaddress = labels[na];
			}
		} else if (!isInt(na)) {
			microinstructions[i].nextaddress = microinstructions[i+1].addr;
		}
	}

	//console.log(labels);

	return {control: control_store, entrypoint: labels.mic1_entry};
}

function parse_microcode(microCode) {
	var ast = parser.parse(microCode);

	var microinstructions = [];
	var mi, i;
	for (i = 0; i < ast.length; i++) {
		if (typeof ast[i] === "function") {
			i++;
			mi = ast[i-1](ast[i]);
			microinstructions.push(mi);
		} else {
			microinstructions.push(ast[i]);
		}
	}

	microinstructions.pop(); // Remove tailing '' in array.

	var store = assign_addresses(microinstructions);
	var mic1 = new machine(store, microinstructions, [0x00]);
	stack = new stack_visualization(mic1.registers.CPP);

	mic1.setRegisterWriteCallback(function(reg, v) {
		//console.log("Writing", v, "in", reg);
		$("#s" + reg).html(reg + ":" + v);
		stack.registerWriteCallback(reg, v);
	});

	mic1.setMemoryWriteCallback(function(val, idx) {
		$("#stack").html(mic1.memory.stackArea);
		stack.memoryWriteCallback(val, idx);
	});

	mic1.setInstructionCallback(function(mOp, na) {
		if (isInt(highlightedInstruction)) {
			editorSession.removeGutterDecoration(highlightedInstruction, "curInst");
		}

		if (isInt(mOp.lineNumber)) {
			editorSession.addGutterDecoration(mOp.lineNumber - 1, "curInst");
			editor.moveCursorToPosition({row: mOp.lineNumber - 1, column: 0});
			editor.scrollToLine(mOp.lineNumber - 1, true, false, null);
			highlightedInstruction = mOp.lineNumber - 1;
		} else {
			console.log("Missing linenumber:", mOp);
		}

		var naStr = "0x" + (na + 0x1000).toString(16).substr(1).toUpperCase();
		$('#sNA').html(naStr);
	});

	//mic1.setMainLabelCallback(function() {
	//});

	mic1.refreshRegisterCallback();
	mic1.refreshStackCallback();

	return mic1;
}


function main(microCode) {
	editor = ace.edit("editor");
	editor.$blockScrolling = Infinity;
	editor.setTheme("ace/theme/github");
	editorSession = editor.getSession();
	var editorDocument = editorSession.getDocument();
	editorDocument.setValue(microCode);

	$('#mal-input').val(microCode);
	mic1 = parse_microcode(microCode);

	$("#btn-step").click(function() {
		mic1.step();
	});

	$("#btn-run").click(function() {
		mic1.run();
	});

	$("#btn-reset").click(function() {
		stack.reset();
		mic1 = parse_microcode(editorDocument.getValue());
		if (isInt(highlightedInstruction)) {
			editorSession.removeGutterDecoration(highlightedInstruction, "curInst");
		}
		highlightedInstruction = null;
	});
}

$.ajax({
	url: "mic1.mal",
	dataType: "text",
	success: function(h) {
		$('#microcode').html(h);
		main(h);
	}
});
