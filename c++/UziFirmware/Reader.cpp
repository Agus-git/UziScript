#include "Reader.h"

int32 Reader::nextLong(int16 size, bool& timeout)
{
	int32 result = 0;	
	for (int32 i = size - 1; i >= 0; i--)
	{
		result |= ((uint32)next(timeout) << (i * 8));
		if (timeout) return 0;
	}
	return result;
}

/*
INFO(Richo): Code taken and adapted from
http://www.microchip.com/forums/m590535.aspx#590570
*/
float Reader::nextFloat(bool& timeout)
{
	uint32 a = next(timeout);
	if (timeout) return 0;
	uint32 b = next(timeout);
	if (timeout) return 0;
	uint32 c = next(timeout);
	if (timeout) return 0;
	uint32 d = next(timeout);
	if (timeout) return 0;

	uint32 value = (a << 24) | (b << 16) | (c << 8) | d;
	return uint32_to_float(value);
}

uint8 * Reader::next(int16 size, bool& timeout)
{
	uint8 * result = new uint8[size];
	for (int16 i = 0; i < size; i++)
	{
		result[i] = next(timeout);
		if (timeout) return 0;
	}
	return result;
}

uint8 * Reader::upTo(uint8 aCharacter, bool inclusive, bool& timeout)
{
	// This number should be big enough to prevent too many resizings 
	// and small enough to avoid wasting memory. For now, I'll choose 100 bytes.
	int16 arraySize = 100;
	uint8 * result = new uint8[arraySize];
	int16 i = 0;
	bool found = false;
	while (!found)
	{
		uint8 nextChar = next(timeout);
		found = (nextChar == aCharacter) || timeout;
		if (!found || inclusive)
		{
			result[i] = nextChar;
			i++;
			// If we reached the end of the array, we need to resize it.
			if (i >= arraySize)
			{
				int16 newSize = arraySize * 2;
				uint8 * temp = new uint8[newSize];
				memcpy(temp, result, arraySize);
				delete[] result;
				result = temp;
				arraySize = newSize;
			}
		}
	}
	// If the resulting array is smaller than our expectation, we need to resize it.
	if (i < arraySize)
	{
		uint8 * temp = new uint8[i];
		memcpy(temp, result, i);
		delete[] result;
		result = temp;
	}
	return result;
}

