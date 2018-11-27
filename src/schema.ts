import {ExtractArrayItems, itemElements, KeyInPathsAtDepthKey} from './index'
import * as mongoose from 'mongoose';
import {Schema, SchemaDefinition, SchemaTypeOpts, SchemaType, Types} from 'mongoose'
import {If, ObjectHasKey, ObjectOptional, ObjectOmit, ObjectClean, Bool, StringOmit, StringEq, ObjectOverwrite, Option} from './tstypelevel';
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


interface IMSchemaDefinition<> extends SchemaDefinition
{
    [path: string]: IMongooseTSType<any, any, any>;//MoggooseType<any,any,MongooseTSType<any>>;
}

type MongooseTypes = any;

interface IMSchemaId<ID extends MongooseTypes>
{
    __id: ID
}


// type MTypeModifiersDefaultRecord<TSType extends TsTypesPrimatives, Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends TSType | undefined> =
// Record<string, IMongooseTSType<any,any,any> & IMTypeModifiersDefault<TSType, Optional, Readonly, Default>>

// interface IMTypeModifiersDefault<TSType extends TsTypesPrimatives, Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends TSType | undefined>
// extends IMTypeModifiers<Optional, Readonly, Default>
// {
//     __Optional : Optional
//     __Readonly : Readonly   // Complications I can't detect readonly, so has to be explicity file mm.. How to create teh constructors for this.., I think only in 3.1, which make dynamic name for variable.
//     __Default : Default
// }

interface IMTypeModifiersRecord<
Optional extends 'Req' | 'Op',
Readonly extends 'Get' | 'Set',
Default extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
RefType extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined,
OptionalConstraints extends 'Req' | 'Op' = Optional, 
ReadonlyConstraints extends 'Get' | 'Set' = Readonly,
DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined = Default,
RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined = RefType,
> extends
Record<string, (IMongooseTSType<any,any,any> & 
(IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default, RefType, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>)
//| IMTypeModifiersRecord<Optional, Readonly, Default, RefType, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>
)>
{
}

// interface IMRefTypeModifiers<
//     Optional extends 'Req' | 'Op',
//     Readonly extends 'Get' | 'Set',
//     Default extends TsTypesPrimatives | Array<any> | undefined,
//     RefType extends IMongooseSchemas<any,any,any,any,any,any,any>
// > extends IMTypeModifiers<Optional, Readonly, Default, RefType>
// {

// }

interface IMTypeModifiers<
    Optional extends 'Req' | 'Op',
    Readonly extends 'Get' | 'Set',
    Default extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
    RefType extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined = undefined
> {
    __Optional : Optional
    __Readonly : Readonly   // Complications I can't detect readonly, so has to be explicity file mm.. How to create teh constructors for this.., I think only in 3.1, which make dynamic name for variable.
    __Default : Default
    __RefType : RefType
}

interface IMTypeModifiersWithNeastedConstraints<
    Optional extends 'Req' | 'Op',
    Readonly extends 'Get' | 'Set',
    Default extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
    RefType extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined = undefined,
    OptionalConstraints extends 'Req' | 'Op' = Optional, 
    ReadonlyConstraints extends 'Get' | 'Set' = Readonly,
    DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined = Default,
    RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined = RefType,
   
> extends IMTypeModifiers<Optional, Readonly, Default, RefType> {
    __Optional : Optional
    __Readonly : Readonly   // Complications I can't detect readonly, so has to be explicity file mm.. How to create teh constructors for this.., I think only in 3.1, which make dynamic name for variable.
    __Default : Default
    __RefType : RefType
}

// To validate this, one needs to build a generator based on the input to ensure that the final type is of the form
// IMRefTypeModifiers
interface MRefTypeModifiersRecord<Optional extends 'Req' | 'Op',
Readonly extends 'Get' | 'Set', Default extends TsTypesPrimatives | Array<any> | undefined, 
RefType extends IMongooseSchemas<any,any,any,any,any,any,any>> 
extends Record<string, (IMongooseTSType<any,any,any> & IMTypeModifiers<Optional, Readonly, Default, RefType>) | MRefTypeModifiersRecord<any,any,any,any>>
{

}

