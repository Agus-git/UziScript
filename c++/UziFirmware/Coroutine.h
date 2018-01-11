#pragma once

#include "Arduino.h"
#include "StackArray.h"
#include "Script.h"
#include "Errors.h"

class Coroutine
{
public:
	Coroutine(Script*);
	Coroutine(void);
	~Coroutine(void);

	Script* getScript(void);

	Script* getActiveScript(void);
	void setActiveScript(Script*);
	int16 getFramePointer(void);
	void setFramePointer(int16);
	int16 getPC(void);
	void setPC(int16);
	void saveStack(StackArray*);
	void restoreStack(StackArray*);
	int32 getNextRun(void);
	void setNextRun(int32);
	int8 getBreakCount(void);
	void setBreakCount(int8);
	bool getDumpState(void);
	void clearDumpState(void);
	uint16 getStackSize(void);
	float getStackElementAt(uint16);

	Error getError(void);
	void setError(Error);
	void reset(void);

private:

	Script* activeScript;
	int16 framePointer;
	int16 pc;
	float* stackElements;
	uint16 stackSize;

	Script* script;
	int32 nextRun;

	int8 breakCount;
	bool dumpState = false;

	Error error = NO_ERROR;
};