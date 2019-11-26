tests
test074BinaryNodeReturnsTheValueAsFloat
	| pp |
	pp := parser hexNumber.
	self assert: 0.0 equals: (pp parse: '0x00') value.
	self assert: 107.0 equals: (pp parse: '0x6b') value