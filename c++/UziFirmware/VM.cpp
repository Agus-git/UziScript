#include "VM.h"

void VM::executeProgram(Program * program, GPIO * io)
{
	currentProgram = program;
	Script * script = 0;
	int16 count = program->getScriptCount();
	
	int32 now = millis();
	script = program->getScript();
	for (int16 i = 0; i < count; i++)
	{
		if (script->isStepping() && script->shouldStepNow(now))
		{
			script->rememberLastStepTime(now);
			executeScript(script, io);
		}
		script = script->getNext();
	}
}

void VM::executeScript(Script * script, GPIO * io)
{
	pc = 0;
	currentScript = script;
	stack->reset();
	while (pc < currentScript->getInstructionCount())
	{
		Instruction next = nextInstruction();
		executeInstruction(next, io);
		if (stack->overflow())
		{
			// TODO(Richo): Notify client of stack overflow
			break;
		}
	}	
}

Instruction VM::nextInstruction(void)
{
	return currentScript->getInstructionAt(pc++);
}

void VM::executeInstruction(Instruction instruction, GPIO * io)
{
	uint8 opcode = instruction.opcode;
	uint16 argument = instruction.argument;
	switch (opcode)
	{
		// Turn ON
		case 0x00:
		{
			io->setValue((uint8)argument, HIGH);
		} break;

		// Turn OFF
		case 0x01:
		{
			io->setValue((uint8)argument, LOW);
		} break;

		// Write
		case 0x02:
		{
			io->setValue((uint8)argument, stack->pop());
		} break;

		// Read
		case 0x03:
		{
			stack->push(io->getValue((uint8)argument));
		} break;

		// Push
		case 0xF8:
		case 0x08:
		{
			stack->push(currentProgram->getGlobal(argument));
		} break;

		// Pop
		case 0xF9:
		case 0x09:
		{
			currentProgram->setGlobal(argument, stack->pop());
		} break;

		// Prim call
		case 0xFB: argument += 256; // 288 -> 543
		case 0xFA: argument += 16;  // 32 -> 287
		case 0x0B: argument += 16;  // 16 -> 31
		case 0x0A:					// 0 -> 15
		{
			executePrimitive(argument, io);
		} break;

		// Script call
		case 0xFC:
		case 0x0C:
		{

		} break;

		// Start script
		case 0xFD:
		case 0x0D:
		{
			Script* script = currentProgram->getScript(argument);
			if (script != 0)
			{
				script->setStepping(true);
			}
		} break;

		// Stop script
		case 0xFE:
		case 0x0E:
		{
			Script* script = currentProgram->getScript(argument);
			if (script != 0)
			{
				script->setStepping(false);
			}
		} break;

		// Yield
		case 0xF0:
		{

		} break;

		// JZ
		case 0xF1:
		{
			if (stack->pop() == 0) // TODO(Richo): Float comparison
			{
				pc += argument;
			}
		} break;

		// JNZ
		case 0xF2:
		{
			if (stack->pop() != 0) // TODO(Richo): Float comparison
			{
				pc += argument;
			}
		} break;

		// JNE
		case 0xF3:
		{
			float a = stack->pop();
			float b = stack->pop();
			if (a != b) // TODO(Richo): float comparison
			{
				pc += argument;
			}
		} break;

		// JLT
		case 0xF4:
		{
			float b = stack->pop();
			float a = stack->pop();
			if (a < b)
			{
				pc += argument;
			}
		} break;

		// JLTE
		case 0xF5:
		{
			float b = stack->pop();
			float a = stack->pop();
			if (a <= b)
			{
				pc += argument;
			}
		} break;

		// JGT
		case 0xF6:
		{
			float b = stack->pop();
			float a = stack->pop();
			if (a > b)
			{
				pc += argument;
			}
		} break;

		// JGTE
		case 0xF7:
		{
			float b = stack->pop();
			float a = stack->pop();
			if (a >= b)
			{
				pc += argument;
			}
		} break;

		// JMP
		case 0xFF:
		{
			pc += argument;
		} break;
	}

}

void VM::executePrimitive(uint16 primitiveIndex, GPIO * io)
{
	switch (primitiveIndex)
	{
		case 0x00:
		{// read
			uint8 pin = (uint8)stack->pop();
			stack->push(io->getValue(pin));
		} break;
		case 0x01:
		{// write
			float value = stack->pop();
			uint8 pin = (uint8)stack->pop();
			io->setValue(pin, value);
		} break;
		case 0x02:
		{// toggle
			uint8 pin = (uint8)stack->pop();
			io->setValue(pin, 1 - io->getValue(pin));
		} break;
		case 0x03:
		{// getMode
			uint8 pin = (uint8)stack->pop();
			stack->push(io->getMode(pin));
		} break;
		case 0x04:
		{// setMode
			uint8 mode = (uint8)stack->pop();
			uint8 pin = (uint8)stack->pop();
			io->setMode(pin, mode);
		} break;
		case 0x05:
		{// servoWrite
			float value = stack->pop();
			uint8 pin = (uint8)stack->pop();
			io->servoWrite(pin, value);
		} break;
		case 0x06:
		{// add
			float val1 = stack->pop();
			float val2 = stack->pop();
			stack->push(val1 + val2);
		} break;
	}
}