// // Problem with this referance type is that it is not perfectly recusive...
// // as it addes on options, but from to level its fine actually, because constaint is actually at a top level.
// interface IMRefTypeModifiers<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends TsTypesPrimatives | Array<any> | undefined, RefType extends IMongooseSchemas<any,any,any,any,any,any,any>>
// extends IMTypeModifiers<Optional, Readonly, Default>
// {
//     __RefType : IMongooseSchemas<any, any, any,any, any, any, any>
// }


interface MSchemaModifiers<
    Optional extends 'Req' | 'Op',
    Readonly extends 'Get' | 'Set',
    Default extends MongooseTypes | undefined>
{
    [path: string]: IMTypeModifiers<Optional, Readonly, undefined>;//MoggooseType<any,any,MongooseTSType<any>>;
}

type ExtractSchemaValidation<T, SchemaModifiers extends IMTypeModifiers<any, any, any>> = {
    [K in keyof T] : 
        T[K] extends IMTypeModifiers<any, any, any> ? 
            T[K] extends SchemaModifiers ? 
                T[K] : 'Invalid Type for Key:' & K
            : T[K] extends Record<string, any> ?
                // Recurses here.
            : 'Invalid type.'
}

// Require an extraction routine, to recusively extract referances.
// I think be better to do this one get the major iteration pattern working.
// Model-CollectionName
// type ModelsRefMap<RefSchema extends Record<string, RefMap extends Record<string, Record<keyof RefSchema> = Record<string, RefMap<>>

// interface RefMap<ModelsRefMap extends Record<string, RefMap<any>>> extends RefMapBase, extends Record<string, Record<string,keyof ModelsRefMap>> 
// {

// }

// interface RefMapBase
// {

// }

// const testings : ModelsRefMap = {
//     col1 : 
// }





type SchemaTypeID<ID extends IMongooseTSType<any,'T','P'> & IMTypeModifiers<'Req', 'Set', undefined>> = ID

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
interface IMongooseSchemas<
    Id extends SchemaTypeID<any>,
    Mod extends IMTypeModifiersRecord<any, 'Set', undefined, undefined>,
    ModRef extends IMTypeModifiersRecord<any, 'Set', undefined, any>,
    NonOpReadDefault extends IMTypeModifiersRecord<'Req', 'Get', undefined, undefined>,
    NonOpROptional extends IMTypeModifiersRecord<'Req', 'Get', any, undefined>,
    NDefault extends IMTypeModifiersRecord<'Op', any, MongooseTypes, undefined>,
    NeastedSchemas extends IMongoosePartialSchemaRecord<any, any, any, any, any, any>
    > extends IMongoosePartialSchema<Mod, ModRef, NonOpReadDefault, NonOpROptional, NDefault, NeastedSchemas>
{
    __Name : string // This is a default name, that can be used for the model, which can be overidden by the model.
    // The question is how would you update the referance were there are mutiple instances..
    // We would require to have an abstract list of model names, however, for typings, the name of the model,
    // is actually in consiquential, because we tie nothing to the name..
    // The problem is for runtime information, because one needs to create a new schema, with a new name, were the referance
    // is abstracted away.
    // the only way one is cappable of doing that is, the name needs to be looked up in a dictionary under and alias name.
    // RefModelName, when a new instance of Schema is create the default value would be used for each,
    // or it can be overidden with a new list.
    // Yes so each schema.
    // Which means one needs a set of model maps..
    // were for single name instance model, 
    // to simplfy things I am just going to use a string right now.
    __Id : Id
}

