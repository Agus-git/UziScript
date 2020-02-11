// Uzi.state.program.current.compiled
function ctorSimulator() {
  let simulator = {
     pins: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     stack: [],
     next: next,
     execute: execute,
     loadCurrentProgram: () => loadProgram(Uzi.state.program.current.compiled),
     getProgram: () => Uzi.state.program.current.compiled,
     framePointer: 0,
     globals:[],
     instructions:[],
     pc:0,
     drawCircles: drawCircles
  };

  //simulator.pins.forEach((item) => console.log(item));


  function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function drawCircles(target,radius) {
  	target.innerHTML="";
  	let x= 0;
    let index = 0;
  	for( let i=0;i<simulator.pins.length;i++) {
  		x+=radius*2 + 10;
  		let c =  document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      let t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  		c.setAttribute("fill", "blue");
  		c.setAttribute("cx", x );
  		c.setAttribute("cy", radius);
  		c.setAttribute("r", radius);
      t.setAttribute("x", x - radius);
      t.setAttribute("y",(radius + 40));
      t.setAttribute( "font-size", "25");
      t.setAttribute("font-family", "sans-serif");
      t.setAttribute( "width", "50");
      t.setAttribute("height", "50");
      t.textContent = "D" + index++;
      t.setAttribute('fill', '#000');
      t.setAttribute("viewBox", "0 0 1000 300");
  		target.appendChild(c);
      target.appendChild(t);
  		setInterval(() => {
  			if(sim.pins[i]>0.5) {
  					c.setAttribute("fill", "chartreuse");
  			} else {
  					c.setAttribute("fill", "black");
  			}
  		}, 50);
  	}
  }


  function loadProgram(program) {
    simulator.pc = 0;
    simulator.stack = [];
    simulator.instructions = program.scripts[0].instructions;
  }

  function writeConsole(pin) {
    console.log(simulator.pins[pin]);
  }

  function changeRandomPinValue() {
    let r = getRandomInt(0,10);
    simulator.pins[r] = Math.random();
    console.log("Pin" + r + " = " + simulator.pins[r])
  }

  function next() {
    simulator.pc = simulator.pc % simulator.instructions.length;
    var result = simulator.instructions[(simulator.pc++)];
    simulator.pc = simulator.pc % simulator.instructions.length;
    return result;
  }

  function execute() {
    let instruction = simulator.next();
    if(instruction == undefined) {
      throw "undefined found as instruction" ;
      simulator.pc=0;
    }
    let argument = instruction.argument;

    switch (instruction.__class__) {
      case "UziPushInstruction": {
        simulator.stack.push(instruction.argument.value);
      } break;
      case "UziPrimitiveCallInstruction": {
        executePrimitive(argument);
      } break;
      /////////////////
      case 'turn_on':
        simulator.pins[instruction.argument] = 1;
        break;
      case 'turn_off':
        simulator.pins[instruction.argument] = 0;
        break;
      case'write_pin':
        simulator.pins[instruction.argument] = simulator.stack.pop();
        break;
      case'read_pin':
        if (instruction.argument < 0 ) {
          instruction.argument = 0;
        } else if (instruction.argument > 1) {
          instruction.argument = 1;
        }
        simulator.stack.push(instruction.argument);
        break;
      case'read_global':
        throw "TO DO";
        break;
      case'write_global':
        throw "TO DO";
        break;
      case'script_start':
        throw "TO DO";
        break;
      case'script_resume':
        throw "TO DO";
        break;
      case'script_stop':
        throw "TO DO";
        break;
      case'script_pause':
        throw "TO DO";
        break;
      case'jmp':
        simulator.pc += instruction.argument;
        break;
      case'jz':
        if (simulator.stack.pop() == 0) {
            simulator.pc += instruction.argument;
        }
        break;
      case'jnz':
        if (simulator.stack.pop() != 0) {
          simulator.pc += instruction.argument;
        }
        break;
      case 'jne': {
          let a = simulator.stack.pop();
          let b = simulator.stack.pop();
          if (a != b) {
            simulator.pc += instruction.argument;
          }
        }
        break;
      case 'jlt': {
          let a = simulator.stack.pop();
          let b = simulator.stack.pop();
          if (a < b) {
            simulator.pc += instruction.argument;
          }
        }
        break;
      case 'jlte': {
          let a = simulator.stack.pop();
          let b = simulator.stack.pop();
          if (a <= b) {
            simulator.pc += instruction.argument;
          }
        }
        break;
      case 'jgt': {
          let a = simulator.stack.pop();
          let b = simulator.stack.pop();
          if (a > b) {
            simulator.pc += instruction.argument;
          }
        }
        break;
      case 'jgte': {
          let a = simulator.stack.pop();
          let b = simulator.stack.pop();
          if (a >= b) {
            simulator.pc += instruction.argument;
          }
        }
        break;
      case 'read_local': {
          throw "TO DO";
        }
        break;
      case 'write_local': {
          throw "TO DO";
        }
        break;
      case 'prim_read_pin': {
          /*let pin = simulator.stack.pop();
          simulator.stack.push(pin);*/
          throw "TO DO";
        }
        break;
      case 'prim_write_pin': {
          /*let pin = simulator.stack.pop();
          let value = simulator.stack.pop();
          simulator.pins[pin] =value;*/
          throw "TO DO";
        }
        break;
      case 'prim_toggle_pin': {
          throw "TO DO";
        }
        break;

      default:
        throw "Missing instruction "+ instruction.__class__;
    }
  }

  function executePrimitive(prim) {
    switch (prim.name) {
      case "turnOn": {
        simulator.pins[simulator.stack.pop()] = 1;
      } break;

      case "turnOff": {
        simulator.pins[simulator.stack.pop()] = 0;
      } break;

      default:
        throw "Missing primitive "+ prim.name;
    }
  }

  //setInterval(changeRandomPinValue, 1000);
  return simulator;
};
