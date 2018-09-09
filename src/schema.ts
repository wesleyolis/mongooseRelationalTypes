import {ExtractRelationshipType, ExtractArrayItems} from './index'
import {Schema, SchemaDefinition, SchemaOptions, SchemaTypeOpts, SchemaType} from 'mongoose'
import {If, ObjectHasKey, ObjectOptional, ObjectOmit, ObjectClean, Bool, StringOmit, StringEq, ObjectOverwrite} from 'typelevel-ts';
import { StringContains, ObjectDiff } from './tstypelevel';

interface MSchemaDefinition extends SchemaDefinition
{
    [path: string]: MongooseTSType<any, any, any>;//MoggooseType<any,any,MongooseTSType<any>>;
}

class MSchema<T extends MSchemaDefinition> extends Schema implements MongooseTSType<T, 'O', 'P'>
{
    __tsType : T;
    __ID : 'O' = 'O';
    __InputForm : 'P' = 'P';

    constructor(definition: T, options?: SchemaOptions)
    {        
        super(definition, options);

        this.__tsType = definition;
    }   
}

interface ObjectId extends String
{
}

type ID = 'T' |'O' | 'A' | 'R' | 'S'
type InputForm = 'P' | 'W'

interface MongooseTSType<T , I extends ID = 'T', F extends InputForm = 'P'>
{
    __tsType : T;
    __ID: I;
    __InputForm : F;
}

type MTypes = MBoolean | MNumber | MString | MDate | MObjectId | MBuffer | MArray<any> | MMixed;

export type Ref<RefId, RefImplem> = {
    RefId : RefId,
    RefImplem : RefImplem
}

// Primatives
type MBoolean = MongooseTSType<boolean> & Schema.Types.Boolean
type MNumber = MongooseTSType<number> & Schema.Types.Number
type MString = MongooseTSType<string> & Schema.Types.String
type MDate = MongooseTSType<string | number> & Schema.Types.Date
type MObjectId = MongooseTSType<ObjectId> & Schema.Types.ObjectId
type MBuffer = MongooseTSType<string> & Schema.Types.Buffer
type MArray<T> = MongooseTSType<T, 'A', 'W'> & Schema.Types.Array
type MObject<T> = MongooseTSType<T, 'O'>
type MRef<RefId extends MTypes, RefImplem extends MSchema<any>> = MongooseTSType<Ref<RefId, RefImplem>, 'O'>
type MDecimal128 = MongooseTSType<number> & Schema.Types.Decimal128


type MMixed = MongooseTSType<ObjectId> & Schema.Types.Mixed
/*type MMixed = MongooseTSType<ObjectId> & Schema.Types.Embedded
type MMixed = MongooseTSType<ObjectId> & Schema.Types.DocumentArray
type MMixed = MongooseTSType<ObjectId> & Schema.Types.Decimal128
*/
type MongooseArrayType = MBoolean | MNumber | MString | MDate | MObjectId | MBuffer | MDecimal128 | MRef<any, any> | MArray<any> | MObject<any>;

type Options = {

}

type MBaseSchema = Schema.Types.Boolean;
/*Schema.Types.Array | Schema.Types.Boolean | Schema.Types.Buffer | Schema.Types.Date | Schema.Types.Decimal128 |
Schema.Types.DocumentArray | Schema.Types.Embedded | Schema.Types.Mixed | Schema.Types.Number | Schema.Types.ObjectId | Schema.Types.String
*/
type MongooseTypeOptions<B, Options> = ({type : B} & {[i:string] : Options})
 
type MoggooseType<B, E, Options> = E | MongooseTypeOptions<E, Options> 

function MongooseTypes<TT, Options>(schemaType : TT, ... options : Options[]) : any
{
    if (options)
    {
        const mType = {type : schemaType, ...options};

        return mType
    }
    else 
        return schemaType
}
/*
interface MObject
{
    // define function, but doesn't excistin so I would have to inject it in the resulting prototype to make it work.
}*/