type IMongoosePartialSchemaRecord<
Mod extends IMTypeModifiersRecord<any, 'Set', undefined, undefined>,
ModRef extends IMTypeModifiersRecord<any, 'Set', undefined, any>,
NonOpReadDefault extends IMTypeModifiersRecord<'Req', 'Get', undefined, undefined>,
NonOpROptional extends IMTypeModifiersRecord<'Req', 'Get', any, undefined>,
NDefault extends IMTypeModifiersRecord<'Op', any, MongooseTypes, undefined>,
NeastedSchemas extends IMongoosePartialSchemaRecord<any, any, any, any, any, any>
> = Record<string, IMongoosePartialSchema<Mod, ModRef, NonOpReadDefault, NonOpROptional, NDefault, NeastedSchemas>>

interface IMongoosePartialSchema<
    Mod extends IMTypeModifiersRecord<any, 'Set', undefined, undefined>,
    ModRef extends IMTypeModifiersRecord<any, 'Set', undefined, any> | undefined,
    NonOpReadDefault extends IMTypeModifiersRecord<'Req', 'Get', undefined, undefined> | Record<never, never>,
    NonOpROptional extends IMTypeModifiersRecord<'Req', 'Get', any, undefined> | Record<never, never>,
    NDefault extends IMTypeModifiersRecord<'Op', any, MongooseTypes, undefined> | Record<never, never>,
    NeastedSchemas extends IMongoosePartialSchemaRecord<any, any, any, any, any, any>
    >
{
    __Mod : Mod
    __ModRef : ModRef
    __NonOpReadDefault : NonOpReadDefault
    __NonOpROptional : NonOpROptional
    __NDefault : NDefault
    __NeastedSchema : NeastedSchemas
}

// Test the assume structure of the schema.
type testSchema = IMongoosePartialSchema<{},{},{},{},{},{neasted : IMongoosePartialSchema<{a : IMongooseTSType<''> & IMTypeModifiers<"Op","Set",undefined>},{},{},{},{},{neasted : IMongooseSchemas<{_id:IMongooseTSType<''> & IMTypeModifiers<"Req","Set", undefined>},{a : IMongooseTSType<''> & IMTypeModifiers<"Op","Set",undefined>},{},{},{},{},{}>}>}>

/*
var numberSchema = new Schema({
  integerOnly: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i'
  }
});

var Number = mongoose.model('Number', numberSchema);

var doc = new Number();
doc.integerOnly = 2.001;
doc.integerOnly; // 2
doc.i; // 2
doc.i = 3.001;
doc.integerOnly; // 3
doc.i; // 3
*/


// I will have to figure out the defaults, because there seems to be a typescript bug of stores.
// Which is a problem. Ask peire see if he has any ideas, lets press on with the other things.
class MSchema<Id extends SchemaTypeID<any>,
Mod extends IMTypeModifiersRecord<any, 'Set', undefined, undefined>,
ModRef extends IMTypeModifiersRecord<any, 'Set', undefined, any>,
NonOpReadDefault extends IMTypeModifiersRecord<'Req', 'Get', undefined, undefined>,
NonOpROptional extends IMTypeModifiersRecord<'Req', 'Get', any, undefined>,
NDefault extends IMTypeModifiersRecord<'Op', any, MongooseTypes, undefined>,
NeastedSchemas extends IMongoosePartialSchemaRecord<any, any, any, any, any, any>>
implements IMongooseSchemas<Id, Mod, ModRef, NonOpReadDefault, NonOpROptional, NDefault, NeastedSchemas>, extends Schema
{
    constructor(
        public __Name : string,
        public __Id : Id,
        public __Mod : Mod ,
        public __ModRef : ModRef,
        public __NonOpReadDefault : NonOpReadDefault,
        public __NonOpROptional : NonOpROptional,
        public __NDefault : NDefault,
        public __NeastedSchema : NeastedSchemas,
        public options : SchemaOptions | Record<string,never>
    )
    {
        super({id:__Id, 
            ...__Mod as any,
            ...__ModRef as any,
            ...__NonOpReadDefault as any,
            ...__NonOpROptional as any,
            ...__NDefault as any,
            ...__NeastedSchema as any
        }, options)

    }
}

