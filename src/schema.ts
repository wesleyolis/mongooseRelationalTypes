//import {ExtractArrayItems, itemElements, KeyInPathsAtDepthKey} from './index'
import * as mongoose from 'mongoose';
//import {Schema, SchemaDefinition, SchemaTypeOpts, SchemaType, Types} from 'mongoose'
//import {If, ObjectHasKey, ObjectOptional, ObjectOmit, ObjectClean, Bool, StringOmit, StringEq, ObjectOverwrite, Option} from './tstypelevel';
//import { StringContains, ObjectDiff } from './tstypelevel';
//import { Module } from 'module';
//import { ENGINE_METHOD_PKEY_METHS } from 'constants';

/*
--------------------------
Helpers Routines
--------------------------
*/

/*
RecusivePick using extends, which using type interigation.
*/
//const ___CPTSymbol = Symbol()

type ICPT<T> = {
    
    ___CPTSymbol : T
    //[___CPTSymbol] : T
}

type RecusivePick<Object extends Record<string, any>,
Condition extends Record<string, any> | string | number | boolean, 
StopCondition extends Record<string, any> | ICPT<any> | undefined = undefined,
StopConditionEnhanced = string | boolean | number | Date | StopCondition> =
Pick<
{
    [K in keyof Object]
        : Object[K] extends StopConditionEnhanced ? Object[K]
            : Object[K] extends Array<infer A>? RecusivePick<A, Condition, StopCondition> []
            : Object[K] extends Array<infer A> | undefined ? RecusivePick<A, Condition, StopCondition> [] | undefined
            : RecusivePick<Object[K], Condition, StopCondition>
}
,{
    [K in keyof Object] 
        : Object[K] extends StopConditionEnhanced ? (Object[K] extends Condition ? K : never) 
            : Object[K] extends Record<string,never> ? never 
            : Object[K] extends Array<Record<string,never>> ? never 
            : Object[K] extends Array<Record<string,never>> | undefined ? never 
            : K // Only want this key if the object is not empty
}[keyof Object]>

/*
recusivePick using HasKeyValue, which should be fasters, but is more complex and not as generic, because
it will need to use
*/

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


// DefaultsOptional = Optional = false & Readonly = false & Default = true    //  these would typically be optional.
// ReadOnlyRequired = Optional = false & ReadOnly = true & Default = false
// ReadOnlyOptional = Optional = false & ReadOnly = true & Default = true
// Default          = Optional = true & ReadOnly = any & Default = false wtf is going on here I need to take a relook at this.


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


/////////////////////////////////////////////////////////////////////////////////////////////



// Optional Field, with default becomes a required field, because of the by nature of the database fill it in.
// Field with default = true, becomes required field naturally by the nature of things.
// Required Field with default remains a Required field.
// Therefore there is no point in allow the permutation of this, but still have to take into account
// readonly..
// InvalidDBHack = Optional, ReadOnly = any & Default = true    // As it is always going to be there, disable this combination.
// for results become required, but for record creation they can still be overidden,
// for update non readonly=false, can be updated.
// for update readonly =true, can't be updated.
// => Required, readonly=any, default = true.


// NewRecord    A = Optional, Readonly = false, default = true          -- ModOptionalDefault                  // implicity become required in the results, but for record creatin must be able to overid
// +            = Optional, Readonly = false, default = false           -- ModOptionalNoDefault                 // Manually Required to be input. 
// +  Partial<A>= Partial<Required, Readonly = false, default = true>   -- Partial<ModRequiredDefault>      same as A  // Optional can be input, same in results as now.
// +            = Required, Readonly = false, default = false           -- ModRequiredNoDefault                // Manual Required to be input      
// +            = Partial<Requied, Readonly = true, default = true>     -- Partial<RequiredReadOnlyDefault>
// +            = Required, Readonly = true, default = false            -- RequiredReadonlyNoDefault            // Must be filled in
// +            = Optional, Readonly = true, default = true             -- OptionalReadonlyDefault              // implicity become required in the results, by for record creating
                                                                                                                // Must be able to overide it.
// +            = Optional, Readonly = true, default = false            -- OptionalReadonlyNoDefault            // Must be filled in.


// Update = Partial<Required, Readonly = false, default=true>                   -- Partial<ModRequiredDefault>
//          + Partial<Required, Readonly = false, default=false>                -- Partial<ModRequiredNoDefault>
//          + Optional, Readonly = false, default=true    // Present for  Mod,  --ModOptionalDefault
//          + Optional, Readonly = false, default=false    // Set ModOp,        --ModOptionalNoDefault

// Results = Required, Readonly = false, default=true/false,        //-- ModRequiredDefault + ModRequiredNoDefault
//       + Required<Optional, Readonly = false, default=true>       //-- RequiredRecord<ModOptionalDefault>
//          + Optional, Readonly = false, default=false             //-- ModOptionalNoDefault
//          + Required, Readonly = true, default=true/false,        //-- RequiredReadOnlyDefault + RequiredReadonlyNoDefault
//          + Optional, Readonly = true, default=false              //-- OptionalReadonlyNoDefault
//       + Required<Optional, Readonly = true, default=true>        //-- RequiredRecord<OptionalReadonlyDefault>

// To summaries the following set of information are required
// ID:
// ModRequiredDefault
// ModRequiredNoDefault
// ModOptionalDefault
// ModOptionalNoDefault same in all 3.
// RequiredReadOnlyDefault
// RequiredReadonlyNoDefault
// OptionalReadonlyNoDefault same in 2
// OptionalReadonlyDefault
//-----------------
// ModRef, is a results field only, thus everything in the join table, cant be updated.
//
//= Required/Optional, readonly= true/false, default=false.      -- ModRequiredDefault + ModRequiredNoDefault +
// Disallow the combination of Optional/default =true, not a valid permutation.
// 

////////////////////////////////////////////////////////////////////////////////////////////////////

// type InputTypeFormat<
// OptionalConstraints extends 'Req' | 'Op', 
// ReadonlyConstraints extends 'Get' | 'Set',
// DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
// RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any, any,any,any,any> | undefined
// > = IMongooseShape<any, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>;

// //type RecordInputTypeFormat<T extends IMongooseTSType<any,any,any> & IMTypeModifiers<any,any,any,any>> = IMTypeModifiersRecord<>;
// type RecordInputTypeFormat<
// OptionalConstraints extends 'Req' | 'Op', 
// ReadonlyConstraints extends 'Get' | 'Set',
// DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
// RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any,any,any,any,any> | undefined> = 
// IMTypeModifiersRecord<OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>;

// type ArrayInputTypeFormat = {w: InputTypeFormat<any, any, any, any>};
// type RefInputTypeFormat = {w: IMongooseSchemas<any,any,any,any,any,any,any>}

// type ArrayTypes = RecordInputTypeFormat<any, any, any, any> | ArrayInputTypeFormat | RefInputTypeFormat;

type TsTypesPrimatives = boolean | number | string | Date; 

type ID = 'T' | 'R' | 'AR' | 'AN' | 'Ref' | 'S'

type ITSShapes = 
IShapeTSType<any> 
| IShapeContainers
| IShapeTSRef<any>
| IShapeTSSchema<any>

type IShapeContainers = IShapeTSRecord<any> | IShapeTSArrayNeasted<any> | IShapeTSArrayRecord<any>

type IShapeRefContainers = IShapeContainers | IShapeTSRef<any>;//IShapeTSSchema

type Neasted = IShapeContainers | undefined;

interface IShape<TID extends ID, TNeasted>{
    id: TID;
    neasted : TNeasted
}

interface ITSShape<T, TID extends ID> extends IShape<ID, T>
{
    __tsType: T;
    __ID: TID;
}

class Shape<TShape extends ITSShape<any, any>> implements IShape<TShape['__ID'], TShape['neasted'] >
{
    constructor(public id: TShape['__ID'], public neasted : TShape['neasted'] | undefined = undefined)
    {
    }

    TSTypeCastUp() {
        return this as any as TShape
    }
}

type IShapeTSTypeConstraint = IShapeTSType<IShapeTSTypeExtends>;

type IShapeTSTypeExtends = boolean | number | string | Date;

interface IShapeTSType<T extends IShapeTSTypeExtends> extends ITSShape<T, 'T'> {
    __tsType : T;
}

function ShapeTSType<T extends IShapeTSTypeExtends>()
{
    return new Shape<IShapeTSType<T>>('T').TSTypeCastUp();
}

 
type IShapeRecordExtends = Record<string, ITSShapes> | null

interface IShapeTSRecord<T extends IShapeRecordExtends> extends ITSShape<T, 'R'>
{
    __tsType : T;
}

function ShapeTSRecord<T extends IShapeRecordExtends>(rec : T)
{
    return new Shape<IShapeTSRecord<T>>('R', rec).TSTypeCastUp();
}

type IShapeArrayNeastedExtends = IShapeTSType<any> | IShapeTSRef<any> | IShapeTSSchema<any> | IShapeTSArrayNeasted<any> | IShapeTSArrayRecord<any>;

interface IShapeTSArrayNeasted<T extends IShapeArrayNeastedExtends> extends ITSShape<any, 'AN'>
{
    __tsType : {w:T};
}

function ShapeTSArray<T extends IShapeArrayNeastedExtends>(record : T)
{
    return new Shape<IShapeTSArrayNeasted<T>>('AN', record).TSTypeCastUp();
}

type IShapeTSArrayRecordExtends = Record<string, ITSShapes> | null;

interface IShapeTSArrayRecord<T extends IShapeTSArrayRecordExtends> extends ITSShape<T, 'AR'>
{
    __tsType : T;
}

function ShapeTSArrayRecord<T extends IShapeTSArrayRecordExtends>(record : T)
{
    return new Shape<IShapeTSArrayRecord<T>>('AR', record).TSTypeCastUp();
}

interface IShapeTSRef<T extends TsTypesPrimatives> extends ITSShape<T,'Ref'>
{
    __tsType : T;
}

// Going to have to put in some work here.. as number capture, doesn't reveal
// the runtime type, which is what previously happened.
// The right hand side of the schema wil be captured on the right.
// lets just get this all working.
function ShapeTSRef<T extends TsTypesPrimatives>()
{
    return new Shape<IShapeTSRef<T>>('Ref').TSTypeCastUp();
}

interface IShapeTSSchema<T extends ISchemas<any, any, any, any, any, any, any, any, any, any, any, any>>
extends ITSShape<T, 'S'> 
{
    __tsType : T;
}

function ShapeTSSchema<T extends ISchemas<any, any, any, any, any, any, any, any, any, any, any, any>>()
{
    return new Shape<IShapeTSSchema<T>>('S').TSTypeCastUp();
}

type GenAdaptersSchemaOptions = Record<GenAdapters, Record<string, any>>;

type GenAdaptersFieldTypesOptions = Record<GenAdapters, Record<string, any>>;

type IFieldDef<Options extends GenAdaptersFieldTypesOptions> = 
IShape<any,any> & IMTypeModifiers<any, any, any, any, any, any, any, any, any, any> & Options;

type IteratorSchemaContext = {
    schema : ISchema<any, any, any, any, any, any, any, any, any, any, any>,
    parentSchema : ISchema<any, any, any, any, any, any, any, any, any, any, any> | undefined,
    rootSchema : ISchema<any, any, any, any, any, any, any, any, any, any, any> | undefined,
    fieldKeys: string [] // May want simple boolean to decided on things.
}

type IteratorFieldContext = {
    schema : IteratorSchemaContext
    fields: {
        field : IFieldDef<any>,
        parentField : IFieldDef<any>,
        fieldKeys: string []
    }
}

type GenOptionsPrimatives = boolean | number | string | Function | undefined;

interface IGenAdapterConfig<SchemaAnotationOptions extends Record<string, GenOptionsPrimatives>, FieldAnotationOptions extends Record<string, GenOptionsPrimatives>> {
    
    schemaTransform: (        
        anotationOptions: SchemaAnotationOptions,
        iteratorContext: IteratorSchemaContext,
        schemasContents: string | undefined
    ) => string,
    fieldTransform:(
        key: string,
        anotationOptions: FieldAnotationOptions,
        iteratorContext: IteratorFieldContext,
        neastedFieldTransformContents: string | undefined
    ) => string
}

interface ITSGenAdapterConfig<
SchemaAnontationOptions extends Record<string, GenOptionsPrimatives>,
FieldAnontationOptions extends Record<string, GenOptionsPrimatives>
> extends IGenAdapterConfig<SchemaAnontationOptions, FieldAnontationOptions> {
    __tsSchemaOptions: SchemaAnontationOptions,
    __tsFieldOptions: FieldAnontationOptions,
}

