

define(function(require){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[1,6],$V2=[1,8],$V3=[4,7,9,10,18,20,21],$V4=[4,7,9],$V5=[1,19],$V6=[1,20],$V7=[1,21],$V8=[1,24],$V9=[1,29],$Va=[1,28],$Vb=[1,30],$Vc=[1,31],$Vd=[4,10,18,20,21],$Ve=[1,43],$Vf=[1,44],$Vg=[4,10,25,26,27,28,29],$Vh=[7,9],$Vi=[4,7,9,10],$Vj=[4,10,25,28];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"newline":3,"ENDLINE":4,"program":5,"methods":6,"EOF":7,"method":8,"METHOD":9,"SYMBOL":10,"methodbody":11,"directive_begin":12,"insns_begin":13,"directive":14,"directives":15,"insn":16,"insns":17,"ARG":18,"expr":19,"LOCAL":20,"DEFINE":21,"EQUAL":22,"exprs":23,"COLON":24,"INTEGER":25,"PLUS":26,"MINUS":27,"LPAREN":28,"RPAREN":29,"$accept":0,"$end":1},
terminals_: {2:"error",4:"ENDLINE",7:"EOF",9:"METHOD",10:"SYMBOL",18:"ARG",20:"LOCAL",21:"DEFINE",22:"EQUAL",24:"COLON",25:"INTEGER",26:"PLUS",27:"MINUS",28:"LPAREN",29:"RPAREN"},
productions_: [0,[3,2],[3,1],[5,3],[5,2],[6,3],[6,2],[6,1],[8,4],[11,2],[12,3],[12,2],[12,0],[13,3],[13,2],[15,1],[15,2],[15,3],[14,3],[14,3],[14,5],[17,1],[17,2],[17,3],[16,3],[16,2],[16,2],[23,2],[23,1],[19,1],[19,1],[19,3],[19,3],[19,2],[19,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: case 2: case 12:
this.$ = [];
break;
case 3: case 4:
return $$[$0-1];
break;
case 5: case 23:

			this.$ = $$[$0-2];
			this.$.push($$[$0]);
		
break;
case 6: case 22: case 27:

			this.$ = $$[$0-1];
			this.$.push($$[$0]);
		
break;
case 7:
this.$ = [$$[$0]];
break;
case 8:

			//console.log("MDirectives:", $$[$0][0]);
			this.$ = new method($$[$0-2], $$[$0][0], $$[$0][1], this._$);
		
break;
case 9:

			this.$ = [$$[$0-1], $$[$0]];
			//console.log($$[$0-1]);
		
break;
case 10:

			this.$ = [$$[$0-2]].concat($$[$0-1]);
		
break;
case 11:

			this.$ = [$$[$0-1]].concat($$[$0]);
		
break;
case 13:

			this.$ = $$[$0-1];
			this.$.unshift($$[$0-2]);
		
break;
case 14:

			this.$ = $$[$0];
			this.$.unshift($$[$0-1]);
		
break;
case 15:

			this.$ = [$$[$0]];
			//console.log("1:", this.$)
		
break;
case 16:

			this.$ = $$[$0-1].concat($$[$0]);
		
break;
case 17:

			this.$ = $$[$0-2].concat($$[$0]);
		
break;
case 18:

			var loc = this._$;
			this.$ = function(method) {
				var args = $$[$0-1](method);
				console.log("Read it as taking", args, "arguments");
				if (args < 1) {
					method.errors.push(
						["A method has atleast one parameter", loc]);
					method.nargs = 1;
					return;
				}

				if (method.nargs !== null) {
					method.errors.push(
						["Repeated .args for method", loc]);
					method.nargs = 1;
					return;
				}

				method.nargs = args;
			};
		
break;
case 19:

			var loc = this._$;
			this.$ = function(method) {
				var locals = $$[$0-1](method);
				if (locals < 0) {
					method.errors.push(
						["A method cannot have negative local variables", loc]);
					method.nlocals = 1;
					return;
				}

				if (method.nlocals !== null) {
					method.errors.push(
						["Repeated .locals for method", loc]);
					method.nlocals = 1;
					return;
				}

				method.nlocals = locals;
			};
		
break;
case 20:

			var loc = this._$;
			var sym = $$[$0-3];
			this.$ = function(method) {
				var val = $$[$0-1](method);

				if (method.locals.hasOwnProperty(sym)) {
					method.errors.push(["Redefinition of variable " + sym, loc]);
					return;
				}

				method.locals[sym] = val;
			};
		
break;
case 21: case 28:

			this.$ = [$$[$0]];
		
break;
case 24:

			this.$ = new instruction($$[$0-2], $$[$0-1], this._$);
		
break;
case 25:

			this.$ = new instruction($$[$0-1], [], this._$);
		
break;
case 26:

			this.$ = {
				generate: function(method) {
					method.labels[$$[$0-1]] = method.byteCode.length;
				},
			};
		
break;
case 29:

			this.$ = function(method) {
				return parseInt($$[$0]);
			};
		
break;
case 30:

			var e = $$[$0];
			var loc = this._$;
			this.$ = function(method, label) {
				if (!!label) {
					return e;
				}

				if (!method.locals.hasOwnProperty(e)) {
					method.errors.push(["Unresolvable variable " + e, loc]);
					return 1;
				}

				return method.locals[$$[$0]];
			};
		
break;
case 31:

			var l = $$[$0-2];
			var r = $$[$0];
			var loc = this._$;
			this.$ = function(method) {
				return l(method) + r(method);
			};
		
break;
case 32:

			var l = $$[$0-2];
			var r = $$[$0];
			this.$ = function(method) {
				return l(method) - r(method);
			};
		
break;
case 33:

			var e = $$[$0];
			this.$ = function(method) {
				return e(method);
			};
		
break;
case 34:

			var e = $$[$0-1];
			this.$ = function(method) {
				return e(method);
			};
		
break;
}
},
table: [{3:2,4:$V0,5:1,6:3,8:5,9:$V1},{1:[3]},{4:$V2,6:7,8:5,9:$V1},{3:10,4:$V0,7:[1,9],8:11,9:$V1},o($V3,[2,2]),o($V4,[2,7]),{10:[1,12]},{3:10,4:$V0,7:[1,13],8:11,9:$V1},o($V3,[2,1]),{1:[2,4]},{4:$V2,8:14,9:$V1},o($V4,[2,6]),{3:15,4:$V0},{1:[2,3]},o($V4,[2,5]),{4:$V2,10:[2,12],11:16,12:17,14:18,18:$V5,20:$V6,21:$V7},o($V4,[2,8]),{10:$V8,13:22,16:23},{14:26,15:25,18:$V5,20:$V6,21:$V7},{10:$V9,19:27,25:$Va,27:$Vb,28:$Vc},{10:$V9,19:32,25:$Va,27:$Vb,28:$Vc},{10:[1,33]},o($V4,[2,9]),{10:$V8,16:35,17:34},{4:[1,37],10:$V9,19:39,23:36,24:[1,38],25:$Va,27:$Vb,28:$Vc},{3:40,4:$V0,10:[2,11],14:41,18:$V5,20:$V6,21:$V7},o($Vd,[2,15]),{4:[1,42],26:$Ve,27:$Vf},o($Vg,[2,29]),o($Vg,[2,30]),{10:$V9,19:45,25:$Va,27:$Vb,28:$Vc},{10:$V9,19:46,25:$Va,27:$Vb,28:$Vc},{4:[1,47],26:$Ve,27:$Vf},{22:[1,48]},o($Vh,[2,14],{3:49,16:50,4:$V0,10:$V8}),o($Vi,[2,21]),{4:[1,51],10:$V9,19:52,25:$Va,27:$Vb,28:$Vc},o($Vi,[2,25]),o($Vi,[2,26]),o($Vj,[2,28],{26:$Ve,27:$Vf}),{4:$V2,10:[2,10],14:53,18:$V5,20:$V6,21:$V7},o($Vd,[2,16]),o($Vd,[2,18]),{10:$V9,19:54,25:$Va,27:$Vb,28:$Vc},{10:$V9,19:55,25:$Va,27:$Vb,28:$Vc},o($Vg,[2,33]),{26:$Ve,27:$Vf,29:[1,56]},o($Vd,[2,19]),{10:$V9,19:57,25:$Va,27:$Vb,28:$Vc},o($Vh,[2,13],{16:58,4:$V2,10:$V8}),o($Vi,[2,22]),o($Vi,[2,24]),o($Vj,[2,27],{26:$Ve,27:$Vf}),o($Vd,[2,17]),o($Vg,[2,31]),o($Vg,[2,32]),o($Vg,[2,34]),{4:[1,59],26:$Ve,27:$Vf},o($Vi,[2,23]),o($Vd,[2,20])],
defaultActions: {9:[2,4],13:[2,3]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        function lex() {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


var exprFun = (function() {
	function plusfunc(x, y, op, _$) {
		return function(env) {
			var left = x(env);
			var right = y(env);
			op.apply(null, [left, right]);
		}
	}

	return plusfunc;
}());

var instruction = (function() {
	function instruction(symbol, expressions, loc) {
		this.symbol = symbol;
		this.expressions = expressions;
		this.loc = loc;
	}

	instruction.prototype.generate = function(method, specs) {
		var me = this,
			bcIdx = method.byteCode.length;
			eIdx = 0,
			i  = 0;

		if (!specs.hasOwnProperty(this.symbol)) {
			method.errors.push(["Unknown instruction " + this.symbol, this.loc]);
			method.byteCode.push(0xEE);
			return;
		}

		var nmbr  = specs[this.symbol][0],
			exprs = specs[this.symbol][1],
			exprlimit = Math.min(exprs.length, this.expressions.length),
			e = this.expressions;

		method.byteCode.push(nmbr);

		if (this.expressions.length < exprs.length) {
			method.errors.push(["Missing expressions according to spec " + exprs, this.loc]);
		} else if (this.expressions.length > exprs.length) {
			method.errors.push(["Too many expressions according to spec " + exprs, this.loc]);
		}

		for (i = 0; i < exprlimit; i++) {
			var p = exprs[i];
			switch(p) {
			case 'byte':
				method.byteCode.push(e[i](method));
				break;
			case 'label':
				var staticAddr = bcIdx;
				var bcIndex = method.byteCode.length;
				var expIdx = i;
				method.byteCode.push(0xEE, 0xEE);
				method.resolvers.push(function(offset, constantpool, methods, labels) {
					var lbl = e[expIdx](method, true);
					//console.log("Going from", bcIdx, "to label", labels[lbl]);
					var off;
					
					if (!labels.hasOwnProperty(lbl)) {
						method.errors.push("Unmatched label '" + lbl + "'", me.loc);
						off = 0;
					} else {
						off = labels[lbl] - staticAddr;
					}

					method.byteCode[bcIndex]     = (off & (~255)) >> 8;
					method.byteCode[bcIndex + 1] = off & 255;
				});
				break;
			case 'varnum':
				method.byteCode.push(e[i](method));
				break;
			case 'varnum-wide':
				var off = e[i](method);
				if (off > 0xFF) {
					method.byteCode.push((off & (~255)) >> 8);
				}
				method.byteCode.push(off & 255);
				break;
			case 'method':
				var bcIndex = method.byteCode.length;
				var expIdx = i;
				method.byteCode.push(0xEE, 0xEE);
				method.resolvers.push(function(offset, constantpool, methods, labels){
					var mname = e[expIdx](method, true);
					var midx = 0;
					if (!methods.hasOwnProperty(mname)) {
						method.errors.push(
							["Invoking non-existant method '" + mname + "'", me.loc]);
					} else {
						midx = methods[e[expIdx](method, true)];
					}
					method.byteCode[bcIndex]     = (midx & (~255)) >> 8;
					method.byteCode[bcIndex + 1] = midx & 255;
				});
				break;
			case 'constant':
				var v = e[i](method);
				method.byteCode.push(nmbr);
				var bcIndex = method.byteCode.length;

				method.byteCode.push(0xEE, 0xEE);

				method.resolvers.push(function(offset, constantpool, methods, labels) {
					var idx = constantpool.indexOf[v];
					if (idx == -1) {
						idx = constantpool.length;
						constantpool.push(v);
					}
					method.byteCode[bcIndex]     = (idx & (~255)) >> 8;
					method.byteCode[bcIndex + 1] = idx & 255;
				});
			}
		}

		for (i = 0; i < method.byteCode.length - bcIdx; i++) {
			method.bcToLine[bcIdx + i] = this.loc.first_line;
		}
	};

	return instruction;
}());

var method = (function() {
	function method(name, directives, insns, loc) {
		this.loc       = loc;
		this.name      = name;
		this.locals    = {};
		this.labels    = {};
		this.insns     = insns;
		this.nlocals   = null;  // Amount of local variables
		this.nargs     = 1;   // Amount of parameters, default 1.
		this.nBytes    = 4;
		this.byteCode  = [];
		this.errors    = [];
		this.resolvers = [];
		this.bcToLine  = {};

		var me = this;

		directives.forEach(function(e) {
			e(me);
			//console.log(e);	
		});

		if (this.nlocals === null) {
			this.nlocals = 0;
		}

		this.byteCode.push(
			this.nargs >> 8,
			this.nargs & 0xFF,
			this.nlocals >> 8,
			this.nlocals & 0xFF
		);
	}

	method.prototype.generateBytecode = function(m, constantPool, methods) {
		var me = this;
		//var bc = [];

		for (var i = 0; i < 4; i++) {
			this.bcToLine[i] = this.loc.first_line;
		}

		this.insns.forEach(function(e) {
			//var ibc = e(m, constantPool, methods);
			e.generate(me, m);
			//bc = bc.concat(ibc);
		});
	};

	return method;
}());

/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 4;
break;
case 1:/* skip whitespace */
break;
case 2:/* skip singeline comment */
break;
case 3:/* skip multiline comments (no nesting) */
break;
case 4:return 25;
break;
case 5:return 9;
break;
case 6:return 18;
break;
case 7:return 20;
break;
case 8:return 21;
break;
case 9:return 28;
break;
case 10:return 29;
break;
case 11:return 26;
break;
case 12:return 27;
break;
case 13:return 22;
break;
case 14:return 'COMMA';
break;
case 15:return 24;
break;
case 16:return 10;
break;
case 17:return 7;
break;
}
},
rules: [/^(?:\n)/i,/^(?:[^\n\S]+)/i,/^(?:\/\/[^\n]*)/i,/^(?:\/\*(.|\n|\r)*?\*\/)/i,/^(?:([0-9]+|0x[0-9A-F]+)\b)/i,/^(?:\.method\b)/i,/^(?:\.args\b)/i,/^(?:\.locals\b)/i,/^(?:\.define\b)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\+)/i,/^(?:-)/i,/^(?:=)/i,/^(?:,)/i,/^(?::)/i,/^(?:[a-zA-Z]\w*\b)/i,/^(?:$)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
return parser;
});