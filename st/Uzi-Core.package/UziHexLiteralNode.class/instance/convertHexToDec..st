as yet unclassified
convertHexToDec: char
	char = $a ifTrue: [^10].
	char = $b ifTrue: [^11].
	char = $c ifTrue: [^12].
	char = $d ifTrue: [^13].
	char = $e ifTrue: [^14].
	char = $f ifTrue: [^15].
	char = $0 ifTrue: [^0].
	char = $1 ifTrue: [^1].
	char = $2 ifTrue: [^2].
	char = $3 ifTrue: [^3].
	char = $4 ifTrue: [^4].
	char = $5 ifTrue: [^5].
	char = $6 ifTrue: [^6].
	char = $7 ifTrue: [^7].
	char = $8 ifTrue: [^8].
	char = $9 ifTrue: [^9].
	