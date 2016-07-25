/*global define:true*/
define([],
	function() {
		return (function() {
		function memory(methodArea, stackArea, registers) {
			this.stackArea = stackArea;
			this.methodArea = methodArea;
			this.methodAreaWords = Math.ceil((methodArea.length)/4);
			this.registers = registers;
			this.memQueue = [];
			this.maQueue = [];
		}

		memory.prototype.setRegisterWriteCallback = function(cb) {
			this.registerWriteCallback = cb;
		};

		memory.prototype.setMemoryWriteCallback = function(f) {
			this.memoryWriteCallback = f;
		};

		// This functions handles 32bit aligned reads from main memory.
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

				var readIdx = idx - me.methodAreaWords;
				if (readIdx >= me.stackArea.length) {
					me.registers.MDR = 0;
					console.log("Warning: Reading beyond allocated memory");
				} else if (readIdx < 0) {
					me.registers.MDR = 0;
					console.log("Warning: Reading below allocated memory");
				} else {
					me.registers.MDR = me.stackArea[readIdx];
				}

				console.log("Read on stack index", idx, "(" + readIdx + ")",  "value", me.registers.MDR);
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
				console.log("Writing", value, "on stack index", idx, "(" + (idx - me.methodAreaWords) + ")");
				me.stackArea[idx - me.methodAreaWords] = value;
			});
		};

		memory.prototype.fetch = function() {
			var me = this,
				idx = this.registers.PC;

			// If we have no waiting fetches, push an empty on so we have
			// correct timing.
			if (this.maQueue.length === 0) {
				this.maQueue.push(null);	
			}

			console.log("Reading into MBR", idx, "length", me.methodArea.length);
			this.maQueue.push(function() {
				if (idx >= me.methodArea.length) {
					idx -= me.methodArea.length;

					console.log("Reading from stack:", parseInt(Math.floor(idx/4), 10), (0xFF << (idx % 4)));
					me.registers.MBR = me.stackArea[parseInt(Math.floor(idx/4), 10)] & (0xFF << (idx % 4));
					me.registers.MBRU = me.registers.MBR;
				} else {
					if (typeof me.registerWriteCallback === 'function') {
						me.registerWriteCallback('MBR', me.methodArea[idx]);
					}
					me.registers.MBR = me.methodArea[idx];
					me.registers.MBRU = me.methodArea[idx];
				}
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
});
