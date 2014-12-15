
#include "EEPROMStream.h"

unsigned char EEPROMStream::nextChar(void) {
	unsigned char value = EEPROM.read(_position);
	_position++;
	return value;
}

unsigned char * EEPROMStream::upTo(unsigned char aCharacter, bool inclusive) {
	// This number should be big enough to prevent too many resizings 
	// and small enough to avoid wasting memory. For now, I'll choose 100 bytes.
	int arraySize = 100; 
	unsigned char * result = new unsigned char[arraySize];
	int i = 0;
	bool found = false;
	while (!found) {
		unsigned char next = nextChar();
		found = (next == aCharacter);
		if (!found || inclusive) {
			result[i] = next;
			i++;
			// If we reached the end of the array, we need to resize it.
			if (i >= arraySize) {
				int newSize = arraySize * 2;
				unsigned char * temp = new unsigned char[newSize];
				memcpy(temp, result, arraySize);
				delete [] result;
				result = temp;
				arraySize = newSize;
			}
		}
	}
	// If the resulting array is smaller than our expectation, we need to resize it.
	if (i < arraySize) {
		unsigned char * temp =  new unsigned char[i];
		memcpy(temp, result, i);
		delete [] result;
		result = temp;
	}
	return result;
}
