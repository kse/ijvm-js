/*global define:true*/

define(['ijvm'], function(ijvm) {
		return (function() {
			function bytecode(ijvmCode) {
				this.takesParameters = false;
				var ast = ijvm.parse(ijvmCode);
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

				this.constantPool = constantPool;
				this.byteCode     = bc;
				this.methods      = methods;

				// TODO: Check if we have a main method
				if (ast[methods.main].nparms > 1) {
					this.takesParameters = true;
					this.nparms = ast[methods.main].nparms - 1;
				}

				/*
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
				*/
			}

			return bytecode;
		}());
});
