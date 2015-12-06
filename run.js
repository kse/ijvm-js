var parser = require('./ijvm.js'),
    fs     = require('fs');

/**
 *  - No check is being done that we don't allocate more than 512 control stores.
 *  - Looots of things are bad.
 */

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

			console.log("Placing " + key + " in " + freeptr);
			labels[key] = freeptr;
			control_store[freeptr] = 0xdeadbeef; // Store non-zero value
			console.log("Placing " + jumps[key] + " in " + (freeptr + 256));
			control_store[freeptr + 256] = 0xdeadbeef; // Store non-zero value
			labels[jumps[key]] = freeptr + 256;
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

	return control_store;
}

fs.readFile('imul.j', 'utf8', function(err, data) {
    if (err) {
        console.log("ERROR: ", err);
        return false;
    }

	var ast = parser.parse(data);
	//console.log(ast);
	var constantPool = [];
	var methods      = {};
	var i, sum = 0;
	ast.forEach(function(e) {
		methods[e.name] = constantPool.length;
		constantPool.push(0);
	});

	ast.forEach(function(e) {
		e.generateBytecode({
			'bipush':        [0x10, ['byte']],
			'dup':           [0x59, []],
			'goto':          [0xA7, ['label']],
			'iadd':          [0x60, []],
			'iand':          [0x7E, []],
			'ifeq':          [0x99, ['label']],
			'iflt':          [0x9B, ['label']],
			'if_icmpeq':     [0x9F, ['label']],
			'iinc':          [0x84, ['varnum', 'byte']],
			'iload':         [0x15, ['varnum-wide']],
			'invokevirtual': [0xB6, ['method']],
			'ior':           [0x80, []],
			'ireturn':       [0xAC, []],
			'istore':        [0x36, ['varnum-wide']],
			'isub':          [0x64, []],
			'ldc_w':         [0x13, ['constant']],
			'nop':           [0x00, []],
			'pop':           [0x57, []],
			'swap':          [0x5F, []],
			'wide':          [0xC4, []],
			'dec':           [0x78, []],
		}, constantPool, methods);
	});

	var bc = [];

	for (i = 0; i < ast.length; i++) {
		constantPool[i] = sum;
		sum += ast[i].nBytes;

		bc = bc.concat(ast[i].byteCode);
	}

	var str = "",
		el;
	for (i = 0; i < bc.length; i++) {
		el = bc[i].toString(16);
		if (bc[i] < 0)
		{
			el = (0x100000000 + bc[i]).toString(16).substr(-2);
		}

		if (el.length === 1) {
			el = '0' + el;	
		}

		str += el;
		if(i !== 0 && (i + 1) % 16 === 0) {
			str += '\n';
		} else {
			str += ' ';
		}
	}

	console.log(str);
	console.log(constantPool);

	/*
    var ast = parser.parse(data);
	var microinstructions = [];
	var mi;
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
	var control_store = assign_addresses(microinstructions);
	console.log(control_store);
	console.log(microinstructions);
	*/
});
