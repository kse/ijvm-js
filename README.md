# ijvm-js

A (work in progress) MIC1 simulator, based upon the architecture described in
the book Structured Computer Organization.

## License

This program (with the exception of mic1.mal) is licensed under GPLv3. This
license can be found in gpl.txt, which is included in this directory.

The file "mic1.mal" was taken from the github repository kse/ijvm-tools,
containing code written by Kristian Høgsberg, and is distributed under the
GPLv2 license. This license can be found in the respective repository.

Copyright 2015 by Kasper Sacharias Roos Eenberg

## Known Issues

The program is in a rough state right now, since it is still a work in
progress, thus there are several know limitations. Specifically, be aware of
the following.

- Currently the *ijvm.spec* file is hardcoded and the parser does not support
	alternative usage. This means you cannot add new IJVM commands.
- The visualization is very rough and the microinstructions themselves aren't
	shown. This needs fixing.
- There is no indication as to which IJVM instruction the program is executing.
- The two editors probably need to be shown at the same time, so it is easier
	to follow the flow of the program.
- Passing parameters is awful, they are simply space separated.
- There is no feedback on parsing errors, excepting in the console.
- The stack is not really shown. In fact, a major problem with showing the
	stack is that it is not always in the ideal state. So TOS may never be
	written before SP is decremented below it. A more ideal thing would be to
	create an idealized stack layout when changing IJVM command, while also
	showing the *real* stack layout (including pointers).
- The result of the computation is only shown in the console.