type GenAdapterConfiguration = Record<string, IGenAdapterConfig<any, any>>

// The schemaOptions need to be defined as typesript information and not as runtime informaiton.
// This means that I am going to need a helper function, which takes in the runtime information
// and then takes on some typescript constraints __tsTheOption anme.

function NewAdapterConfiguration<
SchemaOptions extends Record<string, GenOptionsPrimatives>,
FieldOptions extends Record<string, GenOptionsPrimatives>>(config : IGenAdapterConfig<SchemaOptions, FieldOptions>)
{
    return config as ITSGenAdapterConfig<SchemaOptions, FieldOptions>
}

// Typescript seem to not be able to validate function signatures
// not much we can do about that..
type ExtractGenAdapterConfShape<T extends Record<string,any>> = {
    [K in keyof T] : ITSGenAdapterConfig<
    T[K]['__tsSchemaOptions'] extends unknown ? Record<string,never> : T[K]['__tsSchemaOptions'],
    T[K]['__tsFieldOptions'] extends unknown ? Record<string,never> : T[K]['__tsFieldOptions']
    >
}

// type MapRuntimeToTSType = {
//     'Boolean' : boolean,
//     'Number' : number,
//     'String' : string,
//     'Date' : Date
//     'R' : Record
//     'AR' : Array<Record<string,any>>,
//     'A' : Array<>;

// }

type AdaptorConfigurationSchemaOptions<T extends Record<string, ITSGenAdapterConfig<any, any>>> = {
 [K in keyof T] : T[K]['__tsSchemaOptions']
}

type AdaptorConfigurationFieldOptions<T extends Record<string, ITSGenAdapterConfig<any, any>>> = {
    [K in keyof T] : T[K]['__tsFieldOptions']
}
   
class SchemaGenerator<AdaptorConfigurations extends Record<string, ITSGenAdapterConfig<any, any>>,
SchemaOptions = AdaptorConfigurationSchemaOptions<AdaptorConfigurations>,
FieldOptions = AdaptorConfigurationFieldOptions<AdaptorConfigurations>
>
{
    constructor(public adaptors : AdaptorConfigurations)
    {
    }

    Generate(adapterName : keyof AdaptorConfigurations) : string {
        return 'Not Implemented Yet'

    }
    // All the typescript type definitions, which must be define on this class, so that 
    // all the correct typing signatures will exist on the functions.

    NewSchema<
        Name extends string,
        Id extends string,
        ModRD extends ITSModifiersRecord<ITSShapes, 'Req', 'Set', any, undefined>,
        ModRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Set', undefined, undefined>,
        ModOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', any, undefined>,
        ModOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', undefined, undefined>,
        ReadRD extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', any, undefined>,
        ReadRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', undefined, undefined>,
        ReadOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
        ReadOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
        ModRef extends ITSModifiersRecord<IShapeRefContainers, any, any, any, ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>>,
        NeastedSchemas extends INeastedSchemaRecord>(
        name : Name,
        id : Id,
        modRD : ModRD,
        modRND : ModRND,
        modOD : ModOD,
        modOND : ModOND,
        readRD : ReadRD,
        readRND : ReadRND,
        readOD : ReadOD,
        readOND : ReadOND,
        modRef : ModRef,
        neastedSchemas : NeastedSchemas,
        options? : SchemaOptions)
    {
        return new Schema(name, id, modRD, modRND, modOD, modOND, readRD, readRND, readOD, readOND, modRef, neastedSchemas, options);
    }

    NewPartialSchema()
    {
        return {} as boolean
    }

    // Binding of the TSIterationPattern with, the more complex type variants.

    ObjectIdString ()
    {
        return NewModifiers(ShapeTSType<string>(), 'ObjectIdString', {} as FieldOptions);
    }

    Boolean()
    {
        return NewModifiers(ShapeTSType<boolean>(), 'Boolean', {} as FieldOptions);
    }

    Number()
    {
        return NewModifiers(ShapeTSType<number>(), 'Number', {} as FieldOptions);
    }

    String()
    {
        return NewModifiers(ShapeTSType<string>(), 'String', {} as FieldOptions);
    }

    Date()
    {
        return NewModifiers(ShapeTSType<Date>(), 'Date', {} as FieldOptions);
    }

    Record<Record extends ITSModifiersRecord<ITSShapes, any, any, any, any>>(rec : Record)
    {
        return NewModifiersWithConstraints(ShapeTSRecord(rec), 'Record', {} as FieldOptions,
        {} as ExtractRecordModfierConstraints<Record,'__Required', '__RequiredConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Readonly','__ReadonlyConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Nullable','__NullableConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Default','__DefaultConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__RefType','__RefTypeConstraints'>);
    }

    // Because types can't differentiate which method to call, there is no
    // way to capture the runtime differances, but with runTime methods with different names.

    Array<Record extends ITSShapeModifiersFunWithConstraints<any, any, any, any, any, any, any, any, any, any, IShapeArrayNeastedExtends, any>
    >(items : Record)
    {
        return NewModifiers(ShapeTSArray(items), 'ArrayNeasted', {} as FieldOptions);
    }

    ArrayRecord<Record extends ITSModifiersRecord<ITSShapes, any, any, any, any>>(items : Record)
    {
        return NewModifiersWithConstraints(ShapeTSArrayRecord(items), 'ArrayRecord', {} as FieldOptions,
        {} as ExtractRecordModfierConstraints<Record,'__Required', '__RequiredConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Readonly','__ReadonlyConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Nullable','__NullableConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Default','__DefaultConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__RefType','__RefTypeConstraints'>);
    }

    /*
    Ref:<MSchema extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any>,
    Required extends 'Req' | 'Op' = 'Op', 
    ReadOnly extends 'Get' | 'Set' = 'Set',
    >(refSchema: MSchema, options? : {required?: Required, readonly?: ReadOnly, default?: never} & SchemaFieldOptionsAll)
    => 
    MongooseTypes(refSchema['__Id'], { options , ref: refSchema['__Name'] }) 
    as any as IMongooseShape<IShapeTSRef<MSchema['__Id']>, Required, ReadOnly, never, MSchema>

    */

    // Need to limit things here to the TSContainer formats and RefType..
    // Need to take in and ID field, which I have not formulated yet
    // also needs the other schema that is needs to be referances here.
    // the Id field can be pulled from the schema, or partially schema, probably refactor this later.
    RefType<Schema extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>>
    (record : Schema)
    {
        return NewModifiersWithConstraintsAndRefType(ShapeTSRef<Schema['__Id']>(), 'RefType', {} as FieldOptions,
        {} as ExtractRecordModfierConstraints<Schema['__ModRD'],'__Required', '__RequiredConstraints'> |
                ExtractRecordModfierConstraints<Schema['__ModRND'],'__Required', '__RequiredConstraints'>,
        {} as ExtractRecordModfierConstraints<Schema['__ModOD'],'__Readonly','__ReadonlyConstraints'> |
                ExtractRecordModfierConstraints<Schema['__ModOND'],'__Readonly','__ReadonlyConstraints'>,
        undefined as undefined,
        {} as ExtractRecordModfierConstraints<Schema['__ReadRD'],'__Default','__DefaultConstraints'> | 
                ExtractRecordModfierConstraints<Schema['__ReadRND'],'__Default','__DefaultConstraints'>,
        {} as ExtractRecordModfierConstraints<Schema['__ReadOD'],'__RefType','__RefTypeConstraints'> |
                ExtractRecordModfierConstraints<Schema['__ReadOND'],'__RefType','__RefTypeConstraints'>,
        {} as Schema
        );
    }

    // At runtime, this could have been merge with the existing iteration stucture
    // It is only broken appart here for the typings.
    Schema<Record extends IMongoosePartialSchema<any, any, any, any, any, any>,
    ArrayItems extends IMongooseShape<ITSShape<any,any>, any, any, any, any>
    >(object : Record)
    {
        return NewModifiersWithConstraints(ShapeTSSchema(object), 'Schema', {} as FieldOptions,
        {} as ExtractRecordModfierConstraints<Record,'__Required', '__RequiredConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Readonly','__ReadonlyConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Nullable','__NullableConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Default','__DefaultConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__RefType','__RefTypeConstraints'>);
    }
}   



type SchemaOptions = {
    autoIndex?: any,
    bufferCommands?: any,
    capped?: any,
    collection?: any,
    id?: any,
    _id?: any,
    minimize?: any,
    read?: any,
    writeConcern?: any,
    safe?: any,
    shardKey?: any,
    strict?: any,
    strictQuery?: any,
    toJSON?: any,
    toObject?: any,
    typeKey?: any,
    validateBeforeSave?: any,
    versionKey?: any,
    collation?: any,
    skipVersioning?: any,
    timestamps?: any,
    selectPopulatedPaths?: any,
    storeSubdocValidationError?: any,
}

type SchemaFieldOptionsAll = {
    select?: boolean,
    validate?: Function, 
    get?: Function,
    set?: Function, 
    alias? : string
}


const adapter = {
    'Mongoose': NewAdapterConfiguration<SchemaOptions, SchemaFieldOptionsAll>({
    schemaTransform : {} as any,
    fieldTransform : {} as (
        key: string,
        options: SchemaFieldOptionsAll,
        iteratorContext: IteratorFieldContext,
        neastedFieldTransformContents: string | undefined
    ) => string
    })
};


const GSchema = new SchemaGenerator(adapter);

const mongooseRunTime = GSchema.Generate('Mongoose', [SchemaA]);

const schemaARight = GSchema.NewSchema('RightSchema', '', {},{},{},{},{},{},{},{},{},{});

const schemaA = GSchema.NewSchema('collectionName','', {
    a : GSchema.Boolean().Required().Nullable().Default(null).Anotations({'Mongoose':{select:true}}),
    b : GSchema.Number().Required(),
    c : GSchema.String().Required().Nullable().Default(''),
    neasted : GSchema.Record({
        nA : GSchema.Boolean().Required(),
        neasted : GSchema.Record({
            NNe : GSchema.String().Required(),
            NNf : GSchema.Number().Required()
        }).Required(),
    }).Required(),
    // The extaction forms of this are not perfect, because I assumed, its primative
    // but it is not neaasry a primative.
    arrayPrimative : GSchema.Array(GSchema.Number().Required()).Required(),
    // arrayofRecord : GSchema.Array(GSchema.Record({
    //     a : GSchema.Boolean()
    // })).Required(), Must rather use ArrayRecord
    arrayArray : GSchema.Array(GSchema.Array(GSchema.Number().Required())).Required(),
   //, arrayArrayRecord : GSchema.ArrayRecord(GSchema.Number().Required()).Required(), -- This should be Invalid.
    arrayRecord : GSchema.ArrayRecord({
        a: GSchema.Number().Required(),
        b: GSchema.Record({
            c: GSchema.Number().Required()
        }).Required(),
    }).Required()
    // arrayRecordRecord : GSchema.ArrayRecord(GSchema.Record({
    //     a: GSchema.Number().Required()
    // }).Required()).Required(),

    //refType : GSchema.RefType(schemaARight).Required()// Invalid - But not pretty to debug the message, because of the type
    // capturing.. Mabye later, could just be a name list were they are all first regsitered, so that
    // We can reduce the list name to , difficault, because would be no ways to validate things, until runtime, which not what is wanted.
},{
    //c : GSchema.Boolean().Required().Default(false), // Invalid Default false - Good
    //d : GSchema.Number().Required().Default(34), // Invalid Default false - Good
    e : GSchema.Number().Required().Nullable().Anotations({'Mongoose' : {}}),
    neasted : GSchema.Record({
        NNa : GSchema.Boolean().Required()
    }).Required()  // Any Record
},{

},{},{},{},{},{},{
    //primative : GSchema.Boolean(),
    refType : GSchema.RefType(schemaARight).Required(),
    neasted : GSchema.Record({
        //Na : GSchema.Number().Required()
        Nb : GSchema.RefType(schemaARight).Required()
    }).Required()
},{},{Mongoose:{collation:'',}});

const Neasted__ = GSchema.Record({
    Na : GSchema.Number().Required(),
    Nb : GSchema.RefType(schemaARight).Required()
}).Required();


type res = typeof Neasted__['__RefTypeConstraints'];



type EROM<Mod extends ITSShapeModifiersFunWithConstraints<any, any, any, any, any, any, any, any, any, any, any, any>, T extends any> = ({
    'Req' : T 
    'Op' : T | undefined
})[Mod['__Required']];

