using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SimulatorTest.UziProtocol
{
    class Protocol
    {
        public const int majorVersion = 0;
        public const int minorVersion = 6;
        private bool isConnected;

        Thread keepAlive;
        public delegate void emptyDelegate();
        public event emptyDelegate ReportingChanged;

        public Protocol()
        {
            emptyDelegate nop = () => { };
            ReportingChanged += nop;
        }

        private void send(params byte[] data)
        {
            //TODO(Tera): implement this.
            throw new NotImplementedException();
        }
        private byte next()
        {
            throw new NotImplementedException();
        }


        #region Keep Alive
        public void SendKeepAlive()
        {
            if (!isConnected)
            {
                StopKeepAliveProcess();
            }
            send(OutgoingMessages.msgOutKeepAlive);
        }

        public int KeepAliveTime { get => 100; }


        private void keepAliveLoop()
        {
            try
            {
                while (true)
                {
                    SendKeepAlive();
                    Thread.Sleep(KeepAliveTime);
                }
            }
            catch (ThreadAbortException)
            {
                //do nothing.
            }
            catch (Exception)
            {

                throw;
            }
        }
        public void StartKeepAliveProcess()
        {
            if (keepAlive != null) return;


            keepAlive = new Thread(keepAliveLoop);
            keepAlive.IsBackground = true;
            keepAlive.Name = "Keep Alive";
            keepAlive.Start();

        }


        public void StopKeepAliveProcess()
        {
            if (keepAlive == null) return;
            var temp = keepAlive;
            keepAlive = null;
            temp.Abort();
        }

        #endregion

        #region accessing-pins

        public void SetPin(byte pinNumber, float value)
        {
            send(OutgoingMessages.msgOutSetValue, pinNumber, (byte)Math.Round(value * 255));
        }

        #endregion

        public void Handshake()
        {


            /*
             * INFO(Richo): Perform connection request and handshake.
             * Otherwise, when we send a program later we will be rejected.
             */
            send(OutgoingMessages.msgOutConnectionRequest, majorVersion, minorVersion);

            byte handshake = next();
            byte sendByte = (byte)(( majorVersion + minorVersion + handshake) % 256);
            send(sendByte );

            byte ack = next();
            if (ack != sendByte) {
                throw new InvalidOperationException("Could not perform handshake");
            }
        }

        #region reporting

        private void setReportingGlobal(byte globalIndex, bool enabled)
        {
            send(OutgoingMessages.msgOutSetGlobalReport, globalIndex, (byte)(enabled ? 1 : 0));
        }
        private void setReportingPin(byte index, bool enabled)
        {
            send(OutgoingMessages.msgOutSetReport, index, (byte)(enabled ? 1 : 0));
            ReportingChanged();
        }
        public void StartReporting()
        {
            send(OutgoingMessages.msgOutStartReporting);
        }
        public void StopReporting()
        {
            send(OutgoingMessages.msgOutStopReporting);
        }
        #endregion


        #region receiving
        private void processInput()
        {
            //check if connection is available
            byte cmd = next();
            switch (cmd)
            {
                case IncomingMessages.msgInError:
                    break;
                case IncomingMessages.msgInPinValue:
                    break;
                case IncomingMessages.msgInProfile:
                    break;
                case IncomingMessages.msgInGlobalValue:
                    break;
                case IncomingMessages.msgInTrace:
                    break;
                case IncomingMessages.msgInCoroutineState:
                    break;
                case IncomingMessages.msgInTickingScripts:
                    break;
                case IncomingMessages.msgInFreeRam:
                    break;
                case IncomingMessages.msgInSerialTunnel:
                    break;
                default:
                    
                    break;
            }
        }

        #endregion

    }
}
