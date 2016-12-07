#pragma once

#include "StackArray.h"
#include "Script.h"

class Coroutine
{
public:
	Coroutine(Script*);
	Coroutine(void);
	~Coroutine(void);

	void setNext(Coroutine*);
	Coroutine* getNext(void);
	Script* getScript(void);
	int16 getPC(void);
	void setPC(int16);
	StackArray* getStack(void);
	void setStack(StackArray*);

private:

	int16 pc;
	StackArray* stack; 
	Script* script;

	Coroutine* next;
};