type ESRec<T extends ITSModifiersRecord<any, any, any, any, any>> = {
    [P in keyof T] : 
    ({
        'T' : EROM<T[P], T[P]['__tsType']>,
        'R' : EROM<T[P], ESRec<T[P]['__tsType']>>,
        'AN' : EROM<T[P],ESRec<T[P]['__tsType']>['w'][]>,
        'AR' : EROM<T[P],ESRec<T[P]['__tsType']>[]>
        //'Ref' : 'Invalid Option here'
        //'S' : 'Invalid Option Here'
    })[T[P]['__ID']]
}

type TSchema = typeof schemaA['__ModRD']//['a']['__ID'];

type TSSchema = ESRec<TSchema>
const tsSchema : TSSchema = {
    a : true,
    b : 234,
    c : '',
    neasted : {
        nA : true,
        neasted : {
            NNe :'',
            NNf : 234
        }
    },
    arrayPrimative: [1],
    arrayArray : [[1]],
    arrayRecord: [{ 
        a : 324,
        b : {
            c : 324
        }
    }]
        
}

// Layer 2 were we want the typing speed improvements
// were the model definition will extra this informaiton.
// What we could do is the full type type out here, but then check that
// Schema conforms to that, but the simpified 
const modelA = model('collectionName', Schema);

// This basically what the model would be doing up front.
// If we wanted to speed things up and not do the type extraction
// from 
//type SchemaA = ExtractTSSchema<typeof schemaA>;

type TypesPrimative = 'Boolean' | 'Number' | 'String' | 'Date' | 'Record' | 'ArrayNeasted' | 'ArrayRecord' | 'RefType' | 'Schema' | 'ObjectIdString' | undefined

type _Required = 'Req' | 'Op'
type _Readonly = 'Get' | 'Set'
type _Nullable = 'Nullable' | 'Value'
type _Default = TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null | undefined
type _RefType = ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any> | undefined 
type _OptionsAnontations = Record<string, any>

interface IModifiers<TOptions extends _OptionsAnontations> extends IShape<ID, Neasted>
{
    id : ID,
    neasted : Neasted;
    type: TypesPrimative;
    required: _Required;
    readonly: _Readonly;
    nullable: _Nullable;
    init: _Default;
    refType: _RefType;
    options : TOptions | undefined;
}

interface ITSModifiers<
    TRequired extends _Required,
    TReadonly extends _Readonly,
    TNullable extends _Nullable,
    TDefault extends _Default,
    TRefType extends _RefType,
    TOptionsAnotations extends _OptionsAnontations
> extends IModifiers<TOptionsAnotations> {
    __Type: TypesPrimative;
    __Required: TRequired;
    __Readonly: TReadonly;
    __Nullable: TNullable;
    __Default: TDefault;
    __RefType: TRefType;
}

// type ITSShapeModifiers<
//     TOptionsAnotations extends _OptionsAnontations,
//     TShape extends ITSShape<any, any>,
//     TRequired extends _Required,
//     TReadonly extends _Readonly,
//     TNullable extends _Nullable,
//     TDefault extends _Default,
//     TRefType extends _RefType
// >  = TShape & ITSModifiers<TOptionsAnotations, TRequired, TReadonly, TNullable, TDefault, TRefType>



interface ITSModifiersWithConstraints<
    TRequired extends _Required,
    TReadonly extends _Readonly,
    TNullable extends _Nullable,
    TDefault extends _Default,
    TRefType extends _RefType,
    RequiredConstraint extends _Required | undefined, 
    ReadonlyConstraint extends _Readonly | undefined,
    NullableConstraint extends _Nullable | undefined,
    DefaultConstraint extends _Default,
    RefTypeConstraint extends _RefType,
    TShape extends ITSShape<any,any>,
    TOptionsAnotations extends _OptionsAnontations,
> extends ITSModifiers<TRequired, TReadonly, TNullable, TDefault, TRefType, TOptionsAnotations>{
    __RequiredConstraints : RequiredConstraint
    __ReadonlyConstraints : ReadonlyConstraint
    __NullableConstraints : NullableConstraint
    __DefaultConstraints : DefaultConstraint
    __RefTypeConstraints : RefTypeConstraint
}


// type ITSShapeModifiersWithConstraints<
//     TOptionsAnotations extends _OptionsAnontations,
//     TShape extends ITSShape<any,any>,
//     TRequired extends _Required,
//     TReadonly extends _Readonly,
//     TNullable extends _Nullable,
//     TDefault extends _Default,
//     TRefType extends _RefType = undefined,
//     RequiredConstraint extends _Required | undefined = TRequired, 
//     ReadonlyConstraint extends _Readonly | undefined = TReadonly,
//     NullableConstraint extends _Nullable | undefined = TNullable,
//     DefaultConstraint extends _Default = TDefault,
//     RefTypeConstraint extends _RefType = TRefType
// > = TShape & ITSModifiersWithConstraints<TOptionsAnotations, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType,
// RequiredConstraint, ReadonlyConstraint, NullableConstraint, DefaultConstraint, RefTypeConstraint>

// type Top = ITSModifiersWithConstraints<any, ITSShapes, any, any, any, any, any>;

// type Top2 = {
//     __ID: boolean;
//     __tsType: string;
//     __Type: TypesPrimative;
//     __Required: any;
//     __Readonly: any;
//     __Nullable: any;
//     __Default: any;
//     __RefType: any;
// }


function NewModifiers<TAvaliableOptions extends _OptionsAnontations,
    TShape extends ITSShape<any, any>
    >(shape : TShape, type : TypesPrimative, __options : TAvaliableOptions)
    {
        return new Modifiers<'Op', 'Set', 'Value', undefined, undefined, TShape, TAvaliableOptions>
        (shape, type, 'Op', 'Set', 'Value', undefined, undefined, undefined) as any as ITSShapeModifiersFunWithConstraints<'Op', 'Set', 'Value', undefined, undefined, undefined, undefined, undefined, undefined, undefined, TShape, TAvaliableOptions>
    }

    function NewModifiersWithConstraints<TAvaliableOptions extends _OptionsAnontations,
    TShape extends ITSShape<any, any>,
    TRequiredConstraint extends _Required | undefined, 
    TReadonlyConstraint extends _Readonly | undefined,
    TNullableConstraint extends _Nullable | undefined,
    TDefaultConstraint extends _Default,
    TRefTypeConstraint extends _RefType,
    TRefType extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>
    >(shape : TShape, type : TypesPrimative, __options : TAvaliableOptions,
        __RequiredConstraints : TRequiredConstraint,
        __ReadonlyConstraints : TReadonlyConstraint,
        __NullableConstraints : TNullableConstraint,
        __DefaultConstraints : TDefaultConstraint,
        __RefTypeConstraints : TRefTypeConstraint
        )
    {
        return new Modifiers<'Op', 'Set', 'Value', undefined, undefined, TShape, TAvaliableOptions>
        (shape, type, 'Op', 'Set', 'Value', undefined, undefined) as any as ITSShapeModifiersFunWithConstraints<'Op', 'Set', 'Value', undefined, undefined, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    }

    function NewModifiersWithConstraintsAndRefType<TAvaliableOptions extends _OptionsAnontations,
    TShape extends ITSShape<any, any>,
    TRequiredConstraint extends _Required | undefined, 
    TReadonlyConstraint extends _Readonly | undefined,
    TNullableConstraint extends _Nullable | undefined,
    TDefaultConstraint extends _Default,
    TRefTypeConstraint extends _RefType,
    TRefType extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>
    >(shape : TShape, type : TypesPrimative, __options : TAvaliableOptions,
        __RequiredConstraints : TRequiredConstraint,
        __ReadonlyConstraints : TReadonlyConstraint,
        __NullableConstraints : TNullableConstraint,
        __DefaultConstraints : TDefaultConstraint,
        __RefTypeConstraints : TRefTypeConstraint,
        __RefType : TRefType
        )
    {
        return new Modifiers<'Op', 'Set', 'Value', undefined, undefined, TShape, TAvaliableOptions>
        (shape, type, 'Op', 'Set', 'Value', undefined, __RefType ? __RefType['__Name'] : undefined) as any as ITSShapeModifiersFunWithConstraints<'Op', 'Set', 'Value', undefined, TRefType, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    }

// function Mutate<TAvaliableOptions extends Record<string, any>,
//     TShape extends ITSShape<any, any>,
//     TRequired extends _Required,
//     TReadonly extends _Readonly,
//     TNullable extends _Nullable,
//     TDefault extends _Default,
//     TRefType extends _RefType
//     >(mod : Modifiers<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>) : 
//     ITSModifiersWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>
// {
//     return mod as any;
// }
// Cavart, is that if this is not a neasted type.
// then the TReadonlyConstraint must be made to be the same as
// the the change.
// How ever, if this is for neasted types, then we are required to prset the RequiredConstraints
// As they should be pass thought.
interface IModifiersFunctions<
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
TRequiredConstraint extends _Required | undefined, 
TReadonlyConstraint extends _Readonly | undefined,
TNullableConstraint extends _Nullable | undefined,
TDefaultConstraint extends _Default,
TRefTypeConstraint extends _RefType,
TShape extends ITSShape<any, any>,
TAvaliableOptions extends _OptionsAnontations>
{
    Anotations(options : TAvaliableOptions): ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, TNullable, TDefault, TRefType, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Options(options : TAvaliableOptions): ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, TNullable, TDefault, TRefType,TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Required(): ITSShapeModifiersFunWithConstraints<'Req', TReadonly, TNullable, TDefault, TRefType, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Optional(): ITSShapeModifiersFunWithConstraints<'Op', TReadonly, TNullable, TDefault, TRefType, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Nullable() : ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, 'Nullable', TDefault, TRefType, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Readonly() : ITSShapeModifiersFunWithConstraints<TRequired, 'Get', TNullable, TDefault, TRefType, TRequiredConstraint, TReadonlyConstraint, TNullable, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Default<DValue extends TShape['neasted'] | (TNullable extends 'Nullable' ? null : never)>(dValue : DValue) : 
    ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, TNullable, DValue, TRefType, TRequiredConstraint, TReadonlyConstraint, TNullable, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
}

type ITSShapeModifiersFunWithConstraintsSimple<
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
TShape extends ITSShape<any, any>,
TAvaliableOptions extends _OptionsAnontations> = ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, TNullable, TDefault, TRefType, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>

type ITSShapeModifiersFunWithConstraints<
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
RequiredConstraint extends _Required | undefined, 
ReadonlyConstraint extends _Readonly | undefined,
NullableConstraint extends _Nullable | undefined,
DefaultConstraint extends _Default,
RefTypeConstraint extends _RefType,
TShape extends ITSShape<any, any>,
TAvaliableOptions extends _OptionsAnontations
>
= TShape & ITSModifiersWithConstraints<TRequired, TReadonly, TNullable, TDefault, TRefType,
RequiredConstraint, ReadonlyConstraint, NullableConstraint, DefaultConstraint, RefTypeConstraint, TShape, TAvaliableOptions> &
IModifiersFunctions<TRequired, TReadonly, TNullable, TDefault, TRefType,
RequiredConstraint, ReadonlyConstraint, NullableConstraint, DefaultConstraint, RefTypeConstraint, TShape, TAvaliableOptions>


interface IModifiersFunWithConstraints<
TAvaliableOptions extends _OptionsAnontations,
TShape extends ITSShape<any, any>,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
RequiredConstraint extends _Required | undefined = TRequired, 
ReadonlyConstraint extends _Readonly | undefined = TReadonly,
NullableConstraint extends _Nullable | undefined = TNullable,
DefaultConstraint extends _Default = TDefault,
RefTypeConstraint extends _RefType = TRefType>
extends ITSModifiersWithConstraints<TRequired, TReadonly, TNullable, TDefault, TRefType,
RequiredConstraint, ReadonlyConstraint, NullableConstraint, DefaultConstraint, RefTypeConstraint, TShape, TAvaliableOptions>, 
IModifiersFunctions<TRequired, TReadonly, TNullable, TDefault, TRefType,
RequiredConstraint, ReadonlyConstraint, NullableConstraint, DefaultConstraint, RefTypeConstraint, TShape, TAvaliableOptions> {

}

