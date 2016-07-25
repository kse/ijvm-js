/*global document:true, alert:true, localStorage:true, window:true*/

// Stolen from: http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
function isInt(value) {
	var x;
	if (isNaN(value)) {
		return false;
	}
	x = parseFloat(value);
	return (x | 0) === x;
}

require.config({
	paths: {
		'jQuery':       '../lib/jquery-2.2.4.min',
		'goldenlayout': '../lib/goldenlayout.min',

		'mal':    '../parsers/mal',
		'ijvm':   '../parsers/ijvm',
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
		'ijvm': {
			exports: 'ijvm'
		},
	}
});

function initializeStaticConfig(defaultProgram) {
	if(!localStorage.getItem('ijvm-js.config')) {
		var config = {
			ijvm_programs: ["fac.ijvm"],
		};

		localStorage.setItem('ijvm-js.config', JSON.stringify(config));
		localStorage.setItem("fac.ijvm", defaultProgram);
	}

	return JSON.parse(localStorage.getItem('ijvm-js.config'));
}

require(['jQuery', 'machine', 'aceEditor', 
		'malCompiler',
		'ijvmCompiler',
		'goldenlayout',
		'underscore',
		'text!../testfiles/fac.j',
		'text!../resource/mic1.mal'],
		function($, machine, aceEditor, malCompiler, ijvmCompiler, GoldenLayout, _, ijvmCode, microCode) {
			var ijvmEditor = null,
				malEditor = null,
				mic1 = null,
				MAL, IJVM = null,
				fileElement = null;
			
			var config = initializeStaticConfig(ijvmCode);

			function updateSavedFiles() {
				fileElement.html('');
				config.ijvm_programs.forEach(function(e) {
					var li = $('<li class="list-group-item"></li>')
						.data('file', e).html(e);

					fileElement.append(li);
				});
			}

			function initializeDockerLayout() {
				// Document = ace.require('ace/document').Document,

				/* Initialize GoldenLayout */
				var goldenLayout = new GoldenLayout({
					settings: {
						showPopoutIcon: false,
						selectionEnabled: true,
					},
					content: [{
						type: 'row',
						content: [{
							type: 'stack',
							content: [{
								type: 'component',
								componentName: 'machine',
								isClosable: false,
							}, {
								type: 'component',
								componentName: 'visualizer',
								isClosable: false,
							}],
						}, {
							type: 'stack',
							content: [{
								type: 'component',
								componentName: 'usage',
								isClosable: false,
							}],
						}],
					}],
				});

				// Whenever a stack is created, we remove the close icon,
				// stacks should only be closed because they are empty.
				goldenLayout.on('stackCreated', function(stack) {
					stack
						.header
						.controlsContainer
						.find('.lm_close')
						.off('click')
						.remove();
				});

				/*jslint unparam: true*/
				// FILL OUT USAGE
				goldenLayout.registerComponent('usage', function(container, componentState) {
					container.getElement().html('<h2 class="text-center">Usage will follow here</h2>');
					container.setTitle('Usage');
				});
				/*jslint unparam: false*/

				goldenLayout.registerComponent('mal-editor', function(container, componentState) {
					var div = container.getElement();

					//var virtualRenderer = new VirtualRenderer(div.get(0), 'ace/theme/monokai');
					//var editor = new Editor(virtualRenderer);
					//editor.setSession(componentState.doc);
					//editor.$blockScrolling = Infinity;

					var editor = new aceEditor(div.get(0));
					editor.setContents(componentState.text);
					malEditor = editor;

					container.on('resize', function() {
						editor.editor.resize();
					});
				});

				goldenLayout.registerComponent('ijvm-editor', function(container, componentState) {
					var template = (_.template($('#editor-tab-template').html()))();

					container.getElement().html(template).addClass('editor-container');
					var el = container.getElement().find('.editor-main');

					var editor = new aceEditor(el.get(0));
					editor.setContents(localStorage.getItem(componentState.filename));

					$('#btn-compile').prop('disabled', false);

					// There can only ever exist one.
					ijvmEditor = editor;

					var saved = true;

					editor.editor.on('change', function() {
						if (saved) {
							container.getElement().find('.savefile')
								.removeClass('btn-success')
								.addClass('btn-warning');
							saved = false;
						}
					});

					// Resize when tab resizes..
					container.on('resize', function() {
						editor.editor.resize();
					});

					// Every time a tab is created, create a listener that
					// prevents hard shutdowns and instead asks for confirmation
					// if file has not been saved.
					container.on('tab', function(tab) {
						tab
							.closeElement
							.off('click')
							.click(function() {
								if (!saved) {
									if (!window.confirm("Are you sure you to close an unsaved file?")) {
										return;
									}
								}

								ijvmEditor = null;
								container.tab.contentItem.remove();
							});
					});

					// Save file contents on destroy.
					container.getElement().find('.savefile').click(function() {
						if (!saved) {
							var data = editor.getContents();
							localStorage.setItem(componentState.filename, data);	
							console.log("Saving file");
							container.getElement().find('.savefile')
								.addClass('btn-success')
								.removeClass('btn-warning');
							saved = true;
						}
					});

					// Handle the deletion of files.
					container.getElement().find('.removefile').click(function() {
						var warnStr = "Press 'OK' if you want to delete this file.";

						if (window.confirm(warnStr)) {
							config.ijvm_programs =
								_.without(config.ijvm_programs, componentState.filename);
							localStorage.removeItem(componentState.filename);
							localStorage.setItem('ijvm-js.config', JSON.stringify(config));
							container.close();
							ijvmEditor = null;

							updateSavedFiles();
						}
					});

					container.on('destroy', function() {
						$('#control-container .toggleable').prop('disabled', true);
						$('#btn-compile').removeClass('btn-success').addClass('btn-danger');
						ijvmEditor = null;
						mic1 = null;
						MAL = null;
						IJVM = null;
					});
				});

				/*jslint unparam: true*/
				goldenLayout.registerComponent('visualizer', function(container, componentState) {
					container.getElement().html((_.template($('#visual-template').html()))());
					container.setTitle('Visualizer');
				});
				/*jslint unparam: false*/

				/*jslint unparam: true*/
				goldenLayout.registerComponent('machine', function(container, componentState) {
					container
						.getElement()
						.html((_.template($('#machine-template').html()))());

					container.setTitle('Machine');

					container.getElement().find('#new-ijvm-program').click(function() {
						if (ijvmEditor !== null) {
							console.log("Cannot create new file as an ijvmEditor exists.");
							return;
						}

						var filename = window.prompt("Please enter new IJVM file name");
						if (!!filename) {
							if (_.contains(config.ijvm_programs, filename)) {
								console.log("File already exists.");
								return;
							}

							config.ijvm_programs.push(filename);
							localStorage.setItem('ijvm-js.config', JSON.stringify(config));
							localStorage.setItem(filename, '');
							updateSavedFiles();

							var editorConfig = {
								title: filename,
								type: 'component',
								componentName: 'ijvm-editor',
								componentState: {
									filename: filename,
								}
							};

							goldenLayout.root.contentItems[0].addChild(editorConfig);
						}
					});

					var ul = container.getElement().find('ul > span');
					fileElement = ul;

					// Set a listener on the
					ul.click(function(e) {
						var file = $(e.target).data('file'),
							editorConfig = {
								title: file,
								type: 'component',
								componentName: 'ijvm-editor',
								componentState: {
									filename: file,
								},
							};

						if(ijvmEditor === null) {
							goldenLayout.root.contentItems[0].addChild(editorConfig);
						}
					});

					/* Initialize files list */
					config.ijvm_programs.forEach(function(e) {
						var el = $('<li class="list-group-item"></li>')
							.data('file', e).html(e);

						ul.append(el);
					});
				});
				/*jslint unparam: false*/

				goldenLayout.init();

				var malConfig = {
					title: 'MALCode',
					type: 'component',
					componentName: 'mal-editor',
					componentState: {
						text: microCode,
					}
				};

				goldenLayout.createDragSource($('#open-mal'), malConfig);
			}

			initializeDockerLayout();

			//initializeEditors(microCode, ijvmCode);

			$('#btn-step').click(function() {
				mic1.step();
				if (mic1.done) {
					console.log('Result:', mic1.result);
				}
			});

			$('#btn-run').click(function() {
				mic1.run();
				if (mic1.done) {
					console.log('Result:', mic1.result);
				}
			});

			$('#btn-step-ijvm').click(function() {
				mic1.step_ijvm();
				if (mic1.done) {
					console.log('Result:', mic1.result);
				}
			});

			function startMic1() {
				console.log(mic1);
				mic1.start([]);

				$('#control-container .toggleable').prop('disabled', false);
				$('#btn-compile').removeClass('btn-danger').addClass('btn-success');
			}

			$("#btn-reset").click(function() {
				//stack.reset();
				if (mic1 !== null && mic1.started) {
					mic1.reset();
					//malEditor.clearHighlight();
					mic1.refreshRegisterCallback();
					mic1.refreshStackCallback();
					startMic1();
				}
			});

			$("#btn-compile").click(function() {
				MAL = malCompiler(microCode);
				IJVM = new ijvmCompiler(ijvmEditor.getContents());
				console.log(IJVM);

				var nargs =
					IJVM.methods.main.nargs === null ? 0 : IJVM.methods.main.nargs;

				mic1 = new machine(
						MAL.store,
						MAL.microInstructions,
						IJVM.constantPool,
						IJVM.methods.main.methodAreaLocation,
						IJVM.byteCode,
						nargs
					);

				//stack = new stack_visualization(mic1.registers.CPP);

				mic1.setRegisterWriteCallback(function(reg, v) {
					console.log("Writing", v, "in", reg);
					$('svg rect').css('fill', 'none');
					$("#s" + reg).html(reg + ":" + v).prev().css('fill', '#efefef');
					//stack.registerWriteCallback(reg, v);
				});

				/*jslint unparam:true*/
				/*
				mic1.setMemoryWriteCallback(function(val, idx) {
					$("#stack").html(mic1.memory.stackArea.join(','));
					//stack.memoryWriteCallback(val, idx);
				});
				*/
				/*jslint unparam:false*/

				/*jslint unparam:true*/
				mic1.setInstructionCallback(function(mOp, na) {
					//console.log(mOp);
					//console.log(mic1.memory.stackArea.slice(0, mic1.registers.PC).join(','));
					//console.log(mic1.memory.stackArea.slice(mic1.constantPool.length).join(','));
					if (malEditor !== null) {
						if (isInt(mOp.lineNumber)) {
							malEditor.scrollTo(mOp.lineNumber - 1);
							malEditor.highlight(mOp.lineNumber - 1);
						} else {
							console.log("Missing linenumber:", mOp);
						}
					}

					//var naStr = "0x" + (na + 0x1000).toString(16).substr(1).toUpperCase();
					//$('#sNA').html(naStr);
				});
				/*jslint unparam:false*/

				ijvmEditor.highlight(IJVM.methods.main.loc.first_line - 1);
				mic1.setMainLabelCallback(function(mOp) {
					if (mOp.label === 'main') {
						ijvmEditor.highlight(IJVM.bcToLine[mic1.registers.PC] - 1);
					}
				});

				mic1.refreshRegisterCallback();
				mic1.refreshStackCallback();
				startMic1();
			});

		});
