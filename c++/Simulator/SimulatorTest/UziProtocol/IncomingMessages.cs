using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimulatorTest.UziProtocol
{
    static class IncomingMessages
    {
        public const byte msgInError = 0;
        public const byte msgInPinValue = 1;
        public const byte msgInProfile = 2;
        public const byte msgInGlobalValue = 3;
        public const byte msgInTrace = 4;
        public const byte msgInCoroutineState = 5;
        public const byte msgInTickingScripts = 6;
        public const byte msgInFreeRam = 7;
        public const byte msgInSerialTunnel = 8;
    }
}