const MTypes = {
    Boolean : <Options> (options? : Options) => MongooseTypes(Schema.Types.Boolean, options) as MBoolean, //MoggooseType<Schema.Types.Boolean, Options, MBoolean>,
    Number :  <Options>(options? : Options) => MongooseTypes(Schema.Types.Number, options) as MNumber, //MoggooseType<Schema.Types.Number, Options, MNumber>,
    Decimal128 :  <Options>(options? : Options) => MongooseTypes(Schema.Types.Number, options) as MDecimal128, //MoggooseType<Schema.Types.Number, Options, MNumber>,
    String :  <Options>(options? :  Options) => MongooseTypes(Schema.Types.String, options) as MString, //| MongooseTypeOptions<MString, Options>//MoggooseType<Schema.Types.String, Options, MString>,
    //Date : () => <Options>(options? : Options) => MongooseTypes(Schema.Types.Date, options) as MString, //MoggooseType<Schema.Types.Boolean, Options, MDate>,        
    ObjectId : <Options>(options? : Options) => MongooseTypes(Schema.Types.Boolean, options) as MObjectId, //MoggooseType<Schema.Types.ObjectId, Options, MObjectId>,        
    Buffer :  <Options>(options? : Options) => MongooseTypes(Schema.Types.Boolean, options) as MBuffer, //MoggooseType<Schema.Types.Buffer, Options, MBuffer>,
        
    Array: <T extends MongooseArrayType, Options>(items : T, options? : Options) => 
        MongooseTypes(Schema.Types.Array, options) as Schema.Types.Array as MArray<{w:T}>,// MoggooseType<Schema.Types.Array, Options, MArray<T>>,                

    Schema :  <T extends MSchema<MSchemaDefinition>, Options>(object : T, options? : Options) => MongooseTypes(object, options) as T,//MongooseTypes(Schema.Types.Boolean, options) as MBuffer,// MoggooseType<Schema.Types.Buffer, Options, MBuffer>,
    Object :  <T extends Record<string, any>, Options>(object : T, options? : Options) => MongooseTypes(object, options) as MObject<T>,//MongooseTypes(Schema.Types.Boolean, options) as MBuffer,// MoggooseType<Schema.Types.Buffer, Options, MBuffer>,
    //Object :  <T extends SchemaType, Options>(object : T, options? : Options) => MongooseTypes(object, options) as MObject<T>,
    // ensure that the two join key types are the same, we enhance that checking.
    Ref : <RefId extends MTypes, RefImplem extends MSchema<any>>(RefId : RefId, RefImplem : RefImplem, options? : Options) => MongooseTypes(RefId, options) as any as MRef<RefId, RefImplem>
};



// naturally nest documents....
// Map, is basically a document. and an Array
const mMumberSchema = new MSchema({a : MTypes.Number()});

const arrayTest = MTypes.Array(MTypes.Object({
    e : MTypes.Boolean(),
    f : MTypes.Number(),
    h : MTypes.String(),
    Ref : MTypes.Ref(MTypes.String(), mMumberSchema),
}));

const mSchema = new MSchema({
    tBoolean : MTypes.Boolean(),
    tNumber : MTypes.Number(),
    tString : MTypes.String(),
    //tDate : MTypes.Date(),
    tObjectId : MTypes.ObjectId(),
    tBuffer : MTypes.Buffer(),
    tDecimal : MTypes.Decimal128(),
   
    //tArrayPBoolean : MTypes.Array(MTypes.Boolean()),
    //tArrayPNumber : MTypes.Array(MTypes.Number()),
    tArrayObject : arrayTest,
    //MTypes.Array(arrayTest),
    //tArrayMixedArray : MTypes.Array(mnumberSchema),
   
    Ref : MTypes.Ref(MTypes.String(), mMumberSchema),
    object : MTypes.Object({
        a : MTypes.Number(),
        b : MTypes.String(),
        c : MTypes.Boolean(),
        Ref : MTypes.Ref(MTypes.String(), mMumberSchema),
    }),
    schema : MTypes.Schema(mMumberSchema)
})


// type mSchema = ExtractTypeTSSchema<typeof MSchema>

// type ExtractTypeTSSchema<T extends MongooseTSType<any>> = {
//     [K in keyof T['__tsType']] : T[K] extends {'__tsType' : infer T} ? T : 'missing'
// }

export type ExtractType<T extends any> = T['__tsType']

export type ExtractFormat<C extends any, T extends any> = 
{
  'P' : T
  'W' : T['w']
}[C['__InputForm']]


type _ExtractFromObject<T extends {[index:string] : MongooseTSType<any, any, any>}> = {
    [P in keyof T] : ({
        'T' : ExtractType<T[P]>
        'O' : 
        _ExtractFromObject<ExtractType<T[P]>>
        //ExtractType<T[P]>
        'A' : (ExtractFormat<T[P],_ExtractFromObject<ExtractType<T[P]>>>)[]
        'R' : _ExtractFromObject<ExtractType<T[P]>> // might want a different formate here.      
    }
  )[T[P]['__ID']]
}

type t =  MSchema<{[index:string] : MongooseTSType<any, any, any>}>
type tt = t['__tsType']

type ExtractTSSchema<T extends MSchema<any>> = _ExtractFromObject<ExtractType<T>>

type test = ExtractTSSchema<typeof mSchema>

