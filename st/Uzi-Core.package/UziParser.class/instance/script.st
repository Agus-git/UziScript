grammar-scripts
script
	^ ws , ('task' asParser, ws , identifier , paramsList, scriptState optional , tickingRate optional , scriptBody) token , ws
	map: [:ign1 :token :ign2 || nodes |
		nodes := token parsedValue.
		(UziScriptNode
			name: nodes third
			arguments: nodes fourth
			state: nodes fifth
			tickingRate: nodes sixth 
			body: nodes seventh)
			token: token]