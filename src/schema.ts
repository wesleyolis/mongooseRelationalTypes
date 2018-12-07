//import {ExtractArrayItems, itemElements, KeyInPathsAtDepthKey} from './index'
import * as mongoose from 'mongoose';
import { FindAndUpdateOption } from 'mongoose';
import { Query } from 'mongoose';
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
type IShapeContainersID = IShapeTSRecord<any>['__ID'] | IShapeTSArrayNeasted<any>['__ID'] | IShapeTSArrayRecord<any>['__ID']

type IShapeRefContainers = IShapeContainers | IShapeTSRef<any>;//IShapeTSSchema
type IShapeRefContainersID = IShapeContainersID | IShapeTSRef<any>['__ID']

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

//type IShapeRecordExtends = Record<string, ITSShapes> | null
type IShapeRecordExtends = Record<string, ITSShape<any, ID>> | null

interface IShapeTSRecord<T extends IShapeRecordExtends> extends ITSShape<T, 'R'>
{
    __tsType : T;
}

function ShapeTSRecord<T extends IShapeRecordExtends>(rec : T)
{
    return new Shape<IShapeTSRecord<T>>('R', rec).TSTypeCastUp();
}

type IShapeArrayNeastedExtendsID = 'T' | 'S' | 'AN' | 'AR' | 'Ref'
type IShapeArrayNeastedExtends = ITSShape<IShapeArrayNeastedExtendsID, any>//IShapeTSType<any> | IShapeTSRef<any> | IShapeTSSchema<any> | IShapeTSArrayNeasted<any> | IShapeTSArrayRecord<any>;

interface IShapeTSArrayNeasted<T extends IShapeArrayNeastedExtends> extends ITSShape<any, 'AN'>
{
    __tsType : {w:T};
}

function ShapeTSArray<T extends IShapeArrayNeastedExtends>(record : T)
{
    return new Shape<IShapeTSArrayNeasted<T>>('AN', record).TSTypeCastUp();
}

type IShapeTSArrayRecordExtends = Record<string, ITSShape<ID, any>> | null;

interface IShapeTSArrayRecord<T extends IShapeTSArrayRecordExtends> extends ITSShape<T, 'AR'>
{
    __tsType : T;
}

function ShapeTSArrayRecord<T extends IShapeTSArrayRecordExtends>(record : T)
{
    return new Shape<IShapeTSArrayRecord<T>>('AR', record).TSTypeCastUp();
}

interface IShapeTSRef<T extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>> extends ITSShape<T,'Ref'>
{
    __tsType : T;
}

// Going to have to put in some work here.. as number capture, doesn't reveal
// the runtime type, which is what previously happened.
// The right hand side of the schema wil be captured on the right.
// lets just get this all working.
function ShapeTSRef<T extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>>()
{
    return new Shape<IShapeTSRef<T>>('Ref').TSTypeCastUp();
}

interface IShapeTSSchema<T extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>>
extends ITSShape<T, 'S'> 
{
    __tsType : T;
}

function ShapeTSSchema<T extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>>()
{
    return new Shape<IShapeTSSchema<T>>('S').TSTypeCastUp();
}

// type TesResult = ITSModifiersWithConstraints<any, any, any, any, any, any, any, any, any, any, IShapeTSType<number>, any> extends 
// ITSModifiersWithConstraints<any,any,any,any,any,any,any,any,any,any, IShapeTSArrayNeasted<any>,any> ?
// 'T' : 'F'

type GenAdaptersSchemaOptions = Record<GenAdapters, Record<string, any>>;

type GenAdaptersFieldTypesOptions = Record<GenAdapters, Record<string, any>>;

type IFieldDef<Options extends GenAdaptersFieldTypesOptions> = 
IShape<any,any> & IMTypeModifiers<any, any, any, any, any, any, any, any, any, any> & Options;

