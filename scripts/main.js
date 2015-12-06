/*global document:true, alert:true*/
require.config({
	paths: {
		'jQuery': 'jquery-2.1.4.min',
		//'ace': 'ace/ace',
		'mal': '../parsers/mal',
	},

	shim: {
		'jQuery': {
			exports: '$'
		},
		'ace': {
			exports: 'ace'
		},
		'mal': {
			exports: 'mal'
		},
	}
});

require(['jQuery', 'machine', 'aceEditor', 
		'malCompiler',
		'ijvmCompiler',
		'text!../resource/imul.j',
		'text!../resource/mic1.mal'],
		function($, machine, aceEditor, malCompiler, ijvmCompiler, ijvmCode, microCode){

			var malEditor, ijvmEditor, mic1 = null;
			var MAL, IJVM = null;

			// Stolen from: http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
			function isInt(value) {
				var x;
				if (isNaN(value)) {
					return false;
				}
				x = parseFloat(value);
				return (x | 0) === x;
			}

			function startMic1() {
				var args = $('#arg-input').val();
				var re = /^(\d+\s*)+$/g;

				if (!re.test(args)) {
					console.log("Test failed");
					alert("Parameters invalid");
					return;
				}

				var s = args.trim().split(/\s+/).map(function(item) {
					return parseInt(item, 10);
				});
				mic1.start(s);
			}

			function initializeEditors(microCode, ijvmCode) {
				malEditor = new aceEditor('mal-editor');
				malEditor.setContents(microCode);

				ijvmEditor = new aceEditor('ijvm-editor');
				ijvmEditor.setContents(ijvmCode);

				$('#editor-nav a').click(function(e) {
					var el = $(e.target).parent();

					$('#editor-nav li').removeClass('active');	
					el.addClass('active');

					$('#editor-container').children('.editor').each(function() {
						$(this).addClass('invisible');
					});

					var edName = el.data('display');
					$('#' + edName).removeClass('invisible');
				});
			}

			initializeEditors(microCode, ijvmCode);

			$("#btn-step").click(function() {
				mic1.step();
				if (mic1.done) {
					console.log("Result:", mic1.result);
				}
			});

			$("#btn-run").click(function() {
				mic1.run();
				if (mic1.done) {
					console.log("Result:", mic1.result);
				}
			});

			$("#btn-reset").click(function() {
				//stack.reset();
				if (mic1 !== null && mic1.started) {
					mic1.reset();
					malEditor.clearHighlight();
					mic1.refreshRegisterCallback();
					mic1.refreshStackCallback();
					startMic1();
				}
			});

			$("#btn-compile").click(function() {
				MAL = malCompiler(malEditor.getContents());
				IJVM = new ijvmCompiler(ijvmEditor.getContents());
				//console.log(IJVM);

				//byteCode = new bytecode(ijvmEditor.getContents());
				mic1 = new machine(MAL.store, MAL.microInstructions, IJVM.constantPool, IJVM.methods.main, IJVM.byteCode);
				//stack = new stack_visualization(mic1.registers.CPP);

				mic1.setRegisterWriteCallback(function(reg, v) {
					//console.log("Writing", v, "in", reg);
					$("#s" + reg).html(reg + ":" + v);
					//stack.registerWriteCallback(reg, v);
				});

				mic1.setMemoryWriteCallback(function(val, idx) {
					$("#stack").html(mic1.memory.stackArea.join(','));
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
				startMic1();
			});

		});
