#include "Program.h"

Program::Program(Reader * rs, bool& timeout)
{
	globalCount = 0;
	globals = 0;
	globalsReport = 0;
	script = 0;

	scriptCount = rs->next(timeout);
	if (!timeout) { parseGlobals(rs, timeout); }
	if (!timeout) { parseScripts(rs, timeout); }

	if (timeout)
	{
		scriptCount = 0;
	}
}

Program::Program()
{
	scriptCount = 0;
	script = 0;
	globalCount = 0;
	globals = 0;
	globalsReport = 0;
}

Program::~Program(void)
{
	delete[] globalsReport;
	delete[] globals;
	delete script;
}

uint8 Program::getScriptCount(void)
{
	return scriptCount;
}

Script * Program::getScript(void)
{
	return script;
}

void Program::parseGlobals(Reader * rs, bool& timeout)
{
	globalCount = rs->next(timeout);
	if (timeout) return;
		
	globals = new float[globalCount];
	globalsReport = new bool[globalCount];
	uint8 i = 0;
	while (i < globalCount)
	{
		uint8 sec = rs->next(timeout);
		if (timeout) return;

		int16 count = (sec >> 2) & 0x3F;
		int16 size = (sec & 0x03) + 1;
		while (count > 0)
		{
			globalsReport[i] = false;
			if (size == 4)
			{
				// Special case: float
				globals[i] = rs->nextFloat(timeout);
			}
			else
			{
				globals[i] = (float)rs->nextLong(size, timeout);
			}
			if (timeout) return;

			count--;
			i++;
		}
	}
}

void Program::parseScripts(Reader * rs, bool& timeout)
{
	Script * scriptTemp;
	for (int16 i = 0; i < scriptCount; i++)
	{
		scriptTemp = new Script(rs, timeout);
		scriptTemp->setNext(script);
		script = scriptTemp;

		if (timeout) return;
	}
}

float Program::getGlobal(int16 index)
{
	return globals[index];
}

void Program::setGlobal(int16 index, float value)
{
	globals[index] = value;
}

bool Program::getReport(uint8 index)
{
	return globalsReport[index];
}

void Program::setReport(uint8 index, bool report)
{
	globalsReport[index] = report;
}

uint8 Program::getGlobalCount(void)
{
	return globalCount;
}