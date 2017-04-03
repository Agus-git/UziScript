﻿using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Simulator;

namespace SimulatorTest
{
    [TestClass]
    public class SketchTest
    {
        private Sketch sketch = Sketch.Current;

        [TestInitialize]
        public void Setup()
        {
            sketch.SetMillis(-1);
            sketch.Setup();
            TurnOffAllPins();
        }

        private void TurnOffAllPins()
        {
            for (int i = 0; i < 19; i++)
            {
                sketch.SetPinValue(i, 0);
            }
        }

        [TestMethod]
        public void TestTurnOnBytecode()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi
                    program: [:p | p
	                    script: #test
	                    ticking: true
	                    delay: 0
	                    bytecodes: [:s | s
		                    turnOn: 13]].
                UziProtocol new run: program
                */
                0, 1, 0, 128, 0, 0, 0, 1, 13
            });
            Assert.AreEqual(0, sketch.GetPinValue(13));
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestTurnOffBytecode()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi 
                    program: [:p | p
	                    script: #test
	                    ticking: true
	                    delay: 0
	                    bytecodes: [:s | s
		                    turnOff: 13]].
                UziProtocol new run: program
                */
                0, 1, 0, 128, 0, 0, 0, 1, 45
            });
            sketch.SetPinValue(13, 1023);
            Assert.AreEqual(1023, sketch.GetPinValue(13));
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestReadWriteBytecode()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi 
                    program: [:p | p
	                    script: #test
	                    ticking: true
	                    delay: 0
	                    bytecodes: [:s | s
		                    read: 15;
		                    write: 13]].
                UziProtocol new run: program
                */
                0, 1, 0, 128, 0, 0, 0, 2, 111, 77
            });
            /*
            INFO(Richo):
            The choice of 120 as expected value is not casual. Since analogRead() and
            analogWrite() have different scales (the former goes from 0 to 1023, and 
            latter from 0 to 255) and we internally store the pin values as floats,
            some precision can be lost. So, I chose 120 because it's one of those
            values that keep their precision after being read/write.
            */
            sketch.SetPinValue(15, 120);
            Assert.AreEqual(0, sketch.GetPinValue(13));
            sketch.Loop();
            Assert.AreEqual(120, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestPushBytecode()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #blink
	                ticking: true
	                delay: 0
	                bytecodes: [:s | s
		                push: 1;		
		                write: 13]].
                UziProtocol new run: program.
                */
                0, 1, 1, 4, 1, 128, 0, 0, 0, 2, 128, 77
            });
            Assert.AreEqual(0, sketch.GetPinValue(13));
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestPushWithFloatingPointVariable()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #blink
	                ticking: true
	                delay: 0
	                bytecodes: [:s | s
		                push: 0.2;		
		                write: 13]].
                UziProtocol new run: program.
                */
                0, 1, 1, 7, 62, 76, 204, 205, 128, 0, 0, 0, 2, 128, 77
            });
            Assert.AreEqual(0, sketch.GetPinValue(13));
            sketch.Loop();
            Assert.AreEqual(Math.Round(0.2 * 1023), sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestPopBytecode()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #blink
	                ticking: true 
	                delay: 0
	                bytecodes: [:s | s
		                push: #a;
		                write: 13;
		                push: 1;
		                pop: #a]].
                UziProtocol new run: program.
                */
                0, 1, 2, 8, 0, 1, 128, 0, 0, 0, 4, 128, 77, 129, 144
            });
            Assert.AreEqual(0, sketch.GetPinValue(13));
            sketch.Loop(); // The first loop sets the var to 1
            Assert.AreEqual(0, sketch.GetPinValue(13));
            sketch.Loop(); // And now we set the pin
            Assert.AreEqual(1023, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestPrimBytecode()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #blink
	                ticking: true 
	                delay: 0
	                bytecodes: [:s | s
		                push: 13;
		                prim: #toggle]].
                UziProtocol new run: program.
                */
                0, 1, 1, 4, 13, 128, 0, 0, 0, 2, 128, 162
            });
            Assert.AreEqual(0, sketch.GetPinValue(13));
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestJZBytecode()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #blink
	                ticking: true 
	                delay: 0
	                instructions: [:s | s
		                read: 13;
		                jz: #zero;
		                turnOff: 13;
		                jmp: #end;
		                label: #zero;
		                turnOn: 13;
		                label: #end]].
                UziProtocol new run: program.
                */
                0, 1, 0, 128, 0, 0, 0, 5, 109, 241, 2, 45, 240, 1, 13
            });
            sketch.SetPinValue(13, 0);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestTickingRate()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #blink
	                ticking: true 
	                delay: 1000
	                instructions: [:s | s
		                push: 13;
		                prim: #toggle]].
                UziProtocol new run: program.
                */
                0, 1, 1, 4, 13, 128, 0, 3, 232, 2, 128, 162
            });

            sketch.SetMillis(0);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetMillis(1500);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));

            sketch.SetMillis(1750);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));

            sketch.SetMillis(2500);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestMultipleScriptsWithDifferentTickingRates()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #blink
	                ticking: true 
	                delay: 1000
	                instructions: [:s | s
		                push: 13;
		                prim: #toggle];
	                script: #pot
	                ticking: true
	                delay: 100
	                instructions: [:s | s
		                read: 15;
		                write: 9]].
                UziProtocol new run: program.
                */
                0, 2, 1, 4, 13, 128, 0, 3, 232, 2, 128, 162, 128, 0, 0, 100, 2, 111, 73
            });

            sketch.SetMillis(0);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
            Assert.AreEqual(0, sketch.GetPinValue(15));
            Assert.AreEqual(0, sketch.GetPinValue(9));

            sketch.SetPinValue(15, 120);
            sketch.SetMillis(50);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
            Assert.AreEqual(120, sketch.GetPinValue(15));
            Assert.AreEqual(0, sketch.GetPinValue(9));

            sketch.SetMillis(500);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
            Assert.AreEqual(120, sketch.GetPinValue(15));
            Assert.AreEqual(120, sketch.GetPinValue(9));

            sketch.SetMillis(1500);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));
            Assert.AreEqual(120, sketch.GetPinValue(15));
            Assert.AreEqual(120, sketch.GetPinValue(9));
        }

        [TestMethod]
        public void TestYieldInstruction()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #yieldTest
	                ticking: true
	                delay: 0
	                instructions: [:s | s
		                turnOn: 13;
		                prim: #yield;
		                turnOff: 13]].
                UziProtocol new run: program
                */
                0, 1, 0, 128, 0, 0, 0, 3, 13, 182, 45
            });

            sketch.SetMillis(0);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetMillis(1);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));

            sketch.SetMillis(2);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestYieldInstructionPreservesStack()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #yieldTest
	                ticking: true
	                delay: 0
	                instructions: [:s | s
		                push: 13;
		                prim: #toggle;
		                push: 13;
		                prim: #yield;
		                prim: #toggle;
		                push: 12;
		                push: 1;
		                prim: #yield;
		                prim: #add;
		                prim: #toggle]].
                UziProtocol new run: program
                */
                0, 1, 3, 12, 1, 12, 13, 128, 0, 0, 0, 10, 130, 162,
                130, 169, 162, 129, 128, 169, 166, 162
            });

            sketch.SetMillis(0);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetMillis(1);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));

            sketch.SetMillis(2);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
        }


        [TestMethod]
        public void TestYieldInstructionResumesOnNextTick()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #yieldTest
	                ticking: true
	                delay: 1000
	                instructions: [:s | s
		                turnOn: 12;
		                prim: #yield;
		                turnOff: 12]].
                UziProtocol new run: program
                */
                0, 1, 0, 128, 0, 3, 232, 3, 12, 182, 44
            });

            sketch.SetMillis(1000);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(12));

            sketch.SetMillis(1001);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(12));

            sketch.SetMillis(1002);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(12));
            
            sketch.SetMillis(2001);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(12));
        }

        [TestMethod]
        public void TestPrimitiveYieldTime()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #yieldTest
	                ticking: true
	                delay: 100
	                instructions: [:s | s
		                turnOn: 13;
		                push: 1000;
		                prim: #yieldTime;
		                turnOff: 13]].
                UziProtocol new run: program
                */
                0, 1, 1, 5, 3, 232, 128, 0, 0, 100, 4, 13, 128, 183, 45
            });

            sketch.SetMillis(100);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetMillis(101);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetMillis(1099);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetMillis(1100);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));

            sketch.SetMillis(1199);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(13));

            sketch.SetMillis(1200);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestYieldAfterBackwardsJump()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #blink 
	                ticking: true 
	                delay: 1000
	                instructions: [:s | s push: 11; prim: #toggle];
	                script: #main
	                ticking: true
	                delay: 0
	                instructions: [:s | s
		                push: 13; prim: #toggle;
		                label: #label1; read: 15; jz: #label1;
		                label: #label2; read: 15; jnz: #label2]].
                UziProtocol new run: program
                */
                0, 2, 2, 8, 11, 13, 128, 0, 3, 232, 2, 128, 162, 128, 0,
                0, 0, 6, 129, 162, 111, 241, 254, 111, 242, 254
            });

            sketch.SetMillis(500);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(11));
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetMillis(1500);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(11));
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetPinValue(15, 1023);
            sketch.SetMillis(1700);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(11));
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetPinValue(15, 0);
            sketch.SetMillis(1750);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(11));
            Assert.AreEqual(1023, sketch.GetPinValue(13));

            sketch.SetMillis(1800);
            sketch.Loop();
            Assert.AreEqual(0, sketch.GetPinValue(11));
            Assert.AreEqual(0, sketch.GetPinValue(13));

            sketch.SetMillis(2500);
            sketch.Loop();
            Assert.AreEqual(1023, sketch.GetPinValue(11));
            Assert.AreEqual(0, sketch.GetPinValue(13));
        }

        [TestMethod]
        public void TestScriptCallWithoutParametersOrReturnValue()
        {
            sketch.WriteSerial(new byte[]
            {
                /*
                program := Uzi program: [:p | p
	                script: #toggle
	                ticking: false
	                delay: 0
	                instructions: [:s | s
		                push: 10;
		                prim: #toggle;
		                prim: #ret;
		                turnOn: 13];
	                script: #loop
	                ticking: true
	                delay: 1000
	                instructions: [:s | s
		                call: #toggle;
                        prim: #pop;
		                push: 11;
		                prim: #toggle]].
                UziProtocol new run: program.
                */
                0, 2, 2, 8, 10, 11, 0, 0, 0, 0, 4, 128, 162, 185, 13,
                128, 0, 3, 232, 4, 192, 186, 129, 162
            });

            /*
             * INFO(Richo): This loop allows me to detect stack overflow
             */
            for (int i = 0; i < 100; i++)
            {
                sketch.SetMillis(i * 1000 + 500);
                sketch.Loop();
                Assert.AreEqual(0, sketch.GetPinValue(13), string.Format("D13 should always be off (iteration: {0})", i));

                bool on = i % 2 == 0;
                int value = on ? 1023 : 0;
                string msg = on ? "on" : "off";
                Assert.AreEqual(value, sketch.GetPinValue(11), string.Format("D11 should be {1} (iteration: {0})", i, msg));
                Assert.AreEqual(value, sketch.GetPinValue(10), string.Format("D10 should be {1} (iteration: {0})", i, msg));
            }
        }
    }
}
