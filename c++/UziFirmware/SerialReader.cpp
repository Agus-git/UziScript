#include "SerialReader.h"

#define TIMEOUT		1000

uint8 SerialReader::next(bool& timeout)
{
	int32 start = millis();
	timeout = false;
	while (Serial.available() <= 0)
	{
		timeout = millis() - start > TIMEOUT;
		if (timeout) return 0;
	}
	return (uint8)Serial.read();
}