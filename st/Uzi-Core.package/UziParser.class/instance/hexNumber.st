as yet unclassified
hexNumber
	^ws, (($0 asParser , $x asParser),( #digit asParser / hexLetters) plus) token, ws
	map: [:ign1 :token :ign2 | 
		(UziHexLiteralNode value: token parsedValue third "pinNumber")
		token: token]
	