// const newSchema = new MSchema({}, {},{},{},{},{},{},{})
// Partial Schema, which still needs to refect the id,
// but that should be done by linking it to the base parent schema, which defines some base concepts.
class MSchemaPartial<BaseSchema extends MSchema<any, any, any, any, any, any, any>,
Mod extends IMTypeModifiersRecord<any, 'Set', undefined, undefined>,
ModRef extends IMTypeModifiersRecord<any, 'Set', undefined, any>,
NonOpReadDefault extends IMTypeModifiersRecord<'Req', 'Get', undefined, undefined>,
NonOpROptional extends IMTypeModifiersRecord<'Req', 'Get', any, undefined>,
NDefault extends IMTypeModifiersRecord<'Op', any, MongooseTypes, undefined>,
NeastedSchemas extends IMongoosePartialSchemaRecord<any, any, any, any, any, any>>
implements IMongooseSchemas<BaseSchema['__Id'], Mod, ModRef, NonOpReadDefault, NonOpROptional, NDefault, NeastedSchemas>, extends Schema
{
    constructor(
        public baseSchema : BaseSchema,
        public __Mod : Mod,
        public __ModRef : ModRef,
        public __NonOpReadDefault : NonOpReadDefault,
        public __NonOpROptional : NonOpROptional,
        public __NDefault : NDefault,
        public __NeastedSchema : NeastedSchemas,
        public options : SchemaOptions,
        public __Id : BaseSchema['__Id'] = baseSchema['__Id'],
        public __Name : BaseSchema['__Name']
    )
    {
        super({
            ...__Mod as any,
            ...__ModRef as any,
            ...__NonOpReadDefault as any,
            ...__NonOpROptional as any,
            ...__NDefault as any,
            ...__NeastedSchema as any
        }, options)

    }
}

interface ObjectId extends String
{
}

type InputTypeFormat<
OptionalConstraints extends 'Req' | 'Op', 
ReadonlyConstraints extends 'Get' | 'Set',
DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined
> = 
IMongooseTSType<any,any,any> & IMTypeModifiersWithNeastedConstraints<OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>;

//type RecordInputTypeFormat<T extends IMongooseTSType<any,any,any> & IMTypeModifiers<any,any,any,any>> = IMTypeModifiersRecord<>;
type RecordInputTypeFormat<
OptionalConstraints extends 'Req' | 'Op', 
ReadonlyConstraints extends 'Get' | 'Set',
DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined> = 
IMTypeModifiersRecord<OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>;



type ArrayInputTypeFormat = {w: InputTypeFormat<any, any, any, any>};
type RefInputTypeFormat = {w: IMongooseSchemas<any,any,any,any,any,any,any>}

type ArrayTypes = RecordInputTypeFormat<any, any, any, any> | ArrayInputTypeFormat | RefInputTypeFormat;

type TsTypesPrimatives = boolean | number | string | Date;  // this should actually be the IMongooseTsType constaint.
type TsHybridTypesFormat = TsTypesPrimatives |
RecordInputTypeFormat<any, any, any, any> | 
ArrayInputTypeFormat | 
RefInputTypeFormat | 
{w:IMongoosePartialSchema<any, any, any, any, any, any>}

type ID = 'T' |'O' | 'A' | 'R' | 'S' | 'N' | 'J'
type InputForm = 'P' | 'W'

interface IMongooseTSType<T extends TsHybridTypesFormat, I extends ID = 'T', F extends InputForm = 'P'>
{
    __tsType : T;   // Mostly everything has a tsType so it is here by default.
    __ID: I;
    __InputForm : F;
}

type MongooseTypePrimative<T extends TsTypesPrimatives,
Optional extends 'Req' | 'Op',
Readonly extends 'Get' | 'Set',
Default extends T | undefined,
I extends ID = 'T', F extends InputForm = 'P', 
> = IMongooseTSType<T, I, F> & IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default>



