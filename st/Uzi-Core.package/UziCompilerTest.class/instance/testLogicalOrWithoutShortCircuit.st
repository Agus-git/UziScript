tests
testLogicalOrWithoutShortCircuit
	| cc program script |
	cc := UziCompiler new.
	program := cc compile: '@foo [^ 1 || 0]'.
	script := program scripts first.
	self assert: script instructions = {
		push arg: (program constants detect: [:var | var value = 1]).
		push arg: (program constants detect: [:var | var value = 0]).
		prim arg: (UziPrimitive named: #logicalOr).
		prim arg: (UziPrimitive named: #retv)
	}