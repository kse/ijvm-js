/*global define:true*/

/*
 * - Check we don't write somewhere bad in memory.
 */

define(['memory'],
	function(memory) {
		return (function() {
			function machine(store, microInstructions, constantPool, mainIndex, byteCode) {
				this.controlStore = store.control;
				this.microInstructions = microInstructions;
				this.registerWriteCallback = null;

				this.bytecode = byteCode;
				this.mainIndex = mainIndex;
				this.constantPool = constantPool;

				this.instruction = store.entrypoint;

				var maWords = Math.ceil(this.bytecode.length/4);
				this.maWords = maWords;

				this.reset();
			}

			machine.prototype.reset = function() {
				this.started = false;
				this.done = false;

				this.N = 0;
				this.Z = 0;

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

				var stackarea = [].concat(this.constantPool);
				this.memory = new memory(this.bytecode, stackarea, this.registers);

				this.registers.CPP = this.maWords;
				this.registers.H = this.mainIndex; // Required by starting point.
				this.registers.LV = this.maWords;
				this.registers.SP = this.maWords + this.constantPool.length;
				this.registers.PC = 0;
			};

			machine.prototype.start = function(args) {
				var me = this;
				if (this.started) {
					throw new Error("Machine already started");
				}

				this.started = true;

				this.memory.stackArea.push(88); // Push OBJREF
				args.forEach(function(item) {
					me.memory.stackArea.push(item); // Push function arguments
				});

				this.registers.SP += args.length;
			};

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
				if (!this.started) {
					throw new Error("Machine has not been started");
				}

				var mOp = this.microInstructions[this.controlStore[this.instruction]],
					strOpts = "[" + (mOp.f0|0) + (mOp.f1|0) + (mOp.ena|0) +
					(mOp.enb|0) + (mOp.inva|0) + (mOp.inc|0) + "]",
					res = 0,
					src;

				this.memory.cycle();

				if (!!mOp.label) {
					//console.log("Now at label", mOp.label);

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
					this.result = this.registers.TOS;
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
				if (!this.done) {
					this.simulateInstruction();
				}
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
		}());
});