// There are two types of arrays Primatives and Objects or Arrays of Arrays.
type MongooseTypeArray<T extends ArrayTypes,
Optional extends 'Req' | 'Op',
Readonly extends 'Get' | 'Set',
Default extends Array<any> | undefined,
OptionalConstraints extends 'Req' | 'Op', 
ReadonlyConstraints extends 'Get' | 'Set',
DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
InputForm extends 'P' |'W' = 'W'
> = IMongooseTSType<T, 'A', InputForm> & IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default, undefined, 
OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>

// type MongooseTypeObject<T extends RecordInputTypeFormat,
// Optional extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// RefType extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined,
// OptionalConstraints extends 'Req' | 'Op', 
// ReadonlyConstraints extends 'Get' | 'Set',
// RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined
// > =
//  IMongooseTSType<T, 'O', 'W'> & 
// IMTypeModifiersWithNeastedConstraints<Optional, Readonly, undefined, RefType, OptionalConstraints, ReadonlyConstraints, undefined, RefTypeConstraints>


type MongooseTypeRef<Ref extends TsTypesPrimatives, RefImpl extends IMongooseSchemas<any, any, any, any, any, any, any>,
Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends Array<any> | undefined
> = IMongooseTSType<Ref, 'J', 'W'> & IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default, RefImpl>


// Hybrid type, since we don't want to use the extends keyword, to check for the differance in structure between
// a schema and and just a plain type. 
 

//type MTypes = MBoolean | MNumber | MString | MDate | MObjectId | MBuffer | MArray<any> | MMixed;

export type Ref<RefId, RefImplem> = {
    RefId : RefId,
    RefImplem : RefImplem
}

// New set of Primatives

type MObjectId<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends boolean | undefined> = 
MongooseTypePrimative<string, 'Req', 'Set', undefined> & Schema.Types.ObjectId;

type MBoolean<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends boolean | undefined> = 
MongooseTypePrimative<boolean, Optional, Readonly, Default> & Schema.Types.Boolean;

type MNumber<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends number | undefined> = 
MongooseTypePrimative<number, Optional, Readonly, Default> & Schema.Types.Number;

type MString<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends string | undefined> = 
MongooseTypePrimative<string, Optional, Readonly, Default> & Schema.Types.String;

type MDate<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends Date | undefined> = 
MongooseTypePrimative<Date, Optional, Readonly, Default> & Schema.Types.Date;

//type MObjectId<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set'> = 
//MongooseTypePrimative<string, Optional, Readonly, undefined> & Schema.Types.ObjectId;

// Potentially we can make the ts type for the buffer the true node.js type instead of string.
type MBuffer<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set'> = 
MongooseTypePrimative<string, Optional, Readonly, undefined> & Schema.Types.Buffer;

type MArray<Arr extends ArrayTypes, Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set',
Default extends [] | undefined,
OptionalConstraints extends 'Req' | 'Op', 
ReadonlyConstraints extends 'Get' | 'Set',
DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
InputForm extends 'P' | 'W' = 'W'
> = 
MongooseTypeArray<Arr, Optional, Readonly, Default, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints, InputForm> & Schema.Types.Array;

type MObject<
Items extends IMTypeModifiersRecord<
OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints,
OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
Optional extends 'Req' | 'Op',
Readonly extends 'Get' | 'Set',
Default extends Record<string, TsTypesPrimatives> | undefined,
RefType extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined,
OptionalConstraints extends 'Req' | 'Op', 
ReadonlyConstraints extends 'Get' | 'Set',
DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined
> = 
IMongooseTSType<Items, 'O', 'P'> & 
IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default, RefType, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>

type MRef<Ref extends TsTypesPrimatives, RefType extends IMongooseSchemas<any,any,any,any,any,any,any>,
Optional extends 'Req' | 'Op',
Readonly extends 'Get' | 'Set'> = 
MongooseTypeRef<Ref, RefType, Optional, Readonly, undefined>;


