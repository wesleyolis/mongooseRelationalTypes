import {ExtractArrayItems, itemElements, KeyInPathsAtDepthKey} from './index'
import {Schema, SchemaDefinition, SchemaOptions, SchemaTypeOpts, SchemaType} from 'mongoose'
import {If, ObjectHasKey, ObjectOptional, ObjectOmit, ObjectClean, Bool, StringOmit, StringEq, ObjectOverwrite} from './tstypelevel';
import { StringContains, ObjectDiff } from './tstypelevel';

// SchemaFormats
// -------------------------------------
// Id           =>  Basically _id, optional on New, readonly means, only appears on, new and mod. 
// ResultMod    =>  All modifiable parameters, and Id Schema, and ReadOnly. (SchemaMod, ReadOnly)
// UpdateMod    =>  All modifiable parameters are optional. (SchemaMod)
// New          => Defaults are now optional,Readonly are required, all non mod parameters that optional are pressent as is. ()
// --------------------------------------
// individual schemas required to build up the compositions above, by only apply a single operator.
// Some that is optional will always remain optional, its only the required fields which are a problem.
// SchemaMod = Optional = any & Readonly = false & Default = false           // Typicall implicity has optional
// DefaultsOptional = Optional = false & Readonly = false & Default = true    //  these would typically be optional.
// ReadOnlyRequired = Optional = false & ReadOnly = true & Default = false
// ReadOnlyOptional = Optional = false & ReadOnly = true & Default = true
// Default          = Optional = true & ReadOnly = any & Default = true
// InvalidDBHack = Optional = true & ReadOnly = any & Default = true    // As it is always going to be there, disable this combination.
                                                                        // Will disable this at schema definition time.
// Somthing that is optional and has a default, can't be optional, it is impossible.
// --------------------------------------------------
// Alias
// --------------------------------------------------
// ReadOnly = Readonly = true & Default = any => ReadOnlyRequired & Partial<ReadOnlyOptional>
// New = (Default & Partial<DefaultsOptional>)*[SchemaNew] & ReadonlyRequired & Partial<ReadOnlyOptional> & Partial<SchemaMod>
// ModUpdate = Partial<SchemaMod>
// ModResults = SchemaMod & ReadOnlyRequired & RequiredOnlyOptional
// ...........................
// Overall,  we need Default, DefaultsOptional, ReadonlyRequired, ReadonlyOptoinal, Schemamod, which is 5 variants, in which to file the schema creations.
// ----------------------------------
// How to deal with any field type: Typically have type check to detect that some should have called modified.
// -----------------------------------
// We only wrap with a parameter, which means we need to change the input form.
// What we can do is have a function that returns the type as a wrapper, but its actually not, its been faked.
// Then that addeds a control parameter, which setModified works with, by recording a list of keys.
// which it then can use to generate the update schema, which includes modified results for this field.
// Which means, that field must by default have structure, that includes a type __SetModified, yet to be called.
// When setMOdified is call on the class, the update type that is generate, would be modified.
// This can work, we are doing it already, just means that setModified, is required to  be called before hand.
// the other is that save, can't be called or is not avaliable, if yet modifier is missing, in which
// can do like if statment Extract all fields, which keys provided and that there needs to be setModified,
// then check internal list if they all contained on that list. otherwise the save type is an error.
// but that make that type rather complex.
// I would prefer that I would rather use the builder pattern, that doesn't return the new instance,
// until with save, until set Modified is called for all the keys.
// Should also be able to do this pattern in old school format, with out having to use extends.


interface MSchemaDefinition<> extends SchemaDefinition
{
    [path: string]: MongooseTSType<any, any, any>;//MoggooseType<any,any,MongooseTSType<any>>;
}

type MongooseType = any;

interface MSchemaId<ID extends MongooseType>
{
    __id: ID
}

