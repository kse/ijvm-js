// Integer multiplication.

.method imul
.args   3			// ( int x, int y )
.define x = 1
.define y = 2
.locals 1			// int p;
.define p = 3

	bipush 0
	istore p        // p = 0;

while:				// while
	iload x         // + 1 1
	iflt end_while  // - 1 0
	iload x         // + 1 1
	ifeq end_while  // - 1 0		//    ( x > 0 ) {
	iload x         // + 1 1
	bipush 1        // + 1 2
	isub            // - 1 1
	istore x        // - 1 0		//    x = x - 1;
	iload p         // + 1 1
	iload y         // + 1 2
	iadd            // - 1 1
	istore p        // - 1 0		//    p = p + y;
	goto while		// }
end_while:
	iload  p
	ireturn			// return p;

.method main
.args   3
.define OBJREF = 44
.define x = 1
.define y = 2
	bipush OBJREF
	iload x
	iload y
	invokevirtual imul	
	ireturn