// Primatives
//type MBoolean = MongooseTSType<boolean> & Schema.Types.Boolean
//type MNumber = MongooseTSType<number> & Schema.Types.Number
//type MString = MongooseTSType<string> & Schema.Types.String
//type MDate = MongooseTSType<string | number> & Schema.Types.Date
//type MObjectId = MongooseTSType<ObjectId> & Schema.Types.ObjectId
//type MBuffer = MongooseTSType<string> & Schema.Types.Buffer
//type MArray<T> = MongooseTSType<T, 'A', 'W'> & Schema.Types.Array
//type MObject<T> = MongooseTSType<T, 'O'>
//type MRef<RefId extends MTypes, RefImplem extends MSchema<any>> = MongooseTSType<Ref<{w:RefId}, {w:RefImplem}>, 'R','W'>
//type MDecimal128 = MongooseTSType<number> & Schema.Types.Decimal128


//type MMixed = MongooseTSType<ObjectId> & Schema.Types.Mixed
/*type MMixed = MongooseTSType<ObjectId> & Schema.Types.Embedded
type MMixed = MongooseTSType<ObjectId> & Schema.Types.DocumentArray
type MMixed = MongooseTSType<ObjectId> & Schema.Types.Decimal128
*/
//type MongooseArrayType = MBoolean | MNumber | MString | MDate | MObjectId | MBuffer | MDecimal128 | MRef<any, any> | MArray<any> | MObject<any>;

type SchemaOptions = {
    autoIndex: any,
    bufferCommands: any,
    capped: any,
    collection: any,
    id: any,
    _id: any,
    minimize: any,
    read: any,
    writeConcern: any,
    safe: any,
    shardKey: any,
    strict: any,
    strictQuery: any,
    toJSON: any,
    toObject: any,
    typeKey: any,
    validateBeforeSave: any,
    versionKey: any,
    collation: any,
    skipVersioning: any,
    timestamps: any,
    selectPopulatedPaths: any,
    storeSubdocValidationError: any,
}

type SchemaFieldOptionsAll = {
    select?: boolean,
    validate?: Function, 
    get?: Function,
    set?: Function, 
    alias? : string
}

type MBaseSchema = Schema.Types.Boolean;
/*Schema.Types.Array | Schema.Types.Boolean | Schema.Types.Buffer | Schema.Types.Date | Schema.Types.Decimal128 |
Schema.Types.DocumentArray | Schema.Types.Embedded | Schema.Types.Mixed | Schema.Types.Number | Schema.Types.ObjectId | Schema.Types.String
// */
// type MongooseTypeOptions<B, Options> = ({type : B} & {[i:string] : Options})
 
// type MoggooseType<B, E, Options> = E | MongooseTypeOptions<E, Options> 

