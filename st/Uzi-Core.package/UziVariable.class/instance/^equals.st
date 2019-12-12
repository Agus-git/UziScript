comparing
= anObject
	(anObject isKindOf: UziVariable) ifFalse: [^ false].
	^ self name = anObject name
		and: [self value = anObject value
			or: [self value isNaN and: [anObject value isNaN]]]