const test : test = {
    tBoolean : true,
    tNumber : 345,
    tObjectId : 'sdf',
    tString : 'sdf',
    tBuffer : 'sdf',
    tDecimal : 123,
    //tArrayPBoolean : [true, false],
    //tArrayPNumber : [1,2,3,4,5],
    tArrayObject : [{e : true, f : 234, h : "sdf", Ref : {RefId:'sdf', RefImplem : {a : 1}}}],
    Ref :  {RefId:'sdf', RefImplem : {a : 1}},
    object : {
        a : 1,
        b : 'sdf',
        c: true,
        Ref : {RefId:'sdf', RefImplem : {a : 1}},
    },
    schema : { a : 1}
}


//validation of array of arrays now seem to fail!!
// need to figure out why things are falling over.
// Bug seem to be fixed in version 3.1

const test2 : ExtractRelationshipType<test,[['Ref'], ["tArrayObject"]]> = {
    tBoolean : true,
    tNumber : 345,
    tObjectId : 'sdf',
    tString : 'sdf',
    tBuffer : 'sdf',
    //Ref :  'sdf'
    tDecimal : 123,
    //tArrayPBoolean : [true, false],
    //tArrayPNumber : [1,2,3,4,5],
    tArrayObject : [{e : true, f : 234, h : "sdf", Ref :"sdf"}],
    Ref :  {a:123},
    object : {
        a : 1,
        b : 'sdf',
        c: true,
        Ref : 
            'sdf'
            //{a : 1}        
    },
    schema : { a : 1}
}


// Neasted Referance extraction of Type results for an array doesn't work.
// if want backwards compatability with like 2.6 with out using extends to detect and array, then
// we are going to have write a combined passing exraction routine for mongoose schema..
// Managed to get this working for an array, was kind simpler than not.
// How every required to get this working for Key version as,
// removed of the key to extract doesn't correctly fall back, required to find 
// and check that constaint explicityly now.

// This is an obscure bug, in that, when first key matches and object, that the second key at a different level
// can also match.
// I need to reduce the paths list by the number of matching keys, how do I do this??
export type NarrowPaths<K extends string, T extends any, Paths extends {[index:string] : any}, Depth extends string = '0', iterate extends {[index:string] : string} = itemElements> = 

({[Path in keyof ExtractArrayItems<Paths>] : Paths[Path][Depth] extends K ? Paths[Path] : never
                    
})[keyof ExtractArrayItems<Paths>]  // This now changes the format of things.. to union of types..
// were we implicitly evaluate both side of the unions, as the type enginer does that for us.
// So if convet array to union, then both permutation are evaluted for us
// we could use this to our advantage, because then we don't have to iterate everything.
// lets first restructure so that we narrow the paths to those that match, which are then converted to 
// typle types.
// the other alternative, is that we need to be matching all the previous values all the time, but that not avaliable to us.
// the other approach would be to pass in the matching path, which match.

type obj = {
    a : {
        b: number,
        c : string,
        e : boolean
    }
}

type rrr = NarrowPaths<"a", obj, [['a', 'b'], ['a', 'c']]>
type uu<T extends Array<string>> = {
    [K in keyof T] : K
}


type mmm = uu<rrr>

// Can it ever work in older versions?
const test3 : ExtractRelationshipType<test,[['Ref'],
['object','Ref']
,["tArrayObject","Ref"]
]> = {
    tBoolean : true,
    tNumber : 345,
    tObjectId : 'sdf',
    tString : 'sdf',
    tBuffer : 'sdf',
    tDecimal : 123,
   // tArrayPBoolean : [true, false],
    //tArrayPNumber : [1,2,3,4,5],
    tArrayObject : [{e : true, f : 234, h : "sdf", Ref :  
    {a : 1}
  //"xc"
}, {e : true, f : 234, h : "ssdf", Ref :  
{a : 1}
//""
}],
    //Ref :  'sdf'
    Ref :  {a:123},
    object : {
        a : 1,
        b : 'sdf',
        c: true,
        Ref : 
            //'sdf'
            {a : 1}        
    },
    schema : { a : 1}
}



var schema = new Schema({
    name:    String,
    binary:  Buffer,
    living:  Boolean,
    updated: { type: Date, default: Date.now },
    age:     { type: Number, min: 18, max: 65 },
    mixed:   Schema.Types.Mixed,
    _someId: Schema.Types.ObjectId,
    decimal: Schema.Types.Decimal128,
    array: [],
    ofString: [String],
    ofNumber: [Number],
    ofDates: [Date],
    ofBuffer: [Buffer],
    ofBoolean: [Boolean],
    ofMixed: [Schema.Types.Mixed],
    ofObjectId: [Schema.Types.ObjectId],
    ofArrays: [[]],
    ofArrayOfNumbers: [[Number]],
    nested: {
      stuff: { type: String, lowercase: true, trim: true }
    },
    map: Map,
    mapOfString: {
      type: Map,
      of: String
    }
  })