tests
test076IsEven
	| program |	
	program := Uzi compileString: '
	task main() running 1/s {
		write(D7, isEven(1));
		if isEven(2) && isEven(-2) { write(D8, 0.5); }
		write(D9, isEven(0));
	}'.
	self writeFile: thisContext method selector capitalized
		contents: (UziProtocol new run: program)