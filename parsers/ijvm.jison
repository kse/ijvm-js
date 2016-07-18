/* lexical grammar */
%lex
%options case-insensitive

%%
\n                      {return 'ENDLINE';}
[^\n\S]+                {/* skip whitespace */}
"//"[^\n]*              {/* skip singeline comment */}
"/*"(.|\n|\r)*?"*/"     {/* skip multiline comments (no nesting) */}
([0-9]+|0x[0-9A-F]+)\b  {return 'INTEGER';} /* TODO: Match binary */
".method"\b             {return 'METHOD';}
".args"\b               {return 'ARG';}
".locals"\b             {return 'LOCAL';}
".define"\b             {return 'DEFINE';}
"("                     {return 'LPAREN';}
")"                     {return 'RPAREN';}
"+"                     {return 'PLUS';}
"-"                     {return 'MINUS';}
"="                     {return 'EQUAL';}
","                     {return 'COMMA';}
":"                     {return 'COLON';}
[a-zA-Z]\w*\b           {return 'SYMBOL';}
<<EOF>>                 {return 'EOF';}
/lex

%expect 4

%left MINUS PLUS
%left NEG

/* operator associations and precedence */

%start program

%% /* language grammar */

newline+
	: newline+ ENDLINE
		{$$ = [];}
	| ENDLINE
		{$$ = [];}
	;

program
	: newline+ methods EOF
		{return $2;}
	| methods EOF
		{return $1;}
	;

methods
	: methods newline+ method
		{
			$$ = $1;
			$$.push($3);
		}
	| methods method
		{
			$$ = $1;
			$$.push($2);
		}
	| method
		{$$ = [$1];}
	;

method
	: METHOD SYMBOL newline+ methodbody
		{
			//console.log("MDirectives:", $4[0]);
			$$ = new method($2, $4[0], $4[1], _$);
		}
	;

methodbody
	: directive_begin insns_begin
		{
			$$ = [$1, $2];
			//console.log($1);
		}
	;

directive_begin
	: directive directives newline+
		{
			$$ = [$1].concat($2);
		}
	| directive directives
		{
			$$ = [$1].concat($2);
		}
	|
		{$$ = [];}
	;

insns_begin
	: insn insns newline+
		{
			$$ = $2;
			$$.unshift($1);
		}
	| insn insns
		{
			$$ = $2;
			$$.unshift($1);
		}
	;

directives
	: directive
		{
			$$ = [$1];
			//console.log("1:", $$)
		}
	| directives directive
		{
			$$ = $1.concat($2);
		}
	| directives newline+ directive
		{
			$$ = $1.concat($3);
		}
	;

directive
	: ARG expr ENDLINE
		{
			var loc = @$;
			$$ = function(method) {
				var args = $2(method);
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
		}
	| LOCAL expr ENDLINE
		{
			var loc = @$;
			$$ = function(method) {
				var locals = $2(method);
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
		}
	| DEFINE SYMBOL EQUAL expr ENDLINE
		{
			var loc = @$;
			var sym = $2;
			$$ = function(method) {
				var val = $4(method);

				if (method.locals.hasOwnProperty(sym)) {
					method.errors.push(["Redefinition of variable " + sym, loc]);
					return;
				}

				method.locals[sym] = val;
			};
		}
	;

insns
	: insn
		{
			$$ = [$1];
		}
	| insns insn
		{
			$$ = $1;
			$$.push($2);
		}
	| insns newline+ insn
		{
			$$ = $1;
			$$.push($3);
		}
	;

insn
	: SYMBOL exprs ENDLINE
		{
			$$ = new instruction($1, $2, @$);
		}
	| SYMBOL ENDLINE
		{
			$$ = new instruction($1, [], @$);
		}
	| SYMBOL COLON
		{
			$$ = {
				generate: function(method) {
					method.labels[$1] = method.byteCode.length;
				},
			};
		}
	;

exprs
	: exprs expr
		{
			$$ = $1;
			$$.push($2);
		}
	| expr
		{
			$$ = [$1];
		}
	;

expr
	: INTEGER
		{
			$$ = function(method) {
				return parseInt($1);
			};
		}
	| SYMBOL
		{
			var e = $1;
			var loc = @$;
			$$ = function(method, label) {
				if (!!label) {
					return e;
				}

				if (!method.locals.hasOwnProperty(e)) {
					method.errors.push(["Unresolvable variable " + e, loc]);
					return 1;
				}

				return method.locals[$1];
			};
		}
	| expr PLUS expr
		{
			var l = $1;
			var r = $3;
			var loc = @$;
			$$ = function(method) {
				return l(method) + r(method);
			};
		}
	| expr MINUS expr
		{
			var l = $1;
			var r = $3;
			$$ = function(method) {
				return l(method) - r(method);
			};
		}
	| MINUS expr %prec NEG
		{
			var e = $2;
			$$ = function(method) {
				return e(method);
			};
		}
	| LPAREN expr RPAREN
		{
			var e = $2;
			$$ = function(method) {
				return e(method);
			};
		}
	;

%%

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
		this.nargs     = null;   // Amount of parameters
		this.nBytes    = 4;
		this.byteCode  = [];
		this.errors    = [];
		this.resolvers = [];

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
		var bc = [];

		this.insns.forEach(function(e) {
			//var ibc = e(m, constantPool, methods);
			e.generate(me, m);
			//bc = bc.concat(ibc);
		});
	};

	return method;
}());
