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
[a-zA-Z]\w*             {return 'SYMBOL';}
<<EOF>>                 {return 'EOF';}
/lex

%left PLUS
%left MINUS

/* operator associations and precedence */

%start program

%% /* language grammar */

program
	: empty methods EOF
		{return $2;}
	;

empty
	: empty ENDLINE
	| ENDLINE
	;

methods
	: methods method
		{$$ = $1.concat($2);}
	| method
		{$$ = [$1]}
	;

method
	: METHOD SYMBOL empty direntry insnsentry
		{
			$$ = new method($2, $4, $6);
		}
	;

direntry
	: ENDLINE direntry
	| directives
	;

insnsentry
	: ENDLINE insnsentry
	| insns
	;

directives
	: directives empty directive
		{
			$$ = $1;
			$$.push($3);
		}
	| directive
		{
			$$ = [$1];
		}
	| directives directive
		{
			$$ = $1;
			$$.push($2);
		}
	;

directive
	: ARG expr ENDLINE
		{$$ = ['ARGS', $2];}
	| LOCAL expr ENDLINE
		{$$ = ['LOCALS', $2];}
	| DEFINE SYMBOL EQUAL expr ENDLINE
		{
			$$ = ['DEFINE', function(env) {
				if (env.hasOwnProperty($2)) {
					throw new Error("Redefinition of variable " + $2 + " on line " +  yylineno);
				}

				env[$2] = $4(env);
				return env;
			}]
		}
	;

expr
	: INTEGER
		{
			$$ = function() {
				return $1|0;
			};
		}
	| SYMBOL
		{
			$$ = function(env, lbl) {
				if (!!lbl) {
					return $1;
				}

				if (!env.hasOwnProperty($1)) {
					throw new Error("Unresolved variable " + $1 + " on line " +  yylineno);
				}
				return env[$1]|0;
			};
		}
	| expr PLUS expr
		{
			$$ = new exprFun($1, $3,
				(function (a,b) {return a + b}),
				_$
				);
		}
	| expr MINUS expr
		{
			$$ = new exprFun($1, $3,
				(function (a,b) {return a - b}),
				_$
				);
		}
	| LPAREN expr RPAREN
		{
			$$ = function(env) {
				return $2(env);
			}
		}
	;

label
	: SYMBOL COLON
		{ 
			$$ = function(insn) {
				insn.label = $1;
			}
		}
	|
		{ 
			$$ = function(insn) {
				insn.label = '';
			}
		}
	;

insns
	: insns empty insn
		{
			$$ = $1;
			$$.push($3);
		}
	| insn
		{$$ = [$1];}
	| insns insn
		{
			$$ = $1;
			$$.push($2);
		}
	;

insn
	: SYMBOL exprs ENDLINE
		{
			$$ = [$1].concat($2);
		}
	| SYMBOL ENDLINE
		{$$ = [$1].concat($2);}
	| SYMBOL COLON ENDLINE
		{$$ = ['LABEL', $1];}
	| SYMBOL COLON
		{$$ = ['LABEL', $1];}
	;

exprs
	: exprs expr
		{
			$1.push(expr)
			$$ = $1;
		}
	| expr
		{
			$$ = [$1];
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
	function instruction(symbol, expressions) {
		this.symbol = symbol;
		this.expressions = expressions;
	}

	return instruction;
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
		this.errors = [];

		var me = this;

		directives.forEach(function(e, idx) {
			if (e[0] === 'DEFINE') {
				me.locals = e[1](me.locals);
			} else if (e[0] === 'LOCALS') {
				me.nlocals = e[1](me.locals);
			} else if (e[0] === 'ARGS') {
				me.nparms = e[1](me.locals);
			}
		});

		console.log(insns);

		insns.forEach(function(e) {
			if (e.length == 0) {
				return;
			}
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
					throw new Error("Unable to find instruction: " + insn);
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
							var lbl = e[1](me.locals, true);
							console.log("Going from", me.nBytes, "to label", me.labels[lbl]);
							var off = me.labels[lbl] - staticAddr;
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
