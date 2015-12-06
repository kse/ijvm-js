/*global define:true, parser:true, $:true, ace:true*/
define(['ace/ace'],
	function(ace) {
		return (function() {
			function aceEditor(id) {
				this.editor = ace.edit(id);
				this.editor.$blockScrolling = Infinity;
				this.editor.setTheme('ace/theme/monokai');

				this.highlighted = null;

				this.session = this.editor.getSession();
				this.document = this.session.getDocument();
			}

			aceEditor.prototype.setContents = function(contents) {
				this.document.setValue(contents);
			};

			aceEditor.prototype.getContents = function() {
				return this.document.getValue();
			};

			aceEditor.prototype.scrollTo = function(lineNo) {
				this.editor.scrollToLine(lineNo, true, false, null);
				this.editor.moveCursorToPosition({row: lineNo, column: 0});
			};

			aceEditor.prototype.highlight = function(lineNo) {
				if (this.highlighted !== null) {
					this.session.removeGutterDecoration(this.highlighted, "editor-highlight");
				}

				this.session.addGutterDecoration(lineNo, "editor-highlight");
				this.highlighted = lineNo;
				this.editor.clearSelection();
			};

			aceEditor.prototype.clearHighlight = function() {
				if (this.highlighted !== null) {
					this.session.removeGutterDecoration(this.highlighted, "editor-highlight");
					this.highlighted = null;
				}
			};

			return aceEditor;
		}());
});
