# mongooseRelationalTypes
Wrapper enhancements for mongoose, that allow for populate and deep populate method to automatically replace the oid/id with the right hand side of the relationship

## Wrapper around mongoose to provide type support for relationship in documents, when using populate and deeppopulate functionality.

```.ts

export interface LeftSchema {
    a : number,
    Item0: {
        Item1: {
            Item2:Ref<string,number>
        },
        Item11: {     Item12:Ref<'12-A','12-B'>}
        ItemA : { ItemB : Ref<'AB-A', RightSchema>}
        b : boolean,
        c : string,
        d : number
    }
}

export interface RightSchema {
    a : number,
    B : Ref<'12B-A','12B-B'>
}

``

### Using the following command, the following projections will be produced before.

```.ts
model.findById({}).populate([['ItemA',ItemAB'],['ItemD','ItemDE'],['ItemA','ItemAC']]).exec().then(function(results) {
const value =  results.ItemA.ItemAB;
const value2 = results.ItemD.ItemDE;
const value3 = results.ItemA.ItemAC;
});
```
AS of current waiting on support for type inferance of string literals for and array<array<string> for functions, otherwise one must spesify
this as generic input and then also as runtime value.
https://github.com/Microsoft/TypeScript/issues/26841

Currently working on another method, in which the current system supports type inferance, just a couple corner cases still to sort out.
In which cases these be achivable, with out repeating or stuttering on the parameter need be supplied, the wrapper will do the rest for ou.

### Projections Produced

```.ts

// Good only right hand keys, no fails positives.
let caseItem0JoinedNoFalsePositivesB : ExtractRelationshipType<LeftSchema, [['Item0'],['Item0','f'],['Item0','Item11'],['Item0','Item11','d']]> = {
    a : 1,
    Item0 : {
        Item1 : {Item2 : '234'},
         Item11 : {Item12 : '12-A'},
         ItemA : {    ItemB : 
            'AB-A'
        },
        b : true, 
        c : "string",
        d : 234
    }
}

//Fails item0Item11.Item12 fails, should be left hand key
let caseItem0Item11Item12JoinedNoFalsePositivesB : ExtractRelationshipType<LeftSchema, [['Item0'],['Item0','f'],['Item0','Item11'],['Item0','Item11','d']]> = {
    a : 1,
    Item0 : {
        Item1 : {Item2 : '234'},
         Item11 : {Item12 : '12-B'},
         ItemA : {    ItemB : 
            'AB-A'
        },
        b : true, 
        c : "string",
        d : 234
    }
}

// Good no fail positives.
let caseItem0Item11Item12 : ExtractRelationshipType<LeftSchema, [['Item0'],['Item0','f'],['Item0','Item11'],['Item0','Item11','Item12']]> = {
    a : 1,
    Item0 : {
        Item1 : {Item2 : '234'},
         Item11 : {Item12 : '12-B'},
         ItemA : {    ItemB : 
            'AB-A'
        },
        b : true, 
        c : "string",
        d : 234
    }
}
```
