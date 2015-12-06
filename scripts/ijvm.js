

define(function(require){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[5,9],$V1=[5,9,10,25,26,27,28,29,30,31,32,33,35,36,37,38,39,40,41,42,43,44,45],$V2=[2,8],$V3=[1,12],$V4=[1,13],$V5=[1,14],$V6=[2,18],$V7=[1,37],$V8=[1,17],$V9=[1,18],$Va=[1,19],$Vb=[1,20],$Vc=[1,21],$Vd=[1,22],$Ve=[1,23],$Vf=[1,24],$Vg=[1,25],$Vh=[1,26],$Vi=[1,27],$Vj=[1,28],$Vk=[1,29],$Vl=[1,30],$Vm=[1,31],$Vn=[1,32],$Vo=[1,33],$Vp=[1,34],$Vq=[1,35],$Vr=[1,36],$Vs=[1,41],$Vt=[1,40],$Vu=[1,42],$Vv=[1,58],$Vw=[1,59],$Vx=[7,20,21,23,34];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"methods":4,"EOF":5,"empty":6,"ENDLINE":7,"method":8,"METHOD":9,"SYMBOL":10,"directives":11,"insns":12,"directive":13,"ARG":14,"expr":15,"LOCAL":16,"DEFINE":17,"EQUAL":18,"INTEGER":19,"PLUS":20,"MINUS":21,"LPAREN":22,"RPAREN":23,"insn":24,"BIPUSH":25,"DUP":26,"GOTO":27,"IADD":28,"IAND":29,"IFEQ":30,"IFLT":31,"IFICMPEQ":32,"IINC":33,"COMMA":34,"ILOAD":35,"INVOKEVIRTUAL":36,"IOR":37,"IRETURN":38,"ISTORE":39,"ISUB":40,"LDCW":41,"NOP":42,"POP":43,"SWAP":44,"WIDE":45,"COLON":46,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:"ENDLINE",9:"METHOD",10:"SYMBOL",14:"ARG",16:"LOCAL",17:"DEFINE",18:"EQUAL",19:"INTEGER",20:"PLUS",21:"MINUS",22:"LPAREN",23:"RPAREN",25:"BIPUSH",26:"DUP",27:"GOTO",28:"IADD",29:"IAND",30:"IFEQ",31:"IFLT",32:"IFICMPEQ",33:"IINC",34:"COMMA",35:"ILOAD",36:"INVOKEVIRTUAL",37:"IOR",38:"IRETURN",39:"ISTORE",40:"ISUB",41:"LDCW",42:"NOP",43:"POP",44:"SWAP",45:"WIDE",46:"COLON"},
productions_: [0,[3,2],[6,1],[4,2],[4,1],[4,0],[8,5],[11,3],[11,0],[13,2],[13,2],[13,4],[15,1],[15,1],[15,3],[15,3],[15,3],[12,3],[12,0],[24,2],[24,1],[24,2],[24,1],[24,1],[24,2],[24,2],[24,2],[24,4],[24,2],[24,2],[24,1],[24,1],[24,2],[24,1],[24,2],[24,1],[24,1],[24,1],[24,1],[24,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return $$[$0-1];
break;
case 3:
this.$ = $$[$0-1].concat($$[$0]);
break;
case 4: case 5:
this.$ = []
break;
case 6:

			this.$ = new method($$[$0-3], $$[$0-1], $$[$0]);
		
break;
case 7:
 this.$ = [$$[$0-2]].concat($$[$0]); 
break;
case 8: case 18:
this.$ = [];
break;
case 9:
this.$ = ['ARGS', $$[$0]];
break;
case 10:
this.$ = ['LOCALS', $$[$0]];
break;
case 11:

				this.$ = function(env) {
					if (env.hasOwnProperty($$[$0-2])) {
						throw new Error("Redefinition of variable " + $$[$0-2] + " on line " +  yylineno);
					}

					env[$$[$0-2]] = $$[$0](env);
					return env;
				}
			
break;
case 12:

			this.$ = function() {
				return $$[$0]|0;
			};
		
break;
case 13:

			this.$ = function(env) {
				if (!env.hasOwnProperty($$[$0])) {
					throw new Error("Unresolved variable " + $$[$0] + " on line " +  yylineno);
				}
				return env[$$[$0]]|0;
			};
		
break;
case 14:

			this.$ = new exprFun($$[$0-2], $$[$0],
				(function (a,b) {return a + b}),
				_$
				);
		
break;
case 15:

			this.$ = new exprFun($$[$0-2], $$[$0],
				(function (a,b) {return a - b}),
				_$
				);
		
break;
case 16:

			this.$ = function(env) {
				return $$[$0-1](env);
			}
		
break;
case 17:
this.$ = [$$[$0-2]].concat($$[$0]);
break;
case 19:
this.$ = ['bipush', $$[$0]];
break;
case 20:
this.$ = ['dup'];
break;
case 21:
this.$ = ['goto', $$[$0]];
break;
case 22:
this.$ = ['iadd'];
break;
case 23:
this.$ = ['iand'];
break;
case 24:
this.$ = ['ifeq', $$[$0]];
break;
case 25:
this.$ = ['iflt', $$[$0]];
break;
case 26:
this.$ = ['if_icmpeq', $$[$0]];
break;
case 27:
this.$ = ['iinc', $$[$0-2], $$[$0-1]];
break;
case 28:
this.$ = ['iload', $$[$0]];
break;
case 29:
this.$ = ['invokevirtual', $$[$0]];
break;
case 30:
this.$ = ['ior'];
break;
case 31:
this.$ = ['ireturn'];
break;
case 32:
this.$ = ['istore', $$[$0]];
break;
case 33:
this.$ = ['isub'];
break;
case 34:
this.$ = ['ldc_w', $$[$0]];
break;
case 35:
this.$ = ['nop'];
break;
case 36:
this.$ = ['pop'];
break;
case 37:
this.$ = ['swap'];
break;
case 38:
this.$ = ['wide'];
break;
case 39:
this.$ = ['LABEL', $$[$0-1]];
break;
}
},
table: [o($V0,[2,5],{3:1,4:2,6:3,7:[1,4]}),{1:[3]},{5:[1,5],8:6,9:[1,7]},o($V0,[2,4]),o($V0,[2,2]),{1:[2,1]},o($V0,[2,3]),{10:[1,8]},{7:[1,9]},o($V1,$V2,{11:10,13:11,14:$V3,16:$V4,17:$V5}),o($V0,$V6,{12:15,24:16,10:$V7,25:$V8,26:$V9,27:$Va,28:$Vb,29:$Vc,30:$Vd,31:$Ve,32:$Vf,33:$Vg,35:$Vh,36:$Vi,37:$Vj,38:$Vk,39:$Vl,40:$Vm,41:$Vn,42:$Vo,43:$Vp,44:$Vq,45:$Vr}),{7:[1,38]},{10:$Vs,15:39,19:$Vt,22:$Vu},{10:$Vs,15:43,19:$Vt,22:$Vu},{10:[1,44]},o($V0,[2,6]),{7:[1,45]},{10:$Vs,15:46,19:$Vt,22:$Vu},{7:[2,20]},{10:[1,47]},{7:[2,22]},{7:[2,23]},{10:[1,48]},{10:[1,49]},{10:[1,50]},{10:$Vs,15:51,19:$Vt,22:$Vu},{10:$Vs,15:52,19:$Vt,22:$Vu},{10:[1,53]},{7:[2,30]},{7:[2,31]},{10:$Vs,15:54,19:$Vt,22:$Vu},{7:[2,33]},{10:$Vs,15:55,19:$Vt,22:$Vu},{7:[2,35]},{7:[2,36]},{7:[2,37]},{7:[2,38]},{46:[1,56]},o($V1,$V2,{13:11,11:57,14:$V3,16:$V4,17:$V5}),{7:[2,9],20:$Vv,21:$Vw},o($Vx,[2,12]),o($Vx,[2,13]),{10:$Vs,15:60,19:$Vt,22:$Vu},{7:[2,10],20:$Vv,21:$Vw},{18:[1,61]},o($V0,$V6,{24:16,12:62,10:$V7,25:$V8,26:$V9,27:$Va,28:$Vb,29:$Vc,30:$Vd,31:$Ve,32:$Vf,33:$Vg,35:$Vh,36:$Vi,37:$Vj,38:$Vk,39:$Vl,40:$Vm,41:$Vn,42:$Vo,43:$Vp,44:$Vq,45:$Vr}),{7:[2,19],20:$Vv,21:$Vw},{7:[2,21]},{7:[2,24]},{7:[2,25]},{7:[2,26]},{20:$Vv,21:$Vw,34:[1,63]},{7:[2,28],20:$Vv,21:$Vw},{7:[2,29]},{7:[2,32],20:$Vv,21:$Vw},{7:[2,34],20:$Vv,21:$Vw},{7:[2,39]},o($V1,[2,7]),{10:$Vs,15:64,19:$Vt,22:$Vu},{10:$Vs,15:65,19:$Vt,22:$Vu},{20:$Vv,21:$Vw,23:[1,66]},{10:$Vs,15:67,19:$Vt,22:$Vu},o($V0,[2,17]),{10:$Vs,15:68,19:$Vt,22:$Vu},o([7,20,23,34],[2,14],{21:$Vw}),o($Vx,[2,15]),o($Vx,[2,16]),{7:[2,11],20:$Vv,21:$Vw},{7:[2,27],20:$Vv,21:$Vw}],
defaultActions: {5:[2,1],18:[2,20],20:[2,22],21:[2,23],28:[2,30],29:[2,31],31:[2,33],33:[2,35],34:[2,36],35:[2,37],36:[2,38],47:[2,21],48:[2,24],49:[2,25],50:[2,26],53:[2,29],56:[2,39]},
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

var method = (function() {
	function method(name, directives, insns) {
		this.name = name;
		this.locals = {};
		this.labels = {};
		this.insns  = [];
		this.nlocals = 0;  // Amount of local variables
		this.nparms  = 1;  // Amount of parameters
		this.nBytes  = 4;
		this.byteCode = [];

		var me = this;

		directives.forEach(function(e, idx) {
			if (typeof e === 'function') {
				me.locals = e(me.locals);
			} else if (e[0] === 'LOCALS') {
				me.nlocals = e[1](me.locals);
			} else if (e[0] === 'ARGS') {
				me.nparms = e[1](me.locals);
			}
		});

		insns.forEach(function(e) {
			var insn = e[0];
			var f = null;
			var bc = [];

			// f takes 'm', which is local variables, 'c' which is the
			// constant pool and 'methods' which are the procedures.
			f = function(m, c, methods) {
				if (insn === 'LABEL') {
					me.labels[e[1]] = me.nBytes;
					console.log("Label", e[1], "at", me.nBytes);
					return [];
				}

				if (!m.hasOwnProperty(insn)) {
					throw new Error("Unable to find instruction");
				}

				var bc = [];
				var t = m[insn];
				me.nBytes += 1;
				bc.push(t[0]);

				t[1].forEach(function(p) {
					switch(p) {
					case 'byte':
						me.nBytes += 1;
						bc.push(e[1](me.locals));
						break;
					case 'label':
						var staticAddr = me.nBytes - 1;
						me.nBytes += 2;
						bc.push(function() {
							console.log("Going from", me.nBytes, "to label", me.labels[e[1]]);
							var off = me.labels[e[1]] - staticAddr;
							var bc = [];
							bc.push((off & (~255)) >> 8);
							bc.push(off & 255);
							return bc;
						});
						break;
					case 'varnum':
						me.nBytes += 1;
						bc.push(e[1](me.locals));
						break;
					case 'varnum-wide':
						me.nBytes += 1;
						var off = e[1](me.locals);
						//bc.push((off & (~255)) >> 8);
						bc.push(off & 255);
						break;
					case 'method':
						me.nBytes += 2;
						var midx = methods[e[1]];
						bc.push((midx & (~255)) >> 8);
						bc.push(midx & 255);
						break;
					case 'constant':
						me.nBytes += 2;
						var v = e[1](me.locals);
						var idx = c.indexOf[v];
						if (idx == -1) {
							idx = c.length
							c.push(v)
						}
						bc.push((idx & (~255)) >> 8);
						bc.push(idx & 255);
						break;
					}
				});

				return bc;
			}

			me.insns.push(f);
		});
	}

	method.prototype.generateBytecode = function(m, constantPool, methods) {
		var me = this;
		var bc = [];
		bc.push((this.nparms & (~255)) >> 8);
		bc.push(this.nparms & 255);
		bc.push((this.nlocals & (~255)) >> 8);
		bc.push(this.nlocals & 255);

		this.insns.forEach(function(e) {
			var ibc = e(m, constantPool, methods);
			bc = bc.concat(ibc);
		});

		bc.forEach(function(c) {
			if (typeof c === 'function') {
				me.byteCode = me.byteCode.concat(c())
			} else {
				me.byteCode.push(c);
			}
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
case 0:return 7;
break;
case 1:/* skip whitespace */
break;
case 2:/* skip singeline comment */
break;
case 3:/* skip multiline comments (no nesting) */
break;
case 4:return 19;
break;
case 5:return 25;
break;
case 6:return 26;
break;
case 7:return 27;
break;
case 8:return 28;
break;
case 9:return 29;
break;
case 10:return 30;
break;
case 11:return 31;
break;
case 12:return 32;
break;
case 13:return 33;
break;
case 14:return 35;
break;
case 15:return 36;
break;
case 16:return 37;
break;
case 17:return 38;
break;
case 18:return 39;
break;
case 19:return 40;
break;
case 20:return 41;
break;
case 21:return 42;
break;
case 22:return 43;
break;
case 23:return 44;
break;
case 24:return 45;
break;
case 25:return 9;
break;
case 26:return 14;
break;
case 27:return 16;
break;
case 28:return 17;
break;
case 29:return 22;
break;
case 30:return 23;
break;
case 31:return 20;
break;
case 32:return 21;
break;
case 33:return 18;
break;
case 34:return 34;
break;
case 35:return 46;
break;
case 36:return 10;
break;
case 37:return 5;
break;
}
},
rules: [/^(?:\n+)/i,/^(?:[^\n\S]+)/i,/^(?:\/\/[^\n]*)/i,/^(?:\/\*(.|\n|\r)*?\*\/)/i,/^(?:([0-9]+|0x[0-9A-F]+)\b)/i,/^(?:bipush\b)/i,/^(?:dup\b)/i,/^(?:goto\b)/i,/^(?:iadd\b)/i,/^(?:iand\b)/i,/^(?:ifeq\b)/i,/^(?:iflt\b)/i,/^(?:if_icmpeq\b)/i,/^(?:iinc\b)/i,/^(?:iload\b)/i,/^(?:invokevirtual\b)/i,/^(?:ior\b)/i,/^(?:ireturn\b)/i,/^(?:istore\b)/i,/^(?:isub\b)/i,/^(?:ldc_w\b)/i,/^(?:nop\b)/i,/^(?:pop\b)/i,/^(?:swap\b)/i,/^(?:wide\b)/i,/^(?:\.method\b)/i,/^(?:\.args\b)/i,/^(?:\.locals\b)/i,/^(?:\.define\b)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\+)/i,/^(?:-)/i,/^(?:=)/i,/^(?:,)/i,/^(?::)/i,/^(?:[a-zA-Z]\w*)/i,/^(?:$)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
return parser;
});