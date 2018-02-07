#include "VM.h"

void VM::executeProgram(Program * program, GPIO * io)
{
	currentProgram = program;
	int16 count = program->getScriptCount();
	
	int32 now = millis();
	for (int16 i = 0; i < count; i++)
	{
		Script* script = program->getScript(i);
		if (script->isStepping()) 
		{
			Coroutine* coroutine = script->getCoroutine();
			if (now >= coroutine->getNextRun())
			{
				coroutine->setNextRun(now + script->getInterval());
				executeCoroutine(coroutine, io);
			}
		}
	}
}

void VM::executeCoroutine(Coroutine * coroutine, GPIO * io)
{
	currentCoroutine = coroutine;
	coroutine->restoreStack(&stack);
	pc = coroutine->getPC();
	currentScript = coroutine->getActiveScript();
	framePointer = coroutine->getFramePointer();
	if (framePointer == -1)
	{
		framePointer = stack.getPointer();
		for (int i = 0; i < currentScript->getArgCount(); i++)
		{
			stack.push(0);
		}
		for (int i = 0; i < currentScript->getLocalCount(); i++)
		{
			stack.push(currentScript->getLocal(i));
		}
		stack.push(0); // Return value slot (default: 0)
		stack.push(uint32_to_float((uint32)-1 << 16 | pc));
	}
	bool yieldFlag = false;
	while (true)
	{
		int8 breakCount = coroutine->getBreakCount();
		if (breakCount >= 0)
		{
			if (breakCount == 0)
			{
				coroutine->setActiveScript(currentScript);
				coroutine->setFramePointer(framePointer);
				coroutine->setPC(pc);
				coroutine->saveStack(&stack);
				coroutine->setNextRun(millis());
				break;
			}
			coroutine->setBreakCount(breakCount - 1);
		}
		Instruction next = nextInstruction();
		executeInstruction(next, io, yieldFlag);
		if (stack.hasError())
		{
			coroutine->setError(stack.getError());
			break;
		}
		if (pc > currentScript->getInstructionStop())
		{
			bool returnFromScriptCall = framePointer != 0;
			unwindStackAndReturn();

			if (returnFromScriptCall)
			{
				currentScript = currentProgram->getScriptForPC(pc);
			}
			else
			{
				/*
				INFO(Richo):
				If we get here it means we weren't called from other script, we just reached
				the end of the script after a regular tick. We don't have to return any value.
				We simply reset the coroutine state and break out of the loop.
				*/
				coroutine->setActiveScript(currentScript);
				coroutine->setFramePointer(-1);
				coroutine->setPC(currentScript->getInstructionStart());
				coroutine->saveStack(&stack);
				break;
			}
		}
		if (yieldFlag)
		{
			coroutine->setActiveScript(currentScript);
			coroutine->setFramePointer(framePointer);
			coroutine->setPC(pc);
			coroutine->saveStack(&stack);
			break;
		}
	}
}

Instruction VM::nextInstruction(void)
{
	return currentScript->getInstructionAt(pc++);
}

