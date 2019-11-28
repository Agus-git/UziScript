tests
test075BinaryNodeIsCaseSensitive
	| pp |
	pp := parser hexNumber.
	self assert: 15.0 equals: (pp parse: '0xF') value.
	self assert: 107.0 equals: (pp parse: '0x6B') value