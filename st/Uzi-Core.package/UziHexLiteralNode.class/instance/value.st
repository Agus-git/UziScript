as yet unclassified
value 
|counter|
counter := 0.
value reverse withIndexDo: [:c :i |
	| ex | 
	ex := i - 1. counter := counter + ((self convertHexToDec: c) * (16**ex))].
^counter.