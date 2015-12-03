/* lexical grammar */
%lex
%options case-insensitive

%%
\n                      {return 'ENDLINE';}
[^\n\S]+                {/* skip whitespace */}
"("                     {return '(';}
")"                     {return ')';}
"="                     {return '=';}
"-"                     {return '-';}
"+"                     {return '+';}
":"                     {return ':';}
";"                     {return ';';}
"<<"                    {return '<<';}
">>"                    {return '>>';}
"if"\b                  {return 'IF';}
"rd"\b                  {return 'RD';}
"wr"\b                  {return 'WR';}
(goto)\b                {return 'GOTO'}
(else)\b                {return 'ELSE'}
(fetch)\b               {return 'FETCH'}
(and)\b                 {return 'AND'}
(or)\b                  {return 'OR'}
(inv)\b                 {return 'INV'}
(empty)\b               {return 'EMPTY'}
(halt)\b                {return 'HALT'}
(1)\b                   {return '1'}
(0)\b                   {return '0'}
(8)\b                   {return '8'}
([0-9]+|0x[0-9A-F]+)\b  {return 'INTEGER';} /* TODO: Match binary */
(mar|mbr|mbru|mdr|pc|sp|lv|cpp|tos|opc|h)\b  {return'REG'}
(n|z)\b                 {return 'VREG';}
[a-zA-Z]\w*             {return 'SYMBOL'}
<<EOF>>                 {return 'EOF';}

/lex

/* operator associations and precedence */

%start program

%% /* language grammar */

program : prog {return $1;}
	    ;

prog : expr ENDLINE prog
		{$1 = $1.concat($3); $$ = $1;}
     | EOF { }
	 ;

expr : label insns
		{
			$$ = $1($2)
		}
     | label
		{$$ = [$1]}
	 | EMPTY
		{
			$$ = [new mic()];
			$$[0].lineNumber = @$.first_line;
		}
	 | HALT
		{
			var v = new mic();
			v.nextaddress = 'halt';
			v.lineNumber = @$.first_line;
			$$ = [v];
		}
	 | insns
		{$$ = [$1];}
     | {$$ = [];}
     ;

label : SYMBOL ':'
		{
			$$ = function(inst) {
				inst.label = $1;
				return inst;
			}
		}
      | SYMBOL '=' INTEGER ':'
		{
			$$ = function(inst) {
				inst.label = $1;
				inst.addr  = parseInt($3);
				return inst;
			}
		}
	;