type IteratorSchemaContext = {
    schema : ISchema<any, any, any, any, any, any, any, any, any, any,any, any, any>,
    parentSchema : ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any> | undefined,
    rootSchema : ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any> | undefined,
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
        ModRD extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Set', any, undefined>,
        ModRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Set', undefined, undefined>,
        ModOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', any, undefined>,
        ModOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', undefined, undefined>,
        ReadRD extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', any, undefined>,
        ReadRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', undefined, undefined>,
        ReadOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
        ReadOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
        ModRef extends ITSModifiersRecord<IShapeRefContainersID, any, any, any, any, any>,
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

    Record<Record extends ITSModifiersRecord<ID, any, any, any, any, any>>(rec : Record)
    {
        return NewModifiersWithConstraints(ShapeTSRecord(rec), 'Record', {} as FieldOptions,
        {} as ExtractRecordModfierConstraints<Record,'__ID', '__IDConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Required', '__RequiredConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Readonly','__ReadonlyConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Nullable','__NullableConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__Default','__DefaultConstraints'>,
        {} as ExtractRecordModfierConstraints<Record,'__RefType','__RefTypeConstraints'>);
    }

    // Because types can't differentiate which method to call, there is no
    // way to capture the runtime differances, but with runTime methods with different names.

    Array<Record extends ITSShapeModifiersFunWithConstraints<IShapeArrayNeastedExtendsID, any, any, any, any, any, IShapeArrayNeastedExtendsID | undefined, any, any, any, any, any, any, any>
    >(items : Record)
    {
        return NewModifiers(ShapeTSArray(items), 'ArrayNeasted', {} as FieldOptions);
    }

    ArrayRecord<Record extends ITSModifiersRecord<ID, any, any, any, any, any>>(items : Record)
    {
        return NewModifiersWithConstraints(ShapeTSArrayRecord(items), 'ArrayRecord', {} as FieldOptions,
        {} as ExtractRecordModfierConstraints<Record,'__ID', '__IDConstraints'>,
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
        undefined,// Doesn't make logical sense.
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
    Schema<Schema extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>>(object : Schema)
    {
        return NewModifiersWithConstraints(ShapeTSSchema<Schema>(), 'Schema', {} as FieldOptions,
        undefined,
        {} as ExtractRecordModfierConstraints<Schema['__ModRD'],'__Required', '__RequiredConstraints'> |
                ExtractRecordModfierConstraints<Schema['__ModRND'],'__Required', '__RequiredConstraints'>,
        {} as ExtractRecordModfierConstraints<Schema['__ModOD'],'__Readonly','__ReadonlyConstraints'> |
                ExtractRecordModfierConstraints<Schema['__ModOND'],'__Readonly','__ReadonlyConstraints'>,
        undefined as undefined,
        {} as ExtractRecordModfierConstraints<Schema['__ReadRD'],'__Default','__DefaultConstraints'> | 
                ExtractRecordModfierConstraints<Schema['__ReadRND'],'__Default','__DefaultConstraints'>,
        {} as ExtractRecordModfierConstraints<Schema['__ReadOD'],'__RefType','__RefTypeConstraints'> |
                ExtractRecordModfierConstraints<Schema['__ReadOND'],'__RefType','__RefTypeConstraints'>,
       // {} as Schema
        );
    }
}   

type TypesPrimative = 'Boolean' | 'Number' | 'String' | 'Date' | 'Record' | 'ArrayNeasted' | 'ArrayRecord' | 'RefType' | 'Schema' | 'ObjectIdString' | undefined

type _Required = 'Req' | 'Op'
type _Readonly = 'Get' | 'Set'
type _Nullable = 'Nullable' | 'Value'
type _Default = TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null | undefined
type _RefType = ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any> | undefined 
type _OptionsAnontations = Record<string, any>

interface IModifiers<TOptions extends _OptionsAnontations> extends IShape<ID, any>
{
    id : ID,
    neasted : any;  // This can be better typed later on.
    type: TypesPrimative;
    required: _Required;
    readonly: _Readonly;
    nullable: _Nullable;
    init: _Default;
    refType: _RefType;
    options : TOptions | undefined;
}

interface ITSModifiers<
    TShapeID extends ID,
    TRequired extends _Required,
    TReadonly extends _Readonly,
    TNullable extends _Nullable,
    TDefault extends _Default,
    TRefType extends _RefType,
    TSType extends any, // Required for pass tought of types formats, to match that of the Shapes.
    TOptionsAnotations extends _OptionsAnontations
> extends IModifiers<TOptionsAnotations>, ITSShape<any, ID>{
    __ID: TShapeID;
    __Type: TypesPrimative;
    __Required: TRequired;
    __Readonly: TReadonly;
    __Nullable: TNullable;
    __Default: TDefault;
    __RefType: TRefType;
    __tsType : TSType;
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
    TShapeID extends ID,
    TRequired extends _Required,
    TReadonly extends _Readonly,
    TNullable extends _Nullable,
    TDefault extends _Default,
    TRefType extends _RefType,
    TShapeIDConstraint extends ID | undefined,
    RequiredConstraint extends _Required | undefined, 
    ReadonlyConstraint extends _Readonly | undefined,
    NullableConstraint extends _Nullable | undefined,
    DefaultConstraint extends _Default,
    RefTypeConstraint extends _RefType,
    TShape extends ITSShape<any,any>,
    TOptionsAnotations extends _OptionsAnontations,
> extends ITSModifiers<TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape['__tsType'], TOptionsAnotations>{
    __IDConstraints : TShapeIDConstraint
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

function NewModifiers<TAvaliableOptions extends _OptionsAnontations,
    TShape extends ITSShape<any, any>
    >(shape : TShape, type : TypesPrimative, __options : TAvaliableOptions)
    {
        return new Modifiers<'Op', 'Set', 'Value', undefined, undefined, TShape, TAvaliableOptions>
        (shape, type, 'Op', 'Set', 'Value', undefined, undefined, undefined) as any as ITSShapeModifiersFunWithConstraints<TShape['__ID'], 'Op', 'Set', 'Value', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, TShape, TAvaliableOptions>
    }

    function NewModifiersWithConstraints<TAvaliableOptions extends _OptionsAnontations,
    TShape extends ITSShape<any, any>,
    TShapeConstraintsID extends ID | undefined,
    TRequiredConstraint extends _Required | undefined, 
    TReadonlyConstraint extends _Readonly | undefined,
    TNullableConstraint extends _Nullable | undefined,
    TDefaultConstraint extends _Default,
    TRefTypeConstraint extends _RefType,
    TRefType extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>
    >(shape : TShape, type : TypesPrimative, __options : TAvaliableOptions,
        __ShapeIDConstraints : TShapeConstraintsID,
        __RequiredConstraints : TRequiredConstraint,
        __ReadonlyConstraints : TReadonlyConstraint,
        __NullableConstraints : TNullableConstraint,
        __DefaultConstraints : TDefaultConstraint,
        __RefTypeConstraints : TRefTypeConstraint
        )
    {
        return new Modifiers<'Op', 'Set', 'Value', undefined, undefined, TShape, TAvaliableOptions>
        (shape, type, 'Op', 'Set', 'Value', undefined, undefined) as any as ITSShapeModifiersFunWithConstraints<TShape['__ID'],'Op', 'Set', 'Value', undefined, undefined, TShapeConstraintsID, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    }

    function NewModifiersWithConstraintsAndRefType<TAvaliableOptions extends _OptionsAnontations,
    TShape extends ITSShape<any, any>,
    TShapeConstraintsID extends ID | undefined,
    TRequiredConstraint extends _Required | undefined, 
    TReadonlyConstraint extends _Readonly | undefined,
    TNullableConstraint extends _Nullable | undefined,
    TDefaultConstraint extends _Default,
    TRefTypeConstraint extends _RefType,
    TRefType extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>
    >(shape : TShape, type : TypesPrimative, __options : TAvaliableOptions,
        __ShapeIDConstraints : TShapeConstraintsID,
        __RequiredConstraints : TRequiredConstraint,
        __ReadonlyConstraints : TReadonlyConstraint,
        __NullableConstraints : TNullableConstraint,
        __DefaultConstraints : TDefaultConstraint,
        __RefTypeConstraints : TRefTypeConstraint,
        __RefType : TRefType
        )
    {
        return new Modifiers<'Op', 'Set', 'Value', undefined, undefined, TShape, TAvaliableOptions>
        (shape, type, 'Op', 'Set', 'Value', undefined, __RefType ? __RefType['__Name'] : undefined) as any as ITSShapeModifiersFunWithConstraints<TShape['__ID'], 'Op', 'Set', 'Value', undefined, TRefType, TShapeConstraintsID, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
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
TShapeID extends ID,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
TShapeIDConstraint extends ID | undefined,
TRequiredConstraint extends _Required | undefined, 
TReadonlyConstraint extends _Readonly | undefined,
TNullableConstraint extends _Nullable | undefined,
TDefaultConstraint extends _Default,
TRefTypeConstraint extends _RefType,
TShape extends ITSShape<any, any>,
TAvaliableOptions extends _OptionsAnontations>
{
    Anotations(options : TAvaliableOptions): ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShapeIDConstraint, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Options(options : TAvaliableOptions): ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShapeIDConstraint, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Required(): ITSShapeModifiersFunWithConstraints<TShapeID, 'Req', TReadonly, TNullable, TDefault, TRefType, TShapeIDConstraint, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Optional(): ITSShapeModifiersFunWithConstraints<TShapeID, 'Op', TReadonly, TNullable, TDefault, TRefType, TShapeIDConstraint, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Nullable() : ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, 'Nullable', TDefault, TRefType, TShapeIDConstraint, TRequiredConstraint, TReadonlyConstraint, TNullableConstraint, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Readonly() : ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, 'Get', TNullable, TDefault, TRefType, TShapeIDConstraint, TRequiredConstraint, TReadonlyConstraint, TNullable, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
    Default<DValue extends TShape['neasted'] | (TNullable extends 'Nullable' ? null : never)>(dValue : DValue) : 
    ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, TNullable, DValue, TRefType, TShapeIDConstraint, TRequiredConstraint, TReadonlyConstraint, TNullable, TDefaultConstraint, TRefTypeConstraint, TShape, TAvaliableOptions>
}

type ITSShapeModifiersFunWithConstraintsSimple<
TShapeID extends ID,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
TShape extends ITSShape<any, any>,
TAvaliableOptions extends _OptionsAnontations> = ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>

interface ITSShapeModifiersFunWithConstraints<
TShapeID extends ID,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
TShapeIDConstraint extends ID | undefined,
RequiredConstraint extends _Required | undefined, 
ReadonlyConstraint extends _Readonly | undefined,
NullableConstraint extends _Nullable | undefined,
DefaultConstraint extends _Default,
RefTypeConstraint extends _RefType,
TShape extends ITSShape<any, any>,
TAvaliableOptions extends _OptionsAnontations
> extends ITSModifiersWithConstraints<TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType,
TShapeIDConstraint, RequiredConstraint, ReadonlyConstraint, NullableConstraint, DefaultConstraint, RefTypeConstraint, TShape, TAvaliableOptions>,
IModifiersFunctions<TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType,
TShapeIDConstraint, RequiredConstraint, ReadonlyConstraint, NullableConstraint, DefaultConstraint, RefTypeConstraint, TShape, TAvaliableOptions>
{

}

// interface IModifiersFunWithConstraints<
// TAvaliableOptions extends _OptionsAnontations,
// TShape extends ITSShape<any, any>,
// TRequired extends _Required,
// TReadonly extends _Readonly,
// TNullable extends _Nullable,
// TDefault extends _Default,
// TRefType extends _RefType,
// RequiredConstraint extends _Required | undefined = TRequired, 
// ReadonlyConstraint extends _Readonly | undefined = TReadonly,
// NullableConstraint extends _Nullable | undefined = TNullable,
// DefaultConstraint extends _Default = TDefault,
// RefTypeConstraint extends _RefType = TRefType>
// extends ITSModifiersWithConstraints<TRequired, TReadonly, TNullable, TDefault, TRefType,
// RequiredConstraint, ReadonlyConstraint, NullableConstraint, DefaultConstraint, RefTypeConstraint, TShape, TAvaliableOptions>, 
// IModifiersFunctions<TRequired, TReadonly, TNullable, TDefault, TRefType,
// RequiredConstraint, ReadonlyConstraint, NullableConstraint, DefaultConstraint, RefTypeConstraint, TShape, TAvaliableOptions> {

// }

class Modifiers<
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
TShape extends ITSShape<any, any>,
TAvaliableOptions extends _OptionsAnontations,
TShapeID extends ID = any>
implements IModifiers<TAvaliableOptions>, 
IShape<TShape['id'], TShape['neasted']>,
IModifiersFunctions<any, TRequired, TReadonly, TNullable, TDefault, TRefType, any, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
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
    public Anotations(options :TAvaliableOptions) : ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.options = options;
        return this as any;
    }

    public Options(options : TAvaliableOptions) : ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.options = options;
        return this as any;
    }

    public Required() : ITSShapeModifiersFunWithConstraints<TShapeID, 'Req', TReadonly, TNullable, TDefault, TRefType, TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.required = 'Req';
        return this as any;
    }

    public Optional() : ITSShapeModifiersFunWithConstraints<TShapeID, 'Op', TReadonly, TNullable, TDefault, TRefType, TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {        
        this.required = 'Op';
        return this as any;
    }

    public Nullable() : ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, 'Nullable', TDefault, TRefType, TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.nullable = 'Nullable';
        return this as any;
    }

    public Readonly() : ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, 'Get', TNullable, TDefault, TRefType, TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions,>
    {
        this.readonly = 'Get';
        return this as any;
    }

    public Default<DValue extends TShape['neasted'] | (TNullable extends 'Nullable' ? null : never)>(dValue : DValue) : ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, TNullable, DValue, TRefType, TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
    {
        this.init = dValue;
        return this as any;
    }
}