class Modifiers<
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
TShape extends ITSShape<any, any>,
TAvaliableOptions extends _OptionsAnontations>
implements IModifiers<TAvaliableOptions>, 
IShape<TShape['id'], TShape['neasted']>,
IModifiersFunctions<TRequired, TReadonly, TNullable, TDefault, TRefType, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
{
    constructor(
        shape: TShape,
        public type: TypesPrimative,
        public required: _Required,
        public readonly: _Readonly,
        public nullable: _Nullable,
        public init: _Default,
        public refType: _RefType,
        public options: TAvaliableOptions | undefined = undefined,
        public id: TShape['id'] = shape.id,
        public neasted: TShape['neasted'] = shape.neasted,
    )
    {
    }

    // Problem here is that I am missing the funtion signatures..
    public Anotations(options :TAvaliableOptions) : ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, TNullable, TDefault, TRefType, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.options = options;
        return this as any;
    }

    public Options(options : TAvaliableOptions) : ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, TNullable, TDefault, TRefType, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.options = options;
        return this as any;
    }

    public Required() : ITSShapeModifiersFunWithConstraints<'Req', TReadonly, TNullable, TDefault, TRefType, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.required = 'Req';
        return this as any;
    }

    public Optional() : ITSShapeModifiersFunWithConstraints<'Op', TReadonly, TNullable, TDefault, TRefType, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {        
        this.required = 'Op';
        return this as any;
    }

    public Nullable() : ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, 'Nullable', TDefault, TRefType, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.nullable = 'Nullable';
        return this as any;
    }

    public Readonly() : ITSShapeModifiersFunWithConstraints<TRequired, 'Get', TNullable, TDefault, TRefType,  TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions,>
    {
        this.readonly = 'Get';
        return this as any;
    }

    public Default<DValue extends TShape['neasted'] | (TNullable extends 'Nullable' ? null : never)>(dValue : DValue) : ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, TNullable, DValue, TRefType, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.init = dValue;
        return this as any;
    }
}


interface ITSModifiersRecord<
TShape extends ITSShape<any,any>,
TRequired extends _Required,
TReadonly extends _Readonly,
TDefault extends _Default,
TRefType extends _RefType | undefined,
TRequiredConstraints extends _Required | undefined = TRequired | undefined, 
TReadonlyConstraints extends _Readonly | undefined = TReadonly | undefined,
TDefaultConstraints extends _Default| undefined = TDefault | undefined,
TRefTypeConstraints extends _RefType | undefined = TRefType | undefined,
> extends
Record<string, ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, any, TDefault, TRefType, TRequiredConstraints, TReadonlyConstraints, any, TDefaultConstraints, TRefTypeConstraints, TShape, any>>
{
} 



// interface ITSModifiersRecord<
// TShape extends ITSShape<any,any>,
// TRequired extends _Required,
// TReadonly extends _Readonly,
// TDefault extends _Default,
// TRefType extends _RefType | undefined,
// TRequiredConstraints extends _Required | undefined = TRequired | undefined, 
// TReadonlyConstraints extends _Readonly | undefined = TReadonly | undefined,
// TDefaultConstraints extends _Default| undefined = TDefault | undefined,
// TRefTypeConstraints extends _RefType | undefined = TRefType | undefined,
// > extends
// Record<string, ITSShapeModifiersFunWithConstraints<TRequired, TReadonly, any, TDefault, TRefType, TRequiredConstraints, TReadonlyConstraints, any, TDefaultConstraints, TRefTypeConstraints, TShape, any>>
// {

// } 

type INeastedSchemaRecord = Record<string, (ITSModifiersWithConstraints<any, any, any, any, any, any, any, any, any, any, any, IShapeContainers | IShapeTSSchema<any>>)>

type ExtractRecordModfierConstraints<T extends Record<string, ITSShapeModifiersFunWithConstraints<any, any, any, any, any, any, any, any, any, any, any, any>>, 
Modifier extends '__Required' | '__Readonly' | '__Nullable' | '__Default' | '__RefType',
ModifierConstraint extends '__RequiredConstraints' | '__ReadonlyConstraints' | '__NullableConstraints' | '__DefaultConstraints' | '__RefTypeConstraints'> = {
    [K in keyof T] : T[K][Modifier] | T[K][ModifierConstraint]
}[keyof T]


interface ISchema<
    Name extends string,
    Id extends string,
    ModRD extends ITSModifiersRecord<ITSShapes, 'Req', 'Set', any, undefined>,
    ModRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Set', undefined, undefined>,
    ModOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', any, undefined>,
    ModOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', undefined, undefined>,
    ReadRD extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', any, undefined>,
    ReadRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', undefined, undefined>,
    ReadOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
    ReadOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
    ModRef extends ITSModifiersRecord<IShapeRefContainers, any, any, any, any>,
    NeastedSchemas extends INeastedSchemaRecord,
    SchemaOptions extends Record<string, any> | undefined,
    >
{
        public __Name : Name,
        public __Id : Id,
        public __ModRD : ModRD,
        public __ModRND : ModRND,
        public __ModOD : ModOD,
        public __ModOND : ModOND,
        public __ReadRD : ReadRD,
        public __ReadRND : ReadRND,
        public __ReadOD : ReadOD,
        public __ReadOND : ReadOND,
        public __ModRef : ModRef,
        public __NeastedSchemas : NeastedSchemas,
        public __SchemaOptions : SchemaOptions        
}

class Schema<
Name extends string,
Id extends string,
ModRD extends ITSModifiersRecord<ITSShapes,'Req', 'Set', any, undefined>,
ModRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Set', undefined, undefined>,
ModOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', any, undefined>,
ModOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', undefined, undefined>,
ReadRD extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', any, undefined>,
ReadRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', undefined, undefined>,
ReadOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
ReadOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
ModRef extends ITSModifiersRecord<IShapeRefContainers, any, any, any, any>,
NeastedSchemas extends INeastedSchemaRecord,
SchemaOptions extends Record<string,any> | undefined>
implements ISchema<Name, Id, ModRD, ModRND, ModOD, ModOND, ReadRD, ReadRND, ReadOD, ReadOND, ModRef, NeastedSchemas, SchemaOptions>
{
        constructor(
        public __Name : Name,
        public __Id : Id,
        public __ModRD : ModRD,
        public __ModRND : ModRND,
        public __ModOD : ModOD,
        public __ModOND : ModOND,
        public __ReadRD : ReadRD,
        public __ReadRND : ReadRND,
        public __ReadOD : ReadOD,
        public __ReadOND : ReadOND,
        public __ModRef : ModRef,
        public __NeastedSchemas : NeastedSchemas,
        public __SchemaOptions : SchemaOptions,
    )
    {
    }
}

interface ISchemaPartial<
TPartialName extends string,
Name extends string,
Id extends string,
ModRD extends ITSModifiersRecord<ITSShapes, 'Req', 'Set', any, undefined>,
ModRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Set', undefined, undefined>,
ModOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', any, undefined>,
ModOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', undefined, undefined>,
ReadRD extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', any, undefined>,
ReadRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', undefined, undefined>,
ReadOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
ReadOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
ModRef extends ITSModifiersRecord<IShapeRefContainers, any, any, any, any>,
NeastedSchemas extends INeastedSchemaRecord,
SchemaOptions extends Record<string,any>>
extends ISchema<Name, Id, ModRD, ModRND, ModOD, ModOND, ReadRD, ReadRND, ReadOD, ReadOND, ModRef, NeastedSchemas, SchemaOptions>
{
    public partialName : TPartialName,
}

class SchemaPartial<
TPartialName extends string,
BaseSchema extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, SchemaOptions>,
ModRD extends ITSModifiersRecord<ITSShapes, 'Req', 'Set', any, undefined>,
ModRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Set', undefined, undefined>,
ModOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', any, undefined>,
ModOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Set', undefined, undefined>,
ReadRD extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', any, undefined>,
ReadRND extends ITSModifiersRecord<ITSShapes, 'Req', 'Get', undefined, undefined>,
ReadOD extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
ReadOND extends ITSModifiersRecord<ITSShapes, 'Op', 'Get', undefined, undefined>,
ModRef extends ITSModifiersRecord<IShapeRefContainers, any, any, any, any>,
NeastedSchemas extends INeastedSchemaRecord,
SchemaOptions extends Record<string,any>>
implements ISchemas<BaseSchema['__Name'], BaseSchema['__Id'], ModRD, ModRND, ModOD, ModOND, ReadRD, ReadRND, ReadOD, ReadOND, ModRef, NeastedSchemas>
{
    constructor(
        public PartialName : TPartialName,
        public baseSchema : BaseSchema,
        public __ModRD : ModRD,
        public __ModRND : ModRND,
        public __ModOD : ModOD,
        public __ModOND : ModOND,
        public __ReadRD : ReadRD,
        public __ReadRND : ReadRND,
        public __ReadOD : ReadOD,
        public __ReadOND : ReadOND,
        public __ModRef : ModRef,
        public __NeastedSchemas : NeastedSchemas,
        public __SchemaOptions : Record<string, any> = baseSchema['__SchemaOptions'],
        public __Id : BaseSchema['__Id'] = baseSchema['__Id'],
        public __Name : BaseSchema['__Name']
    )
    {
    }
}



// class ShapeContainers<
// Required extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Nullable extends 'Nullable' | 'Value',
// Default extends TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null,
// RefType extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any> = never
// >
// implements ITypeGenModifiers<Required, Readonly, Nullable, Default, RefType>
// {
//     arrayItem<Test extends Required,Rec extends Record<string, never>>(record : Rec) : IShapeMongoose & & IArrayFun
//     {
//         return new {runTime; rinte}
//     }
// }


// Now I want to allow subset of this class by overiding the shape signature based on the input constructor parametes.
//  Which would allow me to nuke certin functions;

// Setup a configuration, that takes in a set of allow parameters and then defines,
// which options will be avaliable.

// type ModfierFunKeys<
// Required extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Nullable extends 'Nullable' | 'Value',
// Default extends TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null
// > = ModfierFunKeysBase<Required, Readonly, Nullable>

// type ModfierFunKeysBase<
// Required extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Nullable extends 'Nullable' | 'Value'> = {
//     'Req': 'Required'
//     'Op': 'Optional'

// }[Required] |
// {
//     'Get': 'Readonly'
//     'Set' : never
// }[Readonly] |
// {
//     'Nullable' : 'Nullable'
//     'Value' : never
// }[Nullable] 

// interface ArraySep<
// Shape extends IShape,
// Required extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Nullable extends 'Nullable' | 'Value',
// Default extends TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null,
// RefType extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any> = never,
// Keys extends string = ModfierFunKeys<Required, Readonly, Nullable, Default>
// >
// extends Pick<ArrayFun<Shape, Required, Readonly, Nullable, Default, RefType>, ''>
// {
// }

// const DefaultConfig : ITypeModifiers<'Op', 'Set', 'Value', undefined, any> = {
//     __Default : undefined

// }



type TypeNames = 'Boolean' | 'Number' | 'String' | 'Date'


// Problem is that every time I re-intialize MOdifiers, I loose the shape information,
// this means that the two need to be tightly coupled with one another.
// the runtime information needs to be preserved,
// not just the type information..

// interface IModifiersFuns<
//     AvaliableOptions extends Record<string, any>,
//     Shape extends ITSShape<any, any>,
//     Required extends 'Req' | 'Op',
//     Readonly extends 'Get' | 'Set',
//     Nullable extends 'Nullable' | 'Value',
//     Default extends TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null | undefined,
//     RefType extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any> | undefined>
//     extends ITSModifiers<Shape, Required, Readonly, Nullable, Default, RefType>, IShape<Shape['__ID'], Shape['__Neasted']>
// {
//     public Anotations(options : AvaliableOptions) : IModifiersFuns<AvaliableOptions, Shape, Required, Readonly, Nullable, Default, RefType>
//     public Options(options : AvaliableOptions) : IModifiersFuns<AvaliableOptions, Shape, Required, Readonly, Nullable, Default, RefType>
//     public Required() : IModifiersFuns<AvaliableOptions, Shape, 'Req', Readonly, Nullable, Default, RefType>
//     public Optional() : IModifiersFuns<AvaliableOptions, Shape, 'Op', Readonly, Nullable, Default, RefType>
//     public Nullable() : IModifiersFuns<AvaliableOptions, Shape, Required, Readonly, 'Nullable', Default, RefType>
//     public Readonly() : IModifiersFuns<AvaliableOptions, Shape, Required, 'Get', Nullable, Default, RefType>
//     public Default<DValue extends Default | (Nullable extends 'Nullable' ? null : never)>(dValue : DValue) : 
//     IModifiersFuns<AvaliableOptions, Shape, Required, Readonly, Nullable, Default, RefType>
// }

//type uuuu = IModifiersFunsWithConstraints<any,any,any,any,any,any,any> extends ITSTypeModifiers<any,any,any,any,any,any,any> ? 'T' :'F'