void VM::executeInstruction(Instruction instruction, GPIO * io, bool& yieldFlag)
{
	Opcode opcode = (Opcode)instruction.opcode;
	int16 argument = instruction.argument;
	switch (opcode)
	{
		case TURN_ON:
		{
			io->setValue((uint8)argument, HIGH);
		} 
		break;

		case TURN_OFF:
		{
			io->setValue((uint8)argument, LOW);
		} 
		break;

		case WRITE_PIN:
		{
			io->setValue((uint8)argument, stack.pop());
		} 
		break;

		case READ_PIN:
		{
			stack.push(io->getValue((uint8)argument));
		} 
		break;

		case READ_GLOBAL:
		{
			stack.push(currentProgram->getGlobal(argument));
		} 
		break;

		case WRITE_GLOBAL:
		{
			currentProgram->setGlobal(argument, stack.pop());
		} 
		break;
		
		case SCRIPT_CALL:
		{
			/*
			INFO(Richo): 
			We know the arguments are already on the stack (it's the compiler's job 
			to push them). Now we need to push:
				1) The local variables with their default values.
				2) The return value (default: 0)
				3) The current framePointer and returnAddress (so that when unwinding
				the stack, they can be set correctly).
			*/
			currentScript = currentProgram->getScript(argument);
			int16 fp = stack.getPointer() - currentScript->getArgCount();
			for (int i = 0; i < currentScript->getLocalCount(); i++)
			{
				stack.push(currentScript->getLocal(i));
			}
			stack.push(0); // Return value slot (default: 0)
			stack.push(uint32_to_float((uint32)framePointer << 16 | pc));

			/*
			INFO(Richo): 
			After the stack is configured. We set the framePointer and pc to their
			new values and continue execution.
			*/
			framePointer = fp;
			pc = currentScript->getInstructionStart();
		} 
		break;

		case SCRIPT_START:
		{
			Script* script = currentProgram->getScript(argument);
			if (script != 0)
			{
				script->setStepping(true);

				Coroutine* coroutine = script->getCoroutine();
				if (currentCoroutine == coroutine)
				{
					/*
					If we're starting the current coroutine we need to restart execution
					right now. So, we set the yield flag and reset the vm state.
					*/
					yieldFlag = true;
					stack.reset();
					pc = script->getInstructionStart();
					framePointer = -1;
				}
				else
				{
					/*
					If we're starting another coroutine just resetting the coroutine
					state is enough.
					*/
					coroutine->reset();
				}
			}
		} 
		break;

		case SCRIPT_RESUME:
		{
			Script* script = currentProgram->getScript(argument);
			if (script != 0)
			{
				script->setStepping(true);
			}
		}
		break;

		case SCRIPT_STOP:
		{
			Script* script = currentProgram->getScript(argument);
			if (script != 0)
			{
				script->setStepping(false);

				Coroutine* coroutine = script->getCoroutine();
				if (currentCoroutine == coroutine)
				{
					/*
					If we're stopping the current coroutine we need to stop execution
					right now. So, we set the yield flag and reset the vm state.
					*/
					yieldFlag = true;
					stack.reset();
					pc = script->getInstructionStart();
					framePointer = -1;
				}
				else
				{
					/*
					If we're stopping another coroutine just resetting the coroutine 
					state is enough.
					*/
					coroutine->reset();
				}
			}
		} 
		break;

		case SCRIPT_PAUSE:
		{
			Script* script = currentProgram->getScript(argument);
			if (script != 0)
			{
				script->setStepping(false);

				/*
				If we're stopping the current coroutine we need to stop execution
				right now. But we don't need to reset the coroutine because we will
				resume execution from this point.
				*/
				Coroutine* coroutine = script->getCoroutine();
				if (currentCoroutine == coroutine)
				{
					yieldFlag = true;
				}
			}
		}
		break;


		case JMP:
		{
			pc += argument;
			if (argument < 0) { yieldTime(0, yieldFlag); }
		} 
		break;

		case JZ:
		{
			if (stack.pop() == 0) // TODO(Richo): Float comparison
			{
				pc += argument;
				if (argument < 0) { yieldTime(0, yieldFlag); }
			}
		} 
		break;

		case JNZ:
		{
			if (stack.pop() != 0) // TODO(Richo): Float comparison
			{
				pc += argument;
				if (argument < 0) { yieldTime(0, yieldFlag); }
			}
		} 
		break;

		case JNE:
		{
			float a = stack.pop();
			float b = stack.pop();
			if (a != b) // TODO(Richo): float comparison
			{
				pc += argument;
				if (argument < 0) { yieldTime(0, yieldFlag); }
			}
		} 
		break;

		case JLT:
		{
			float b = stack.pop();
			float a = stack.pop();
			if (a < b)
			{
				pc += argument;
				if (argument < 0) { yieldTime(0, yieldFlag); }
			}
		} 
		break;

		case JLTE:
		{
			float b = stack.pop();
			float a = stack.pop();
			if (a <= b)
			{
				pc += argument;
				if (argument < 0) { yieldTime(0, yieldFlag); }
			}
		} 
		break;

		case JGT:
		{
			float b = stack.pop();
			float a = stack.pop();
			if (a > b)
			{
				pc += argument;
				if (argument < 0) { yieldTime(0, yieldFlag); }
			}
		} 
		break;

		case JGTE:
		{
			float b = stack.pop();
			float a = stack.pop();
			if (a >= b)
			{
				pc += argument;
				if (argument < 0) { yieldTime(0, yieldFlag); }
			}
		} 
		break;

		case READ_LOCAL:
		{
			uint16 index = framePointer + argument;
			float value = stack.getElementAt(index);
			stack.push(value);
		} 
		break;

		case WRITE_LOCAL:
		{
			uint16 index = framePointer + argument;
			float value = stack.pop();
			stack.setElementAt(index, value);
		}
		break;

		case PRIM_READ_PIN:
		{
			uint8 pin = (uint8)stack.pop();
			stack.push(io->getValue(pin));
		}
		break;

		case PRIM_WRITE_PIN:
		{
			float value = stack.pop();
			uint8 pin = (uint8)stack.pop();
			io->setValue(pin, value);
		}
		break;

		case PRIM_TOGGLE_PIN:
		{
			uint8 pin = (uint8)stack.pop();
			io->setValue(pin, 1 - io->getValue(pin));
		}
		break;

		case PRIM_SERVO_DEGREES:
		{
			float value = stack.pop() / 180.0f;
			uint8 pin = (uint8)stack.pop();
			io->servoWrite(pin, value);
		}
		break;

		case PRIM_SERVO_WRITE:
		{
			float value = stack.pop();
			uint8 pin = (uint8)stack.pop();
			io->servoWrite(pin, value);
		}
		break;

		case PRIM_MULTIPLY:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 * val2);
		}
		break;

		case PRIM_ADD:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 + val2);
		}
		break;

		case PRIM_DIVIDE:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 / val2);
		}
		break;

		case PRIM_SUBTRACT:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 - val2);
		}
		break;

		case PRIM_SECONDS:
		{
			float time = (float)millis() / 1000.0;
			stack.push(time);
		}
		break;

		case PRIM_EQ:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 == val2); // TODO(Richo)
		}
		break;

		case PRIM_NEQ:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 != val2); // TODO(Richo)
		}
		break;

		case PRIM_GT:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 > val2);
		}
		break;

		case PRIM_GTEQ:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 >= val2);
		}
		break;

		case PRIM_LT:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 < val2);
		}
		break;

		case PRIM_LTEQ:
		{
			float val2 = stack.pop();
			float val1 = stack.pop();
			stack.push(val1 <= val2);
		}
		break;

		case PRIM_NEGATE:
		{
			float val = stack.pop();
			stack.push(-1 * val);
		}
		break;

		case PRIM_SIN:
		{
			float val = stack.pop();
			stack.push(sinf(val));
		} 
		break;

		case PRIM_COS:
		{
			float val = stack.pop();
			stack.push(cosf(val));
		}
		break;

		case PRIM_TAN:
		{
			float val = stack.pop();
			stack.push(tanf(val));
		}
		break;

		case PRIM_TURN_ON:
		{
			uint8 pin = (uint8)stack.pop();
			io->setValue(pin, 1);
		}
		break;

		case PRIM_TURN_OFF:
		{
			uint8 pin = (uint8)stack.pop();
			io->setValue(pin, 0);
		}
		break;

		case PRIM_YIELD:
		{
			yieldTime(0, yieldFlag);
		}
		break;

		case PRIM_YIELD_TIME:
		{
			int32 time = (int32)stack.pop();
			yieldTime(time, yieldFlag);
		}
		break;

		case PRIM_MILLIS:
		{
			float time = (float)millis();
			stack.push(time);
		}
		break;

		case PRIM_RET:
		{
			bool returnFromScriptCall = framePointer != 0;
			if (returnFromScriptCall)
			{
				unwindStackAndReturn();
				currentScript = currentProgram->getScriptForPC(pc);
			}
			else
			{
				/* 
				INFO(Richo): Jump pass the end of the script so that in the next iteration 
				the execution stops.
				*/
				pc = currentScript->getInstructionStop() + 1;
			}
		}
		break;

		case PRIM_POP:
		{
			// Throw value away
			stack.pop();
		}
		break;

		case PRIM_RETV:
		{
			uint16 index = framePointer + 
				currentScript->getArgCount() + 
				currentScript->getLocalCount();
			// TODO(Richo): Duplicated code from WRITE_LOCAL 
			float value = stack.pop();
			stack.setElementAt(index, value);

			// TODO(Richo): Duplicated code from PRIM_RET
			bool returnFromScriptCall = framePointer != 0;
			if (returnFromScriptCall)
			{
				unwindStackAndReturn();
				currentScript = currentProgram->getScriptForPC(pc);
			}
			else
			{
				/*
				INFO(Richo): Jump pass the end of the script so that in the next iteration
				the execution stops.
				*/
				pc = currentScript->getInstructionStop() + 1;
			}
		}
		break;

		case PRIM_COROUTINE: 
		{
			stack.push(currentCoroutine->getScript()->getIndex());
		}
		break;

		case PRIM_LOGICAL_AND:
		{
			float a = stack.pop();
			float b = stack.pop();
			stack.push(a && b);
		}
		break;

		case PRIM_LOGICAL_OR:
		{
			float a = stack.pop();
			float b = stack.pop();
			stack.push(a || b);
		}
		break;

		case PRIM_BITWISE_AND:
		{
			uint32 a = (uint32)stack.pop();
			uint32 b = (uint32)stack.pop();
			stack.push(a & b);
		}
		break;

		case PRIM_BITWISE_OR:
		{
			uint32 a = (uint32)stack.pop();
			uint32 b = (uint32)stack.pop();
			stack.push(a | b);
		}
		break;
	}

}

void VM::yieldTime(int32 time, bool& yieldFlag)
{
	currentCoroutine->setNextRun(millis() + time);
	yieldFlag = true;
}

void VM::unwindStackAndReturn(void)
{
	bool returnFromScriptCall = framePointer != 0;
	uint32 value = float_to_uint32(stack.pop());
	pc = value & 0xFFFF;
	framePointer = value >> 16;
	
	float returnValue = stack.pop();

	// INFO(Richo): Pop args/locals
	int varCount = currentScript->getArgCount() + currentScript->getLocalCount();
	for (int i = 0; i < varCount; i++)
	{
		stack.pop();
	}
	
	// INFO(Richo): Only push a return value if we were called from another script
	if (returnFromScriptCall)
	{
		stack.push(returnValue);
	}
}