interface ITSModifiersRecord<
TShapeID extends ID,
TShape extends ITSShape<any,any>,
TRequired extends _Required,
TReadonly extends _Readonly,
TDefault extends _Default,
TRefType extends _RefType | undefined,
TShapeIDConstraints extends ID | undefined = TShapeID | undefined,
TRequiredConstraints extends _Required | undefined = TRequired | undefined, 
TReadonlyConstraints extends _Readonly | undefined = TReadonly | undefined,
TDefaultConstraints extends _Default| undefined = TDefault | undefined,
TRefTypeConstraints extends _RefType | undefined = TRefType | undefined,
> extends
Record<string, ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, TReadonly, any, TDefault, TRefType, TShapeIDConstraints, TRequiredConstraints, TReadonlyConstraints, any, TDefaultConstraints, TRefTypeConstraints, TShape, any>>
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

type INeastedSchemaRecord = Record<string, (ITSModifiersWithConstraints<any, any, any, any, any, any, any, any, any, any, any, any, any, IShapeContainers | IShapeTSSchema<any>>)>

type ExtractRecordModfierConstraints<T extends Record<string, ITSShapeModifiersFunWithConstraints<any, any, any, any, any, any, any, any, any, any, any, any, any, any>>, 
Modifier extends '__ID' | '__Required' | '__Readonly' | '__Nullable' | '__Default' | '__RefType',
ModifierConstraint extends '__IDConstraints' | '__RequiredConstraints' | '__ReadonlyConstraints' | '__NullableConstraints' | '__DefaultConstraints' | '__RefTypeConstraints'> = {
    [K in keyof T] : T[K][Modifier] | T[K][ModifierConstraint]
}[keyof T]


interface ISchema<
    Name extends string,
    Id extends string,
    ModRD extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Set', any, undefined>,
    ModRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Set', undefined, undefined>,
    ModOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', any, undefined>,
    ModOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', undefined, undefined>,
    ReadRD extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', any, undefined>,
    ReadRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', undefined, undefined>,
    ReadOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
    ReadOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
    ModRef extends ITSModifiersRecord<IShapeRefContainersID, any, any, any, any, any>,
    NeastedSchemas extends INeastedSchemaRecord,
    SchemaOptions extends Record<string, any> | undefined,
    >
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
        __NeastedSchemas : NeastedSchemas,
        __SchemaOptions : SchemaOptions        
}