interface MTypeModifiers<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends MongooseType | undefined> {
    __Optional : Optional
    __Readonly : Readonly   // Complications I can't detect readonly, so has to be explicity file mm.. How to create teh constructors for this.., I think only in 3.1, which make dynamic name for variable.
    __Default : Default
}


interface MSchemaModifiers<
    Optional extends 'Req' | 'Op',
    Readonly extends 'Get' | 'Set',
    Default extends MongooseType | undefined>
{
    [path: string]: MTypeModifiers<Optional, Readonly, Default>;//MoggooseType<any,any,MongooseTSType<any>>;
}

type ExtractSchemaValidation<T, SchemaModifiers extends MTypeModifiers<any, any, any>> = {
    [K in keyof T] : 
        T[K] extends MTypeModifiers<any, any, any> ? 
            T[K] extends SchemaModifiers ? 
                T[K] : 'Invalid Type for Key:' & K
            : T[K] extends Record<string, any> ?
                // Recurses here.
            : 'Invalid type.'
}

interface SchemaTypeID<ID extends MTypeModifiers<'Req', 'Set', undefined>>
{
    _id : ID
}
// DefaultsOptional = Optional = false & Readonly = false & Default = true    //  these would typically be optional.
// ReadOnlyRequired = Optional = false & ReadOnly = true & Default = false
// ReadOnlyOptional = Optional = false & ReadOnly = true & Default = true
// Default          = Optional = true & ReadOnly = any & Default = false
// How to design the filing logic for this to be done automatically.
// it can be done, with keys things
// Look at using Object.assign(), to merge all the in dividual interface definitions into one.
// I could look at using the builder patter, but then gong to be alot of intersections,
// which will not be simplified.
// The best I can really do is write Record schema formate, so that the input is validated.
interface MongooseSchemas<
    Id extends SchemaTypeID<any>,
    Mod extends MTypeModifiers<any, 'Set', undefined>,
    NonOpReadDefault extends MTypeModifiers<'Req', 'Get', undefined>,
    NonOpROptional extends MTypeModifiers<'Req', 'Get', any>,
    NDefault extends MTypeModifiers<'Op', any, MongooseType>,
    >
{
    __Id : Id
    __Mod : Mod
    __NonOpReadDefault : NonOpReadDefault
    __NonOpROptoinal : NonOpROptional
    __NDefault : NDefault
}


class MSchema<
ModSchema extends MSchemaDefinition, 
ModSchema extends MSchemaDefinition, 
T extends MSchemaDefinition> extends Schema implements MongooseTSType<T, 'O', 'P'>
{
    __tsType : T;
    __ID : 'O' = 'O';
    __InputForm : 'P' = 'P';

    __SchemaMod;

    constructor(modSchema :
        
        definition: T, options?: SchemaOptions)
    {        

        const combinedSchema = 

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
type MRef<RefId extends MTypes, RefImplem extends MSchema<any>> = MongooseTSType<Ref<{w:RefId}, {w:RefImplem}>, 'R','W'>
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
  /*  tBoolean : MTypes.Boolean(),
    tNumber : MTypes.Number(),
    tString : MTypes.String(),
    //tDate : MTypes.Date(),
    tObjectId : MTypes.ObjectId(),
    tBuffer : MTypes.Buffer(),
    tDecimal : MTypes.Decimal128(),
   */
    //tArrayPBoolean : MTypes.Array(MTypes.Boolean()),
    //tArrayPNumber : MTypes.Array(MTypes.Number()),
    tArrayObject : arrayTest,
    //MTypes.Array(arrayTest),
    //tArrayMixedArray : MTypes.Array(mnumberSchema),
   
   // Ref : MTypes.Ref(MTypes.String(), mMumberSchema),
  /*  object : MTypes.Object({
        a : MTypes.Number(),
        b : MTypes.String(),
        c : MTypes.Boolean(),
        Ref : MTypes.Ref(MTypes.String(), mMumberSchema),
    }),
    schema : MTypes.Schema(mMumberSchema)*/
})