// interface IModifiersFunsWithConstraints<
//     AvaliableOptions extends Record<string, any>,
//     Shape extends ITSShape<any, any>,
//     Required extends 'Req' | 'Op',
//     Readonly extends 'Get' | 'Set',
//     Nullable extends 'Nullable' | 'Value',
//     Default extends TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null | undefined,
//     RefType extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any> | undefined>
//     extends ITSTypeModifiersWithConstraints<Shape, Required, Readonly, Nullable, Default, RefType>
// {
//     public Anotations(options : AvaliableOptions) : IModifiersFunsWithConstraints<AvaliableOptions, Shape, Required, Readonly, Nullable, Default, RefType>
//     public Options(options : AvaliableOptions) : IModifiersFunsWithConstraints<AvaliableOptions, Shape, Required, Readonly, Nullable, Default, RefType>
//     public Required() : IModifiersFunsWithConstraints<AvaliableOptions, Shape, 'Req', Readonly, Nullable, Default, RefType>
//     public Optional() : IModifiersFunsWithConstraints<AvaliableOptions, Shape, 'Op', Readonly, Nullable, Default, RefType>
//     public Nullable() : IModifiersFunsWithConstraints<AvaliableOptions, Shape, Required, Readonly, 'Nullable', Default, RefType>
//     public Readonly() : IModifiersFunsWithConstraints<AvaliableOptions, Shape, Required, 'Get', Nullable, Default, RefType>
//     public Default<DValue extends Default | (Nullable extends 'Nullable' ? null : never)>(dValue : DValue) : 
//     IModifiersFunsWithConstraints<AvaliableOptions, Shape, Required, Readonly, Nullable, Default, RefType>
// }


// interface ArrayFun<Required extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Nullable extends 'Nullable' | 'Value',
// Default extends TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null,
// RefType extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any> = never>
// {
//     Required() : ArrayFun<'Get', Readonly, Nullable, Default, RefType>
// }

// type Narrow = ReturnType<ShapeArrayFunctions['arrayItem']>

// type ShapeArrayFunctions
// <
// Required extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Nullable extends 'Nullable' | 'Value',
// Default extends TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null,
// RefType extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any> = never> =
// {
//     'Req' : {
        
//     }
//     'Op' : {

//     }
// }[Required]


// interface ShapeArray<
// Required extends 'Req',
// Readonly extends 'Get' | 'Set',
// Nullable extends 'Nullable' | 'Value',
// Default extends TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null,
// RefType extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any> = never> implements ITypeGenModifiers<Required, Readonly, Nullable, Default, RefType>
// {
//     static array<Rec extends Record<string, never>>(record : Rec, optional : boolean)
//     {

//     }
// }

// class ShapeRefAndContainers
// extends ShapeContainers
// {

// }

// class ShapeRefTsTypeAndContainers
// extends ShapeContainers
// {

// }

interface IMTypeModifiersWithNeastedConstraints<
    Optional extends 'Req' | 'Op',
    Readonly extends 'Get' | 'Set',
    Default extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined |,
    RefType extends IMongooseSchemas<any,any,any,any,any,any,any, any,any,any,any> | undefined = undefined,
    OptionalConstraints extends 'Req' | 'Op' | undefined = Optional, 
    ReadonlyConstraints extends 'Get' | 'Set' | undefined = Readonly,
    DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined = Default,
    RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any,any,any,any,any> | undefined = RefType,
   
> extends IMTypeModifiers<Optional, Readonly, Default, RefType> {
    __Optional : Optional
    __Readonly : Readonly   // Complications I can't detect readonly, so has to be explicity file mm.. How to create teh constructors for this.., I think only in 3.1, which make dynamic name for variable.
    __Default : Default
    __RefType : RefType
    __OptionalConstraints : OptionalConstraints
    __ReadonlyConstraints : ReadonlyConstraints   // Complications I can't detect readonly, so has to be explicity file mm.. How to create teh constructors for this.., I think only in 3.1, which make dynamic name for variable.
    __DefaultConstraints : DefaultConstraints
    __RefTypeConstraints : RefTypeConstraints
}

// type ExtractRecordModfierConstraints<T extends Record<string, IModifiersWithNeastedConstraints>, 
// Modifier extends '__OptionalConstraints' | '__ReadonlyConstraints' | '__NullableConstraints' | '__DefaultConstraints' | '__RefTypeConstraints'> = {
//     [K in keyof T] : T[K][Modifier]
// }[keyof T]

type IMongooseShape<
Shape extends IShape,
Optional extends 'Req' | 'Op',
Readonly extends  'Get' | 'Set',
Default extends (Shape extends (IShapeTSArrayNeasted<any> | IShapeTSArrayRecord<any>) ? [] : 
TsTypesPrimatives | Array<any> | Record<string,TsTypesPrimatives> | TsTypesPrimatives) | undefined | never,
//Shape['__tsType']) | undefined, This needs to be the extracted form.. update this later, once developed.
RefType extends ISchemas<any, any, any, any, any, any, any, any,any,any,any> | undefined = never,
OptionalConstraints extends 'Req' | 'Op' | undefined = Optional, 
ReadonlyConstraints extends 'Get' | 'Set' | undefined = Readonly,
DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined = Default,
RefTypeConstraints extends ISchemas<any, any, any, any, any, any, any, any, any, any, any> | undefined = RefType,
> = IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default, RefType, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>
& Shape

type MongooseTypes = any;

interface IMSchemaId<ID extends MongooseTypes>
{
    __id: ID
}

// interface IMTypeModifiersRecord<
// Optional extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Default extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
// RefType extends ISchemas<any,any,any,any,any,any,any, any,any,any,any> | undefined,
// OptionalConstraints extends 'Req' | 'Op' = Optional, 
// ReadonlyConstraints extends 'Get' | 'Set' = Readonly,
// DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined = Default,
// RefTypeConstraints extends ISchemas<any,any,any,any,any,any,any,any,any,any,any> | undefined = RefType,
// > extends
// Record<string, IMongooseShape<IShape, Optional, Readonly, Default, RefType, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>>
// {
// } 
// IMTypeModifiersWithNeastedConstraints



// // To validate this, one needs to build a generator based on the input to ensure that the final type is of the form
// // IMRefTypeModifiers
// interface MRefTypeModifiersRecord<
// Optional extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Default extends TsTypesPrimatives | Array<any> | undefined, 
// RefType extends IMongooseSchemas<any,any,any,any,any,any,any>> 
// extends Record<string, (IMongooseTSType<any,any,any> & IMTypeModifiers<Optional, Readonly, Default, RefType>) | MRefTypeModifiersRecord<any,any,any,any>>
// {

// }

// // Problem with this referance type is that it is not perfectly recusive...
// // as it addes on options, but from to level its fine actually, because constaint is actually at a top level.
// interface IMRefTypeModifiers<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends TsTypesPrimatives | Array<any> | undefined, RefType extends IMongooseSchemas<any,any,any,any,any,any,any>>
// extends IMTypeModifiers<Optional, Readonly, Default>
// {
//     __RefType : IMongooseSchemas<any, any, any,any, any, any, any>
// }





type SchemaTypeID<ID extends IMongooseShape<IShapeTSType<any>, 'Req', 'Set', undefined>> = ID

// ID:
// ModRequiredDefault
// ModRequiredNoDefault
// ModOptionalDefault
// ModOptionalNoDefault same in all 3.
// RequiredReadOnlyDefault
// RequiredReadonlyNoDefault
// OptionalReadonlyDefault
// OptionalReadonlyNoDefault same in 2
//-----------------
// ModRef, becomes readonly in the final schema...
// since we can't update things back to the model, might be the wrong call toought.



interface ISchemas<
    Name extends string,
    Id extends string,
    ModRD extends IMTypeModifiersRecord<'Req', 'Set', any, never>,
    ModRND extends IMTypeModifiersRecord<'Req', 'Set', never, never>,
    ModOD extends IMTypeModifiersRecord<'Op', 'Set', any, never>,
    ModOND extends IMTypeModifiersRecord<'Op', 'Set', never, never>,
    ReadRD extends IMTypeModifiersRecord<'Req', 'Get', any, never>,
    ReadRND extends IMTypeModifiersRecord<'Req', 'Get', never, never>,
    ReadOD extends IMTypeModifiersRecord<'Op', 'Get', undefined, never>,
    ReadOND extends IMTypeModifiersRecord<'Op', 'Get', never, never>,
    ModRef extends IMTypeModifiersRecord<any, any, any, any>,
    NeastedSchemas extends INeastedSchemaRecord<any, any, any, any, any, any>
    > extends IPartialSchema<ModRD, ModRND, ModOD, ModOND, ReadRD, ReadRND, ReadOD, ReadOND, ModRef, NeastedSchemas>
{
    __Name : Name,
    __Id : Id,
    __ModRD : ModRD,
    __ModRND : ModRND,
    __ModOD : ModOD,
    __ModOND : ModOND,
    __ReadRD : ReadRD,
    __ReadRND : ReadRND,
    __ReadOD : ReadOD,
    __ReadOND : ReadOND,
    __ModRef : ModRef,
    __NeastedSchemas : NeastedSchemas
}

// type INeastedSchemaRecord<
// Mod extends IMTypeModifiersRecord<any, 'Set', undefined, undefined>,
// ModRef extends IMTypeModifiersRecord<any, 'Set', undefined, any>,
// NonOpReadDefault extends IMTypeModifiersRecord<'Req', 'Get', undefined, undefined>,
// NonOpROptional extends IMTypeModifiersRecord<'Req', 'Get', any, undefined>,
// NDefault extends IMTypeModifiersRecord<'Op', any, MongooseTypes, undefined>,
// NeastedSchemas extends INeastedSchemaRecord<any, any, any, any, any, any>
// > = Record<string, (IMongooseShape<IShapeContainers | IShapeTSSchema<any>, any, any, any, any>)>


// type IMongoosePartialSchemaRecord<
// Mod extends IMTypeModifiersRecord<any, 'Set', undefined, undefined>,
// ModRef extends IMTypeModifiersRecord<any, 'Set', undefined, any>,
// NonOpReadDefault extends IMTypeModifiersRecord<'Req', 'Get', undefined, undefined>,
// NonOpROptional extends IMTypeModifiersRecord<'Req', 'Get', any, undefined>,
// NDefault extends IMTypeModifiersRecord<'Op', any, MongooseTypes, undefined>,
// NeastedSchemas extends IMongoosePartialSchemaRecord<any, any, any, any, any, any>
// > = Record<string, IMongoosePartialSchema<Mod, ModRef, NonOpReadDefault, NonOpROptional, NDefault, NeastedSchemas>>

interface IPartialSchema<
ModRD extends IMTypeModifiersRecord<'Req', 'Set', any, never>,
ModRND extends IMTypeModifiersRecord<'Req', 'Set', never, never>,
ModOD extends IMTypeModifiersRecord<'Op', 'Set', any, never>,
ModOND extends IMTypeModifiersRecord<'Op', 'Set', never, never>,
ReadRD extends IMTypeModifiersRecord<'Req', 'Get', any, never>,
ReadRND extends IMTypeModifiersRecord<'Req', 'Get', never, never>,
ReadOD extends IMTypeModifiersRecord<'Op', 'Get', undefined, never>,
ReadOND extends IMTypeModifiersRecord<'Op', 'Get', never, never>,
ModRef extends IMTypeModifiersRecord<any, any, any, any>,
NeastedSchemas extends INeastedSchemaRecord<any, any, any, any, any, any>>
{
    __ModRD : ModRD,
    __ModRND : ModRND,
    __ModOD : ModOD,
    __ModOND : ModOND,
    __ReadRD : ReadRD,
    __ReadRND : ReadRND,
    __ReadOD : ReadOD,
    __ReadOND : ReadOND,
    __ModRef : ModRef,
    __NeastedSchemas : NeastedSchemas
}

// I will have to figure out the defaults, because there seems to be a typescript bug of stores.
// Which is a problem. Ask peire see if he has any ideas, lets press on with the other things.
// class Schema<
// Id extends string,
// ModRD extends IMTypeModifiersRecord<'Req', 'Set', any, never>,
// ModRND extends IMTypeModifiersRecord<'Req', 'Set', never, never>,
// ModOD extends IMTypeModifiersRecord<'Op', 'Set', any, never>,
// ModOND extends IMTypeModifiersRecord<'Op', 'Set', never, never>,
// ReadRD extends IMTypeModifiersRecord<'Req', 'Get', any, never>,
// ReadRND extends IMTypeModifiersRecord<'Req', 'Get', never, never>,
// ReadOD extends IMTypeModifiersRecord<'Op', 'Get', undefined, never>,
// ReadOND extends IMTypeModifiersRecord<'Op', 'Get', never, never>,
// ModRef extends IMTypeModifiersRecord<any, any, any, any>,
// NeastedSchemas extends INeastedSchemaRecord<any, any, any, any, any, any>>
// {
//         constructor(
//         public __Name : string,
//         public __Id : Id,
//         public __ModRD : ModRD,
//         public __ModRND : ModRND,
//         public __ModOD : ModOD,
//         public __ModOND : ModOND,
//         public __ReadRD : ReadRD,
//         public __ReadRND : ReadRND,
//         public __ReadOD : ReadOD,
//         public __ReadOND : ReadOND,
//         public __ModRef : ModRef,
//         public __NeastedSchemas : NeastedSchemas,
//     )
//     {
//     }
// }

