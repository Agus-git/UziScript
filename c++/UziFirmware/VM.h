
#pragma once

#include "GPIO.h"
#include "StackArray.h"
#include "Program.h"

class VM
{

public:
	VM(void) 
	{
		stack = new StackArray();
	}
	~VM(void)
	{
		delete stack;
	}

	void executeProgram(Program*, GPIO*);

private:

	int16 pc;
	StackArray * stack;
	Program * currentProgram;
	Script * currentScript;

	Instruction nextInstruction(void);
	void executeInstruction(Instruction, GPIO*);
	void executePrimitive(uint16, GPIO*);
	void executeScript(Script*, GPIO*);

};