// type mSchema = ExtractTypeTSSchema<typeof MSchema>

// type ExtractTypeTSSchema<T extends MongooseTSType<any>> = {
//     [K in keyof T['__tsType']] : T[K] extends {'__tsType' : infer T} ? T : 'missing'
// }

export type KeysInPath<T extends any, K extends string> = ({
    [K in keyof T] : 'T'
}
&
{
    [index:string] : 'F'
})[K]

export type NarrowsPathKeys<K extends string, Paths extends {[index:string] : any}, Depth extends string, Keys extends string> =
//KeysInPath<Paths, Keys> extends 'T' ?
({
    [Path in Keys] : 
            ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
                Paths[Path][Depth] extends K ? 
                    Path
                : ''
            : ''
    }
    &
    {
        [index:string] : '' // This here doens't really matter since all the keys should exist anyways.
    }
    )[Keys]
//: ''
   
// I need to figure out how to simply determine how to increment the key level.

   // Need to add array iteration support, add  supports for arrays..
type ExtractRelationshipType<T extends {[index:string] : MongooseTSType<any, any, any>}, Paths extends {[index:string] : any}, Depth extends string = '0', Keys extends string = keyof ExtractArrayItems<Paths>, iterate extends {[index:string] : string} = itemElements> = {
    [P in keyof T] : 
    
    ({
        'T' : ExtractType<T[P]>
        'O' : 
        //Keys2
        ExtractRelationshipType<ExtractType<T[P]>, Paths, Depth, Keys>
        //ExtractType<T[P]>
        'A' : //ExtractFormat<T[P],ExtractType<T[P]>>   
        
        
        (
            ExtractFormat<T[P],
            ExtractRelationshipTypeItem<P,T[P], Paths, Depth, Keys>
            >
            )[]
          
        
        //(ExtractFormat<T[P],ExtractRelationshipType<T[P], Paths, Depth, Keys>>)
        'R' : 
        Keys &
        ExtractFormat<T[P],ExtractRelationshipTypeItem<P,T[P], Paths, Depth, Keys>> // might want a different formate here.      
    })[T[P]['__ID']]
}
type ExtractRelationshipTypeItem<K extends string, T extends MongooseTSType<any, any, any>,
 Paths extends {[index:string] : any}, Depth extends string = '0',
  Keys2 extends string = 'pp'
  // = keyof ExtractArrayItems<Paths>,
  ,
   iterate extends {[index:string] : string} = itemElements,
 TD extends any = T extends MongooseTSType<{w: infer A},any,any> ? A : ExtractType<T>> = 

    // I need to preserve the format, because that is the only way I can extract and detect an array.
    // T[K] is another MongooseTSType, so have to extract the type to evaluate its contents.
    // I am probably going to have to change the MRef type, to be encapsulated in mongooseTSType.
    // Otherwise I will be breaking the pattern!
    // The problem is there is now another level of abstraction before RefID and RefIMplemtation
    //  MRef<MType.Bool

    // I think that Ref is going to need a wrapper just like the other stuff.
    // I think I will also need to strip the format off here as well.

    // With an array being wrapped in a w, there is a problem that we can't evalute the internals,
    // because they are not hidden away by w, so if not hidden by w then, be able to evalue it
    // and when go back into the object call we have a problem, because the patter doesn match
    // we required w match w match w match, so how to do this.
    // the next type down needs to be nested in a w.., Which is a big problem.
    // We have iterate type and logical type, just duplicated and have both for A R    
    

    //*** What I could do for arrays and that to as all I need is the formate ,is forward extract that information, so now I have 2 alternatives approaches to this. */
