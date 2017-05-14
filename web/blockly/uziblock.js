var UziBlock = (function () {
	var BLOCKS = [{
	  "type": "script",
	  "message0": "script %1 %2 ticking %3 times per %4 %5 do %6",
	  "args0": [
		{
		  "type": "field_input",
		  "name": "scriptName",
		  "text": "default"
		},
		{
		  "type": "input_dummy"
		},
		{
		  "type": "field_number",
		  "name": "tickingTimes",
		  "value": 1000,
		  "min": 0
		},
		{
		  "type": "field_dropdown",
		  "name": "tickingScale",
		  "options": [
			[
			  "second",
			  "s"
			],
			[
			  "minute",
			  "m"
			],
			[
			  "hour",
			  "h"
			]
		  ]
		},
		{
		  "type": "input_dummy"
		},
		{
		  "type": "input_statement",
		  "name": "statements",
		  "align": "RIGHT"
		}
	  ],
	  "colour": 175,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "toggle",
	  "message0": "toggle pin %1",
	  "args0": [
		{
		  "type": "field_dropdown",
		  "name": "pinNumber",
		  "options": [
			[
			  "D0",
			  "0"
			],
			[
			  "D1",
			  "1"
			],
			[
			  "D2",
			  "2"
			],
			[
			  "D3",
			  "3"
			],
			[
			  "D4",
			  "4"
			],
			[
			  "D5",
			  "5"
			],
			[
			  "D6",
			  "6"
			],
			[
			  "D7",
			  "7"
			],
			[
			  "D8",
			  "8"
			],
			[
			  "D9",
			  "9"
			],
			[
			  "D10",
			  "10"
			],
			[
			  "D11",
			  "11"
			],
			[
			  "D12",
			  "12"
			],
			[
			  "D13",
			  "13"
			],
			[
			  "A0",
			  "14"
			],
			[
			  "A1",
			  "15"
			],
			[
			  "A2",
			  "16"
			],
			[
			  "A3",
			  "17"
			],
			[
			  "A4",
			  "18"
			],
			[
			  "A5",
			  "19"
			]
		  ]
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 0,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "start_script",
	  "message0": "start %1",
	  "args0": [
		{
		  "type": "field_input",
		  "name": "scriptName",
		  "text": "script name"
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 175,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "toggle_variable",
	  "message0": "toggle pin %1",
	  "args0": [
		{
		  "type": "input_value",
		  "name": "pinNumber",
		  "check": "Number"
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 0,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "stop_script",
	  "message0": "stop %1",
	  "args0": [
		{
		  "type": "field_input",
		  "name": "scriptName",
		  "text": "script name"
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 175,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "run_script",
	  "message0": "run %1",
	  "args0": [
		{
		  "type": "field_input",
		  "name": "scriptName",
		  "text": "script name"
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 175,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "wait",
	  "message0": "wait %1 %2",
	  "args0": [
		{
		  "type": "field_dropdown",
		  "name": "negate",
		  "options": [
			[
			  "while",
			  "false"
			],
			[
			  "until",
			  "true"
			]
		  ]
		},
		{
		  "type": "input_value",
		  "name": "condition",
		  "check": "Boolean"
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 120,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "turn_pin",
	  "message0": "turn %1 %2",
	  "args0": [
		{
		  "type": "field_dropdown",
		  "name": "value",
		  "options": [
			[
			  "on",
			  "on"
			],
			[
			  "off",
			  "off"
			]
		  ]
		},
		{
		  "type": "field_dropdown",
		  "name": "pinNumber",
		  "options": [
			[
			  "D0",
			  "0"
			],
			[
			  "D1",
			  "1"
			],
			[
			  "D2",
			  "2"
			],
			[
			  "D3",
			  "3"
			],
			[
			  "D4",
			  "4"
			],
			[
			  "D5",
			  "5"
			],
			[
			  "D6",
			  "6"
			],
			[
			  "D7",
			  "7"
			],
			[
			  "D8",
			  "8"
			],
			[
			  "D9",
			  "9"
			],
			[
			  "D10",
			  "10"
			],
			[
			  "D11",
			  "11"
			],
			[
			  "D12",
			  "12"
			],
			[
			  "D13",
			  "13"
			],
			[
			  "A0",
			  "14"
			],
			[
			  "A1",
			  "15"
			],
			[
			  "A2",
			  "16"
			],
			[
			  "A3",
			  "17"
			],
			[
			  "A4",
			  "18"
			],
			[
			  "A5",
			  "19"
			]
		  ]
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 0,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "turn_pin_variable",
	  "message0": "turn %1 %2",
	  "args0": [
		{
		  "type": "field_dropdown",
		  "name": "value",
		  "options": [
			[
			  "on",
			  "on"
			],
			[
			  "off",
			  "off"
			]
		  ]
		},
		{
		  "type": "input_value",
		  "name": "pinNumber",
		  "check": "Number"
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 0,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "is_pin",
	  "message0": "is %1 %2",
	  "args0": [
		{
		  "type": "field_dropdown",
		  "name": "state",
		  "options": [
			[
			  "on",
			  "on"
			],
			[
			  "off",
			  "off"
			]
		  ]
		},
		{
		  "type": "field_dropdown",
		  "name": "pinNumber",
		  "options": [
			[
			  "D0",
			  "0"
			],
			[
			  "D1",
			  "1"
			],
			[
			  "D2",
			  "2"
			],
			[
			  "D3",
			  "3"
			],
			[
			  "D4",
			  "4"
			],
			[
			  "D5",
			  "5"
			],
			[
			  "D6",
			  "6"
			],
			[
			  "D7",
			  "7"
			],
			[
			  "D8",
			  "8"
			],
			[
			  "D9",
			  "9"
			],
			[
			  "D10",
			  "10"
			],
			[
			  "D11",
			  "11"
			],
			[
			  "D12",
			  "12"
			],
			[
			  "D13",
			  "13"
			],
			[
			  "A0",
			  "14"
			],
			[
			  "A1",
			  "15"
			],
			[
			  "A2",
			  "16"
			],
			[
			  "A3",
			  "17"
			],
			[
			  "A4",
			  "18"
			],
			[
			  "A5",
			  "19"
			]
		  ]
		}
	  ],
	  "output": "Boolean",
	  "colour": 0,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "is_pin_variable",
	  "message0": "is %1 %2",
	  "args0": [
		{
		  "type": "field_dropdown",
		  "name": "state",
		  "options": [
			[
			  "on",
			  "on"
			],
			[
			  "off",
			  "off"
			]
		  ]
		},
		{
		  "type": "input_value",
		  "name": "pinNumber",
		  "check": "Number"
		}
	  ],
	  "output": "Boolean",
	  "colour": 0,
	  "tooltip": "",
	  "helpUrl": ""
	}];
	

	Blockly.defineBlocksWithJsonArray(BLOCKS);
})();