interface ObjectId extends String
{
}


// type MongooseTypePrimative<T extends TsTypesPrimatives,
// Optional extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Default extends T | undefined,
// I extends ID = 'T', F extends InputForm = 'P', 
// > = IMongooseTSTypeOnly<T, I> & IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default>



// There are two types of arrays Primatives and Objects or Arrays of Arrays.
// type MongooseTypeArray<T extends ArrayTypes,
// Optional extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Default extends Array<any> | undefined,
// OptionalConstraints extends 'Req' | 'Op', 
// ReadonlyConstraints extends 'Get' | 'Set',
// DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
// RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
// InputForm extends 'P' |'W' = 'W'
// > = IMongooseTSType<T, 'A', InputForm> & IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default, undefined, 
// OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>

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


// type MongooseTypeRef<Ref extends TsTypesPrimatives, RefImpl extends IMongooseSchemas<any, any, any, any, any, any, any>,
// Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends Array<any> | undefined
// > = IMongooseTSTypeOnly<Ref, 'J'> & IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default, RefImpl>


// Hybrid type, since we don't want to use the extends keyword, to check for the differance in structure between
// a schema and and just a plain type. 
 

//type MTypes = MBoolean | MNumber | MString | MDate | MObjectId | MBuffer | MArray<any> | MMixed;

// export type Ref<RefId, RefImplem> = {
//     RefId : RefId,
//     RefImplem : RefImplem
// }

// // New set of Primatives

// type MObjectId<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends boolean | undefined> = 
// IMongooseShape<IShapeTSType<,string, 'Req', 'Set', undefined> & Schema.Types.ObjectId;

type MBoolean<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends boolean | undefined | never> = 
IMongooseShape<IShapeTSType<boolean>, Optional, Readonly, Default> & Schema.Types.Boolean;

type MNumber<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends number | undefined> = 
IMongooseShape<IShapeTSType<number>, Optional, Readonly, Default> & Schema.Types.Number;

type MString<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends string | undefined> = 
IMongooseShape<IShapeTSType<string>, Optional, Readonly, Default> & Schema.Types.String;

type MDate<Optional extends 'Req' | 'Op', Readonly extends 'Get' | 'Set', Default extends Date | undefined> = 
IMongooseShape<IShapeTSType<Date>, Optional, Readonly, Default> & Schema.Types.Date;

// type MObject<
// Items extends IMTypeModifiersRecord<
// OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints,
// OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
// Optional extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set',
// Default extends Record<string, TsTypesPrimatives> | undefined,
// RefType extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined,
// OptionalConstraints extends 'Req' | 'Op', 
// ReadonlyConstraints extends 'Get' | 'Set',
// DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
// RefTypeConstraints extends IMongooseSchemas<any,any,any,any,any,any,any> | undefined
// > = 
// IMongooseTSTypeRecord<Items, 'O'> & 
// IMTypeModifiersWithNeastedConstraints<Optional, Readonly, Default, RefType, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>

// type MRef<Ref extends TsTypesPrimatives, RefType extends IMongooseSchemas<any,any,any,any,any,any,any>,
// Optional extends 'Req' | 'Op',
// Readonly extends 'Get' | 'Set'> = 
// MongooseTypeRef<Ref, RefType, Optional, Readonly, undefined>;


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

// type SchemaOptions = {
//     autoIndex: any,
//     bufferCommands: any,
//     capped: any,
//     collection: any,
//     id: any,
//     _id: any,
//     minimize: any,
//     read: any,
//     writeConcern: any,
//     safe: any,
//     shardKey: any,
//     strict: any,
//     strictQuery: any,
//     toJSON: any,
//     toObject: any,
//     typeKey: any,
//     validateBeforeSave: any,
//     versionKey: any,
//     collation: any,
//     skipVersioning: any,
//     timestamps: any,
//     selectPopulatedPaths: any,
//     storeSubdocValidationError: any,
// }

// type SchemaFieldOptionsAll = {
//     select?: boolean,
//     validate?: Function, 
//     get?: Function,
//     set?: Function, 
//     alias? : string
// // }

// type MBaseSchema = Schema.Types.Boolean;
// /*Schema.Types.Array | Schema.Types.Boolean | Schema.Types.Buffer | Schema.Types.Date | Schema.Types.Decimal128 |
// Schema.Types.DocumentArray | Schema.Types.Embedded | Schema.Types.Mixed | Schema.Types.Number | Schema.Types.ObjectId | Schema.Types.String
// // */
// // type MongooseTypeOptions<B, Options> = ({type : B} & {[i:string] : Options})
 
// // type MoggooseType<B, E, Options> = E | MongooseTypeOptions<E, Options> 

// function MongooseTypes<TT, Options extends Record<string,any> | undefined>(schemaType : TT, options : Options, useTypeFormat: boolean = false) : any
// {
// //     if(options['required'] == 'Req')
// //         options['required'] = true;

// //     if(options['default'])

//     if (options || useTypeFormat)
//     {
//         // this format in mongoose 3, will results in the cohersion failing,
//         // mongoose neasted objects also don't support the concept of optional.
//         const mType = {type : schemaType, ...options};

