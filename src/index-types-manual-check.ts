import {Ref, ExtractRelationshipType, ExtractRefSchema, ExtractRelationshipTypeKey} from './index'

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

function basicTypeCapture<T extends string>(value : T) : T
{
    return {} as any
}

const basicTypeCaptureValue = basicTypeCapture('A')


// Not an an array literal capture.
function ArrayTypeCapture<T extends Array<string>>(value : T) : T 
{
    return {} as any
}
// not an array literal capture
// ['ItemA','ItemB']
const arrayTypeCaptureValue = ArrayTypeCapture(['ItemA','ItemB']);

// Good, but problem since can't covert a type into runtime value.
const ArrayTypeCaptureValueGeneric = ArrayTypeCapture<['ItemA','ItemB']>(['ItemA','ItemB']);
ArrayTypeCaptureValueGeneric

// Not an an array literal capture, expect 'T'
function ArrayTypeCaptureEvaluate<T>(value : T) : T extends ['ItemA'] ? 'T' :'F' | T extends Array<'ItemA'> ? 'T' :'F' | T extends {'0' : 'ItemA'} ? 'T' :'F' 
{
    return {} as any
}

// Works, but problem since we can't convert a type into a runtime value
const arrayTypeCaptureEvaluteArrayLiteralsSpecializeGeneric = ArrayTypeCaptureEvaluate<['ItemA']>(['ItemA']);

type EvaluateArrayLiteral<T> = T extends ['ItemA'] ? 'T' :'F' | T extends Array<'ItemA'> ? 'T' :'F' | T extends {'0' : 'ItemA'} ? 'T' :'F' 

// Not an an array literal capture, expect 'T'
function ArrayTypeCaptureEvaluateUsingType<T>(value : T) : EvaluateArrayLiteral<T>
{
    return {} as any
}
// ALso fails.
const arrayTypeCaptureEvaluteArrayLiterals = ArrayTypeCaptureEvaluateUsingType(['ItemA']);

// Works, but it is also a problem since we can't convert a type into a runtime value.
const arrayTypeCaptureEvaluteArrayLiteralsSpecializeGeneric = ArrayTypeCaptureEvaluateUsingType<['ItemA']>(['ItemA']);

// Works
type LeftSchemaPlain = ExtractRefSchema<LeftSchema, ['ItemA']>
const leftSchemaPlain : LeftSchemaPlain;

//
function ExtractRelationShipPath<T,P = never>(schema : T, value : P) : ExtractRefSchema<T,P>
{
    return {} as any
}

const extractRelationShipPath = ExtractRelationShipPath({} as LeftSchema, ['ItemA','Item1','Item2']);
extractRelationShipPath.Item0.Item1.Item2


function CaptureArrayLiteralOfArrayLiteral<P extends Array<Array<string>>>(path : P) : P
{
    return {} as any
}

// Fails
const captureArrayLiteralOfArrayLiteral = CaptureArrayLiteralOfArrayLiteral([['ItemA', 'ItemB']]); 

// Works 
const captureArrayLiteralOfArrayLiteralSpesificGeneric = CaptureArrayLiteralOfArrayLiteral<[['ItemA', 'ItemB']]>([['ItemA', 'ItemB']]); 


function CaptureArrayLiteralOfArrayLiteralAndEvaluate<P extends Array<Array<string>>>(path : P) : P extends Array<['ItemA','ItemB']> ? 'T' : 'F' 
{
    return {} as any
}

// Works
const captureArrayLiteralOfArrayLiteralSpesificGenericA = CaptureArrayLiteralOfArrayLiteralAndEvaluate<[['ItemA', 'ItemB']]>([['ItemA', 'ItemB']]); 

// Fails, which is correctly working as expected.
const captureArrayLiteralOfArrayLiteralSpesificGenericB = CaptureArrayLiteralOfArrayLiteralAndEvaluate<[['ItemA', 'Item']]>([['ItemA', 'Item']]); 



function CapturePath<S extends {}, P extends Array<Array<string>>>(path : P) : ExtractRelationshipType<S, P>
{
    return {} as any
}

const CapturePathCaseA = CapturePath([['']]); // results in never [][], which we need to design our system to handle.
CapturePathCaseA.