class Schema<
Name extends string,
Id extends string,
ModRD extends ITSModifiersRecord<any, ITSShapes,'Req', 'Set', any, undefined>,
ModRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Set', undefined, undefined>,
ModOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', any, undefined>,
ModOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', undefined, undefined>,
ReadRD extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', any, undefined>,
ReadRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', undefined, undefined>,
ReadOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
ReadOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
ModRef extends ITSModifiersRecord<IShapeRefContainersID, any, any, any, any, any>,,
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
ModRD extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Set', any, undefined>,
ModRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Set', undefined, undefined>,
ModOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', any, undefined>,
ModOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', undefined, undefined>,
ReadRD extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', any, undefined>,
ReadRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', undefined, undefined>,
ReadOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
ReadOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
ModRef extends ITSModifiersRecord<IShapeRefContainersID, any, any, any, any, any>,
NeastedSchemas extends INeastedSchemaRecord,
SchemaOptions extends Record<string,any>>
extends ISchema<Name, Id, ModRD, ModRND, ModOD, ModOND, ReadRD, ReadRND, ReadOD, ReadOND, ModRef, NeastedSchemas, SchemaOptions>
{
    partialName : TPartialName,
}

class SchemaPartial<
TPartialName extends string,
BaseSchema extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, SchemaOptions>,
ModRD extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Set', any, undefined>,
ModRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Set', undefined, undefined>,
ModOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', any, undefined>,
ModOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Set', undefined, undefined>,
ReadRD extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', any, undefined>,
ReadRND extends ITSModifiersRecord<any, ITSShapes, 'Req', 'Get', undefined, undefined>,
ReadOD extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
ReadOND extends ITSModifiersRecord<any, ITSShapes, 'Op', 'Get', undefined, undefined>,
ModRef extends ITSModifiersRecord<IShapeRefContainersID, any, any, any, any, any>,
NeastedSchemas extends INeastedSchemaRecord,
SchemaOptions extends Record<string,any> | undefined>
implements ISchema<BaseSchema['__Name'], BaseSchema['__Id'], ModRD, ModRND, ModOD, ModOND, ReadRD, ReadRND, ReadOD, ReadOND, ModRef, NeastedSchemas, SchemaOptions>
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
        public __SchemaOptions : BaseSchema['__SchemaOptions'] = baseSchema['__SchemaOptions'],
        public __Id : BaseSchema['__Id'] = baseSchema['__Id'],
        public __Name : BaseSchema['__Name']
    )
    {
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
    // })).Required(),// Must rather use ArrayRecord
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

    //,refType : GSchema.RefType(schemaARight).Required()// Invalid - But not pretty to debug the message, because of the type
    // capturing.. Mabye later, could just be a name list were they are all first regsitered, so that
    // We can reduce the list name to , difficault, because would be no ways to validate things, until runtime, which not what is wanted.
},{
    //c : GSchema.Boolean().Required().Default(false), // Invalid Default false - Good
    //d : GSchema.Number().Required().Default(34), // Invalid Default false - Good
    e : GSchema.Number().Required().Nullable().Anotations({'Mongoose' : {}}),
    neasted : GSchema.Record({
        NNa : GSchema.Boolean().Required(),
        NArray : GSchema.Array(GSchema.Boolean().Required()).Required(),
        NArrayRrecord : GSchema.ArrayRecord({
            NARa : GSchema.Number().Required(),
            NARb : GSchema.String().Required(),
            NAR : GSchema.Record({}).Required(),
            NARA : GSchema.Array(GSchema.Number().Required()).Required()
        }).Required()
    }).Required()  // Any Record
},{

},{},{},{},{},{},{
    //primative : GSchema.Boolean(),
    refType : GSchema.RefType(schemaARight).Required(),
    neasted : GSchema.Record({
        //Na : GSchema.Number().Required() // Need to fix constraints from here again.*********************************************************************
        Nb : GSchema.RefType(schemaARight).Required()
    }).Required()
},{},{Mongoose:{collation:'',}});

const Neasted__ = GSchema.Record({
    Na : GSchema.Number().Required(),
    Nb : GSchema.RefType(schemaARight).Required()
}).Required();


type res = typeof Neasted__['__RefTypeConstraints'];

type EROM<Mod extends ITSShapeModifiersFunWithConstraints<any, any, any, any, any, any, any, any, any, any, any, any, any, any>, T extends any> = ({
    'Req' : T 
    'Op' : T | undefined
})[Mod['__Required']];