alu : REG
		{
			$$ = new mic();
			$$.lineNumber = @$.first_line;
			var reg = $1.toLowerCase();

			if (reg === 'h') {
				$$.f1  = true;
				$$.ena = true;
			} else {
				$$.src = $1;
				$$.f1  = true;
				$$.enb = true;
			}
		}
	| INV '(' REG ')'
		{
			$$ = new mic();
			$$.lineNumber = @$.first_line;

			if ($3.toLowerCase() != 'h') {
				$$.f1   = true;
				$$.ena  = true;
				$$.inva = true;
			} else {
				$$.f0 = true;
				$$.ena = true;
				$$.enb = true;
				$$.src = $3;
			}
		}
	| '-' REG
		{
			if ($2.toLowerCase() != 'h') {
				throw new Error("Only the H register can be subtracted");
			}

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.src = $2;
			$$.f0  = true;
			$$.f1  = true;

			$$.ena  = true;
			$$.inva = true;
			$$.inc  = true;
		} 
    | REG '+' REG
		{
			var first = $1.toLowerCase();
			var second = $3.toLowerCase();

			if ((first == 'h' && second == 'h') || (first != 'h' && second != 'h')) {
				throw new Error("You can only add using both A and B bus.");
			}

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.f0 = true;
			$$.f1 = true;
			$$.ena = true;
			$$.enb = true;

			if (first == 'h') {
				$$.src = second;
			} else {
				$$.src = first;
			}
		} 
    | REG '+' REG '+' '1'
		{
			var first = $1.toLowerCase();
			var second = $3.toLowerCase();

			if ((first == 'h' && second == 'h') || (first != 'h' && second != 'h')) {
				throw new Error("You can only add using both A and B bus.");
			}

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.f0 = true;
			$$.f1 = true;
			$$.ena = true;
			$$.enb = true;
			$$.inc = true;

			if (first == 'h') {
				$$.src = second;
			} else {
				$$.src = first;
			}
		} 
    | REG '+' '1'
		{
			var first = $1.toLowerCase();

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.f0 = true;
			$$.f1 = true;
			$$.inc = true;

			if (first == 'h') {
				$$.ena = true;
			} else {
				$$.src = first;
				$$.enb = true;
			}
		} 
    | REG '-' REG
		{
			if ($3.toLowerCase() != 'h') {
				throw new Error("Only the H register can be subtracted");
			}

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.src  = $1;
			$$.f0   = true;
			$$.f1   = true;
			$$.ena  = true;
			$$.inva = true;
			$$.inc  = true;
			$$.enb  = true;
		} 
    | REG '-' '1'
		{
			if ($1.toLowerCase() == 'h') {
				throw new Error("Only the B bus can be decreased by one");
			}

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.src  = $1;
			$$.f0   = true;
			$$.f1   = true;
			$$.inva = true;
			$$.enb  = true;
		} 
    | REG AND REG
		{
			var first = $1.toLowerCase();
			var second = $3.toLowerCase();

			if ((first == 'h' && second == 'h') || (first != 'h' && second != 'h')) {
				throw new Error("You can only and using both A and B bus.");
			}

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.ena = true;
			$$.enb = true;

			if (first == 'h') {
				$$.src = second;
			} else {
				$$.src = first;
			}
		} 
    | REG OR REG
		{
			var first = $1.toLowerCase();
			var second = $3.toLowerCase();

			if ((first == 'h' && second == 'h') || (first != 'h' && second != 'h')) {
				throw new Error("You can only or using both A and B bus.");
			}

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.ena = true;
			$$.enb = true;
			$$.f1  = true;

			if (first == 'h') {
				$$.src = second;
			} else {
				$$.src = first;
			}
		} 
    | '1'
		{
			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.f0  = true;
			$$.f1  = true;
			$$.inc = true;
		}
    | '0'
		{
			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.f1 = true;
		}
    | '-' '1'
		{
			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.f0   = true;
			$$.f1   = true;
			$$.inva = true;
		}
	;

cond : VREG ;

insns : insns ';' insn
		{
			$$ = $3.addTo($1);
		}
      | insn
	  ;

assign : REG '=' assign
		{$3.destination.push($1); $$ = $3;} 
       | REG '=' alu
		{$3.destination.push($1); $$ = $3;} 
       | REG '=' alu '>>' '1'
		{$3.destination.push($1); $3.sra1 = true; $$ = $3;} 
       | REG '=' alu '<<' '8'
		{$3.destination.push($1); $3.sll8 = true; $$ = $3;} 
       | VREG '=' assign
		{
			$$ = $3;
		} 
       | VREG '=' alu
		{
			$$ = $3;
		} 
       | VREG '=' alu '>>' '1'
		{
			$3.sra1 = true; $$ = $3;
		} 
       | VREG '=' alu '<<' '8'
		{
			$3.sll8 = true; $$ = $3;
		} 
       ;

insn : RD
		{
			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.read = true;
		}
	 | WR
		{
			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.write = true;
		}
	 | FETCH
		{
			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.fetch = true;
		}
	 | GOTO SYMBOL
		{
			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.nextaddress = $2;
		}
	 | GOTO '(' REG ')'
		{
			if ($3.toLowerCase() != 'mbr') {
				throw new Error("Can only goto MBR register");
			}

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.nextaddress = 0;
			$$.jmpc = true;
		}
     | GOTO '(' REG OR INTEGER ')'
		{
			if ($3.toLowerCase() != 'mbr') {
				throw new Error("Can only goto MBR register");
			}

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.nextaddress = parseInt($5);
			$$.jmpc = true;
		}
     | IF '(' cond ')' GOTO SYMBOL ';' ELSE GOTO SYMBOL
		{
			var cond = $3.toLowerCase();

			$$ = new mic();
			$$.lineNumber = @$.first_line;
			$$.nextaddress = parseInt($5);

			if (cond == 'z') {
				$$.jamz = true;
			} else {
				$$.jamn = true;
			}

			$$.nextaddress = [$6, $10];
		}
     | assign
		{$$ = $1;} 
	 ;

%% 

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