function MongooseTypes<TT, Options extends Record<string,any> | undefined>(schemaType : TT, options : Options, useTypeFormat: boolean = false) : any
{
//     if(options['required'] == 'Req')
//         options['required'] = true;

//     if(options['default'])

    if (options || useTypeFormat)
    {
        // this format in mongoose 3, will results in the cohersion failing,
        // mongoose neasted objects also don't support the concept of optional.
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

//const MTypeBoolean = MTypes.Boolean({required : 'Req', default : true});

//type MTypeBoolean = typeof MTypeBoolean;

// I want someone to be able to type MTypes.Array any where generically,
// but there are require filters that need to limit what is inside each of the MTypeArrays,
// so how do I go about this, because MTypes.Array(), needs to be able to pull the context
// from some were, which is a problem, right now I can constaint the patter of usuage,
// which should be fine! But means I need to constaint the internal recusive shape of the pattern
// when there is a requirement for undefined or not..
// I should be able to do this..

class MTypeArray {

    // static default <ArrayItems extends InputTypeFormat,
    // Required extends 'Req' | 'Op' = 'Req', 
    // Default extends ([] | undefined) = [], 
    // ReadOnly extends 'Get' | 'Set' = 'Get'>
    // (item: ArrayItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
    // : MArray<{w:ArrayItems}, Required, ReadOnly, Default, 'W'>;

    // Still require an array of an object
    // Still require an array of schema.
    // also need to check the scehma for mutiple primative types that are consequtive.

    static default <
    OptionalConstraints extends 'Req' | 'Op', 
    ReadonlyConstraints extends 'Get' | 'Set',
    DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
    RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
    ArrayItems extends IMTypeModifiersRecord<OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
    Required extends 'Req' | 'Op' = 'Op', 
    Default extends ([] | undefined) = [], 
    ReadOnly extends 'Get' | 'Set' = 'Set'>
    (item: ArrayItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
    : MArray<ArrayItems, Required, ReadOnly, Default, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints, 'P'>

    static default <
    OptionalConstraints extends 'Req' | 'Op', 
    ReadonlyConstraints extends 'Get' | 'Set',
    DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
    RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
    ArrayItems extends InputTypeFormat<OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
    Required extends 'Req' | 'Op' = 'Op', 
    Default extends ([] | undefined) = [], 
    ReadOnly extends 'Get' | 'Set' = 'Set'
    >

    (item: ArrayItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
    : MArray<{w:ArrayItems}, Required, ReadOnly, Default, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints, 'W'>

    static default(items : any, options?: {required?: any, readonly?: any, default?: any}) : never & 'Invalid Type Inputs'
    {
        return MongooseTypes(items, options) as never;
    }
}


class MTypeObject {
    // Required to pass tought in an inverse way the constraints, into the return type
    // to ensure that all the parameters match...
    // mm how do I do this.
    // There are the requirements of this document, which need to be met.
    // So one of the ways, I can think of doing this is that mixing in the constaint for lower level rquire ment,
    // but there is no such thing as higher or lower qualifying requirement.
    // The only other way is for me to implement auxilary fields that can pass tought constraints,
    // which are just there for 
    static default <
    Required extends 'Req' | 'Op', 
    ReadOnly extends 'Get' | 'Set',
    Default extends Record<string, TsTypesPrimatives> | undefined,
    RefType extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
    OptionalConstraints extends 'Req' | 'Op', 
    ReadonlyConstraints extends 'Get' | 'Set',
    DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
    RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
    ObjectItems extends IMTypeModifiersRecord<
    OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints, 
    OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
    >(object: ObjectItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
    : 
    MObject<ObjectItems, Required, ReadOnly, Default, RefType, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>

    static default(object : any, options?: {required?: any, readonly?: any, default?: any}) : never & 'Invalid Type Inputs'
    {
        return MongooseTypes(object, options, true) as never;
    }
}


const MTypes = {

    ObjectId : () => mongoose.Schema.Types.ObjectId as any as IMongooseTSType<string,'T','P'> & IMTypeModifiers<'Req', 'Set', undefined>,

    Boolean : <Required extends 'Req' | 'Op' = 'Op', 
            Default extends (boolean | undefined) = undefined, 
            ReadOnly extends 'Get' | 'Set' = 'Set'>
        (options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
             => MongooseTypes(Schema.Types.Boolean, options) as MBoolean<Required, ReadOnly, Default>,

    
    Number : <Required extends 'Req' | 'Op' = 'Op', 
            Default extends (number | undefined) = undefined, 
            ReadOnly extends 'Get' | 'Set' = 'Set'>
        (options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
         => MongooseTypes(Schema.Types.Number, options) as MNumber<Required, ReadOnly, Default>,

    String : <Required extends 'Req' | 'Op' = 'Op', 
            Default extends (string | undefined) = undefined, 
            ReadOnly extends 'Get' | 'Set' = 'Set'>
        (options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
         => MongooseTypes(Schema.Types.String, options) as MString<Required, ReadOnly, Default>,
         
    Date : <Required extends 'Req' | 'Op' = 'Op', 
            Default extends (Date | undefined) = undefined, 
            ReadOnly extends 'Get' | 'Set' = 'Set'>
        (options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
        => MongooseTypes(Schema.Types.Date, options) as MDate<Required, ReadOnly, Default>,

    Array : MTypeArray.default,
    Object : MTypeObject.default,
    Record : <Required extends 'Req' | 'Op', 
    ReadOnly extends 'Get' | 'Set',
    Default extends undefined,
    RefType extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
    OptionalConstraints extends 'Req' | 'Op', 
    ReadonlyConstraints extends 'Get' | 'Set',
    DefaultConstraints extends TsTypesPrimatives | Array<any> | undefined,
    RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
    Record extends IMTypeModifiersRecord<OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>>(record : Record)
    => record as any as IMongooseTSType<Record, 'R', 'P'> & 
    IMTypeModifiersWithNeastedConstraints<Required, ReadOnly, Default, RefType, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
    

    Schema :  <NeastedSchemas extends IMongoosePartialSchema<any, any, any, any, any, any>,
    Required extends 'Req' | 'Op' = 'Op', 
    ReadOnly extends 'Get' | 'Set' = 'Set'
    >
    (object : NeastedSchemas, options? : {required?: Required, readonly?: ReadOnly, default?: never} & SchemaFieldOptionsAll)
     => MongooseTypes(object, options) as IMongooseTSType<{w:NeastedSchemas}, 'S', 'W'> & 
    IMTypeModifiersWithNeastedConstraints<Required, ReadOnly, undefined, undefined, any, any, any, any>

    ,
    //MongooseTypes(Schema.Types.Boolean, options) as MBuffer,// MoggooseType<Schema.Types.Buffer, Options, MBuffer>,

    Ref:<MSchema extends IMongooseSchemas<any, any, any, any, any, any, any>,
    Required extends 'Req' | 'Op' = 'Op', 
    ReadOnly extends 'Get' | 'Set' = 'Set'
    >(refSchema: MSchema, options? : {required?: Required, readonly?: ReadOnly, default?: never} & SchemaFieldOptionsAll)
    => MongooseTypes(refSchema['__Id'], { options , ref: refSchema['__Name'] }) as any as MRef<MSchema['__Id'], MSchema, Required, ReadOnly>
};



// naturally nest documents....
// Map, is basically a document. and an Array

//Record<string, (IMongooseTSType<any,any,any> & IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default, RefType, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints> ) |


const mMumberSchema = new MSchema('MyCusCollection', MTypes.ObjectId(),{a : MTypes.Number({required:'Req', }), b: MTypes.Boolean() , c: MTypes.String(), d: MTypes.Date(),
e: MTypes.Array(MTypes.Number()), f: MTypes.Array({z:MTypes.Number(), y: MTypes.Boolean()}), g: MTypes.Record({})
},{},{},{},{},{},{});

type ExtractRequiredOptionalMod<Mod extends IMongooseTSType<any,any,any> & IMTypeModifiersWithNeastedConstraints<any,any,any,any>, T> = ({
    'Req' : T 
    'Op' : T | undefined
})[Mod['__Optional']];

type ExtractTSTYpe<Mod extends IMongooseTSType<any,any,any> & IMTypeModifiersWithNeastedConstraints<any,any,any,any>> = Mod['__tsType'];

type ExtractInputForm<
Mod extends IMongooseTSType<any,any,any> & IMTypeModifiersWithNeastedConstraints<any,any,any,any>,
 T extends any> = ({
    'P' : T,
    'W' : T['w']
})[Mod['__InputForm']];

// We don't have to handle readonly, because we have broken everything up upfront
// when defining the schema.

type ExtractSchemaRecord<T extends IMTypeModifiersRecord<any,any,any,any>> = {
    [P in keyof T] : 
    ({
        'T' : ExtractType<T[P]>,
        'O' : ExtractRequiredOptionalMod<T[P], ExtractSchemaRecord<T[P]['__tsType']>>,
        'A' : ExtractRequiredOptionalMod<T[P], ExtractInputForm<T[P], ExtractSchemaRecord<T[P]['__tsType']>>>,
        'J' : 'Invalid Option here'
        'R' : ExtractSchemaRecord<T[P]['__tsType']>
        'S' : 'Invalid Option Here'
    })[T[P]['__ID']]
}




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