encoding programs
writeScripts: scripts
	self indent; write: ':scripts ['.
	scripts 
		do: [:s | self visit: s]
		separatedBy: [self writeLine: ''; indent; indent].
	self write: ']'