//         return mType
//     }
//     else 
//         return schemaType
// }
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

    static default<
    OptionalConstraints extends 'Req' | 'Op', 
    ReadonlyConstraints extends 'Get' | 'Set',
    DefaultConstraints extends ([] | undefined),
    RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any> | undefined,
    ArrayItems extends IMongooseShape<IShape, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
    Required extends 'Req' | 'Op' = 'Op', 
    Default extends ([] | undefined) = [], 
    ReadOnly extends 'Get' | 'Set' = 'Set'
    >
    (item: ArrayItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
    : IMongooseShape<IShapeTSArrayNeasted<ArrayItems>,Required, ReadOnly, Default, undefined,  OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>
    & Schema.Types.Array;

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
    RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any> | undefined,
    ArrayItems extends IMTypeModifiersRecord<OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
    Required extends 'Req' | 'Op' = 'Op', 
    Default extends ([] | undefined) = [], 
    ReadOnly extends 'Get' | 'Set' = 'Set'>
    (item: ArrayItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
    : IMongooseShape<IShapeTSArrayRecord<ArrayItems>,Required, ReadOnly, Default, undefined,  OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>
    & Schema.Types.Array
    //IMongooseTSTypeRecord<ArrayItems, 'A'> & IMTypeModifiersWithNeastedConstraints<Required, ReadOnly, Default, undefined,  OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>
    //;
    //MArray<ArrayItems, Required, ReadOnly, Default, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints, 'P'>

    
    
    static default(items : any, options?: {required?: any, readonly?: any, default?: any}) : never & 'Invalid Type Inputs'
    {
        return MongooseTypes(items, options) as never;
    }
}


// class MTypeObject {
//     // Required to pass tought in an inverse way the constraints, into the return type
//     // to ensure that all the parameters match...
//     // mm how do I do this.
//     // There are the requirements of this document, which need to be met.
//     // So one of the ways, I can think of doing this is that mixing in the constaint for lower level rquire ment,
//     // but there is no such thing as higher or lower qualifying requirement.
//     // The only other way is for me to implement auxilary fields that can pass tought constraints,
//     // which are just there for 
//     static default <
//     Required extends 'Req' | 'Op', 
//     ReadOnly extends 'Get' | 'Set',
//     Default extends Record<string, TsTypesPrimatives> | undefined,
//     RefType extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
//     OptionalConstraints extends 'Req' | 'Op', 
//     ReadonlyConstraints extends 'Get' | 'Set',
//     DefaultConstraints extends Record<string, TsTypesPrimatives> | undefined,
//     RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
//     ObjectItems extends IMTypeModifiersRecord<
//     OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints, 
//     OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
//     >(object: ObjectItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
//     : 
//     IMongooseShape<IShapeTSRecord<ObjectItems>,Required, ReadOnly, Default, undefined,  OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>
//     & Schema.Types.;

//     static default(object : any, options?: {required?: any, readonly?: any, default?: any}) : never & 'Invalid Type Inputs'
//     {
//         return MongooseTypes(object, options, true) as never;
//     }
// }


const MTypes = {

    ObjectId : () => mongoose.Schema.Types.ObjectId as any as string;
    //as IShapeTSType<string> & IMTypeModifiers<'Req', 'Set', undefined>,

    Boolean : <Required extends 'Req' | 'Op' = 'Op', 
            ReadOnly extends 'Get' | 'Set' = 'Set',
            Default extends (boolean | undefined | never) = never
            >
        (options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
        => MongooseTypes(Schema.Types.Boolean, options) as MBoolean<Required, ReadOnly, Default>,

    
    Number : <Required extends 'Req' | 'Op' = 'Op', 
            ReadOnly extends 'Set' | 'Get' = 'Set',
            Default extends (number | undefined) = never
            >
        (options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
         => MongooseTypes(Schema.Types.Number, options) as MNumber<Required, ReadOnly, Default>,

    String : <Required extends 'Req' | 'Op' = 'Op', 
            ReadOnly extends 'Get' | 'Set' = 'Set',
            Default extends (string | undefined) = undefined
            >
        (options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
         => MongooseTypes(Schema.Types.String, options) as 
         //IMongooseShape<IShapeTSType<string>, Required, ReadOnly, Default>,
         MString<Required, ReadOnly, Default>,
         
    Date : <Required extends 'Req' | 'Op' = 'Op', 
            Default extends (Date | undefined) = never, 
            ReadOnly extends 'Get' | 'Set' = 'Set'>
        (options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
        => MongooseTypes(Schema.Types.Date, options) as MDate<Required, ReadOnly, Default>,


        // Array : <OptionalConstraints extends 'Req' | 'Op', 
        // ReadonlyConstraints extends 'Get' | 'Set',
        // DefaultConstraints extends ([] | undefined),
        // RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
        // ArrayItems extends IMongooseShape<IShape, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
        // Required extends 'Req' | 'Op' = 'Op', 
        // Default extends ([] | undefined) = [], 
        // ReadOnly extends 'Get' | 'Set' = 'Set'
        // >(items: ArrayItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
        // => MongooseTypes(items, options) as IMongooseShape<IShapeTSArrayNeasted<ArrayItems2>,Required, ReadOnly, Default, undefined,  OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>
        // & Schema.Types.Array,
    
        // Array : function<OptionalConstraints extends 'Req' | 'Op', 
        // DefaultConstraints extends ([] | undefined),
        // RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
        // ArrayItems extends IMongooseShape<IShape, OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
        // Required extends 'Req' | 'Op' = 'Op', 
        // Default extends ([] | undefined) = [], 
        // ReadOnly extends 'Get' | 'Set' = 'Set',
        // ReadonlyConstraints extends 'Get' | 'Set' = 'Set',
        // >(items: ArrayItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
        // : IMongooseShape<IShapeTSArrayNeasted<ArrayItems>,Required, ReadOnly, Default, undefined,  OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>
        // & Schema.Types.Array {return MongooseTypes(items, options)},
    
        
        // function<OptionalConstraints extends 'Req' | 'Op', 
        // ReadonlyConstraints extends 'Get' | 'Set',
        // DefaultConstraints extends TsTypesPrimatives | Array<any> | Record<string, TsTypesPrimatives> | undefined,
        // RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any> | undefined,
        // ArrayItems extends IMTypeModifiersRecord<OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
        // Required extends 'Req' | 'Op' = 'Op', 
        // Default extends ([] | undefined) = [], 
        // ReadOnly extends 'Get' | 'Set' = 'Set'>
        // (items: ArrayItems, options?: {required?: Required, readonly?: ReadOnly, default?: Default} & SchemaFieldOptionsAll)
        //  : IMongooseShape<IShapeTSArrayRecord<ArrayItems>,Required, ReadOnly, Default, undefined,  OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>
        // & Schema.Types.Array { return MongooseTypes(items, options)},

    Array : MTypeArray.default,
    //Object : MTypeObject.default,
    
    Record : <DefaultConstraints extends TsTypesPrimatives | Array<any> | undefined | Record<string, never>,
    Records extends IMTypeModifiersRecord<OptionalConstraints, ReadonlyConstraints, DefaultConstraints, RefTypeConstraints>,
    OptionalConstraints extends 'Req' | 'Op' = any, 
    ReadonlyConstraints extends 'Get' | 'Set' = any,
    RefTypeConstraints extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any> | undefined = any

    //Required extends 'Req' | 'Op' = 'Req', 
    //ReadOnly extends 'Get' | 'Set' = 'Set',
    //Default extends undefined = never
    >(record : Records)
    => record as any as IMongooseShape<IShapeTSRecord<Records>, any, any, any, never, 
    ExtractRecordModfierConstraints<Records,'__Required', '__RequiredConstraints'>, 
    ExtractRecordModfierConstraints<Records,'__Readonly', '__ReadonlyConstraints'>, 
    ExtractRecordModfierConstraints<Records,'__Default', '__DefaultConstraints'>, 
    ExtractRecordModfierConstraints<Records,'__RefType', '__RefTypeConstraints'>>,


    // Schema :  <NeastedSchemas extends IMongoosePartialSchema<any, any, any, any, any, any>,
    // Required extends 'Req' | 'Op' = 'Op', 
    // ReadOnly extends 'Get' | 'Set' = 'Set'
    // >
    // (object : NeastedSchemas, options? : {required?: Required, readonly?: ReadOnly, default?: never} & SchemaFieldOptionsAll)
    //  => MongooseTypes(object, options) as IMongooseTSTypeSchema<NeastedSchemas, 'S'> & 
    // IMTypeModifiersWithNeastedConstraints<Required, ReadOnly, undefined, undefined, any, any, any, any>

    // ,
    //MongooseTypes(Schema.Types.Boolean, options) as MBuffer,// MoggooseType<Schema.Types.Buffer, Options, MBuffer>,

    Ref:<MSchema extends IMongooseSchemas<any, any, any, any, any, any, any, any, any, any, any>,
    Required extends 'Req' | 'Op' = 'Op', 
    ReadOnly extends 'Get' | 'Set' = 'Set',
    >(refSchema: MSchema, options? : {required?: Required, readonly?: ReadOnly, default?: never} & SchemaFieldOptionsAll)
    => MongooseTypes(refSchema['__Id'], { options , ref: refSchema['__Name'] }) as any as IMongooseShape<IShapeTSRef<MSchema['__Id']>, Required, ReadOnly, never, MSchema>
};

const mRight = new MSchema('Right', MTypes.ObjectId(), {a: MTypes.Number({required:'Req'})},{},{},{},{},{},{}, {}, {}, {}, {});

const mMumberSchema = new MSchema('MyCusCollection', MTypes.ObjectId(),{a : MTypes.Number({required:'Req', }), b: MTypes.Boolean(), c: MTypes.String(), d: MTypes.Date(),
e: MTypes.Array(MTypes.Number({required:'Req'})), f: MTypes.Array({z:MTypes.Number(), y: MTypes.Boolean()}), g: MTypes.Record({m:MTypes.Number()})
},{m : MTypes.Ref(mRight, {required:'Req'})},{},{},{},{},{}, {}, {}, {}, {});

const mTypes = MTypes.Ref(mRight, {required:'Req'});

// type EROM<Mod extends IMTypeModifiersWithNeastedConstraints<any,any,any,any>, T extends any> = ({
//     'Req' : T 
//     'Op' : T | undefined
// })[Mod['__Optional']];

// type ESRec<T extends IMTypeModifiersRecord<any,any,any,any>> = {
//     [P in keyof T] : 
//     ({
//         'T' : EROM<T[P], T[P]['__tsType']>,
//         'R' : EROM<T[P], ESRec<T[P]['__tsType']>>,
//         'AN' : EROM<T[P],ESRec<T[P]['__tsType']>['w'][]>,
//         'AR' : EROM<T[P],ESRec<T[P]['__tsType']>[]>
//         'Ref' : 'Invalid Option here'
//         'S' : 'Invalid Option Here'
//     })[T[P]['__ID']]
// }

// type ESRedId<T extends INeastedSchemaRecord<any, any, any, any, any, any>, Path = '__Mod'> =
// {
//     [P in keyof T] : 
//     ({
//         'T' : 'Invalid Option Here'
//         'R' : EROM<T[P], ESSRedId<T[P]['__tsType']>>
//         'AN' : EROM<T[P], ESSRedId<T[P]['__tsType']>['w'][]>
//         'AR' : EROM<T[P], ESSRedId<T[P]['__tsType']>[]>
//         'Ref' : T[P]['__tsType']
//         'S' : 'Invalid Option Here'
//     })[T[P]['__ID']]
// }


// type ESSRec<T extends IMTypeModifiersRecord<any,any,any,any>,
// Path extends '__ModRD' | '__ModRND' | '__ModOD' | '__ModOND' | '__ReadRD' | '__ReadRND' | '__ReadOD' | '__ReadOND'> = {
//     [P in keyof T] : 
//     ({
//         'T' : EROM<T[P], T[P]['__tsType']>,
//         'R' : EROM<T[P], ESSRec<T[P]['__tsType'], Path>>,
//         'AN' : EROM<T[P],ESSRec<T[P]['__tsType'], Path>['w'][]>,
//         'AR' : EROM<T[P],ESSRec<T[P]['__tsType'], Path>[]>
//         'Ref' : 'Invalid Option here'
//         'S' : ESSRec<T[P]['__tsType'][Path], Path>
//     })[T[P]['__ID']]
// }

// type ESRefP<T extends IMTypeModifiersRecord<any,any,any,any>, Paths extends Record<string, any> = {}, KeysOfPaths = keyof Paths> = {
//     [P in keyof T] : 
//     ({
//         'T' : EROM<T[P], T[P]['__tsType']>,
//         'R' : EROM<T[P], ESRefP<T[P]['__tsType']>>,
//         'AN' : EROM<T[P], ESRefP<T[P]['__tsType']>['w'][]>,
//         'AR' : EROM<T[P], ESRefP<T[P]['__tsType']>[]>
//         'Ref' : P extends keyof Paths ? ESRefP<T[P]['__RefType'], Paths[P]> : T[P],
//         'S' : 'Invalid Option Here'
//     })[T[P]['__ID']]
// }


// type ESResRef<T extends IMTypeModifiersRecord<any,any,any,any>, Paths extends Record<string, any> = {}, KeysOfPaths = keyof Paths> = {
//     [P in keyof T] : 
//     ({
//         'T' : EROM<T[P], T[P]['__tsType']>,
//         'R' : EROM<T[P], ESResRef<T[P]['__tsType']>>,
//         'AN' : EROM<T[P], ESResRef<T[P]['__tsType']>['w'][]>,
//         'AR' : EROM<T[P], ESResRef<T[P]['__tsType']>[]>
//         'Ref' : P extends keyof Paths ? ESResRef<T[P]['__RefType'], Paths[P]> : T[P]['__tsType'],
//         'S' : 'Invalid Option Here'
//     })[T[P]['__ID']]
// }


// type ESSNoResRef<T extends INeastedSchemaRecord<any, any, any, any, any, any>,
// Path extends string = '__ModRD' | '__ModRND' | '__ModOD' | '__ModOND' | '__ReadRD' | '__ReadRND' | '__ReadOD' | '__ReadOND'> =
// {
//     [P in keyof T] : 
//     ({
//         'T' : 'Invalid Option Here'
//         'R' : EROM<T[P], ESSNoResRef<T[P]['__tsType']>>
//         'AN' : EROM<T[P], ESSNoResRef<T[P]['__tsType']>['w'][]>
//         'AR' : EROM<T[P], ESSNoResRef<T[P]['__tsType']>[]>
//         'Ref' : T[P] // Unmodified.
//         'S' : ESSNoResRef<T[P]['__tsType'][Path]>
//     })[T[P]['__ID']]
// }

// type ESSRedId<T extends INeastedSchemaRecord<any, any, any, any, any, any>,
// Path extends string = '__Mod' | '__NonOpReadDefault' | '__NonOpROptional' | '__NDefault'> =
// {
//     [P in keyof T] : 
//     ({
//         'T' : 'Invalid Option Here'
//         'R' : EROM<T[P], ESSRedId<T[P]['__tsType']>>
//         'AN' : EROM<T[P], ESSRedId<T[P]['__tsType']>['w'][]>
//         'AR' : EROM<T[P], ESSRedId<T[P]['__tsType']>[]>
//         'Ref' : T[P]['__tsType']
//         'S' : ESSRedId<T[P]['__tsType'][Path]>
//     })[T[P]['__ID']]
// }-

// See if I can make mutiple different version of ModelRecordTsType, that check Required, Optional, Readonly
// But this can only really be done in the latest typesript versions.
interface IModelParts<
Id extends string, 
ModRD extends ModelRecordTsTypes<any>,
ModRND extends ModelRecordTsTypes<any>,
ModOD extends ModelRecordTsTypes<any>,
ModOND extends ModelRecordTsTypes<any>,
ReadRD extends ModelRecordTsTypes<any>,
ReadRND extends ModelRecordTsTypes<any>,
ReadOD extends ModelRecordTsTypes<any>,
ReadOND extends ModelRecordTsTypes<any>,
ModRefIds extends ModelRecordTsTypes<any>,      // Used to spesify it must have these fields, irrelavant if modRef is populated, only there for sub sections.
ModRefTypes extends ModelRecordTsTypes<any>,    // Can add in a specially modifier.   // User to spesify it msut have there fields irrelacant if Mod Ref is populated, only there for sub sections.
ModRef extends IMTypeModifiersRecord<any, any, any, any> // Use the populates or extraction method... but should be removed as soon as it is not required.
>
{
    __Id: Id;
    __ModRD: ModRD,
    __ModRND: ModRND,
    __ModOD: ModOD,
    __ModOND: ModOND,
    __ReadRD: ReadRD,
    __ReadRND: ReadRND,
    __ReadOD: ReadOD,
    __ReadOND: ReadOND,
    __ModRefIds : ModRefIds;
    __ModRefTypes : ModRefTypes;    // These are all the readonly version of the referance.
    __ModRef: ModRef;
}

type IModelPartsFromSchema<TMSchema extends MSchema<string, any, any, any, any, any, any, any, any, any, any>> = IModelParts<
TMSchema['__Id'],
ESRec<TMSchema['__ModRD']> & ESSRec<TMSchema['__NeastedSchemas'],'__ModRD'>,
ESRec<TMSchema['__ModRND']> & ESSRec<TMSchema['__NeastedSchemas'],'__ModRND'>,
ESRec<TMSchema['__ModOD']> & ESSRec<TMSchema['__NeastedSchemas'],'__ModOD'>,
ESRec<TMSchema['__ModOND']> & ESSRec<TMSchema['__NeastedSchemas'],'__ModOND'>,
ESRec<TMSchema['__ReadRD']> & ESSRec<TMSchema['__NeastedSchemas'],'__ReadRD'>, 
ESRec<TMSchema['__ReadRND']> & ESSRec<TMSchema['__NeastedSchemas'],'__ReadRND'>, 
ESRec<TMSchema['__ReadOD']> & ESSRec<TMSchema['__NeastedSchemas'],'__ReadOD'>, 
ESRec<TMSchema['__ReadOND']> & ESSRec<TMSchema['__NeastedSchemas'],'__ReadOND'>, 
ESRedId<TMSchema['__ModRef']> & ESSRedId<TMSchema['__NeastedSchemas'],'__ModRef'>,
{},
TMSchema['__ModRef'] & ESSNoResRef<TMSchema['__NeastedSchemas'],'__ModRef'>
>;

interface ModelRecordTsTypes<TS extends TsTypesPrimatives> extends Record<string, TS | ModelRecordTsTypes<any>>
{
}

declare module 'mongoose'
{
    function model<
    TMSchema extends MSchema<string, any, any, any, any, any, any, any, any, any, any>, 
    ModelExtracted extends IModelParts<string, any, any, any, any, any, any,any, any, any, {}, any> = IModelPartsFromSchema<TMSchema>
    > (name: string, schema?: Schema, collection?: string, skipInit?: boolean): IModel<ModelExtracted>

    export module Types {

        interface ObjectId
        {
            toString: () => string;   
        }
    }
}

export interface IModel<ModelShape extends IModelParts<string, any, any, any, any, any, any, any, any, any, any, any>>
{

}
  
const schemaRight = new MSchema('MRight', MTypes.ObjectId(),
{},
{},
{},
{},
{},
{},
{},
{},
{},
{},
{})

type td = never extends any ? 'T' :'F'

const schemaLeft = new MSchema('MSchemaName',
MTypes.ObjectId(),
{
    // Must be Required/Modifiable
    aReqSet: MTypes.Boolean(),
    //aOpSet: MTypes.Boolean({required:'Op'}),
    bSet: MTypes.Number({readonly: 'Set'}),
    cSet : MTypes.String({readonly:'Set', required: 'Req', default:''}),
    neasted : MTypes.Record({
        neastedA : MTypes.String({readonly:'Set', required: 'Req', default: undefined})
        //neatedB : {} as IMongooseShape<IShapeTSRecord<{}>, any, any, 'uuuu', never,  'Req', 'Set', never, never>,

        //neastedB : MTypes

    }),

},
{},
{},
{},
{}, {}, {}, {},{},{},{});

const neasted = MTypes.Record({
    neastedA : MTypes.String({readonly:'Set', required: 'Req', default: 'sdf'}),
    neatedB : {} as IMongooseShape<IShapeTSType<boolean>, any, any, '', never, 'Req', 'Get', 'df', never>,

    //neastedB : MTypes

});

type NeastedA = typeof neasted;

type TSType = NeastedA['__tsType'];


type Req = NeastedA['__Optional'];
type R = NeastedA['__Readonly'];
type D = NeastedA['__Default'];
type Ref = NeastedA['__RefType'];

type ReqC = NeastedA['__OptionalConstraints'];
type RC = NeastedA['__ReadonlyConstraints'];
type DC = NeastedA['__DefaultConstraints'];
type RefC = NeastedA['__RefTypeConstraints'];




type uu2 = typeof neasted['__Default'];

const schemaLeft = new MSchema('MSchemaName',
MTypes.ObjectId(),
{
    // Must be Required/Modifiable
    aReqSet: MTypes.Boolean(),
    //aOpSet: MTypes.Boolean({required:'Op'}),
    bSet: MTypes.Number({readonly: 'Set'}),
    mNeasted : MTypes.Record({
        // mNa : MTypes.Number({required:'Req'}),
        // mNb : MTypes.Number({required:'Req', readonly: 'Set'}),
        
       // mNFail : MTypes.Number({required:'Req', readonly: 'Set', default : 3}) //Fails just like expected.
    }),
    //mArraySimpleFail : MTypes.Array(MTypes.String({required:'Op', default: ''}), {required:'Op'}),// Fails like it is expected to

    mArraySimple : MTypes.Array(MTypes.String({required:'Op',readonly:'Set'}), {required:'Op'}),
    mArrayRecord : MTypes.Array({
               //mNFail : MTypes.Number({required:'Req', readonly: 'Set'}),
               mArrayRecordB : MTypes.String({required:'Op'}),
               mArrayRecordC : MTypes.Boolean({required:'Req'}),
              // mArrayRecordD : MTypes.Number({required:'Req', readonly: 'Get'})

               

    }, {required:'Req', readonly:'Set'})
},
{   
    //mRefNumber : MTypes.String(),// This shouldn't be possible, as mRef is never and requirement is somthing and not never.
    mRef : MTypes.Ref(schemaRight),
    mNeastedRef : MTypes.Record({
        mNRefA : MTypes.Ref(schemaRight, {required:'Op'}),
        mNeastedRefNumber: MTypes.Number() //  This should not be possible., I don't know right now why it is not working..
    }),
    mArraySimpleRef : MTypes.Array(MTypes.Ref(schemaRight, {required:'Op'}), {}),
    //mArraySimpleRefNumberfail : MTypes.Array(MTypes.Number(), {}),
    mArrayRef : MTypes.Array({
        mArrayRefA: MTypes.Ref(schemaRight),
       // mArrayRefNumber: MTypes.Number()// this is working....
    },{})
},
{
    aReqSet: MTypes.Boolean(),
    aOpSet: MTypes.Boolean({required: 'Req', readonly:'Get'}),
    bSet: MTypes.Number({readonly: 'Get'}),
    mNeasted : MTypes.Record({
        mNa : MTypes.Number({required:'Req'}),
        mNb : MTypes.Number({required:'Req', readonly: 'Get'}),
        
       // mNFail : MTypes.Number({required:'Req', readonly: 'Get', default : 3}) //Fails just like expected.
    }),
    //mArraySimpleFail: MTypes.Array(MTypes.String({required:'Req', readonly:'Get', default:unknown}), {required:'Req',readonly:'Get'}),// Fails like it is expected to

    mArraySimple : MTypes.Array(MTypes.String({required:'Req', readonly:'Get'}), {required:'Req', readonly:'Get'}),
    mArrayRecord : MTypes.Array({
               mNFail : MTypes.Number({required:'Req', readonly: 'Get', default : 3}),
               mNFail2 : MTypes.Number({required:'Req', readonly: 'Get'}) 
    }, {required:'Op'})
},
{},
{}, {}, {}, {},{},{},{});

const model = mongoose.model(schemaLeft);



// )
// Id extends string,
// Mod extends IMTypeModifiersRecord<any, 'Set', undefined, undefined>,
// ModRef extends IMTypeModifiersRecord<any, 'Set', never, undefined | IMongooseSchemas<any,any,any,any,any,any,any>>,
// NonOpReadDefault extends IMTypeModifiersRecord<'Req', 'Get', never, undefined>,
// NonOpROptional extends IMTypeModifiersRecord<'Req', 'Get', any, undefined>,
// NDefault extends IMTypeModifiersRecord<'Op', any, MongooseTypes, undefined>,
// // NeastedSchemas extends INeastedSchemaRecord<any, any, any, any, any, any>>

// const testinggg = MTypes.Array({
//     //mNFail : MTypes.Number({required:'Req', readonly: 'Set'}),
//     mArrayRecordB : MTypes.String({required:'Op'}),
//     mArrayRecordC : MTypes.Boolean({required:'Req'}),
//     mArrayRecordD : MTypes.Number({required:'Req', readonly: 'Set'})

    

// }, {required:'Req', readonly:'Set'});

// type uuu = typeof testinggg['__ReadonlyConstraints']

// __OptionalConstraints : OptionalConstraints
// __ReadonlyConstraints : ReadonlyConstraints   // Complications I can't detect readonly, so has to be explicity file mm.. How to create teh constructors for this.., I think only in 3.1, which make dynamic name for variable.
// __DefaultConstraints : DefaultConstraints
// __RefTypeConstraints : RefTypeConstraints

// // Extract Schema is the same as extra neasted schema.
// type ESchema<MSchema extends IMongooseSchemas<any, any, any, any, any, any, any>> = 
// ESR<MSchema['__Id']> 
// ESR<MSchema['__Mod']> & 
// ESR<MSchema['__NDefault']> & 
// ESR<MSchema['__NonOpROptional']> & 
// ESR<MSchema['__NonOpReadDefault']>

// & MSchema['____NeastedSchema']


// type ExtractNoRefSchema<MSchema extends IMongooseSchemas<any, any, any, any, any, any, any>> = 
// ESR<MSchema['__Id']> & 
// ESR<MSchema['__Mod']> & 
// ESR<MSchema['__NDefault']> & 
// ESR<MSchema['__NonOpROptional']> & 
// ESR<MSchema['__NonOpReadDefault']>

// type ExtractFullPartialSchema<MSchema extends IMongooseSchemas<any, any, any, any, any, any, any>, Paths extends Record<string, any> = {}> = 
// ESR<MSchema['__Id']> & 
// ESR<MSchema['__Mod']> & 
// ESR<MSchema['__NDefault']> & 
// ESR<MSchema['__NonOpROptional']> & 
// ESR<MSchema['__NonOpReadDefault']> & 
// ExtractSchemaRecordWithPathsPartial<MSchema['__ModRef'], Paths>

// type tekkst = ESR<typeof mMumberSchema['__Mod']>;

// const tek : tekkst = {
//     a: 234,
//     b : true,
//     c: '',
//     d: new Date(),
//     e : [],
//     f: [{
//         z : 223,
//         y: true
//     }],
//     g:
//     {
//         m: 234
//     }
// }

// type refImpl = ExtractSchemaRecordWithPathsPartial<typeof mMumberSchema['__ModRef'], {m:{}}>;

// const refImpl : refImpl = {
// m : {
// a : 234
// }
// }



//const mSchema = new MSchema({
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
    //tArrayObject : arrayTest,
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
//})


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

// const test2 : ExtractTSSchemaType<typeof mSchema,[['Ref'], ["tArrayObject"]]> = {
//     tBoolean : true,
//     tNumber : 345,
//     tObjectId : 'sdf',
//     tString : 'sdf',
//     tBuffer : 'sdf',
//     //Ref :  'sdf'
//     tDecimal : 123,
//     //tArrayPBoolean : [true, false],
//     //tArrayPNumber : [1,2,3,4,5],
//     tArrayObject : [{e : true, f : 234, h : "sdf", Ref :"sdf"}],
//     Ref :  {a:123},
//     object : {
//         a : 1,
//         b : 'sdf',
//         c: true,
//         Ref : 
//             'sdf'
//             //{a : 1}        
//     },
//     schema : { a : 1}
// }


// // Neasted Referance extraction of Type results for an array doesn't work.
// // if want backwards compatability with like 2.6 with out using extends to detect and array, then
// // we are going to have write a combined passing exraction routine for mongoose schema..
// // Managed to get this working for an array, was kind simpler than not.
// // How every required to get this working for Key version as,
// // removed of the key to extract doesn't correctly fall back, required to find 
// // and check that constaint explicityly now.

// // This is an obscure bug, in that, when first key matches and object, that the second key at a different level
// // can also match.
// // I need to reduce the paths list by the number of matching keys, how do I do this??
// export type NarrowPaths<K extends string, T extends any, Paths extends {[index:string] : any}, Depth extends string = '0', iterate extends {[index:string] : string} = itemElements> = 

// ({[Path in keyof ExtractArrayItems<Paths>] : Paths[Path][Depth] extends K ? Paths[Path] : never
                    
// })[keyof ExtractArrayItems<Paths>]  // This now changes the format of things.. to union of types..
// // were we implicitly evaluate both side of the unions, as the type enginer does that for us.
// // So if convet array to union, then both permutation are evaluted for us
// // we could use this to our advantage, because then we don't have to iterate everything.
// // lets first restructure so that we narrow the paths to those that match, which are then converted to 
// // typle types.
// // the other alternative, is that we need to be matching all the previous values all the time, but that not avaliable to us.
// // the other approach would be to pass in the matching path, which match.

// type obj = {
//     a : {
//         b: number,
//         c : string,
//         e : boolean
//     }
// }

// type rrr = NarrowPaths<"a", obj, [['a', 'b'], ['a', 'c']]>
// type uu<T extends Array<string>> = {
//     [K in keyof T] : K
// }


// type mmm = uu<rrr>

// // Can it ever work in older versions?
// const test3 : ExtractRelationshipType<test,[['Ref'],
// ['object','Ref']
// ,["tArrayObject","Ref"]
// ]> = {
//     tBoolean : true,
//     tNumber : 345,
//     tObjectId : 'sdf',
//     tString : 'sdf',
//     tBuffer : 'sdf',
//     tDecimal : 123,
//    // tArrayPBoolean : [true, false],
//     //tArrayPNumber : [1,2,3,4,5],
//     tArrayObject : [{e : true, f : 234, h : "sdf", Ref :  
//     {a : 1}
//   //"xc"
// }, {e : true, f : 234, h : "ssdf", Ref :  
// {a : 1}
// //""
// }],
//     //Ref :  'sdf'
//     Ref :  {a:123},
//     object : {
//         a : 1,
//         b : 'sdf',
//         c: true,
//         Ref : 
//             //'sdf'
//             {a : 1}        
//     },
//     schema : { a : 1}
// }



// var schema = new Schema({
//     name:    String,
//     binary:  Buffer,
//     living:  Boolean,
//     updated: { type: Date, default: Date.now },
//     age:     { type: Number, min: 18, max: 65 },
//     mixed:   Schema.Types.Mixed,
//     _someId: Schema.Types.ObjectId,
//     decimal: Schema.Types.Decimal128,
//     array: [],
//     ofString: [String],
//     ofNumber: [Number],
//     ofDates: [Date],
//     ofBuffer: [Buffer],
//     ofBoolean: [Boolean],
//     ofMixed: [Schema.Types.Mixed],
//     ofObjectId: [Schema.Types.ObjectId],
//     ofArrays: [[]],
//     ofArrayOfNumbers: [[Number]],
//     nested: {
//       stuff: { type: String, lowercase: true, trim: true }
//     },
//     map: Map,
//     mapOfString: {
//       type: Map,
//       of: String
//     }
//   })