/*global define:true*/

define(['ijvm'], function(ijvm) {
		return (function() {
			function bytecode(data) {
				var ast = ijvm.parse(data);
				var constantPool = [];
				var methods      = {},
					methodoffsets = {};
				var i, sum = 0;
				this.errors = [];

				var spec = {
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
				};

				ast.forEach(function(e) {
					if (methodoffsets.hasOwnProperty(e.name)) {
						this.errors.push(["Duplicate method name " + e.name, e.loc]);
					} else {
						methodoffsets[e.name] = constantPool.length;
						e.methodAreaLocation  = constantPool.length;
						constantPool.push(sum);
					}

					methods[e.name] = e;
					e.generateBytecode(spec, constantPool, methodoffsets);
					sum += e.byteCode.length;
				});

				ast.forEach(function(e) {
					e.resolvers.forEach(function(b) {
						b(0, constantPool, methodoffsets, e.labels);
					});
				});

				var bc = [];

				for (i = 0; i < ast.length; i++) {
					sum += ast[i].nBytes;
					bc = bc.concat(ast[i].byteCode);

					this.errors = this.errors.concat(ast[i].errors);
				}

				var str = "", el;
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

				this.constantPool = constantPool;
				this.byteCode = bc;
				this.methods = methods;
			}

			return bytecode;
		}());
});
