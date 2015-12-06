

define(function(require){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[2,9],$V1=[1,4],$V2=[1,6],$V3=[1,7],$V4=[1,9],$V5=[1,17],$V6=[1,18],$V7=[1,11],$V8=[1,12],$V9=[1,13],$Va=[1,14],$Vb=[1,15],$Vc=[1,21],$Vd=[6,29],$Ve=[1,27],$Vf=[6,17,28,35,36,37,38,39],$Vg=[1,37],$Vh=[1,38],$Vi=[1,39],$Vj=[1,40],$Vk=[1,41],$Vl=[6,29,32,33];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"0":26,"1":23,"8":34,"error":2,"program":3,"prog":4,"expr":5,"ENDLINE":6,"EOF":7,"label":8,"insns":9,"EMPTY":10,"HALT":11,"SYMBOL":12,":":13,"=":14,"INTEGER":15,"alu":16,"REG":17,"INV":18,"(":19,")":20,"-":21,"+":22,"AND":24,"OR":25,"cond":27,"VREG":28,";":29,"insn":30,"assign":31,">>":32,"<<":33,"RD":35,"WR":36,"FETCH":37,"GOTO":38,"IF":39,"ELSE":40,"$accept":0,"$end":1},
terminals_: {2:"error",6:"ENDLINE",7:"EOF",10:"EMPTY",11:"HALT",12:"SYMBOL",13:":",14:"=",15:"INTEGER",17:"REG",18:"INV",19:"(",20:")",21:"-",22:"+",23:"1",24:"AND",25:"OR",26:"0",28:"VREG",29:";",32:">>",33:"<<",34:"8",35:"RD",36:"WR",37:"FETCH",38:"GOTO",39:"IF",40:"ELSE"},
productions_: [0,[3,1],[4,3],[4,1],[5,2],[5,1],[5,1],[5,1],[5,1],[5,0],[8,2],[8,4],[16,1],[16,4],[16,2],[16,3],[16,5],[16,3],[16,3],[16,3],[16,3],[16,3],[16,1],[16,1],[16,2],[27,1],[9,3],[9,1],[31,3],[31,3],[31,5],[31,5],[31,3],[31,3],[31,5],[31,5],[30,1],[30,1],[30,1],[30,2],[30,4],[30,6],[30,10],[30,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return $$[$0];
break;
case 2:
$$[$0-2] = $$[$0-2].concat($$[$0]); this.$ = $$[$0-2];
break;
case 3:
 
break;
case 4:

			this.$ = $$[$0-1]($$[$0])
		
break;
case 5:
this.$ = [$$[$0]]
break;
case 6:

			this.$ = [new mic()];
			this.$[0].lineNumber = this._$.first_line;
		
break;
case 7:

			var v = new mic();
			v.nextaddress = 'halt';
			v.lineNumber = this._$.first_line;
			this.$ = [v];
		
break;
case 8:
this.$ = [$$[$0]];
break;
case 9:
this.$ = [];
break;
case 10:

			this.$ = function(inst) {
				inst.label = $$[$0-1];
				return inst;
			}
		
break;
case 11:

			this.$ = function(inst) {
				inst.label = $$[$0-3];
				inst.addr  = parseInt($$[$0-1]);
				return inst;
			}
		
break;
case 12:

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			var reg = $$[$0].toLowerCase();

			if (reg === 'h') {
				this.$.f1  = true;
				this.$.ena = true;
			} else {
				this.$.src = $$[$0];
				this.$.f1  = true;
				this.$.enb = true;
			}
		
break;
case 13:

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;

			if ($$[$0-1].toLowerCase() != 'h') {
				this.$.f1   = true;
				this.$.ena  = true;
				this.$.inva = true;
			} else {
				this.$.f0 = true;
				this.$.ena = true;
				this.$.enb = true;
				this.$.src = $$[$0-1];
			}
		
break;
case 14:

			if ($$[$0].toLowerCase() != 'h') {
				throw new Error("Only the H register can be subtracted");
			}

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.src = $$[$0];
			this.$.f0  = true;
			this.$.f1  = true;

			this.$.ena  = true;
			this.$.inva = true;
			this.$.inc  = true;
		
break;
case 15:

			var first = $$[$0-2].toLowerCase();
			var second = $$[$0].toLowerCase();

			if ((first == 'h' && second == 'h') || (first != 'h' && second != 'h')) {
				throw new Error("You can only add using both A and B bus.");
			}

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.f0 = true;
			this.$.f1 = true;
			this.$.ena = true;
			this.$.enb = true;

			if (first == 'h') {
				this.$.src = second;
			} else {
				this.$.src = first;
			}
		
break;
case 16:

			var first = $$[$0-4].toLowerCase();
			var second = $$[$0-2].toLowerCase();

			if ((first == 'h' && second == 'h') || (first != 'h' && second != 'h')) {
				throw new Error("You can only add using both A and B bus.");
			}

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.f0 = true;
			this.$.f1 = true;
			this.$.ena = true;
			this.$.enb = true;
			this.$.inc = true;

			if (first == 'h') {
				this.$.src = second;
			} else {
				this.$.src = first;
			}
		
break;
case 17:

			var first = $$[$0-2].toLowerCase();

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.f0 = true;
			this.$.f1 = true;
			this.$.inc = true;

			if (first == 'h') {
				this.$.ena = true;
			} else {
				this.$.src = first;
				this.$.enb = true;
			}
		
break;
case 18:

			if ($$[$0].toLowerCase() != 'h') {
				throw new Error("Only the H register can be subtracted");
			}

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.src  = $$[$0-2];
			this.$.f0   = true;
			this.$.f1   = true;
			this.$.ena  = true;
			this.$.inva = true;
			this.$.inc  = true;
			this.$.enb  = true;
		
break;
case 19:

			if ($$[$0-2].toLowerCase() == 'h') {
				throw new Error("Only the B bus can be decreased by one");
			}

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.src  = $$[$0-2];
			this.$.f0   = true;
			this.$.f1   = true;
			this.$.inva = true;
			this.$.enb  = true;
		
break;
case 20:

			var first = $$[$0-2].toLowerCase();
			var second = $$[$0].toLowerCase();

			if ((first == 'h' && second == 'h') || (first != 'h' && second != 'h')) {
				throw new Error("You can only and using both A and B bus.");
			}

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.ena = true;
			this.$.enb = true;

			if (first == 'h') {
				this.$.src = second;
			} else {
				this.$.src = first;
			}
		
break;
case 21:

			var first = $$[$0-2].toLowerCase();
			var second = $$[$0].toLowerCase();

			if ((first == 'h' && second == 'h') || (first != 'h' && second != 'h')) {
				throw new Error("You can only or using both A and B bus.");
			}

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.ena = true;
			this.$.enb = true;
			this.$.f1  = true;

			if (first == 'h') {
				this.$.src = second;
			} else {
				this.$.src = first;
			}
		
break;
case 22:

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.f0  = true;
			this.$.f1  = true;
			this.$.inc = true;
		
break;
case 23:

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.f1 = true;
		
break;
case 24:

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.f0   = true;
			this.$.f1   = true;
			this.$.inva = true;
		
break;
case 26:

			this.$ = $$[$0].addTo($$[$0-2]);
		
break;
case 28: case 29:
$$[$0].destination.push($$[$0-2]); this.$ = $$[$0];
break;
case 30:
$$[$0-2].destination.push($$[$0-4]); $$[$0-2].sra1 = true; this.$ = $$[$0-2];
break;
case 31:
$$[$0-2].destination.push($$[$0-4]); $$[$0-2].sll8 = true; this.$ = $$[$0-2];
break;
case 32: case 33:

			this.$ = $$[$0];
		
break;
case 34:

			$$[$0-2].sra1 = true; this.$ = $$[$0-2];
		
break;
case 35:

			$$[$0-2].sll8 = true; this.$ = $$[$0-2];
		
break;
case 36:

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.read = true;
		
break;
case 37:

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.write = true;
		
break;
case 38:

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.fetch = true;
		
break;
case 39:

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.nextaddress = $$[$0];
		
break;
case 40:

			if ($$[$0-1].toLowerCase() != 'mbr') {
				throw new Error("Can only goto MBR register");
			}

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.nextaddress = 0;
			this.$.jmpc = true;
		
break;
case 41:

			if ($$[$0-3].toLowerCase() != 'mbr') {
				throw new Error("Can only goto MBR register");
			}

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.nextaddress = parseInt($$[$0-1]);
			this.$.jmpc = true;
		
break;
case 42:

			var cond = $$[$0-7].toLowerCase();

			this.$ = new mic();
			this.$.lineNumber = this._$.first_line;
			this.$.nextaddress = parseInt($$[$0-5]);

			if (cond == 'z') {
				this.$.jamz = true;
			} else {
				this.$.jamn = true;
			}

			this.$.nextaddress = [$$[$0-4], $$[$0]];
		
break;
case 43:
this.$ = $$[$0];
break;
}
},
table: [{3:1,4:2,5:3,6:$V0,7:$V1,8:5,9:8,10:$V2,11:$V3,12:$V4,17:$V5,28:$V6,30:10,31:16,35:$V7,36:$V8,37:$V9,38:$Va,39:$Vb},{1:[3]},{1:[2,1]},{6:[1,19]},{1:[2,3]},{6:[2,5],9:20,17:$V5,28:$V6,30:10,31:16,35:$V7,36:$V8,37:$V9,38:$Va,39:$Vb},{6:[2,6]},{6:[2,7]},{6:[2,8],29:$Vc},{13:[1,22],14:[1,23]},o($Vd,[2,27]),o($Vd,[2,36]),o($Vd,[2,37]),o($Vd,[2,38]),{12:[1,24],19:[1,25]},{19:[1,26]},o($Vd,[2,43]),{14:$Ve},{14:[1,28]},{4:29,5:3,6:$V0,7:$V1,8:5,9:8,10:$V2,11:$V3,12:$V4,17:$V5,28:$V6,30:10,31:16,35:$V7,36:$V8,37:$V9,38:$Va,39:$Vb},{6:[2,4],29:$Vc},{17:$V5,28:$V6,30:30,31:16,35:$V7,36:$V8,37:$V9,38:$Va,39:$Vb},o($Vf,[2,10]),{15:[1,31]},o($Vd,[2,39]),{17:[1,32]},{27:33,28:[1,34]},{16:36,17:$Vg,18:$Vh,21:$Vi,23:$Vj,26:$Vk,28:$V6,31:35},{16:43,17:$Vg,18:$Vh,21:$Vi,23:$Vj,26:$Vk,28:$V6,31:42},{1:[2,2]},o($Vd,[2,26]),{13:[1,44]},{20:[1,45],25:[1,46]},{20:[1,47]},{20:[2,25]},o($Vd,[2,28]),o($Vd,[2,29],{32:[1,48],33:[1,49]}),o($Vl,[2,12],{14:$Ve,21:[1,51],22:[1,50],24:[1,52],25:[1,53]}),{19:[1,54]},{17:[1,55],23:[1,56]},o($Vl,[2,22]),o($Vl,[2,23]),o($Vd,[2,32]),o($Vd,[2,33],{32:[1,57],33:[1,58]}),o($Vf,[2,11]),o($Vd,[2,40]),{15:[1,59]},{38:[1,60]},{23:[1,61]},{34:[1,62]},{17:[1,63],23:[1,64]},{17:[1,65],23:[1,66]},{17:[1,67]},{17:[1,68]},{17:[1,69]},o($Vl,[2,14]),o($Vl,[2,24]),{23:[1,70]},{34:[1,71]},{20:[1,72]},{12:[1,73]},o($Vd,[2,30]),o($Vd,[2,31]),o($Vl,[2,15],{22:[1,74]}),o($Vl,[2,17]),o($Vl,[2,18]),o($Vl,[2,19]),o($Vl,[2,20]),o($Vl,[2,21]),{20:[1,75]},o($Vd,[2,34]),o($Vd,[2,35]),o($Vd,[2,41]),{29:[1,76]},{23:[1,77]},o($Vl,[2,13]),{40:[1,78]},o($Vl,[2,16]),{38:[1,79]},{12:[1,80]},o($Vd,[2,42])],
defaultActions: {2:[2,1],4:[2,3],6:[2,6],7:[2,7],29:[2,2],34:[2,25]},
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
 

var mic = (function() {
	function microinstruction() {
		this.nextaddress = null;

		this.jmpc = false;
		this.jamn = false;
		this.jamz = false;

		this.sll8 = false;
		this.sra1 = false;
		this.f0 = false;
		this.f1 = false;
		this.ena = false;
		this.enb = false;
		this.inva = false;
		this.inc = false;

		this.destination = [];

		this.write = false;
		this.read = false;
		this.fetch = false;

		this.src = null;

		this.label = null;
		this.addr = null;

		this.lineNumber = null;
	};

	microinstruction.prototype.addTo = function(inst) {
		if (this.nextaddress != null) {
			inst.nextaddress = this.nextaddress;
		}

		inst.jmpc = inst.jmpc || this.jmpc;

		inst.jamn = inst.jamn || this.jamn;
		inst.jamz = inst.jamz || this.jamz;
		inst.sll8 = inst.sll8 || this.sll8;
		inst.sra1 = inst.sra1 || this.sra1;
		inst.f0   = inst.f0   || this.f0;
		inst.f1   = inst.f1   || this.f1;
		inst.ena  = inst.ena  || this.ena;
		inst.enb  = inst.enb  || this.enb;
		inst.inva = inst.inva || this.inva;
		inst.inc  = inst.inc  || this.inc;

		inst.destination.concat(this.destination);

		inst.write = inst.write || this.write;
		inst.read  = inst.read || this.read;
		inst.fetch = inst.fetch || this.fetch;

		if (this.src != null) {
			inst.src = this.src;
		}

		if (this.label != null) {
			inst.label = this.label;
		}

		if (this.addr != null) {
			inst.addr(this.addr);
		}

		return(inst);
	};

	return microinstruction;
})();

function isInvertible(register) {
	register = register.toLowerCase();
	var list = ['mar', 'mbr', 'mbru', 'mdr', 'pc',
		'sp', 'lv', 'cpp', 'tos', 'opc'];

	if (list.indexOf(register) == -1) {
		return false;
	} else {
		return true;
	}
}

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
case 0:return 6;
break;
case 1:/* skip whitespace */
break;
case 2:/* skip oneline comments */
break;
case 3:/* skip multiline comments (no nesting) */
break;
case 4:return 19;
break;
case 5:return 20;
break;
case 6:return 14;
break;
case 7:return 21;
break;
case 8:return 22;
break;
case 9:return 13;
break;
case 10:return 29;
break;
case 11:return 33;
break;
case 12:return 32;
break;
case 13:return 39;
break;
case 14:return 35;
break;
case 15:return 36;
break;
case 16:return 38
break;
case 17:return 40
break;
case 18:return 37
break;
case 19:return 24
break;
case 20:return 25
break;
case 21:return 18
break;
case 22:return 10
break;
case 23:return 11
break;
case 24:return 23
break;
case 25:return 26
break;
case 26:return 34
break;
case 27:return 15;
break;
case 28:return'REG'
break;
case 29:return 28;
break;
case 30:return 12
break;
case 31:return 7;
break;
}
},
rules: [/^(?:\n)/i,/^(?:[^\n\S]+)/i,/^(?:\/\/[^\n]*)/i,/^(?:\/\*(.|\n|\r)*?\*\/)/i,/^(?:\()/i,/^(?:\))/i,/^(?:=)/i,/^(?:-)/i,/^(?:\+)/i,/^(?::)/i,/^(?:;)/i,/^(?:<<)/i,/^(?:>>)/i,/^(?:if\b)/i,/^(?:rd\b)/i,/^(?:wr\b)/i,/^(?:(goto)\b)/i,/^(?:(else)\b)/i,/^(?:(fetch)\b)/i,/^(?:(and)\b)/i,/^(?:(or)\b)/i,/^(?:(inv)\b)/i,/^(?:(empty)\b)/i,/^(?:(halt)\b)/i,/^(?:(1)\b)/i,/^(?:(0)\b)/i,/^(?:(8)\b)/i,/^(?:([0-9]+|0x[0-9A-F]+)\b)/i,/^(?:(mar|mbr|mbru|mdr|pc|sp|lv|cpp|tos|opc|h)\b)/i,/^(?:(n|z)\b)/i,/^(?:[a-zA-Z]\w*)/i,/^(?:$)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
return parser;
});