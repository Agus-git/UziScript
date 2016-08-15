#include "Script.h"

Script::Script(Reader * rs)
{
	long n = rs->nextLong(4);
	stepping = (n >> 31) & 1;
	stepTime = n & 0x7FFFFFFF;
	lastStepTime = 0;

	bytecodeCount = rs->next();
	bytecodes = rs->next(bytecodeCount);
	nextScript = 0;
}

Script::Script()
{
	// Returns a NOOP program.
	stepping = false;
	stepTime = lastStepTime = bytecodeCount = 0;
	bytecodes = new unsigned char[0];
	nextScript = 0;
}

Script::~Script(void)
{
	delete[] bytecodes;
}

unsigned char Script::getBytecodeCount(void)
{
	return bytecodeCount;
}

unsigned char Script::bytecodeAt(int index)
{
	return bytecodes[index];
}

void Script::rememberLastStepTime(long now)
{
	lastStepTime = now;
}

bool Script::shouldStepNow(long now)
{
	return (now - lastStepTime) > stepTime;
}

bool Script::isStepping(void)
{
	return stepping;
}

void Script::setStepping(bool val)
{
	stepping = val;
}

Script* Script::getNext(void)
{
	return nextScript;
}

void Script::setNext(Script* next)
{
	nextScript = next;
}

long Script::getStepTime(void)
{
	return stepTime;
}
