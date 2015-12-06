/*global machine:true, parser:true, $:true, ace:true, aceEditor:true, bytecode:true*/

/**
 *  - No check is being done that we don't allocate more than 512 control stores.
 *  - Looots of things are bad.
 */

var mic1;
var stack;

var malEditor;
var ijvmEditor;
var byteCode;

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
		//console.log("Memory offset:", idx, "value:", val, "extent:", this.extent);
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
			//console.log("SP Written:", v);
			if (v + 1 < this.extent) {
				while (v + 1 < this.extent) {
					// Assume only one element is removed at a time.
					$('#stackarea :first-child').remove();
					this.extent--;
				}
			} else if (v > this.extent) {
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
	//stack = new stack_visualization(mic1.registers.CPP);

	mic1.setRegisterWriteCallback(function(reg, v) {
		//console.log("Writing", v, "in", reg);
		$("#s" + reg).html(reg + ":" + v);
		//stack.registerWriteCallback(reg, v);
	});

	mic1.setMemoryWriteCallback(function(val, idx) {
		$("#stack").html(mic1.memory.stackArea);
		//stack.memoryWriteCallback(val, idx);
	});

	mic1.setInstructionCallback(function(mOp, na) {
		if (isInt(mOp.lineNumber)) {
			malEditor.scrollTo(mOp.lineNumber - 1);
			malEditor.highlight(mOp.lineNumber - 1);
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

function main(microCode, ijvmCode) {
	initializeEditors(microCode, ijvmCode);

	$('#mal-input').val(microCode);
	mic1 = parse_microcode(microCode);

	$("#btn-step").click(function() {
		mic1.step();
	});

	$("#btn-run").click(function() {
		mic1.run();
	});

	$("#btn-reset").click(function() {
		//stack.reset();
		mic1 = parse_microcode(malEditor.getContents());
		malEditor.clearHighlight();
	});

	$("#btn-compile").click(function() {
		byteCode = new bytecode(ijvmEditor.getContents());
	});
}