// Good only let primary keys.
let caseNoJoins : ExtractRelationshipType<LeftSchema, [never]> = {
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


// Good only right hand keys, no fails positives.
let caseItem0JoinedNoFalsePositivesA : ExtractRelationshipType<LeftSchema, [['Item0'],['Item0','f'],['Item0','Item11']]> = {
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


type JoinPaths = [['Item0','e'],['Item0', 'Item1', 'Item2'], ['Item0', 'Item11', 'Item12'],['Item0','ItemA','ItemB','B']];

type SchemaCaseAllJoined = ExtractRelationshipType<LeftSchema, JoinPaths>

// Good all the right keys.
let caseAllJoined : SchemaCaseAllJoined = {
    a : 1,
    Item0 : {
        Item1 : {Item2 : 234},
         Item11 : {Item12 : '12-B'},
         ItemA : {    ItemB : 
        //    'AB-A'
        {a:234,B:'12B-B'},       
        },
        b : true, 
        c : "string",
        d : 234
    }
}

// Items a should be missign from Item0.ItemA.a
let caseAllJoinedFail : SchemaCaseAllJoined = {
   // a : 1,
    Item0 : {
        Item1 : {Item2 : true},
        Item11 : {Item12 : '12-A'},
        
        ItemA : {
            ItemB : 
            'AB-A'
            // Missing the right hand side join
            //{a:234,B:'12B-B'},    
        },
        b : true, 
        c : "string",
        d : 234
    }
}


/////////////////Keys as Paths

interface structKeyLeft
{
    a : number,
    b : string,
    c : Ref<'C-Key', structKeyRight>
    d : boolean
}

interface structKeyRight
{
    A : 'a'
    b : Ref<'b', structKeyRight>
}

type Simple = ExtractRelationshipTypeKey<structKeyLeft,{c:{b:''}}>

let simple : Simple;

simple = {
    a : 234,
    b : 'sdf',
    c : {A:'a', 
        //b: 'c',
        b: {A:'a',
         b: 'b'
        }
        },
    d : true
}

// Good only let primary keys, fail, however, typically don't used populate inthe first place.
// so at the end of the day, its all good.
let caseNoJoinskeys : ExtractRelationshipTypeKey<LeftSchema,{}> = {
    a : 1,
    Item0 : 
    {
        Item1 : {Item2 : '234'},
         Item11 : {Item12 : '12-A'},
         ItemA : {    ItemB : 
            'AB-B'
        },
        b : true, 
        c : "string",
        d : 234
    }
}

// Good only right hand keys, no fails positives.
let caseItem0JoinedNoFalsePositivesAKey : ExtractRelationshipTypeKey<LeftSchema, {
    Item0:{       
        f:'',
        Item11 : ''        
    }
}> = {
    a : 1,
    Item0 : {
       // b :'',
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

// Good only right hand keys, no fails positives.
let caseItem0JoinedNoFalsePositivesBKeys : ExtractRelationshipType<LeftSchema, {Item0:{f:'', Item11 :{d:''}}}> = {
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
let caseItem0Item11Item12JoinedNoFalsePositivesBKeys : ExtractRelationshipTypeKey<LeftSchema,
{Item0:{f:'', Item11 : {d:''}}}> = {
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

// Good no fail positives.
let caseItem0Item11Item12Keys : ExtractRelationshipTypeKey<LeftSchema, 
{
    Item0 : {f :'', Item11 : {Item12 : ''}}
}> = {
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


type JoinPathsKey = 
{
    Item0 : {
        e:'',
        Item1 : {Item2:''},
        Item11 : {Item12 : ''},
        ItemA : {ItemB : {B:''}}
    }
}
//[['Item0','e'],['Item0', 'Item1', 'Item2'], ['Item0', 'Item11', 'Item12'],['Item0','ItemA','ItemB','B']];



type SchemaCaseAllJoinedKey = ExtractRelationshipTypeKey<LeftSchema, JoinPathsKey>

// Good all the right keys.
let caseAllJoinedKeys : SchemaCaseAllJoinedKey = {
    a : 1,
    Item0 : {
        Item1 : {Item2 : 234},
         Item11 : {Item12 : '12-B'},
         ItemA : {    ItemB : 
        //    'AB-A'
        {a:234,B:'12B-B'},       
        },
        b : true, 
        c : "string",
        d : 234
    }
}

// Items a should be missign from Item0.ItemA.a
let caseAllJoinedFailKeys : SchemaCaseAllJoinedKey = {
    a:1,
    Item0 : {        
        Item1 : {Item2 : 34},
        Item11 : {Item12 : '12-A'},
        
        ItemA : {
            ItemB :
            // 'AB-A'
            // Missing the right hand side join
            {a:234,B:'12B-B'},    
        },
        b : true, 
        c : "string",
        d : 234
    }
}


// Items a should be missign from Item0.ItemA.Item2.number
let caseAllJoinedFailKeysB : SchemaCaseAllJoinedKey = {
    a:1,
    Item0 : {        
        Item1 : {Item2 : 34},
        Item11 : {Item12 : '12-A'},
        
        ItemA : {
            ItemB :
            // 'AB-A'
            // Missing the right hand side join
            {a:234,B:'12B-B'},    
        },
        b : true, 
        c : "string",
        d : 234
    }
}


// Items a should be missign from Item0.ItemA.a
let caseAllJoinedFailKeys : SchemaCaseAllJoinedKey = {
    a:1,
    Item0 : {        
        Item1 : {Item2 : 34},
        Item11 : {Item12 : '12-A'},
        
        ItemA : {
            ItemB :
            // 'AB-A'
            // Missing the right hand side join
            {a:234,B:'12B-B'},    
        },
        b : true, 
        c : "string",
        d : 234
    }
}


type test<T> = T extends void ? 'T' : 'F'

type results = test<number>