type ESRec<T extends ITSModifiersRecord<any, any, any, any, any, any>> = {
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
        nA :true,
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

type ESRefId<T extends ITSModifiersRecord<any, any, any, any, any, any>> =
{
    [P in keyof T] : 
    ({
        'T' : 'Invalid Option Here'
        'R' : EROM<T[P], ESRedId<T[P]['__tsType']>>
        'AN' : EROM<T[P], ESRedId<T[P]['__tsType']>['w'][]>
        'AR' : EROM<T[P], ESRedId<T[P]['__tsType']>[]>
        'Ref' : T[P]['__tsType']['__ID']
        'S' : ESRedId<T[P]['__tsType']['__ModRef']>
    })[T[P]['__ID']]
}

type ESSRec<T extends ITSModifiersRecord<any, any, any, any, any, any>,
Path extends '__ModRD' | '__ModRND' | '__ModOD' | '__ModOND' | '__ReadRD' | '__ReadRND' | '__ReadOD' | '__ReadOND' | '__ModRef'> = {
    [P in keyof T] : 
    ({
        'T' : EROM<T[P], T[P]['__tsType']>,
        'R' : EROM<T[P], ESSRec<T[P]['__tsType'], Path>>,
        'AN' : EROM<T[P],ESSRec<T[P]['__tsType'], Path>['w'][]>,
        'AR' : EROM<T[P],ESSRec<T[P]['__tsType'], Path>[]>
        'Ref' : T[P]// Leave untouched for futher passing.
        'S' : ESSRec<T[P]['__tsType'][Path], Path>
    })[T[P]['__ID']]
}

type ESRefs<T extends ITSModifiersRecord<any, any, any, any, any, any>, Paths extends Record<string,any>> =
{
    [P in keyof T] : P extends keyof Paths ? 
    ({
        'T' : 'Invalid Option Here'
        'R' : EROM<T[P], ESRefs<T[P]['__tsType'], Paths>>
        'AN' : EROM<T[P], ESRefs<T[P]['__tsType'], Paths>['w'][]>
        'AR' : EROM<T[P], ESRefs<T[P]['__tsType'], Paths>[]>
        'Ref' : P extends keyof Paths ? T[P]['__tsType'] : never
        'S' : ESRefs<T[P]['__tsType']['__ModRef']>
    })[T[P]['__ID']]
    : never
}

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

type ExtractMRefTypes<T extends Record<string, any>, Paths extends Record<string, any>> =
{
    [K in keyof T] : K extends keyof Paths ?
        T[K] extends IShapeTSRef<any> | undefined ?
            T[K]['__tsType']
            : T[K] extends Record<string, any> | undefined ?
                ExtractMRefTypes<T[K]['__tsType'], Paths[K]>
            : T[K] extends Array<infer A> | undefined ?
                ExtractMRefTypes<A, Paths[K]> []
            : 'Mismatch shape'
    : never
}

type MRequired<T extends Record<string, any>> = 
{
    [K in keyof T] -?: NonNullable<T[K]>
}

interface ModelRecordTSRefType extends Record<string, ModelRecordTSRefType | IShapeTSRef<any>>
{
}

type MPrimatives = boolean | number | string | Date;

interface IMModelRecordTsTypes<T extends Record<string,any>> extends Record<string, IMModelRecordTsTypes<any> | MPrimatives>
{

}

// I would need to add the model for parts, that from int he shape of IAdapters system.
// I am going to take a short cut here first, but simpler swap out after ways.

// See if I can make mutiple different version of ModelRecordTsType, that check Required, Optional, Readonly
// But this can only really be done in the latest typesript versions.
interface IMModelParts<
Id extends string, 
ModRD extends IMModelRecordTsTypes<any>,
ModRND extends IMModelRecordTsTypes<any>,
ModOD extends IMModelRecordTsTypes<any>,
ModOND extends IMModelRecordTsTypes<any>,
ReadRD extends IMModelRecordTsTypes<any>,
ReadRND extends IMModelRecordTsTypes<any>,
ReadOD extends IMModelRecordTsTypes<any>,
ReadOND extends IMModelRecordTsTypes<any>,
ModRefIds extends IMModelRecordTsTypes<any>,      // Used to spesify it must have these fields, irrelavant if modRef is populated, only there for sub sections.
ModRefTypes extends IMModelRecordTsTypes<any>,    // Can add in a specially modifier.   // User to spesify it msut have there fields irrelacant if Mod Ref is populated, only there for sub sections.
ModRef extends ITSModifiersRecord<any, any, any, any, any, any>> // Use the populates or extraction method... but should be removed as soon as it is not required.
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

type MRecordId<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
{
    _id : TModelParts['__Id']
}

type MNewRecord<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
    TModelParts['__ModOD'] & 
    TModelParts['__ModOND'] & 
    Partial<TModelParts['__ModRD']> & 
    TModelParts['__ModRND'] & 
    Partial<TModelParts['__ReadRD']> & 
    TModelParts['__ReadRND'] & 
    TModelParts['__ReadOD'] & 
    TModelParts['__ReadOND']

type MUpdate<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
    Partial<TModelParts['__ModRD']> &
    Partial<TModelParts['__ModRND']> &
    TModelParts['__ModOD'] &
    TModelParts['__ModOND']

type MResults<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
    MRecordId<TModelParts> &
    TModelParts['__ModRD'] &
    TModelParts['__ModRND'] &
    MRequired<TModelParts['__ModOD']> &
    TModelParts['__ModOND'] &
    TModelParts['__ReadRD'] &
    TModelParts['__ReadRND'] &
    TModelParts['__ReadOND'] &
    MRequired<TModelParts['__ReadOD']>


export type ExtractPathValidator<T extends any, Keys extends Record<string,any>> = any
//     TKeys = keyof Keys,
//     TRefKeys extends string = ExtractIRefKeys<T>,
//     TTransformed = TransformPartial<T,keyof Keys>
//     > = 
//     {
//     [K in keyof TTransformed]? : 
//         K extends TKeys ?
//             Keys[K] extends Record<string,never> ?
//                 Record<string,never>  
//             : Keys[K] extends 'id' ? 
//                 K extends TRefKeys ? 'id' : never
//             : Keys[K] extends 'never' ? 
//                 K extends TRefKeys ? 'never' : never
            
//             : TTransformed[K] extends Array<IPlainType<any>> | undefined ? never
//                 : TTransformed[K] extends IPlainType<any> | undefined ? never
//                 : TTransformed[K] extends Array<IPlainType<any>> | undefined ? never
//                 : TTransformed[K] extends IRefType<any> | undefined ? 'should never happen'
//                 : TTransformed[K] extends Array<infer Arr> | undefined ?
//                     ExtractTranformValidate<Arr,Keys[K]>
//                     : ExtractTranformValidate<TTransformed[K],Keys[K]>
                    
//         : never  
// }


// export type ExtractPickValidate<T extends any, Keys extends Record<string,any>,
// TKeys = keyof Keys,
// TTransformed = TransformPartial<T,keyof Keys>
// > = 
// {
//    [K in keyof TTransformed]? : 
//        K extends TKeys ? 
//             Keys[K] extends Record<string,never> ?
//                Record<string,never>  

//             : TTransformed[K] extends IPlainType<any> | undefined ? never
//             : TTransformed[K] extends Array<IPlainType<any>>  | undefined ? never
//                : TTransformed[K] extends IPlainType<any> | undefined ? never
//                : TTransformed[K] extends Array<IPlainType<any>> | undefined ? never
//                : TTransformed[K] extends Array<IRefType<infer Arr>> | undefined ? 
//                     Record<string,never> | 'id'
//                 : TTransformed[K] extends Array<infer Arr> | undefined?
//                     ExtractPickValidate<Arr,Keys[K]>
//                    : ExtractPickValidate<TTransformed[K],Keys[K]> 
//        : never  
// }

// This will be flesh out later on.
// type IModelPartsFromSchema<TSchema extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>> = IModelParts<
// TSchema['__Id'],
// ESRec<TSchema['__ModRD']> & ESSRec<TSchema['__NeastedSchemas'],'__ModRD'>,
// ESRec<TSchema['__ModRND']> & ESSRec<TSchema['__NeastedSchemas'],'__ModRND'>,
// ESRec<TSchema['__ModOD']> & ESSRec<TSchema['__NeastedSchemas'],'__ModOD'>,
// ESRec<TSchema['__ModOND']> & ESSRec<TSchema['__NeastedSchemas'],'__ModOND'>,
// ESRec<TSchema['__ReadRD']> & ESSRec<TSchema['__NeastedSchemas'],'__ReadRD'>, 
// ESRec<TSchema['__ReadRND']> & ESSRec<TSchema['__NeastedSchemas'],'__ReadRND'>, 
// ESRec<TSchema['__ReadOD']> & ESSRec<TSchema['__NeastedSchemas'],'__ReadOD'>, 
// ESRec<TSchema['__ReadOND']> & ESSRec<TSchema['__NeastedSchemas'],'__ReadOND'>, 
// ESRedId<TSchema['__ModRef']> & ESRedId<TSchema['__NeastedSchemas']>,
// {},// Seeding that we require no find extracted form.
// TSchema['__ModRef'] & ESSNoResRef<TMSchema['__NeastedSchemas'],'__ModRef'>
// >;

interface ModelRecordTsTypes<TS extends TsTypesPrimatives> extends Record<string, TS | ModelRecordTsTypes<any>>
{
}

declare module 'mongoose'
{
//     function model<
//     TMSchema extends ISchema<string, any, any, any, any, any, any, any, any, any, any, any, any>, 
//     ModelExtracted extends IModelParts<string, any, any, any, any, any, any,any, any, any, {}, any> = IModelPartsFromSchema<TMSchema>
//     > (name: string, schema?: Schema, collection?: string, skipInit?: boolean): IModel<ModelExtracted>

    function model<ModelExtracted extends IMModelParts<string, any, any, any, any, any, any, any, any, any, {}, any>
    > (name: string, schema?: mongoose.Schema, collection?: string, skipInit?: boolean): IModel<ModelExtracted>

    export module Types {

        interface ObjectId
        {
            toString: () => string;   
        }
    }
}

export type ObjectGetValue<O extends Record<string,any>, K extends string> = O[K]
      
// Need to just decided on how and when to apply the transform.
export type QueryResultsDocumentModel<RecordTransformed, ArrayOfResults extends 'A' | 'O', Primative extends undefined | unknown,
Lean extends 'T' | 'F', TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>> =
       Lean extends 'T' ? 
            Primative extends undefined ? 
                ArrayOfResults extends 'O' ? 
                    RecordTransformed
               : Array<RecordTransformed>
               : Primative
       : ArrayOfResults extends 'O' ? 
           Primative extends undefined ?
                RecordTransformed & DocumentEnhanced<TModelParts>
                : Primative & DocumentEnhanced<TModelParts>
           : Array<RecordTransformed & DocumentEnhanced<TModelParts>>


interface IModel<TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>,
_NewRecordDocument = MNewRecord<TModelParts>,
_ResultRecord = MResults<TModelParts>,
_ResultRecordNewDocument = _ResultRecord & DocumentNewEnhanced<TModelParts>,
_ResultRecordDocument = _ResultRecord & DocumentEnhanced<TModelParts>,
_ResultRecordDocumentKeys extends keyof _ResultRecordDocument = keyof _ResultRecordDocument>
{
    newType : _NewRecordDocument;
    new(doc?: _NewRecordDocument, fields?: Object, skipInit?: boolean): _ResultRecordNewDocument;


    // This is required to overide the underlying hidden Model, in less you feel like copy and pasting everything to this level.
    new(doc?: Object, fields?: Object, skipInit?: boolean): 'Invalid Record' & void;

    // After using deepPopulate in our current version of mongo, populate methods can't be used again.
    // Issues apply the path constraints here recusively for some reason...
    //Paths extends keyof Extract<ExtractPathValidator<TModelParts['__ModRefIds'], Paths>
    deepPopulate<Paths extends Record<string,any>>(paths: string) : QueryEnhanced<TModelParts>;

    deepPopulate<Paths extends Record<string,any>>(paths: Array<string>) : QueryEnhanced<TModelParts>;


    create(doc: _NewRecordDocument, fn?: (err: any, res: MResults<TModelParts> & DocumentNewEnhanced<TModelParts>) => void): Promise<_ResultRecordNewDocument>;
    create(doc1: _NewRecordDocument, doc2: _NewRecordDocument, fn?: (err: any, res1: _ResultRecordNewDocument, res2: _ResultRecordNewDocument) => void): Promise<_ResultRecordNewDocument[]>;
    create(doc1: _NewRecordDocument, doc2: _NewRecordDocument, doc3: _NewRecordDocument, fn?: (err: any, res1: _ResultRecordNewDocument, res2: _ResultRecordNewDocument, res3: _ResultRecordNewDocument) => void): Promise<_ResultRecordNewDocument[]>;
    

    // Not finished...
    // distincts are lean in the callback by definition
    // distinct<K extends _ResultRecordDocumentKeys>(field: K, callback?: (err: any, res: _ResultRecordDocument[K][]) => void): QueryEnhanced<Schema[K][],{},Schema[K][]>;
    // distinct<K extends _ResultRecordDocumentKeys = never>(field: string, callback?: (err: any, res: _ResultRecordDocument[K][]) => void): QueryEnhanced<Schema[K][],{},Schema[K][]>;
    // distinct<K extends _ResultRecordDocumentKeys>(field: K, conditions: Object, callback?: (err: any, res: _ResultRecordDocument[K][]) => void): QueryEnhanced<Schema[K][],{},Schema[K][]>
    // distinct<K extends _ResultRecordDocumentKeys = never>(field: string, conditions: Object, callback?: (err: any, res: _ResultRecordDocument[K][]) => void): QueryEnhanced<Schema[K][],{},Schema[K][]>;

    aggregate<X>(...aggregations: Object[]): mongoose.Aggregate<X[]>;
    aggregate<X>(aggregation: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;
    aggregate<X>(aggregation1: Object, aggregation2: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;
    aggregate<X>(aggregation1: Object, aggregation2: Object, aggregation3: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;

    aggregate(...aggregations: Object[]): 'Invalid Record' & void;
    aggregate(aggregation: Object, callback: (err: any, res: any[]) => void): 'Invalid Record' & void;
    aggregate(aggregation1: Object, aggregation2: Object, callback: (err: any, res: any[]) => void): 'Invalid Record' & void;
    aggregate(aggregation1: Object, aggregation2: Object, aggregation3: Object, callback: (err: any, res: any[]) => void): 'Invalid Record' & void;
 
    
    findById(id: TModelParts['__Id'], callback?: (err: any, res: _ResultRecordDocument) => void) : QueryEnhanced<TModelParts>;
            
    find(): QueryEnhanced<TModelParts, 'A'>;
    // I haven't taken the array wrapping into arroud for transform, I will need to strip that.
    find(cond: Object, callback?: (err: any, res: _ResultRecordDocument[]) => void): QueryEnhanced<TModelParts, 'A'>;
    find(cond: Object, fields: Object, callback?: (err: any, res: _ResultRecordDocument[]) => void): QueryEnhanced<TModelParts, 'A'>;
    find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: _ResultRecordDocument[]) => void): QueryEnhanced<TModelParts, 'A'>;
    findById(id: TModelParts['__Id'], callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findById(id: TModelParts['__Id'], fields: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findById(id: TModelParts['__Id'], fields: Object, options: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findByIdAndRemove(id: TModelParts['__Id'], callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findByIdAndRemove(id: TModelParts['__Id'], options: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findByIdAndUpdate(id: TModelParts['__Id'], update: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findByIdAndUpdate(id: TModelParts['__Id'], update: Object, options: FindAndUpdateOption, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findOne(cond?: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts,  'O'>;
    findOne(cond: Object, fields: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts,  'O'>;
    findOne(cond: Object, fields: Object, options: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findOneAndRemove(cond: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findOneAndRemove(cond: Object, options: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findOneAndUpdate(cond: Object, update: Object, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;
    findOneAndUpdate(cond: Object, update: Object, options: FindAndUpdateOption, callback?: (err: any, res: _ResultRecordDocument) => void): QueryEnhanced<TModelParts, 'O'>;

    //populate<U>(doc: U, options: Object, callback?: (err: any, res: U) => void): Promise<U>;
    //populate<U>(doc: U[], options: Object, callback?: (err: any, res: U[]) => void): Promise<U[]>;

    // These schema may need to change but I will have to look that up.
    update(cond: Object, update: MUpdate<TModelParts>, callback?: (err: any, affectedRows: number, raw: any) => void): QueryEnhanced<TModelParts, 'O'>;
    update(cond: Object, update: MUpdate<TModelParts>, options: Object, callback?: (err: any, affectedRows: number, raw: any) => void): QueryEnhanced<TModelParts, 'O'>;
    remove(cond: Object, callback?: (err: any) => void): Query<{}>;

    save(callback?: (err: any, result: _ResultRecordDocument, numberAffected: number) => void): QueryEnhanced<TModelParts, 'O'>;

    // Need to look into this.
    //where(path: string, val?: Object): Query<T[]>;

    // These can be broken up even better, to improve performance.
    count(callback?: (err: any, count: number) => void): QueryEnhanced<TModelParts, 'O', number>;

    count(criteria: Object, callback?: (err: any, count: number) => void): QueryEnhanced<TModelParts, 'O', number>;

    $where(condition?: string): QueryEnhanced<TModelParts, 'O'>;

    $where(funCondition: (this: (_ResultRecord)) => boolean): QueryEnhanced<TModelParts, 'O'>;
}


export type SchemaResultsDocumentModel<TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>> = MResults<TModelParts> & DocumentEnhanced<TModelParts>

export interface DocumentNewEnhanced<TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>>
{
    save(callback?: (err: any, res: MResults<TModelParts> & DocumentNewEnhanced<TModelParts>) => void): void;

    // Might needs some other form here going to use results, we shall see.
    equals<docType extends MResults<TModelParts>>(doc: docType): boolean;

    // Think the following should stil be relavent to newaly create records.
    invalidate<K extends keyof  MResults<TModelParts>>(path: K, errorMsg: string, value: any): void;
    invalidate<K extends keyof  MResults<TModelParts>>(path: K, error: Error, value: any): void;

    // invalidate<Paths extends ExtractPickValidate<Schema,Paths>>(path: string, errorMsg: string, value: any): void;
    // invalidate<Paths extends ExtractPickValidate<Schema,Paths>>(path: string, error: Error, value: any): void;

    set<K extends keyof MUpdate<TModelParts>>(path: K, val: MUpdate<TModelParts>[K], options?: Object): void;
    //set<Paths extends ExtractPickValidate<Schema,Paths>> (path: string, val: any, options?: Object): void;
    set<Paths extends Record<string,any>, Missing extends 'Missing Field'> (path: string, val: any, options?: Object): void;
    set(value: Partial<MUpdate<TModelParts>>): void;

    validate(cb: (err: any) => void): void;

    isNew: boolean;
    errors: Object;
    schema: Object;
}


export interface DocumentEnhanced<TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>,
_NewRecordDocument = MNewRecord<TModelParts>,
_ResultRecord = MResults<TModelParts>,
_ResultRecordNewDocument = _ResultRecord & DocumentNewEnhanced<TModelParts>> //extends Document
{
    save(callback?: (err: any, res: _ResultRecord & DocumentEnhanced<TModelParts>) => void): void;

    equals<docType extends _ResultRecord>(doc: docType): boolean;

    // populate<K extends keyof TModelParts['__ModRefIds']>(path: K, callback?: 
    //     (err: any, res: SchemaResultsDocumentModel<RawSchema, SchemaReadOnly, TransformPartial<SchemaPartial,K>>) => void):
    //     DocumentEnhanced<RawSchema, SchemaReadOnly, TransformPartial<SchemaPartial,K>>

    // populate<Opt extends ExtractPopulateOption<SchemaPartial,Opt>>(opt: Opt, 
    //     callback?: (err: any, res: any) => void): any

    // // deep populate now just stops everything else, need to implemented a look at head
    // // Record<string, any> = > Record<string,Record<string(dontcare),Record<string,any>>
    // deepPopulate<Paths extends ExtractTranformValidate<SchemaPartial,Paths>>(paths: string, 
    // callback?: (err: any, res: SchemaResultsDocumentModel<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>>) => void) : void

    // deepPopulate<Paths extends ExtractTranformValidate<SchemaPartial,Paths>>(paths: Array<string>, 
    //     callback?: (err: any, res: SchemaResultsDocumentModel<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>>) => void) : void    

    // QueryEnhanced<RawSchema, SchemaReadOnly, TransformRaw<SchemaPartial,Paths>, Lean>;

    remove<T>(callback?: (err: any) => void): QueryEnhanced<TModelParts>;

    update<T>(doc: Object, options: Object, callback: (err: any, affectedRows: number, raw: any) => void): QueryEnhanced<TModelParts>;

    toJSON(options?: Object): MResults<TModelParts>;
    toObject(options?: Object): MResults<TModelParts>;

    invalidate<Paths extends keyof MUpdate<TModelParts>>(path: string, errorMsg: string, value: any): void;
    invalidate<Paths extends keyof MUpdate<TModelParts>>(path: string, error: Error, value: any): void;

    invalidate(path: string, errorMsg: string, value: any): void;
    invalidate(path: string, error: Error, value: any): void;

    invalidate<K extends keyof MUpdate<TModelParts>>(path: K, errorMsg: string, value: any): void;
    invalidate<K extends keyof MUpdate<TModelParts>>(path: K, error: Error, value: any): void;

    invalidate<Paths extends keyof MResults<TModelParts>>(path: string, errorMsg: string, value: any): void;
    invalidate<Paths extends keyof MResults<TModelParts>>(path: string, error: Error, value: any): void;

    set<K extends keyof MUpdate<TModelParts>>(path: K, val: MUpdate<TModelParts>[K], options?: Object): void;
    set<Paths extends MUpdate<TModelParts>> (path: string, val: any, options?: Object): void;
    set<Paths extends Record<string,any>, Missing extends 'Missing Field'> (path: string, val: any, options?: Object): void;
    set(value: MUpdate<TModelParts>): void;

    get<K extends keyof MResults<TModelParts>>(path: string, type?: new(...args: any[]) => any): any;
    //get(path: string, type?: new(...args: any[]) => any): any;
}

export interface QueryEnhanced<
TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>,
ArrayOfResults extends 'A' | 'O' = 'O',
Primative extends unknown | undefined = unknown,
Lean extends 'T' |'F' = 'F'>
    {
    lean() : QueryEnhanced<TModelParts, ArrayOfResults, Primative ,'T'>;
    lean(value : true) : QueryEnhanced<TModelParts, ArrayOfResults, Primative, 'T'>;
    lean(value : false) : QueryEnhanced<TModelParts, ArrayOfResults, Primative, 'F'>;
    lean(value : undefined) : QueryEnhanced<TModelParts, ArrayOfResults, Primative, 'F'>;

    exec(callback?: (err: any, res: QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>) => void):
    Promise<QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>>;
    exec(operation: string, callback?: (err: any, res: QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>) => void):
    Promise<QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>>;
    exec(operation: Function, callback?: (err: any, res: QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>) => void):
    Promise<QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>>;

    // populate<K extends keyof TModelParts['__ModRefIds'], Sel extends keyof TransformPartial<SchemaPartial,K>[K]>
    // (path: K, select: Sel, match?: Object, options?: Object):
    // QueryEnhanced<RawSchema, {}, ObjectKeyPick<TransformPartial<SchemaPartial,K>,K,Sel>, ArrayOfResults, Primative, Lean>;

    populate<K extends keyof TModelParts['__ModRefIds']>(path: K, select: undefined, match?: Object, options?: Object):
    QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartial<SchemaPartial,K>, ArrayOfResults, Primative, Lean>;

    populate<K extends keyof TModelParts['__ModRefIds'], Sel extends keyof TransformPartial<SchemaPartial,K>[K]>(path: K, select: string, match?: Object, options?: Object):
    QueryEnhanced<RawSchema, SchemaReadOnly, ObjectKeyPick<TransformPartial<SchemaPartial,K>,K,Sel>, ArrayOfResults, Primative, Lean>;

    populate<K extends keyof TModelParts['__ModRefIds'],>(path: K, select?: undefined, match?: Object, options?: Object):
    QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartial<SchemaPartial,K>, ArrayOfResults, Primative, Lean>;

    // still required to write a partial conversion form of this.
    populate<Which extends 'neasted', Paths extends ExtractTranformValidate<SchemaPartial,Paths>>(path: string, select?: undefined, match?: Object, options?: Object):
    QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>, ArrayOfResults, Primative, Lean>;

    populate<Opt extends ExtractPopulateOption<Schema,Opt>>(opt: Opt): 
    QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,ObjectGetValue<Opt,'Path'>>, ArrayOfResults, Primative, Lean>;
    
    // Still required to write a partial version of this.
    //populate<Opt extends ExtractPopulateOption<SchemaPartial,Opt>>(opt: Opt, 
    //  callback?: (err: any, res: any) => void): any

    // deep populate now just stops everything else, need to implemented a look at head
    // Record<string, any> = > Record<string,Record<string(dontcare),Record<string,any>>
    deepPopulate<Paths extends ExtractTranformValidate<Schema,Paths>>(paths: string) :
    QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>, ArrayOfResults, Primative, Lean>;

    deepPopulate<Paths extends ExtractTranformValidate<Schema,Paths>>(paths: Array<string>) :
    QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>, ArrayOfResults, Primative, Lean>;


    //  QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, ArrayOfResults ,'T'>;

    //  distinct(callback?: (err: any, res: T) => void): Query<T>;
    //  distinct(field: string, callback?: (err: any, res: T) => void): Query<T>;
    //  distinct(criteria: Object, field: string, callback?: (err: any, res: T) => void): Query<T>;
    //  distinct(criteria: Query<T>, field: string, callback?: (err: any, res: T) => void): Query<T>;


    distinct<K extends keyof Schema>(field: K, callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K],{},Schema[K], 'A', Primative, Lean>;
    distinct<K extends keyof Schema = never>(field: string, callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K],{},Schema[K],'A', Primative, Lean>;

    distinct<K extends keyof Schema>(conditions: Object,field: K,callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K],{},Schema[K],'A', Primative, Lean>
    distinct<K extends keyof Schema = never>(conditions: Object, field: string,  callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K],{},Schema[K],'A', Primative, Lean>;


    // Typiclally all of these should start from scratch again, were Lean should be reset.

    find(callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'A', Primative, Lean, SchemaPartial, Schema>) => void):
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'A', Primative, Lean>;
    find(criteria: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'A', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'A', Primative, Lean>;
    findOne(callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    findOne(criteria: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative,  Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    findOneAndRemove(callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative,  Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative,  Lean>;
    findOneAndRemove(cond: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    findOneAndRemove(cond: Object, options: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    findOneAndUpdate(callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    findOneAndUpdate(update: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    findOneAndUpdate(cond: Object, update: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    findOneAndUpdate(cond: Object, update: Object, options: FindAndUpdateOption, callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    // PRIMATIVE OPTION REQUIRED, TAKE SUBKEY PARAMETER
    //limit(val: number): Query<T>;

    remove(callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O',Primative, Lean, SchemaPartial, Schema>) => void):
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    remove(criteria: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    sort(arg: Object): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    sort(arg: string): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    update(callback?: (err: any, affectedRows: number, doc: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    update(doc: Object, callback?: (err: any, affectedRows: number, doc: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    update(criteria: Object, doc: Object, callback?: (err: any, affectedRows: number, doc: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    update(criteria: Object, doc: Object, options: Object, callback?: (err: any, affectedRows: number, doc: 
        QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;


    count(callback?: (err: any, count: number) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, {Primative:number}, 'O', 'P', Lean>;

    count(criteria: Object, callback?: (err: any, count: number) => void): 
        QueryEnhanced<RawSchema, SchemaReadOnly, {Primative: number}, 'O', 'P', Lean>;

    limit(val: number): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    select<K extends keyof SchemaPartial>(arg: K):
        QueryEnhanced<RawSchema, SchemaReadOnly, {Primative:Pick<SchemaPartial, K> & {_id:ObjectGetValue<SchemaPartial, '_id'>}}, 'O', 'P', Lean>;

    select<Paths extends ExtractTranformValidate<Schema,Paths>>(arg: string):
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    select<Paths extends ExtractTranformValidate<Schema,Paths>>(arg: Object):
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>

    where(path?: string, val?: any): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    where(path?: Object, val?: any): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    gt(val: number): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    gt(path: string, val: number): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    gte(val: number): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    gte(path: string, val: number): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    lt(val: number): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    lt(path: string, val: number): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    lte(val: number): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    lte(path: string, val: number): 
        QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    // Typicaly these need to be check that they have been preceed by some previous operation.
    // this woudl require nother parameter.
    equals(val: Object): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    exists(val?: boolean): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
    exists(path: string, val?: boolean): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

    $where(condition?: string): 
    QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;

    $where(funCondition: (this: (TransformRaw<SchemaPartial,{}>)) => bool): 
    QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;

    /*
    lt(val: number): Query<T>;
    lt(path: string, val: number): Query<T>;
    lte(val: number): Query<T>;
    lte(path: string, val: number): Query<T>;
    */
}

const model = mongoose.model(schemaLeft);