//Falls over on the second level of key narrowing, so we need figure out how to fix that or use the old void concept..
    Depth extends '1' ? {w: 'DDD' & Keys2} :

     NarrowsPathKeys<K, Paths, Depth, Keys2> extends '' ?                 
        TD extends Ref<any, any> ?
        {w:'NOMatch' & Keys2}
           // ExtractRelationshipType<TD['RefId'], Paths, iterate[Depth], ''>   // Both side of the referance types have now been abstracted.
        :
         //{w:'T'}
         ExtractRelationshipType<ExtractType<T>, Paths, iterate[Depth], ''>
        
    :
    //{w:'F'}
    
    TD extends Ref<any, any> ? 
        //{w:'I'}
        ExtractRelationshipType<TD['RefImplem'], Paths, iterate[Depth], NarrowsPathKeys<K, Paths, Depth, Keys2>> 
    :
      //  {w: 'H' & Depth & K}
      //{w:   NarrowsPathKeys<K, Paths, Depth, Keys2> }
        //{w:'H' & K & '--' & Keys2 & ':' & Paths} 
        // carray on on level down were the issues would be, not on this true false evaluation.
    
    
     ExtractRelationshipType<ExtractType<T>, Paths, iterate[Depth], NarrowsPathKeys<K, Paths, Depth, Keys2>> // Going to have a problem here because there are two different formats still

   

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


type ExtractTSSchemaType<T extends MSchema<any>, Paths extends {[index:string] : any} = [['tArrayObject','Rejf'],['lkj']]> = ExtractRelationshipType<ExtractType<T>, Paths>
type ExtractTSSchema<T extends MSchema<any>> = _ExtractFromObject<ExtractType<T>>

type test = ExtractTSSchemaType<typeof mSchema>

type Paths__ = [['tArrayObject','sdf'], ['tArrayObject','K2']];
type dduu = keyof ExtractArrayItems<Paths__>

// Same old story as before of needing to handle the cases of when there is absolutely no match at all.
// the same issues as before, which makes use of this function to resolve that issues one layer up.
// will have to look at employing that here too.
// Basically if there is no match at all, then ..
// can't I program empty key, problem is that I need to evalute the results and results of union type is both code paths.
// which creates more complexity and permutations to evaluate, which is a problem.
type pp = NarrowsPathKeys<'K2', Paths__,'1', '' | '0'>

type mm = pp extends '' ? 'NoMatches' :'HaveMatches'

// Problem here is that still can't make logical decissin  based onthe results,
// unless write some logic that does some explicty '' or other
// I could do that possible but I am going to have to think about that and draw up a truth table,
// so that I can get it to work.
// Actually I can't do anything about this 2 values will always remain two values.. of unions, I can reduce them.. reduce to true and never, which is true.
// which means I can do it for the other combination as well.
// complex thing is I can never test for a never, which is a really big problem.
type uuuuu = {'':'T'} & {[index:string] : 'F'}
type rr = uuuuu['g']

// Empty doesn't work it is a problem.

// New bug is that when we have mutiple keys the second key stops working
// as it no longer seems to match any more, I will have to fixure this out.

const test : test = {
  /*  tBoolean : true,
    tNumber : 345,
    tObjectId : 'sdf',
    tString : 'sdf',
    tBuffer : 'sdf',
    tDecimal : 123,*/
   // tArrayPBoolean : [true, false],
    //tArrayPNumber : [1,2,3,4,5],
    tArrayObject : [{e : true, f : 234, h : "sdf", Ref :
    // 234
    //true
    //"kkk"
    //{RefId:'sdf', RefImplem : {a : 1}}
    {a:1}
}],
   // Ref : 
    //{a:1}
    //"dsf"
    //{RefId:'sdf', RefImplem : {a : 1}},
   /* object : {
        a : 1,
        b : 'sdf',
        c: true,
        Ref : {RefId:'sdf', RefImplem : {a : 1}},
    },
    schema : { a : 1}
    */
}


//validation of array of arrays now seem to fail!!
// need to figure out why things are falling over.
// Bug seem to be fixed in version 3.1

const test2 : ExtractTSSchemaType<typeof mSchema,[['Ref'], ["tArrayObject"]]> = {
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