#pragma once

#include "Arduino.h"
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
	void saveStack(StackArray*);
	void restoreStack(StackArray*);
	int32 getNextRun(void);
	void setNextRun(int32);


private:

	int16 pc;
	float* stackElements;
	uint16 stackSize;

	Script* script;
	int32 nextRun;

	Coroutine* next;
};