using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimulatorTest.UziProtocol
{
   static class OutgoingMessages
    {
        public const byte msgOutDebugContinue = 12;
        public const byte msgOutSetBreakpoints = 13;
        public const byte msgOutSetBreakpointsAll = 14;

        public const byte msgOutKeepAlive = 7;
        public const byte msgOutProfile = 8;
        public const byte msgOutSaveProgram = 6;

        public const byte msgOutSetGlobal = 10;
        public const byte msgOutSetGlobalReport = 11;
        public const byte msgOutSetProgram = 0;
        public const byte msgOutSetMode = 2;
        public const byte msgOutSetValue = 1;
        public const byte msgOutSetReport = 5;
        public const byte msgOutStartReporting = 3;
        public const byte msgOutStopReporting = 4;

        public const byte msgOutConnectionRequest = 255;
    }
}
