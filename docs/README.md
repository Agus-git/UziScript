# UziScript Documentation

UziScript is a concurrent programming language and virtual machine for educational robotics. The current implementation only supports Arduino as hardware platform.

## Table of contents

* [Motivation](#motivation)
* [Proposed Solution](#proposed-solution)
* [Contributing](#contributing)
  * [Getting started](#getting-started)
  * [Dependencies](#dependencies)
* [Description of the language](#description-of-the-language)
* [Implementation](#implementation)
* [Task scheduling](#task-scheduling)

## Motivation

Arduino has become one of the most popular platforms for building electronic projects, especially among hobbyists, artists, designers, and people just starting with electronics. The Arduino IDE and software library provide an abstraction layer over the hardware details that makes it possible to build interesting projects without a complete understanding of more advanced microcontroller concepts such as interrupts, ports, registers, timers, and such. At the same time, this abstraction layer can be bypassed to access advanced features if the user needs them. These characteristics make the Arduino platform suitable for both beginners and experts.

However, there is one aspect in which the Arduino language lacks proper abstractions: concurrency. For all but the simplest projects, the `setup()` and `loop()` [program structure](http://playground.arduino.cc/ArduinoNotebookTraduccion/Structure) proposed by Arduino is not expressive enough. Even moderately complex problems require some sort of simultaneous task execution.

Furthermore, most educational robotics projects require the implementation of a device that performs two or more simultaneous tasks. This poses a limitation on the type of educational projects that can be carried out, especially if the teaching subject is not robotics or programming itself.

## Proposed Solution

We propose the implementation of a concurrent programming language supported by a virtual machine running on the Arduino. We call this language UziScript and we expect it to become a suitable compilation target for visual programming environments such as [Physical Etoys](http://tecnodacta.com.ar/gira/projects/physical-etoys), [Scratch for Arduino](http://s4a.cat), and [Ardublock](http://blog.ardublock.com/), among others.

Given that the main purpose of this programming language is educational, it was designed based on the following principles:
* __Simplicity__: It should be easy to reason about the virtual machine and understand how it performs its job.
* __Abstraction__: the language should provide high-level functions that hide away some of the details regarding both beginner and advanced microcontroller concepts (such as timers, interruptions, concurrency, pin modes, and such). These concepts can later be introduced at a pace compatible with the needs of the student.
* __Monitoring__: It should be possible to monitor the state of the board while it is connected to the computer.
* __Autonomy__: The programs must be able to run without a computer connected to the board.
* __Debugging__: the toolchain must provide mechanisms for error handling and step by step code execution. Without debugging tools, the process of fixing bugs can be frustrating for an inexperienced user.

## Contributing

ACAACA descripción de la organización del repositorio, qué hay en cada carpeta, etc.

### Getting started

Before you can start contributing to UziScript, you'll need to install all the necessary tools. First, you'll need to clone this repository and make sure you also recursively clone the submodules.

For the firmware, since it is a simple Arduino sketch, you only need the Arduino IDE. However, to make development easier we also use Visual Studio 2017 with a very simple Arduino simulator we developed for this project. The simulator is extremely limited so it's not exactly the same as compiling for the Arduino but it makes things a lot easier especially when it comes to debugging and unit testing. The source code for the Uzi firmware can be found here: [/c++/UziFirmware/UziFirmware.ino](/c++/UziFirmware/UziFirmware.ino). If you want to use the Visual Studio IDE you can find the solution here: [/c++/Simulator/Simulator.sln](/c++/Simulator/).

All the compilation tools are written in [Squeak Smalltalk](http://squeak.org/). To load them into your image, open up a Workspace and evaluate the following script. Make sure you have [filetree](https://github.com/dalehenrich/filetree) installed, otherwise the script will fail. It will ask you the path to the root of the current repository and it will then load all the necessary packages.
```smalltalk
git := FileDirectory on: (UIManager default 
	request: 'Path to git repository?' 
	initialAnswer: (gitPath ifNil: [FileDirectory default pathName])).
uzi := MCFileTreeRepository directory: git / 'st'.
rest := MCFileTreeRepository directory: git / 'st' / 'REST' / 'st'.
MCRepositoryGroup default addRepository: uzi.
MCRepositoryGroup default addRepository: rest.
load := [:ass || repo pckgName versionName version |
	repo := ass key.
	pckgName := ass value.
	versionName := repo allVersionNames 
		detect: [:name | name beginsWith: pckgName].
	version := repo versionNamed: versionName.
	version load].
{
	uzi -> 'PetitParser'.
	uzi -> 'WebClient'.
	rest -> 'REST'.
	uzi -> 'Uzi-Core'.
	uzi -> 'Uzi-EEPROM'.
	uzi -> 'Uzi-Etoys'
} do: load.
(Smalltalk at: #Uzi) perform: #defaultDirectory: with: git.
```

Once the script has finished installing everything, you can open the control panel by evaluating:
```smalltalk
UziProtocolMorph new openInHand.
```

All the web tools are written in plain html and javascript. You'll find the source code in here: [/web](/web).

### Dependencies

UziParser is built using [PetitParser](http://scg.unibe.ch/research/helvetia/petitparser) by Lukas Renggli. 
UziServer uses the [REST package](https://github.com/RichoM/REST), which in turn uses [WebClient](http://www.squeaksource.com/WebClient/) by Andreas Raab. The above script should take care of loading everything but if you find any problem, please let me know.

## Description of the language

UziScript syntax is based on C, which is familiar to most programmers including Arduino developers. The `task` keyword has been added to represent behavior that can be executed periodically at a configurable rate. For example, the following code will declare a task that will toggle the LED on pin 13 every second.

```
task blink() running 1/s { toggle(D13); }
```

UziScript does not require any type declarations, so to distinguish a function from a procedure two new keywords are introduced: `func` and `proc`.

```
func isOn(pin) { return read(pin) > 0.5; }
 
proc toggle(pin) {
  if isOn(pin) { turnOff(pin); }
  else { turnOn(pin); }
}
```

A program can have any number of tasks, and each task can be defined with a different interval as well as a different starting state, which can be either `running` or `stopped`. If no starting state is specified the task will run just once and then it will stop. This is especially useful to initialize variables and can be used as a substitute to the Arduino `setup()` function. 

The execution of each task at the correct time is performed automatically by the virtual machine but the user can invoke certain primitives to start, stop, pause, or resume a given task. Each task execution is independent, it has its own stack, and it shares memory with other tasks through specially defined global variables. This design allows users to write sequential programs in Arduino’s usual style and make them run concurrently without being concerned about the processor scheduling. 

Primitive instructions like `delay()` are provided to allow the user to block the executing task for a given amount of time without affecting the rest. Arduino related primitives are also included but in some cases their names and behavior were modified to offer a simplified interface with the hardware. For example, the Arduino `digitalRead()` and `analogRead()` functions are merged into a single UziScript function called `read()`, which accepts a pin number and returns a floating-point value. If the pin is digital the resulting value can either be 0 or 1 but if the pin is analog the function will normalize its value between 0 and 1. An equivalent implementation of the `write()` procedure is also provided. We believe these small design details make the language more accessible to beginners by providing a concise (and consistent) interface to the hardware.

UziScript also supports external libraries that can extend the primitive functionality of the language. You can find examples [here](/uzi/libraries).

The UziScript grammar, written as a PEG, can be found [here](/docs/uzi.pegjs). Since the actual parser is written in Smalltalk using PetitParser, the grammar provided here is for illustrative purposes only.

## Implementation

The UziScript firmware is a regular Arduino sketch written in C++ that can be uploaded using the Arduino IDE. The entire source code is open for inspection and modification. We believe this to be very important for the adoption of the platform. First, being open source allows for more advanced students or teachers to learn from its implementation and improve it to suit their own needs. Second, installing the firmware is as simple as uploading any Arduino sketch so the time it takes to test the platform is reduced.

We initially target the Arduino UNO because it is the most popular model amongst beginners but we plan to support other models in the future.

<p align="center">
  <img width="75%" src="./img/uzi_architecture.png?raw=true">
</p>

Internally, the firmware implements a stack-based high-level language virtual machine that uses a decode and dispatch bytecode interpreter to execute UziScript programs. This implementation was chosen mainly because of its simplicity. Since the purpose of this language is educational, performance is not currently considered a high priority.

For now, the stack and global variables are the only available memory to the user program. There is no heap or dynamic memory allocation implemented yet. This allows for simpler virtual machine code and compact object code. Almost all the instructions can be encoded using one byte for both the opcode and its arguments and just a few special instructions (such as branches) require an extra byte.

Apart from the virtual machine, the firmware includes a monitor program that allows to interact with a computer through the serial port. Periodically, this monitor program will send the status of the Arduino and receive commands, allowing the host computer to fully control the virtual machine.

By having these two programs running on the Arduino we can provide an interactive programming experience with a short feedback loop without sacrificing autonomy. Moreover, the monitor program permits the implementation of debugging tools that allow the user to stop the execution of any task, inspect the value of all the variables, explore the call stack, and execute instructions step by step. These kind of debugging capabilities, which we consider to be essential in an educational context, are only available on the Arduino platform using either extra hardware or the more advanced Arduino Zero.

On the computer side we implemented a small set of tools that allow to edit, compile, debug, and transmit the programs to the Arduino board through the serial port. All these tools were developed using [Squeak](https://squeak.org/), an open source version of [Smalltalk](https://en.wikipedia.org/wiki/Smalltalk). We are also working on a web-based version of the tools that will allow to write UziScript programs using a visual interface supported by [Blockly](https://developers.google.com/blockly/).

The compilation process transforms UziScript programs into bytecode suitable for the virtual machine to execute. Below is an example of the generated bytecode from a simple UziScript program. As you can see, the notation used to represent the bytecodes is also valid Smalltalk code that, when evaluated, will produce an instance of the program.

<p align="center">
  <img src="./img/Uzi_bytecode.png?raw=true">
</p>

You can find a detailed description of the instruction set [here](/docs/ISA.md).

## Task scheduling

As most Arduino boards contain a single microcontroller, they can only execute one thread at a time. This means all the tasks defined in the program must share a single processor. The virtual machine, apart from executing the program instructions, is responsible for handling the task scheduling. It decides which task gets executed and when to preemptively interrupt it. 

The scheduling strategy is simple, the virtual machine will cycle through the task list scheduling the tasks whose time to run is reached. It will then execute each instruction until a blocking operation occurs, in which case it will interrupt the current task and start executing the next one. Each task will store its execution context (stack, program counter, and frame pointer) in order to be able to later resume the execution from the point where it was interrupted. Some of the blocking operations that will force a context switch include: the `yield` instruction, all the `delay()` procedures, a reverse jump, writing to the serial port when the buffer is full, and reading from the serial port when the buffer is empty.

Below is a simplified example of one of the possible ways the scheduler could interleave the execution of the instructions between two tasks.

<p align="center">
  <img src="./img/uzi_scheduling.png?raw=true">
</p>

This strategy has the advantage of being simple (which is important, considering this is an educational project) and it guarantees that all of the tasks will have a chance to run. However, it does not provide any real-time guarantees. In the future, we might improve the implementation by incorporating a real-time scheduler.

