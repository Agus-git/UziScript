﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Threading;

namespace Simulator
{
    public partial class Main : Form
    {
        private const int PIN_COUNT = 20;
        private Pin[] pins = new Pin[PIN_COUNT];
        private CheckBox[] checks = new CheckBox[PIN_COUNT];

        public Main()
        {
            InitializeComponent();
        }

        private void Main_Load(object sender, EventArgs e)
        {
            InitializePins();
            stepTimer.Enabled = true;
            Sketch.Start();
        }

        private void InitializePins()
        {
            pinsTable.Padding = new Padding(0, 0, SystemInformation.VerticalScrollBarWidth, 0);
            for (int i = 0; i < PIN_COUNT; i++)
            {
                Pin pin = new Pin(i);
                pin.Size = new Size(pinsTable.Size.Width - SystemInformation.VerticalScrollBarWidth, pin.Size.Height);
                pin.Anchor = AnchorStyles.Left | AnchorStyles.Right;
                pin.Visible = false;
                pinsTable.Controls.Add(pin);

                CheckBox check = new CheckBox();
                check.Text = pin.Number.ToString();
                if (i < 14)
                {
                    digitalChecksTable.Controls.Add(check);
                }
                else
                {
                    analogChecksTable.Controls.Add(check);
                }

                pins[i] = pin;
                checks[i] = check;
            }

            // HACK(Richo): By default I make these three pins visible
            checks[11].Checked = checks[13].Checked = checks[14].Checked = true;
        }

        private void stepTimer_Tick(object sender, EventArgs e)
        {
            // HACK(Richo): To speed testing, I automatically change the value of A0
            Sketch.SetPinValue(14, Convert.ToInt16(Math.Sin((double)Environment.TickCount / 1000) * 1024));
            
            UpdateUI();
        }

        private void UpdateUI()
        {
            startButton.Enabled = !Sketch.Running;
            stopButton.Enabled = Sketch.Running;
            for (int i = 0; i < PIN_COUNT; i++)
            {
                pins[i].UpdateValue();
                pins[i].Visible = checks[i].Checked;
            }
        }

        private void Main_FormClosing(object sender, FormClosingEventArgs e)
        {
            Sketch.Stop();
        }

        private void startButton_Click(object sender, EventArgs e)
        {
            Sketch.Start();
        }

        private void toggle(Pin pin)
        {
            pin.Visible = !pin.Visible;
        }

        private void openSerialButton_Click(object sender, EventArgs e)
        {
            SerialConsole serial = new SerialConsole();
            serial.ShowDialog();
        }

        private void stopButton_Click(object sender, EventArgs e)
        {
            Sketch.Stop();
        }
    }
}
