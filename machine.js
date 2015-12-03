/*global jQuery:true, machine:true*/

/*
 * - Make bytecode, mainIndex and constantPool parameters.
 * - Check we don't write somewhere bad in memory.
 */

var memory = (function() {
	function memory(methodArea, stackArea, registers) {
		this.stackArea = stackArea;
		this.methodArea = methodArea;
		this.methodAreaWords = Math.ceil((methodArea.length)/4);
		this.registers = registers;
		this.memQueue = [];
		this.maQueue = [];

		//this.stackArea.push(this.methodAreaWords + constantPool.length + 1);
		//this.stackArea.push(1);
		//this.stackArea.push(88);
		//this.stackArea.push(2);
		//this.stackArea.push(3);
	}

	memory.prototype.setRegisterWriteCallback = function(cb) {
		this.registerWriteCallback = cb;
	};

	memory.prototype.setMemoryWriteCallback = function(f) {
		this.memoryWriteCallback = f;
	};

	memory.prototype.read = function() {
		var me = this,
			idx = this.registers.MAR;
		if (this.memQueue.length === 0) {
			this.memQueue.push(null);	
		}

		this.memQueue.push(function() {
			if (typeof me.registerWriteCallback === 'function') {
				me.registerWriteCallback('MDR', me.stackArea[idx - me.methodAreaWords]);
			}
			me.registers.MDR = me.stackArea[idx - me.methodAreaWords];
			//console.log("read on stack index", idx, "(" + (idx - me.methodAreaWords) + ")",  "value", me.registers.MDR);
		});
	};

	memory.prototype.write = function() {
		var me = this,
			idx = this.registers.MAR,
			value = this.registers.MDR;

		if (this.memQueue.length === 0) {
			this.memQueue.push(null);	
		}

		this.memQueue.push(function() {
			if (typeof me.memoryWriteCallback === 'function') {
				me.memoryWriteCallback(value, idx);
			}
			//console.log("Writing", value, "on stack index", idx, "(" + (idx - me.methodAreaWords) + ")");
			me.stackArea[idx - me.methodAreaWords] = value;
		});
	};

	memory.prototype.fetch = function() {
		var me = this,
			idx = this.registers.PC;

		if (this.maQueue.length === 0) {
			this.maQueue.push(null);	
		}

		this.maQueue.push(function() {
			if (typeof me.registerWriteCallback === 'function') {
				me.registerWriteCallback('MBR', me.methodArea[idx]);
			}
			me.registers.MBR = me.methodArea[idx];
			me.registers.MBRU = me.methodArea[idx];
		});
	};

	memory.prototype.cycle = function() {
		var memop = this.memQueue.shift();
		if (typeof memop === 'function') {
			memop();
		}

		var maop = this.maQueue.shift();
		if (typeof maop === 'function') {
			maop();
		}
	};

	memory.prototype.getIndexes = function(low, high) {
		var off = 1;
		if (low === high) {
			off = 0;
		}
		return this.stackArea.slice(low - this.methodAreaWords, high - this.methodAreaWords + off);
	};

	return memory;
}());

