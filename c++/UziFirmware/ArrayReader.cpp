#include "ArrayReader.h"

ArrayReader::ArrayReader(unsigned char * anArray, int size) {
	_position = 0;
	_elements = anArray;
	_size = size;
}

bool ArrayReader::isClosed(void) {
	return _position >= _size;
}

unsigned char ArrayReader::nextChar(void) {
	unsigned char result = _elements[_position];
	_position++;
	return result;
}

int ArrayReader::position(void) {
	return _position;
}

unsigned char * ArrayReader::upTo(unsigned char aCharacter, bool inclusive) {	
	int arraySize = remaining();
	unsigned char * result = new unsigned char[arraySize];
	int i = 0;
	bool found = false;
	while (i < arraySize || !found) {
		unsigned char next = nextChar();
		found = (next == aCharacter);
		if (!found || inclusive) {
			result[i] = next;
			i++;
		}
	}
	if (i < arraySize) {
		unsigned char * temp = new unsigned char[i];
		memcpy(temp, result, i);
		delete [] result;
		result = temp;
	}
	return result;
}

int ArrayReader::size(void) {
	return _size;
}

int ArrayReader::remaining(void) {
	return _size - _position;
}