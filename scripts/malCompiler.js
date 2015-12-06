/*global define:true */

define(['mal'], function(mal) {
	// Stolen from: http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
	function isInt(value) {
		var x;
		if (isNaN(value)) {
			return false;
		}
		x = parseFloat(value);
		return (x | 0) === x;
	}

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
		var ast = mal.parse(microCode);

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
		return {
			store: store,
			microInstructions: microinstructions,
			errors: []
		};
	}

	return function(microCode) {
		return parse_microcode(microCode);
	};
});