var machine = (function() {
	function machine(store, microInstructions, args) {
		this.registers = {
			"MAR": 0,
			"MBR": 0,
			"MBRU": 0,
			"MDR": 0,
			"PC": 0,
			"SP": 0,
			"LV": 0,
			"CPP": 0,
			"TOS": 0,
			"OPC": 0,
			"H": 0
		};

		this.done = false;

		this.N = 0;
		this.Z = 0;

		this.controlStore = store.control;
		this.microInstructions = microInstructions;
		this.registerWriteCallback = null;

		this.bytecode = [0x00, 0x01, 0x00, 0x00, 0x10, 0x05, 0x10, 0x02, 0x64, 0xac];
		//this.bytecode = [0x00, 0x01, 0x00, 0x00, 0x20, 0x05, 0x64, 0xac];
		this.mainIndex = 0;
		this.constantPool = [0x0];
		/*
		this.bytecode = [0x00, 0x03, 0x00, 0x01, 0x10, 0x00, 0x36, 0x03, 0x15,
			0x01, 0x9b, 0x00, 0x19, 0x15, 0x01, 0x99, 0x00, 0x14, 0x15, 0x01,
			0x10, 0x01, 0x64, 0x36, 0x01, 0x15, 0x03, 0x15, 0x02, 0x60, 0x36,
			0x03, 0xa7, 0xff, 0xe8, 0x15, 0x03, 0xac, 0x00, 0x03, 0x00, 0x00,
			0x10, 0x2c, 0x15, 0x01, 0x15, 0x02, 0xb6, 0x00, 0x00, 0xac];
		this.mainIndex = 0x1;
		this.constantPool = [0x0, 0x26];
		*/
		var stackarea = [];

		this.constantPool.forEach(function(item) {
			stackarea.push(item);
		});

		args.forEach(function(item) {
			stackarea.push(item);
		});

		this.memory = new memory(this.bytecode, stackarea, this.registers);
		this.instruction = store.entrypoint;


		var maWords = Math.ceil(this.bytecode.length/4);
		this.registers.CPP = maWords;
		this.registers.H = this.mainIndex; // Required by starting point.
		this.registers.LV = maWords;
		this.registers.SP = maWords + this.constantPool.length + args.length;
		this.registers.PC = this.constantPool[this.mainIndex];
		this.maWords = maWords;
	}

	machine.prototype.refreshRegisterCallback = function() {
		var r;
		for (r in this.registers) {
			if (this.registers.hasOwnProperty(r) && typeof this.registerWriteCallback === 'function') {
				this.registerWriteCallback(r, this.registers[r]);
			}
		}
	};


	machine.prototype.refreshStackCallback = function() {
		var that = this;
		this.memory.stackArea.forEach(function(item, idx) {
			if (typeof that.memoryWriteCallback === 'function') {
				console.log("here");
				that.memoryWriteCallback(item, idx + that.maWords);
			}
		});
	};

	machine.prototype.setRegisterWriteCallback = function(f) {
		this.registerWriteCallback = f;
		this.memory.setRegisterWriteCallback(f);
	};

	machine.prototype.setRegisterReadCallback = function(f) {
		this.registerReadCallback = f;
	};

	machine.prototype.setBytecode = function(b) {
		//Implement this.
		this.bytecode = b;
	};

	machine.prototype.simulateInstruction = function() {
		var mOp = this.microInstructions[this.controlStore[this.instruction]],
			strOpts = "[" + (mOp.f0|0) + (mOp.f1|0) + (mOp.ena|0) +
			(mOp.enb|0) + (mOp.inva|0) + (mOp.inc|0) + "]",
			res = 0,
			src;

		this.memory.cycle();

		if (!!mOp.label) {
			console.log("Now at label", mOp.label);

			if (typeof this.mainCallback === 'function') {
				this.mainCallback();
			}
		}

		if (!!mOp.src) {
			src = mOp.src.toUpperCase();

			if (! this.registers.hasOwnProperty(src)) {
				throw new Error("Unknown register", src, mOp);
			}
		}
		
		switch (strOpts) {
			case "[011000]":
				// Check if register is correct?
				res = this.registers.H;
				break;
			case "[010100]":
				// Check if register is correct?
				res = this.registers[src];
				break;
			case "[011010]":
				// Check if register is correct?
				res = ~ this.registers.H;
				break;
			case "[101100]":
				// Check if register is correct?
				res = ~ this.registers[src];
				break;
			case "[111100]":
				// Check if register is correct?
				res = this.registers[src] + this.registers.H;
				break;
			case "[111101]":
				// Check if register is correct?
				res = this.registers[src] + this.registers.H + 1;
				break;
			case "[111001]":
				// Check if register is correct?
				res = this.registers.H + 1;
				break;
			case "[110101]":
				// Check if register is correct?
				res = this.registers[src] + 1;
				break;
			case "[111111]":
				// Check if register is correct?
				res = this.registers[src] - this.registers.H;
				break;
			case "[110110]":
				// Check if register is correct?
				res = this.registers[src] - 1;
				break;
			case "[111011]":
				// Check if register is correct?
				res = - this.registers.H;
				break;
			case "[001100]":
				// Check if register is correct?
				res = this.registers[src] & this.registers.H;
				break;
			case "[011100]":
				// Check if register is correct?
				res = this.registers[src] | this.registers.H;
				break;
			case "[010000]":
				// Check if register is correct?
				res = 0;
				break;
			case "[110000]":
				// Check if register is correct?
				res = 1;
				break;
			case "[110010]":
				// Check if register is correct?
				res = -1;
				break;
			case "[000000]":
				// Check if register is correct?
				res = 0;
				break;
			default:
				console.log(mOp);
				throw new Error("Invalid bit pattern");
		}

		if (mOp.sll8) {
			res = res << 8;
		}

		if (mOp.sra1) {
			res = res >>> 1;
		}


		// if the result is beyond the range of what we can represent with 32
		// bits, adjust it.
		if (res < 0) {
			while (res < -Math.pow(2,31) ) {
				res += Math.pow(2,32)|0;
			}
		} else {
			while (res >= Math.pow(2,31) ) {
				res -= Math.pow(2,32)|0;
			}
		}

		if (res < 0) {
			this.N = 1;
		} else {
			this.N = 0;
		}

		if (res === 0) {
			this.Z = 1;
		} else {
			this.Z = 0;
		}

		var r;
		var cb = this.registerWriteCallback,
			dest;
		for (r in mOp.destination) {
			if (mOp.destination.hasOwnProperty(r)) {
				dest = mOp.destination[r].toUpperCase();
				if (typeof cb === 'function') {
					cb(dest, res);
				}
				this.registers[dest] = res;
			}
		}

		var na = mOp.nextaddress;

		if (na === undefined) {
			this.done = true;
			//throw new Error("Result:", this.registers.TOS);
		}

		if (mOp.jamz) {
			na = na | (this.Z << 8);
		}

		if (mOp.jamn) {
			na = na | (this.N << 8);
		}

		if (mOp.jmpc) {
			na = na | this.registers.MBRU;
		}

		this.instruction = na;

		if (mOp.read) {
			this.memory.read();
		}
		
		if (mOp.fetch) {
			this.memory.fetch();
		}

		if (mOp.write) {
			this.memory.write();
		}

		if (typeof this.instructionCallback === 'function') {
			this.instructionCallback(mOp, na);
		}
	};

	machine.prototype.step = function() {
		this.simulateInstruction();
	};

	machine.prototype.run = function() {
		while (!this.done) {
			this.step();
		}

		return this.registers.TOS;
	};

	machine.prototype.getStackSegment = function() {
		return this.memory.getIndexes(this.registers.LV, this.registers.SP);
	};

	machine.prototype.setMemoryWriteCallback = function(f) {
		this.memoryWriteCallback = f;
		this.memory.setMemoryWriteCallback(f);
	};

	machine.prototype.setMainLabelCallback = function(f) {
		this.mainCallback = f;
	};

	// Called whenever a new instruction is chosen.
	machine.prototype.setInstructionCallback = function(f) {
		this.instructionCallback = f;
	};

	return machine;
}(jQuery));
