#pragma once

#include "ReadStream.h"
#include "Script.h"
#include "PE.h"

class Program {

public:
	Program(ReadStream*);
	Program(void);
	~Program(void);
	
	unsigned char getScriptCount(void);
	Script * getScript(void);
	void configurePins(PE*);

private:
	
	unsigned char _inputs[3];
	unsigned char _outputs[3];
	unsigned char _scriptCount;
	Script * _script;
	
	void parsePinModes(ReadStream*);
	void parseScripts(ReadStream*);
};

