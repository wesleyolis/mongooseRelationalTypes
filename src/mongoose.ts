import * as Mongoose from 'mongoose'
import { Model as MonModel, Document, Query, Types, model } from "mongoose";
import { FindAndUpdateOption } from 'mongoose';
import * as UpdateStatment from './mongooseUpdateStatment';
export {UpdateStatment};

import { MUpdateStatmentFor } from './mongooseUpdateStatment';

export type ObjectId = Mongoose.Types.ObjectId;


export interface ISchemaPropsRaw {
    _id?: ObjectId;
    id?: string;
}

export interface IDocumentModel
{
    id: string;
}

export type ToJson<T extends any> = T extends infer U | undefined ? U extends GenOptionsPrimatives ? U : keyof U extends keyof Date ? string :
U extends Record<string, any> ?
{
  [K in keyof U] : U[K] extends GenOptionsPrimatives ? U[K] : keyof U[K] extends keyof Date ? string : ToJson<U[K]>
}: never : never;

// export type OidOrStringRaw = IPlainType<ObjectId | string>;

// Enhance the mongoose class with the missing function that should be found.
declare module 'mongoose'
{

    //function model<Schema extends MDocument>(name: string, schema?: Schema, collection?: string, skipInit?: boolean): Model<Schema>;

    export module Types {

        interface ObjectId
        {
            toString: () => string;   
        }
    }

    // export type QueryIdRequired<T> = Query<MakeIdRequired<T>>
    // export type MakeIdRequired<T> = ObjectOmit<T,'id'> & {
    //     id : string
    // }

    // export type MakeRecord<T> = ObjectOmit<T, StringOmit<keyof Document,'_id'>>

    // export type MakeNewRecordDoc<T> = ObjectOmit<T, StringOmit<keyof Document, 'id'>>

    // export type MakeResultRecordDoc<T> = ObjectOmit<T, '_id' | 'id'>

    // export interface Model<T extends Document>
    // //extends NodeJS.EventEmitter 
    // {
    //     newType : MakeNewRecordDoc<T>;

    //     new(doc?: MakeNewRecordDoc<T>, fields?: Object, skipInit?: boolean): MakeResultRecordDoc<T>;

    //     new(doc?: Object, fields?: Object, skipInit?: boolean): 'Invalid Record' & void;

    //     aggregate<X>(...aggregations: Object[]): Aggregate<X[]>;
    //     aggregate<X>(aggregation: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;
    //     aggregate<X>(aggregation1: Object, aggregation2: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;
    //     aggregate<X>(aggregation1: Object, aggregation2: Object, aggregation3: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;

    //     aggregate(...aggregations: Object[]): 'Invalid Record' & void;
    //     aggregate(aggregation: Object, callback: (err: any, res: T[]) => void): 'Invalid Record' & void;
    //     aggregate(aggregation1: Object, aggregation2: Object, callback: (err: any, res: T[]) => void): 'Invalid Record' & void;
    //     aggregate(aggregation1: Object, aggregation2: Object, aggregation3: Object, callback: (err: any, res: T[]) => void): 'Invalid Record' & void;
        
    //     distinct<X>(field: string, callback?: (err: any, res: X[]) => void): Query<X[]>;
    //     distinct<X>(field: string, conditions: Object, callback?: (err: any, res: X[]) => void): Query<X[]>;

    //     distinct(field: string, callback?: (err: any, res: T[]) => void): 'Invalid Record' & void;
    //     distinct(field: string, conditions: Object, callback?: (err: any, res: T[]) => void): 'Invalid Record' & void;

    //     findById(id: string | ObjectId, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
    //     findById(id: string | ObjectId, fields: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
    //     findById(id: string | ObjectId, fields: Object, options: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
    //     findByIdAndRemove(id: string | ObjectId, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
    //     findByIdAndRemove(id: string | ObjectId, options: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
    //     findByIdAndUpdate(id: string | ObjectId, update: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
    //     findByIdAndUpdate(id: string | ObjectId, update: Object, options: FindAndUpdateOption, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
    
    //     // sdsdfsdf
    //     find(): QueryIdRequired<T[]>;
    //     find(cond: Object, callback?: (err: any, res: MakeIdRequired<T>[]) => void): QueryIdRequired<T[]>;
    //     find(cond: Object, fields: Object, callback?: (err: any, res: MakeIdRequired<T>[]) => void): QueryIdRequired<T[]>;
    //     find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: MakeIdRequired<T>[]) => void): QueryIdRequired<T[]>;
        
    //     findOne(cond?: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
    //     findOne(cond: Object, fields: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
    //     findOne(cond: Object, fields: Object, options: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;

    //     create(doc: MakeRecord<T>, fn?: (err: any, res: MakeIdRequired<T>) => void): Promise<QueryIdRequired<T>>;
    //     create(doc1: MakeRecord<T>, doc2: Object, fn?: (err: any, res1: MakeIdRequired<T>, res2: MakeIdRequired<T>) => void): Promise<QueryIdRequired<T>[]>;
    //     create(doc1: MakeRecord<T>, doc2: Object, doc3: Object, fn?: (err: any, res1: MakeIdRequired<T>, res2: MakeIdRequired<T>, res3: MakeIdRequired<T>) => void): Promise<QueryIdRequired<T>[]>;
    
    //     // Could here never here, but it doesn't work. so a message and void would be better as the person knows what actually wrong.
    //     // since the compiler doen't actually sort things out properly.
    //     create(doc: Object, fn?: (err: any, res: T) => void) : 'Invalid Record' & void;
    //     create(doc1: Object, doc2: Object, fn?: (err: any, res1: T, res2: T) => void): 'Invalid Record' & void;
    //     create(doc1: Object, doc2: Object, doc3: Object, fn?: (err: any, res1: T, res2: T, res3: T) => void): 'Invalid Record' & void;
   
    //     count(conditions: Object, callback?: (err: any, count: number) => void): Query<number>;

    // }

    // export interface Query<T> {
    //     lean(): Query<ObjectOmit<T, StringOmit<keyof Document, '_id'>>>;
    //     lean(bool : true): Query<ObjectOmit<T, StringOmit<keyof Document, '_id'>>>;
    //     lean(bool? : true): Query<ObjectOmit<T, StringOmit<keyof Document, '_id'>>>;
    //     lean(bool? : undefined): Query<ObjectOmit<T, StringOmit<keyof Document, '_id'>>>;
    // }

    // export interface Document {
    //     save<T>(callback?: (err: any, res: MakeIdRequired<T>) => void): void;
    // }
}

export type ICPT<T> = {
    
    ___CPTSymbol : T
    //[___CPTSymbol] : T
}

export type RecusivePick<Object extends Record<string, any>,
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

export type TsTypesPrimatives = boolean | number | string | Date; 

export type ID = 'T' | 'R' | 'AR' | 'AN' | 'Ref' | 'S' | 'ARF'

export type ITSShapes = 
IShapeTSType<any, any, any, any> 
| IShapeContainers
| IShapeTSRef<any, any, any, any>
| IShapeTSSchema<any, any, any, any>


export type IShapeContainers = IShapeTSRecord<any, any, any, any> | IShapeTSArrayNeasted<any, any, any, any> | IShapeTSArrayRecord<any, any, any, any> | IShapeTSArrayRecordContainingRef<any, any, any, any>
export type IShapeContainersID = IShapeTSRecord<any, any, any, any>['__ID'] | IShapeTSArrayNeasted<any, any, any, any>['__ID'] | IShapeTSArrayRecord<any, any, any, any>['__ID']

export type IShapeRefContainers = IShapeContainers | IShapeTSRef<any, any, any, any>;//IShapeTSSchema
export type IShapeRefContainersID = IShapeContainersID | IShapeTSRef<any, any, any, any>['__ID']

export type Neasted = IShapeContainers | undefined;

export interface IShape<TID extends ID, TNeasted>{
    id: TID;
    neasted : TNeasted
}

// Thesse are required to be know, when we need to know the TSShape container
// So that we can acess spesific properties, and preserve the properties
// modifiers when minipulating referances or neasted schemas.
// with unow, if eerything was option, would be quite interesting, as just have
// an auxliarty type into which everything can be mixed in.
export interface ITSShapeModifiers<
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable> {
    __Required: TRequired;
    __Readonly: TReadonly;
    __Nullable: TNullable;
}

export interface ITSShape<T, TID extends ID,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable
> extends IShape<ID, T>, ITSShapeModifiers<TRequired, TReadonly, TNullable>
{
    __tsType: T;
    __ID: TID;
}

export class Shape<TShape extends ITSShape<any, any, any, any, any>> implements IShape<TShape['__ID'], TShape['neasted'] >
{
    constructor(public id: TShape['__ID'], public neasted : TShape['neasted'] | undefined = undefined)
    {
    }

    TSTypeCastUp() {
        return this as any as TShape
    }
}

export type IShapeTSTypeConstraint = IShapeTSType<IShapeTSTypeExtends, any, any, any>;

export type IShapeTSTypeExtends = boolean | number | string | Date;

export interface IShapeTSType<T extends IShapeTSTypeExtends,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable> extends ITSShape<T, 'T', TRequired, TReadonly, TNullable> {
    __tsType : T;
}

export function ShapeTSType<T extends IShapeTSTypeExtends>()
{
    return new Shape<IShapeTSType<T, any, any, any>>('T').TSTypeCastUp();
}

//type IShapeRecordExtends = Record<string, ITSShapes> | null
export type IShapeRecordExtends = Record<string, ITSShape<any, ID, any, any, any>> | null

export interface IShapeTSRecord<T extends IShapeRecordExtends,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable> extends ITSShape<T, 'R', TRequired, TReadonly, TNullable>
{
    __tsType : T;
}

export function ShapeTSRecord<T extends IShapeRecordExtends>(rec : T)
{
    return new Shape<IShapeTSRecord<T, any, any, any>>('R', rec).TSTypeCastUp();
}

export type IShapeArrayNeastedExtendsID = 'T' | 'S' | 'AN' | 'AR' | 'Ref'
export type IShapeArrayNeastedExtends = ITSShape<any, IShapeArrayNeastedExtendsID, any, any, any>//IShapeTSType<any> | IShapeTSRef<any> | IShapeTSSchema<any> | IShapeTSArrayNeasted<any> | IShapeTSArrayRecord<any>;

export interface IShapeTSArrayNeasted<T extends IShapeArrayNeastedExtends,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable> extends ITSShape<any, 'AN', TRequired, TReadonly, TNullable>
{
    __tsType : {w:T};
}

export function ShapeTSArray<T extends IShapeArrayNeastedExtends>(record : T)
{
    return new Shape<IShapeTSArrayNeasted<T, any, any, any>>('AN', record).TSTypeCastUp();
}

export type IShapeTSArrayRecordExtends = Record<string, ITSShape<any, ID, any, any, any>> | null;

export interface IShapeTSArrayRecord<T extends IShapeTSArrayRecordExtends,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable> extends ITSShape<T, 'AR', TRequired, TReadonly, TNullable>
{
    __tsType : T;
}

export function ShapeTSArrayRecord<T extends IShapeTSArrayRecordExtends>(record : T)
{
    return new Shape<IShapeTSArrayRecord<T , any, any, any>>('AR', record).TSTypeCastUp();
}


// Typescript doesn't post merge arrays containers, that are of the record shape form.
// there for we have to transform them as required main schema and exclude them from the main schema.
// Best we can do for now.
export interface IShapeTSArrayRecordContainingRef<T extends ISchemaParts<any, any, any, any, any, any, any, any, any, any>,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable> extends ITSShape<T, 'ARF', TRequired, TReadonly, TNullable>
{
    __tsType : T;
}

export function ShapeTSArrayRecordContainingRef<T extends ISchemaParts<any, any, any, any, any, any, any, any, any, any>>(record : T)
{
    return new Shape<IShapeTSArrayRecordContainingRef<T , any, any, any>>('ARF', record).TSTypeCastUp();
}


export interface IShapeTSRef<T extends ISchemaParts<any, any, any, any, any, any, any, any, any, any>,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable> extends ITSShape<T,'Ref', TRequired, TReadonly, TNullable>
{
    __tsType : T;
}


// interface IShapeTSRef<T extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>> extends ITSShape<T,'Ref'>
// {
//     __tsType : T;
// }


// Going to have to put in some work here.. as number capture, doesn't reveal
// the runtime type, which is what previously happened.
// The right hand side of the schema wil be captured on the right.
// lets just get this all working.
export function ShapeTSRef<T extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>,
>()
{
    return new Shape<IShapeTSRef<T, any, any, any>>('Ref').TSTypeCastUp();
}

export interface IShapeTSSchema<T extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable>
extends ITSShape<T, 'S', TRequired, TReadonly, TNullable> 
{
    __tsType : T;
}

export function ShapeTSSchema<T extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>>()
{
    return new Shape<IShapeTSSchema<T, any, any, any>>('S').TSTypeCastUp();
}

// type TesResult = ITSModifiersWithConstraints<any, any, any, any, any, any, any, any, any, any, IShapeTSType<number>, any> extends 
// ITSModifiersWithConstraints<any,any,any,any,any,any,any,any,any,any, IShapeTSArrayNeasted<any>,any> ?
// 'T' : 'F'
export type GenAdapters = ''
export type GenAdaptersSchemaOptions = Record<GenAdapters, Record<string, any>>;

export type GenAdaptersFieldTypesOptions = Record<GenAdapters, Record<string, any>>;

export type IFieldDef<Options extends GenAdaptersFieldTypesOptions> = 
IShape<any,any> //& ITypeModifiers<any, any, any, any, any, any, any, any, any, any> & Options;

export type IteratorSchemaContext = {
    schema : ISchema<any, any, any, any, any, any, any, any, any, any,any, any, any>,
    parentSchema : ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any> | undefined,
    rootSchema : ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any> | undefined,
    fieldKeys: string [] // May want simple boolean to decided on things.
}

export type IteratorFieldContext = {
    schema : IteratorSchemaContext
    fields: {
        field : IFieldDef<any>,
        parentField : IFieldDef<any>,
        fieldKeys: string []
    }
}

export type GenOptionsPrimatives = boolean | number | string | Function | undefined;

export interface IGenAdapterConfig<SchemaAnotationOptions extends Record<string, GenOptionsPrimatives>, FieldAnotationOptions extends Record<string, GenOptionsPrimatives>> {
    
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

export interface ITSGenAdapterConfig<
SchemaAnontationOptions extends Record<string, GenOptionsPrimatives>,
FieldAnontationOptions extends Record<string, GenOptionsPrimatives>
> extends IGenAdapterConfig<SchemaAnontationOptions, FieldAnontationOptions> {
    __tsSchemaOptions: SchemaAnontationOptions,
    __tsFieldOptions: FieldAnontationOptions,
}

export type GenAdapterConfiguration = Record<string, IGenAdapterConfig<any, any>>

// The schemaOptions need to be defined as typesript information and not as runtime informaiton.
// This means that I am going to need a helper function, which takes in the runtime information
// and then takes on some typescript constraints __tsTheOption anme.

export function NewAdapterConfiguration<
SchemaOptions extends Record<string, GenOptionsPrimatives>,
FieldOptions extends Record<string, GenOptionsPrimatives>>(config : IGenAdapterConfig<SchemaOptions, FieldOptions>)
{
    return config as ITSGenAdapterConfig<SchemaOptions, FieldOptions>
}

// Typescript seem to not be able to validate function signatures
// not much we can do about that..
export type ExtractGenAdapterConfShape<T extends Record<string,any>> = {
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

export type AdaptorConfigurationSchemaOptions<T extends Record<string, ITSGenAdapterConfig<any, any>>> = {
 [K in keyof T] : T[K]['__tsSchemaOptions']
}

export type AdaptorConfigurationFieldOptions<T extends Record<string, ITSGenAdapterConfig<any, any>>> = {
    [K in keyof T] : T[K]['__tsFieldOptions']
}
   
export class SchemaGenerator<AdaptorConfigurations extends Record<string, ITSGenAdapterConfig<any, any>>,
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

export type TypesPrimative = 'Boolean' | 'Number' | 'String' | 'Date' | 'Record' | 'ArrayNeasted' | 'ArrayRecord' | 'RefType' | 'Schema' | 'ObjectIdString' | undefined

export type _Required = 'Req' | 'Op'
export type _Readonly = 'Get' | 'Set'
export type _Nullable = 'Nullable' | 'Value'
export type _Default = TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null | undefined
export type _RefType = ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any> | undefined 
export type _OptionsAnontations = Record<string, any>

export interface IModifiers<TOptions extends _OptionsAnontations> extends IShape<ID, any>
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

export interface ITSModifiers<
    TShapeID extends ID,
    TRequired extends _Required,
    TReadonly extends _Readonly,
    TNullable extends _Nullable,
    TDefault extends _Default,
    TRefType extends _RefType,
    TSType extends any, // Required for pass tought of types formats, to match that of the Shapes.
    TOptionsAnotations extends _OptionsAnontations
> extends IModifiers<TOptionsAnotations>, ITSShape<any, ID, TRequired, TReadonly, TNullable>{
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



export interface ITSModifiersWithConstraints<
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
    TShape extends ITSShape<any, any, TRequired, TReadonly, TNullable>,
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

export function NewModifiers<TAvaliableOptions extends _OptionsAnontations,
    TShape extends ITSShape<any, any, any, any, any>
    >(shape : TShape, type : TypesPrimative, __options : TAvaliableOptions)
    {
        return new Modifiers<'Op', 'Set', 'Value', undefined, undefined, TShape, TAvaliableOptions>
        (shape, type, 'Op', 'Set', 'Value', undefined, undefined, undefined) as any as ITSShapeModifiersFunWithConstraints<TShape['__ID'], 'Op', 'Set', 'Value', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, TShape, TAvaliableOptions>
    }

    function NewModifiersWithConstraints<TAvaliableOptions extends _OptionsAnontations,
    TShape extends ITSShape<any, any, any, any, any>,
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
    TShape extends ITSShape<any, any, any, any, any>,
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
export interface IModifiersFunctions<
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
TShape extends ITSShape<any, any, any, any, any>,
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

export type ITSShapeModifiersFunWithConstraintsSimple<
TShapeID extends ID,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
TShape extends ITSShape<any, any, any, any, any>,
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
TShape extends ITSShape<any, any, any, any, any>,
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

export class Modifiers<
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType,
TShape extends ITSShape<any, any, any, any, any>,
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

    public Readonly() : ITSShapeModifiersFunWithConstraints<TShapeID, TRequired, 'Get', TNullable, TDefault, TRefType, TShapeID, TRequired, TReadonly, TNullable, TDefault, TRefType, TShape, TAvaliableOptions>
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


export interface ITSModifiersRecord<
TShapeID extends ID,
TShape extends ITSShape<any,any, any, any, any>,
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

export type INeastedSchemaRecord = Record<string, (ITSModifiersWithConstraints<any, any, any, any, any, any, any, any, any, any, any, any, any, IShapeContainers | IShapeTSSchema<any, any,any, any>>)>

type ExtractRecordModfierConstraints<T extends Record<string, ITSShapeModifiersFunWithConstraints<any, any, any, any, any, any, any, any, any, any, any, any, any, any>>, 
Modifier extends '__ID' | '__Required' | '__Readonly' | '__Nullable' | '__Default' | '__RefType',
ModifierConstraint extends '__IDConstraints' | '__RequiredConstraints' | '__ReadonlyConstraints' | '__NullableConstraints' | '__DefaultConstraints' | '__RefTypeConstraints'> = {
    [K in keyof T] : T[K][Modifier] | T[K][ModifierConstraint]
}[keyof T]


export interface ISchema<
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
    /*
    Figure out these constriants later.
    extends ISchemaParts<
    Id,
    ModRD,
    ModRND,
    ModOD,
    ModOND,
    ReadRD,
    ReadRND,
    ReadOD,
    ReadOND,
    ModRef
    >
    */
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

export class Schema<
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
ModRef extends ITSModifiersRecord<IShapeRefContainersID, any, any, any, any, any>,
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

export interface ISchemaPartial<
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

export class SchemaPartial<
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


export type SchemaOptions = {
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

export type SchemaFieldOptionsAll = {
    select?: boolean,
    validate?: Function, 
    get?: Function,
    set?: Function, 
    alias? : string
}


// const adapter = {
//     'Mongoose': NewAdapterConfiguration<SchemaOptions, SchemaFieldOptionsAll>({
//     schemaTransform : {} as any,
//     fieldTransform : {} as (
//         key: string,
//         options: SchemaFieldOptionsAll,
//         iteratorContext: IteratorFieldContext,
//         neastedFieldTransformContents: string | undefined
//     ) => string
//     })
// };


// const GSchema = new SchemaGenerator(adapter);

// const mongooseRunTime = GSchema.Generate('Mongoose', [SchemaA]);

// const schemaARight = GSchema.NewSchema('RightSchema', '', {},{},{},{},{},{},{},{},{},{});

// const schemaA = GSchema.NewSchema('collectionName','', {
//     a : GSchema.Boolean().Required().Nullable().Default(null).Anotations({'Mongoose':{select:true}}),
//     b : GSchema.Number().Required(),
//     c : GSchema.String().Required().Nullable().Default(''),
//     neasted : GSchema.Record({
//         nA : GSchema.Boolean().Required(),
//         neasted : GSchema.Record({
//             NNe : GSchema.String().Required(),
//             NNf : GSchema.Number().Required()
//         }).Required(),
//     }).Required(),
//     // The extaction forms of this are not perfect, because I assumed, its primative
//     // but it is not neaasry a primative.
//     arrayPrimative : GSchema.Array(GSchema.Number().Required()).Required(),
//     // arrayofRecord : GSchema.Array(GSchema.Record({
//     //     a : GSchema.Boolean()
//     // })).Required(),// Must rather use ArrayRecord
//     arrayArray : GSchema.Array(GSchema.Array(GSchema.Number().Required())).Required(),
//    //, arrayArrayRecord : GSchema.ArrayRecord(GSchema.Number().Required()).Required(), -- This should be Invalid.
//     arrayRecord : GSchema.ArrayRecord({
//         a: GSchema.Number().Required(),
//         b: GSchema.Record({
//             c: GSchema.Number().Required()
//         }).Required(),
//     }).Required()
//     // arrayRecordRecord : GSchema.ArrayRecord(GSchema.Record({
//     //     a: GSchema.Number().Required()
//     // }).Required()).Required(),

//     //,refType : GSchema.RefType(schemaARight).Required()// Invalid - But not pretty to debug the message, because of the type
//     // capturing.. Mabye later, could just be a name list were they are all first regsitered, so that
//     // We can reduce the list name to , difficault, because would be no ways to validate things, until runtime, which not what is wanted.
// },{
//     //c : GSchema.Boolean().Required().Default(false), // Invalid Default false - Good
//     //d : GSchema.Number().Required().Default(34), // Invalid Default false - Good
//     e : GSchema.Number().Required().Nullable().Anotations({'Mongoose' : {}}),
//     neasted : GSchema.Record({
//         NNa : GSchema.Boolean().Required(),
//         NArray : GSchema.Array(GSchema.Boolean().Required()).Required(),
//         NArrayRrecord : GSchema.ArrayRecord({
//             NARa : GSchema.Number().Required(),
//             NARb : GSchema.String().Required(),
//             NAR : GSchema.Record({}).Required(),
//             NARA : GSchema.Array(GSchema.Number().Required()).Required()
//         }).Required()
//     }).Required()  // Any Record
// },{

// },{},{},{},{},{},{
//     //primative : GSchema.Boolean(),
//     refType : GSchema.RefType(schemaARight).Required(),
//     neasted : GSchema.Record({
//         //Na : GSchema.Number().Required() // Need to fix constraints from here again.*********************************************************************
//         Nb : GSchema.RefType(schemaARight).Required()
//     }).Required()
// },{},{Mongoose:{collation:'',}});

// const Neasted__ = GSchema.Record({
//     Na : GSchema.Number().Required(),
//     Nb : GSchema.RefType(schemaARight).Required()
// }).Required();


// type res = typeof Neasted__['__RefTypeConstraints'];

// type EROM<Mod extends ITSShapeModifiersFunWithConstraints<any, any, any, any, any, any, any, any, any, any, any, any, any, any>, T extends any> = ({
//     'Req' : T 
//     'Op' : T | undefined
// })[Mod['__Required']];

// type ESRec<T extends ITSModifiersRecord<any, any, any, any, any, any>> = {
//     [P in keyof T] : 
//     ({
//         'T' : ApplyMods<T[P], T[P]['__tsType']>,
//         'R' : ApplyMods<T[P], ESRec<T[P]['__tsType']>>,
//         'AN' : ApplyMods<T[P],ESRec<T[P]['__tsType']>['w'][]>,
//         'AR' : ApplyMods<T[P],ESRec<T[P]['__tsType']>[]>
//         //'Ref' : 'Invalid Option here'
//         //'S' : 'Invalid Option Here'
//     })[T[P]['__ID']]
// }


// type TSchema = typeof schemaA['__ModRD']//['a']['__ID'];

// type TSSchema = ESRec<TSchema>
// const tsSchema : TSSchema = {
//     a : true,
//     b : 234,
//     c : '',
//     neasted : {
//         nA :true,
//         neasted : {
//             NNe :'',
//             NNf : 234
//         }
//     },
//     arrayPrimative: [1],
//     arrayArray : [[1]],
//     arrayRecord: [{ 
//         a : 324,
//         b : {
//             c : 324
//         }
//     }]
        
// }

// // Layer 2 were we want the typing speed improvements
// // were the model definition will extra this informaiton.
// // What we could do is the full type type out here, but then check that
// // Schema conforms to that, but the simpified 
// const modelsdA = model('collectionName', Schema);

// // This basically what the model would be doing up front.
// // If we wanted to speed things up and not do the type extraction
// // from 
// //type SchemaA = ExtractTSSchema<typeof schemaA>;

// type ESRefId<T extends ITSModifiersRecord<any, any, any, any, any, any>> =
// {
//     [P in keyof T] : 
//     ({
//         'T' : 'Invalid Option Here'
//         'R' : EROM<T[P], ESRedId<T[P]['__tsType']>>
//         'AN' : EROM<T[P], ESRedId<T[P]['__tsType']>['w'][]>
//         'AR' : EROM<T[P], ESRedId<T[P]['__tsType']>[]>
//         'Ref' : T[P]['__tsType']['__ID']
//         'S' : ESRedId<T[P]['__tsType']['__ModRef']>
//     })[T[P]['__ID']]
// }

// type ESSRec<T extends ITSModifiersRecord<any, any, any, any, any, any>,
// Path extends '__ModRD' | '__ModRND' | '__ModOD' | '__ModOND' | '__ReadRD' | '__ReadRND' | '__ReadOD' | '__ReadOND' | '__ModRef'> = {
//     [P in keyof T] : 
//     ({
//         'T' : EROM<T[P], T[P]['__tsType']>,
//         'R' : EROM<T[P], ESSRec<T[P]['__tsType'], Path>>,
//         'AN' : EROM<T[P],ESSRec<T[P]['__tsType'], Path>['w'][]>,
//         'AR' : EROM<T[P],ESSRec<T[P]['__tsType'], Path>[]>
//         'Ref' : T[P]// Leave untouched for futher passing.
//         'S' : ESSRec<T[P]['__tsType'][Path], Path>
//     })[T[P]['__ID']]
// }

// type ESRefs<T extends ITSModifiersRecord<any, any, any, any, any, any>, Paths extends Record<string,any>> =
// {
//     [P in keyof T] : P extends keyof Paths ? 
//     ({
//         'T' : 'Invalid Option Here'
//         'R' : EROM<T[P], ESRefs<T[P]['__tsType'], Paths>>
//         'AN' : EROM<T[P], ESRefs<T[P]['__tsType'], Paths>['w'][]>
//         'AR' : EROM<T[P], ESRefs<T[P]['__tsType'], Paths>[]>
//         'Ref' : P extends keyof Paths ? T[P]['__tsType'] : never
//         'S' : ESRefs<T[P]['__tsType']['__ModRef']>
//     })[T[P]['__ID']]
//     : never
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


// // Required to still add support for nullable and undefined.
// type ExtractMRefTypes<T extends Record<string, any>,
// Paths extends Record<string, any>,
// IDS extends 'T' | 'F',
// KeysOfPaths extends keyof Paths = keyof Paths> =
// {
//     [K in keyof T] : K extends KeysOfPaths ?
//     ({
//         'T' : 'Invalid Option Here'
//         'R' : ExtractMRefTypes<T[K]['__tsType'], Paths[K], IDS>
//         'AN' : ExtractMRefTypes<T[K]['__tsType'], {w:Paths[K]}, IDS>['w']
//         'AR' : ExtractMRefTypes<T[K]['__tsType'], Paths[K], IDS>
//         'Ref' : Paths[K] extends Record<string, any> ? (MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], Paths[K], IDS>)
//             : IDS extends 'T' ? T[K]['__tsType']['__Id'] : 'FFF'
//     })[T[K]['__ID']]
//     : IDS extends 'T' ? ExtractMRefTypes<T[K]['__tsType'], {}, IDS> :'FFFF'//T[K]['__tsType']['__Id'] : 'GGG'// Required to still iterate and preserve the existing structure until we find that item.
// }


// // Required to still add support for nullable and undefined.
// type ExtractMRefTypesShape<K extends keyof T,
// T extends Record<keyof Paths, any>,
// Paths extends Record<string,any>,
// IDS extends 'T' | 'F'
// > = ({
//         'T' : 'Invalid Option Here'
//         'R' : ExtractMRefTypes<T[K]['__tsType'], Paths, IDS>
//         'AN' : ExtractMRefTypes<T[K]['__tsType'], {w:Paths}, IDS>['w']
//         'AR' : ExtractMRefTypes<T[K]['__tsType'], Paths, IDS>
//         'Ref' : 
//         Paths[K] extends Record<string, any> ? (MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], Paths[K], IDS>)
//             : IDS extends 'T' ? T[K]['__tsType']['__Id'] : 'FFF' :
//             'JJJJ'
//     })[T[K]['__ID']]
//     //: IDS extends 'T' ? ExtractMRefTypes<T[K]['__tsType'], {}, IDS> :'FFFF'//T[K]['__tsType']['__Id'] : 'GGG'// Required to still iterate and preserve the existing structure until we find that item.


// // Required to still add support for nullable and undefined.
// type ExtractMRefTypes<T extends Record<string, any>,
// Path extends Record<string,any>,
// IDS extends 'T' | 'F',
// Paths extends any = Path,
// KeysOfPaths extends keyof Paths = keyof Paths> =
// {
//     [K in keyof T] :
//     ({
//         'T' : 'Invalid Option Here'
//         'R' : ExtractMRefTypes<T[K]['__tsType'], Paths[K], IDS>
//         'AN' : ExtractMRefTypes<T[K]['__tsType'], K extends KeysOfPaths ? {w:Paths[K]} : {}, IDS>['w']
//         'AR' : ExtractMRefTypes<T[K]['__tsType'], K extends KeysOfPaths ? Paths[K] : {}, IDS>
//         'Ref' : K extends KeysOfPaths ? Paths[K] extends Record<string, any> ? 
//             (MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], Paths[K], IDS>)
//             : IDS extends 'T' ? T[K]['__tsType']['__Id'] : unknown :
//             IDS extends 'T' ? T[K]['__tsType']['__Id'] : unknown
//     })[T[K]['__ID']]
// }
// // Required to still add support for nullable and undefined.
// type ExtractMRefTypes<T extends Record<string, any>,
// Path extends Record<string,any>,
// IDS extends 'T' | 'F',
// Paths extends any = Path,
// KeysOfPaths extends keyof Paths = keyof Paths> =
// {
//     [K in keyof T] :
//     ({
//         'T' : 'Invalid Option Here'
//         'R' : ExtractMRefTypes<T[K]['__tsType'], {}, IDS, Paths[K]>
//         'AN' : ExtractMRefTypes<T[K]['__tsType'], {}, IDS, {w:Paths[K]}>['w']//K extends KeysOfPaths ? {w:Paths[K]} : {}>['w']//{w:Paths[K]}, IDS>['w'] // The problem here is that the wrapper,
//         // causes the key to match, in this case the key is w..
//         // which means the way in which we compare the key is a problem.
//         // the only otherway to handle this is with look ahead, 
//         // or in this cases
//         'AR' : ExtractMRefTypes<T[K]['__tsType'], {}, IDS, Paths[K]>
//         'Ref' : 
//                 // K extends KeysOfPaths ? 
//                 //     keyof Paths[K] extends never ?
//                 //         Paths[K] extends Record<string, never> ? '{}TT' : 
//                 //         'No Key - FakeKey' // Look Head for 
//                 //     : 'A' & Paths[K] //extends Record<string, never> ? 'TT' :  
//                 //     //MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  Paths[K]>
//                 // :'No Key'

//                 K extends KeysOfPaths ? 
//                 keyof Paths[K] extends never ?
//                     Paths[K] extends Record<string, never> ? 
//                         MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  Paths[K]>
//                         : T[K]['__tsType']['__Id'] // Look Head for 
//                 : MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  Paths[K]>
//                 : T[K]['__tsType']['__Id']


//                 // If we have a fake key, which matches, is there another way in  next iteration, when key matches
//                 // to detect if we want it. well I can use Record<string,any>..

//                 // keyof Paths[K] extends never ? 
//                 //     Paths[K] extends Record<string, never> ? e
//                 //         MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,{}> : 
//                 //         Paths// & {lll:K} //T[K]['__tsType']['__Id']
//                 //         : MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'],{}, IDS,  Paths[K]>
//                // K extends KeysOfPaths ? 
//                  //   'TT'://MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  Paths[K]> : 
//                     //Paths[K] extends Record<string, any> ?
//                     //'TTTTT' 
//                     //MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  {}>  
//                    //  'FFFFF'
//                  // Paths[K] extends Record<string, never> ? 
//                 //     T[K]['__tsType']['__Id'] :
//                 //     MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  {}>  

//                 // //keyof Paths[K] extends never ? 
//                   //   Paths[K]// extends Record<string, never> ? 'T' : 'F' 
//                     // keyof Paths[K] extends Record<string, any> ?
//                     // ? MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,{}> : 
                       
                        


//                 // 'FFF'

//                 // : 'Stop ID'
//                 // : 'Typically a RecordWantIT- Iterate'

//             //     keyof Paths[K] extends never ? Paths[K] extends Record<string, never> ? 'Want IT - Stop'
        
//             //     : 'Stop ID'
//             //  : 'Typically a RecordWantIT- Iterate'
//             //  T[K]['__tsType']['__Id']
        
//         //Paths[K] extends Record<string, any> ? 'TTTTT' :'FFFF'
//             // (MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], Paths[K], IDS>)
//             // : IDS extends 'T' ? T[K]['__tsType']['__Id'] : unknown 
//     })[T[K]['__ID']]
// }


export type ModReq<Mod extends ITSShapeModifiers<any, any, any>, T extends any> = ({
    'Req' : T 
    'Op' : T | undefined
})[Mod['__Required']];

export type ModNull<Mod extends ITSShapeModifiers<any, any, any>, T extends any> = ({
    'Nullable' : T | null
    'Value' : T
})[Mod['__Nullable']];

export type ApplyMods<Mod extends ITSShapeModifiers<any, any, any>, T extends any> = ModReq<Mod, ModNull<Mod, T>>

export type Iterator = {
    "0" : "1"
    "1" : "2"
    "2" : "3"
    "3" : "4"
    "4" : "5"
    "5" : "6"
    "6" : "7"
    "7" : "8"
    "8" : "9"
    "9" : never
}


// Required to still add support for nullable and undefined.
export type ExtractMRefTypes<T extends Record<string, any>,
Path extends Record<string,any>,
Keys extends keyof T,
IDS extends 'T' | 'F' | 'E',
Paths extends any = Path,
Iter extends Extract<keyof Iterator, string> = "0",
KeysOfPaths = unknown extends Paths ? never : keyof Paths | Keys> =
Iter extends never ? 'Maxium iterations Exceeded' :
{
    [K in keyof T] :
    ({
        'T' : 'Invalid Option Here'
        'R' : ApplyMods<T[K], ExtractMRefTypes<T[K]['__tsType'], {}, '', IDS, Paths[K], Iter>>
        'AN' : ApplyMods<T[K], ExtractMRefTypes<T[K]['__tsType'], {}, '', IDS, K extends KeysOfPaths ? {w:Paths[K]} : {}, Iter>['w']> []//{w:Paths[K]}, IDS>['w'] // The problem here is that the wrapper,
        'AR' : Array<ApplyMods<T[K], ExtractMRefTypes<T[K]['__tsType'], {}, '',  IDS, Paths[K], Iter>> & ISchemaPropsRaw>
        'ARF' : Array<ApplyMods<T[K], MResultsNoId<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, '', IDS,  Paths[K], Iter>>>
        'Ref' : ApplyMods<T[K], K extends KeysOfPaths ? 

                MResults<T[K]['__tsType']>  & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, '', IDS,  Paths[K], Iter>
                :  IDS extends 'T' ? T[K]['__tsType']['__Id'] : 
                IDS extends 'E' ? T[K]['__tsType']['__Id'] | ExtractMRefTypesStr<T[K]['__tsType']['__ModRef'], never, IDS> : 
                unknown >


                // If we have a fake key, which matches, is there another way in  next iteration, when key matches
                // to detect if we want it. well I can use Record<string,any>..

                // keyof Paths[K] extends never ? 
                //     Paths[K] extends Record<string, never> ? e
                //         MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,{}> : 
                //         Paths// & {lll:K} //T[K]['__tsType']['__Id']
                //         : MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'],{}, IDS,  Paths[K]>
               // K extends KeysOfPaths ? 
                 //   'TT'://MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  Paths[K]> : 
                    //Paths[K] extends Record<string, any> ?
                    //'TTTTT' 
                    //MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  {}>  
                   //  'FFFFF'
                 // Paths[K] extends Record<string, never> ? 
                //     T[K]['__tsType']['__Id'] :
                //     MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  {}>  

                // //keyof Paths[K] extends never ? 
                  //   Paths[K]// extends Record<string, never> ? 'T' : 'F' 
                    // keyof Paths[K] extends Record<string, any> ?
                    // ? MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,{}> : 
                       
                        


                // 'FFF'

                // : 'Stop ID'
                // : 'Typically a RecordWantIT- Iterate'

            //     keyof Paths[K] extends never ? Paths[K] extends Record<string, never> ? 'Want IT - Stop'
        
            //     : 'Stop ID'
            //  : 'Typically a RecordWantIT- Iterate'
            //  T[K]['__tsType']['__Id']
        
        //Paths[K] extends Record<string, any> ? 'TTTTT' :'FFFF'
            // (MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], Paths[K], IDS>)
            // : IDS extends 'T' ? T[K]['__tsType']['__Id'] : unknown 
    })[T[K]['__ID']]
}


// Didn't support concept of ts not being able to post merge arrays.
// Required to still add support for nullable and undefined.
export type ExtractMRefTypesOld<T extends Record<string, any>,
Path extends Record<string,any>,
Keys extends keyof T,
IDS extends 'T' | 'F' | 'E',
Paths extends any = Path,
Iter extends Extract<keyof Iterator, string> = "0",
KeysOfPaths = unknown extends Paths ? never : keyof Paths | Keys> =
Iter extends never ? 'Maxium iterations Exceeded' :
{
    [K in keyof T] :
    ({
        'T' : 'Invalid Option Here'
        'R' : ApplyMods<T[K], ExtractMRefTypes<T[K]['__tsType'], {}, '', IDS, Paths[K], Iter>>
        // This is the slight complication...
        'AN' : ApplyMods<T[K], ExtractMRefTypes<T[K]['__tsType'], {}, '', IDS, K extends KeysOfPaths ? {w:Paths[K]} : {}, Iter>['w']> []//{w:Paths[K]}, IDS>['w'] // The problem here is that the wrapper,
        // causes the key to match, in this case the key is w..
        // which means the way in which we compare the key is a problem.
        // the only otherway to handle this is with look ahead, 
        // or in this cases
        'AR' : Array<ApplyMods<T[K], ExtractMRefTypes<T[K]['__tsType'], {}, '',  IDS, Paths[K], Iter>> & ISchemaPropsRaw>
        'Ref' : 
                // K extends KeysOfPaths ? 
                //     keyof Paths[K] extends never ?
                //         Paths[K] extends Record<string, never> ? '{}TT' : 
                //         'No Key - FakeKey' // Look Head for 
                //     : 'A' & Paths[K] //extends Record<string, never> ? 'TT' :  
                //     //MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  Paths[K]>
                // :'No Key'

                //KeysOfPaths

                ApplyMods<T[K], K extends KeysOfPaths ? 
                //keyof Paths[K] extends never ?
                  //  Paths[K] extends Record<string, never> ? 
                    //    MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  Paths[K]>
                      //  : T[K]['__tsType']['__Id'] // Look Head for 
                //: 

                MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, '', IDS,  Paths[K], Iter>
                :  IDS extends 'T' ? T[K]['__tsType']['__Id'] : 
                IDS extends 'E' ? T[K]['__tsType']['__Id'] | ExtractMRefTypesStr<T[K]['__tsType']['__ModRef'], never, IDS> : 
                unknown >


                // If we have a fake key, which matches, is there another way in  next iteration, when key matches
                // to detect if we want it. well I can use Record<string,any>..

                // keyof Paths[K] extends never ? 
                //     Paths[K] extends Record<string, never> ? e
                //         MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,{}> : 
                //         Paths// & {lll:K} //T[K]['__tsType']['__Id']
                //         : MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'],{}, IDS,  Paths[K]>
               // K extends KeysOfPaths ? 
                 //   'TT'://MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  Paths[K]> : 
                    //Paths[K] extends Record<string, any> ?
                    //'TTTTT' 
                    //MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  {}>  
                   //  'FFFFF'
                 // Paths[K] extends Record<string, never> ? 
                //     T[K]['__tsType']['__Id'] :
                //     MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,  {}>  

                // //keyof Paths[K] extends never ? 
                  //   Paths[K]// extends Record<string, never> ? 'T' : 'F' 
                    // keyof Paths[K] extends Record<string, any> ?
                    // ? MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], {}, IDS,{}> : 
                       
                        


                // 'FFF'

                // : 'Stop ID'
                // : 'Typically a RecordWantIT- Iterate'

            //     keyof Paths[K] extends never ? Paths[K] extends Record<string, never> ? 'Want IT - Stop'
        
            //     : 'Stop ID'
            //  : 'Typically a RecordWantIT- Iterate'
            //  T[K]['__tsType']['__Id']
        
        //Paths[K] extends Record<string, any> ? 'TTTTT' :'FFFF'
            // (MResults<T[K]['__tsType']> & ExtractMRefTypes<T[K]['__tsType']['__ModRef'], Paths[K], IDS>)
            // : IDS extends 'T' ? T[K]['__tsType']['__Id'] : unknown 
    })[T[K]['__ID']]
}


// this is not going to work

// Required to still add support for nullable and undefined.
// type ExtractMRefTypes2<T extends Record<keyof Paths, any>, Paths extends Record<string, any>,
// IDS extends 'T' | 'F',
// KeysOfPaths extends keyof Paths = keyof Paths,
// KeysOfExcludPaths extends keyof T = Exclude<keyof T, KeysOfPaths>> =
// {
//     [K in KeysOfPaths] : 
//     ({
//         'T' : 'Invalid Option Here'
//         'R' : ExtractMRefTypes2<T[K]['__tsType'], Paths[K], IDS>
//         'AN' : ExtractMRefTypes2<T[K]['__tsType'], {w:Paths[K]}, IDS>['w']
//         'AR' : ExtractMRefTypes2<T[K]['__tsType'], Paths[K], IDS>
//         'Ref' : 
//         Paths[K] extends Record<string, any> ? (MResults<T[K]['__tsType']> & ExtractMRefTypes2<T[K]['__tsType']['__ModRef'], Paths[K], IDS>)
//           :'FFF'  
//         //: IDS extends 'T' ? T[K]['__tsType']['__Id'] : 'FFF' 
//     })[T[K]['__ID']]
//     //: IDS extends 'T' ? ExtractMRefTypes<T[K]['__tsType'], {}, IDS> :'FFFF'//T[K]['__tsType']['__Id'] : 'GGG'// Required to still iterate and preserve the existing structure until we find that item.
// }
// &
// {
//     [K in KeysOfExcludPaths] : K extends KeysOfPaths ? unknown : ({
//         'T' : 'Invalid Option Here'
//         'R' : ExtractMRefTypes2<T[K]['__tsType'], {}, IDS>
//         'AN' : ExtractMRefTypes2<T[K]['__tsType'], {}, IDS> // problem here that the inlcude and out Paths are now the keys, so it knows, problem for us.
//         'AR' : ExtractMRefTypes2<T[K]['__tsType'], {}, IDS>
//         'Ref' : T[K]['__tsType']['__Id']
//     })[T[K]['__ID']]
// }

export type ExtractMRefTypesStr<T extends Record<string, any>, Paths extends string, IDS extends 'T' | 'F' | 'E'> =
{
    [K in keyof T] : 
    ({
        'T' : 'Invalid Option Here'
        'R' : ApplyMods<T[K], ExtractMRefTypesStr<T[K]['__tsType'], never, IDS>>
        'AN' : ApplyMods<T[K], ExtractMRefTypesStr<T[K]['__tsType'], K extends Paths ? 'w' : '', IDS>['w']> []
        'AR' : ApplyMods<T[K], ExtractMRefTypesStr<T[K]['__tsType'], never, IDS>> []
        'ARF': Array<ApplyMods<T[K], MResultsNoId<T[K]['__tsType']> & ExtractMRefTypesStr<T[K]['__tsType']['__ModRef'], never, IDS>>>;
        'Ref' : ApplyMods<T[K], K extends Paths ? MResults<T[K]['__tsType']> & 
             ExtractMRefTypesStr<T[K]['__tsType']['__ModRef'], never, IDS>
        :  IDS extends 'T' ? T[K]['__tsType']['__Id'] : 
        IDS extends 'E' ? T[K]['__tsType']['__Id'] | ExtractMRefTypesStr<T[K]['__tsType']['__ModRef'], never, IDS> :  unknown >
    })[T[K]['__ID']]
}

// The thing about this validator is that would only be usefully to validate the value.
// to be correct, because all keys have to be optional anyway.
export type ExtractValidate<T extends Record<string, any>,
Paths extends Record<string, any>,
KeysOfPaths extends keyof Paths = keyof Paths> =
{
    [K in keyof T] ? : K extends KeysOfPaths ?
    ({
        'T' : 'Invalid Option Here'
        'R' : ExtractValidate<T[K]['__tsType'], Paths[K]>
        'AN' : ExtractValidate<T[K]['__tsType'], {w:Paths[K]}>['w']
        'AR' : ExtractValidate<T[K]['__tsType'], Paths[K]>
        'ARF': ExtractValidate<T[K]['__tsType']['__ModRef'], Paths[K]>;
        'Ref' : Paths[K] extends Record<string, never> ? {}: ExtractValidate<T[K]['__tsType']['__ModRef'], Paths[K]>
    })[T[K]['__ID']]
    : never
}

export type MRequired<T extends Record<string, any>> = 
{
    [K in keyof T] -?: NonNullable<T[K]>
}

export interface ModelRecordTSRefType extends Record<string, ModelRecordTSRefType | IShapeTSRef<any, any, any, any>>
{
}

export type MPrimatives = boolean | number | string | Date;

export interface IMModelRecordTsTypes extends Record<string, IMModelRecordTsTypes | any>
{

}

interface  HHH { 
    a : string
}

type uuu = HHH extends IMModelRecordTsTypes
? 'T' :'F'

export interface IMTSModifiersRecord<
TModelParts extends {}
> extends
Record<string, undefined 
| TModelParts
| IMTSModifiersRecord<TModelParts>
| Array<
| undefined
| TModelParts
| IMTSModifiersRecord<TModelParts>
>>
{
}


export interface IMTSModifiersRefRecord extends
Record<string, IShapeContainers | IShapeTSRef<any, any, any, any> | IMTSModifiersRefRecord>
{
} 

// I would need to add the model for parts, that from int he shape of IAdapters system.
// I am going to take a short cut here first, but simpler swap out after ways.

// See if I can make mutiple different version of ModelRecordTsType, that check Required, Optional, Readonly
// But this can only really be done in the latest typesript versions.
export interface ISchemaParts<
Id, 
ModRD extends IMModelRecordTsTypes,
ModRND extends IMModelRecordTsTypes,
ModOD extends IMModelRecordTsTypes,
ModOND extends IMModelRecordTsTypes,
ReadRD extends IMModelRecordTsTypes,
ReadRND extends IMModelRecordTsTypes,
ReadOD extends IMModelRecordTsTypes,
ReadOND extends IMModelRecordTsTypes,
ModRef extends IMTSModifiersRefRecord> // Use the populates or extraction method... but should be removed as soon as it is not required.
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
    __ModRef: ModRef;
}

export interface IMModelParts<
Id, 
ModRD extends IMModelRecordTsTypes,
ModRND extends IMModelRecordTsTypes,
ModOD extends IMModelRecordTsTypes,
ModOND extends IMModelRecordTsTypes,
ReadRD extends IMModelRecordTsTypes,
ReadRND extends IMModelRecordTsTypes,
ReadOD extends IMModelRecordTsTypes,
ReadOND extends IMModelRecordTsTypes,
ModRefIds extends IMTSModifiersRecord<string> | undefined,      // Used to spesify it must have these fields, irrelavant if modRef is populated, only there for sub sections.
ModRefPop extends Record<string, any> | string,    // Can add in a specially modifier.   // User to spesify it msut have there fields irrelacant if Mod Ref is populated, only there for sub sections.
ModRef extends IMTSModifiersRefRecord> // Use the populates or extraction method... but should be removed as soon as it is not required.
extends ISchemaParts<
Id,
ModRD,
ModRND,
ModOD,
ModOND,
ReadRD,
ReadRND,
ReadOD,
ReadOND,
ModRef
>{
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
    __ModRefTypes : ModRefPop;    // These are all the readonly version of the referance.
    __ModRef: ModRef;
}

export type MRecordId<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> =  RecordId<TModelParts['__Id']>

export type RecordId<ID> = 
{
    _id : ID
}


export type RecordKeysResult<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
'_id' |
Extract<keyof TModelParts['__ModOD'], string> |
Extract<keyof TModelParts['__ModOND'], string> |
Extract<keyof TModelParts['__ModRD'], string> |
Extract<keyof TModelParts['__ModRND'], string> |
Extract<keyof TModelParts['__ReadRD'], string> |
Extract<keyof TModelParts['__ReadRND'], string> |
Extract<keyof TModelParts['__ReadOD'], string> |
Extract<keyof TModelParts['__ReadOND'], string> |
Extract<keyof TModelParts['__ModRef'], string>


export type RecordResult<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
{
    _id : TModelParts['__Id']
} &
TModelParts['__ModOD'] &
TModelParts['__ModOND'] &
TModelParts['__ModRD'] &
TModelParts['__ModRND'] &
TModelParts['__ReadRD'] &
TModelParts['__ReadRND'] &
TModelParts['__ReadOD'] &
TModelParts['__ReadOND'] &
ExtractMRefTypesStr<TModelParts['__ModRef'],'','T'>


export type RecordKeysUpdate<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
keyof TModelParts['__ModOD'] |
keyof TModelParts['__ModOND'] |
keyof TModelParts['__ModRD'] |
keyof TModelParts['__ModRND'] |
keyof TModelParts['__ModRef']

export type RecordUpdate<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
TModelParts['__ModOD'] &
TModelParts['__ModOND'] &
TModelParts['__ModRD'] &
TModelParts['__ModRND'] &
ExtractMRefTypesStr<TModelParts['__ModRef'], never, 'T'>

export type MNewRecord<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
{
    _id? : TModelParts['__Id']
}   
&
    TModelParts['__ModOD'] & 
    TModelParts['__ModOND'] & 
    Partial<TModelParts['__ModRD']> & 
    TModelParts['__ModRND'] & 
    Partial<TModelParts['__ReadRD']> & 
    TModelParts['__ReadRND'] & 
    TModelParts['__ReadOD'] & 
    TModelParts['__ReadOND']

export type MUpdate<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
{
    _id? : TModelParts['__Id']
} &
    Partial<TModelParts['__ModRD']> &   // Clearly loose things at times, mongo can only update a full document, which means don't need the partial here.
    Partial<TModelParts['__ModRND']> &  // Same as the satment above, so I could simplify things. This is not the end of the world. Just cross check it with partials.
   // This meant that I main giong to differentiate between readonly and mod fields, in mods fields those that have defaults.
    TModelParts['__ModOD'] &
    TModelParts['__ModOND']

export type MResults<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
MRecordId<TModelParts> & MResultsNoId<TModelParts>

export type MResultsNoId<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
TModelParts['__ModRD'] &
TModelParts['__ModRND'] &
MRequired<TModelParts['__ModOD']> &
TModelParts['__ModOND'] &
TModelParts['__ReadRD'] &
TModelParts['__ReadRND'] &
TModelParts['__ReadOND'] &
MRequired<TModelParts['__ReadOD']>


export type MUpdateStatment<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
    Partial<TModelParts['__ModRD']> &   // Clearly loose things at times, mongo can only update a full document, which means don't need the partial here.
    Partial<TModelParts['__ModRND']> &  // Same as the satment above, so I could simplify things. This is not the end of the world. Just cross check it with partials.
   // This meant that I main giong to differentiate between readonly and mod fields, in mods fields those that have defaults.
    TModelParts['__ModOD'] &
    TModelParts['__ModOND'] &
    ExtractMRefTypes<TModelParts['__ModRef'], {}, '', 'T'>


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

export interface ModelRecordTsTypes<TS extends TsTypesPrimatives> extends Record<string, TS | ModelRecordTsTypes<any>>
{
}

declare module 'mongoose'
{
//     function model<
//     TMSchema extends ISchema<string, any, any, any, any, any, any, any, any, any, any, any, any>, 
//     ModelExtracted extends IModelParts<string, any, any, any, any, any, any,any, any, any, {}, any> = IModelPartsFromSchema<TMSchema>
//     > (name: string, schema?: Schema, collection?: string, skipInit?: boolean): IModel<ModelExtracted>

     function model<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>
    > (name: string, schema?: mongoose.Schema, collection?: string, skipInit?: boolean): IModel<TModelParts>

    export module Types {

        interface ObjectId
        {
            toString: () => string;   
        }
    }
}

export type ObjectGetValue<O extends Record<string,any>, K extends string> = O[K]

// Dealing with the ability to exclude or include id fields, so 
// that one can perform operation on subset results, with like a save function
// or just expect a subset of fields, to exists to push tought a function.
// I need the ability to say these fields are missing,
// so a Record witout certain fields, needs to be present,
// which is the current situation..
// The Record version is the one that needs improvement, but that for later, right now
// we look at DocumentEnhanced
// with documentEnhanded, one needs to communicate, which fields
// are required to be present, or are assumed to be present
// sucht that populate is not called again on the dataset,
// when that information has already been retrived.
// Model = Record<string> & Document<'' which fields,>, where certain
// ref may or mayn't need to be populdate.
// we need to explit state include the ids..
// using id as the value, and special mode of transform.
// need to communicate population string, so that on execute
// the same set of fields would be avaliable.
// The problem is there are two formates as of current for
// populate and they are not interchangable, which means if deep populate
// is used, then choose to do a populate, then there is a problem.
// currently can't use populate and deeppopuldate on the same query.
// It is one or the other.
// There for one needs to populdate fields, deep, populate
// so that communicate existing stat of the model.
// The other thing is now how to communicate which ids'
// all, or only spesified id's, but how to communicate which
// needs to be used when.
// The only time want ids to be missing is for Record & Document results,
// which is a mode when using a subset of a model intialization, so that save is expected to exist.
// To achive this, on the ModelParts there is a field __ModRefids, which the intent
// was to be to make clear that those fields would be required, verus potentially missing
// PopuldateStr, doesn't support concept or ids versus missing extraction, would only be used
// for spesifying, populdate, but that is typically fine, because one would rather spesify
// the other required fields using this __MOdRefIds fields.
// I was thinking that undefined, that means include all model fields in the results,
// but that mean, when gotten a resultsing document, fomr execute
// that we need to extract and populdate the __ModRefIds fields.
// to ensure that when someone spesifies a partial model,
// that the same set of deepPopulate and populate and refids,
// that are required to exists exists in the format expected.
// We have used this in existing code, have other work arounds for it
// The problem with starting undefind, means all are present, but if was empty record
// structure then, should be taken as is in that document without question.
// undefined can mean everything while empty record can mean nothing,
// but a full set would never be the same as everything for the typing system
// and would be a corner case. in such a case, one should choose undefined.
// If you look at the bottom I have some test examples.
// What I now need to do, implement, deePopuldate and populdate generic fields
// then also implement extract and merging routine below,
// that merge the results.
// Also how can I do validation to ensure that the same fields that are populdate or deepPopulated
// are not spesified in __ModRefids... then string | RightHandSide does it make sence or what.
// Because I am doing one of the other, but both became a problem when we tried it,
// as caused too many things to not work. so we opted for leaving the fields out missing,
// which worked much better for us in 2.8.4
// Just think of this for a few seconds, is this 100% the right thing to do here.
// Later mongoose version, pull ids of Right hand side of the relationship
// automatically with id, so id, wouldn't be missing.
// It going to be much better that if someone want to use gards and handle both that the expclity spesify that in
// __ModRefIds. I can't see a reason why not to do that there not a common case anyways.
// Cool lets get on with things I guess..
// The other problem with this it that the modifiers will be lost, that is a problem.
// which means how do we preseve the modifiers, mmm..
// parrallel datastructure, were results type is pick and then wrapped with the existing modifiers.
// that is the only way this going to work.
// It would also be dowable.
// deepPopulate, populdate, RefModifiers going to leave for now.
// just id's in the results. Then update the C# generator at layer 2
// So that I can get some performance and results out, from the theoretically much simplifier
// approached the the really slow implementation, that things evolved into.

      
// Need to just decided on how and when to apply the transform.


export type QueryResultsDocumentModelNotNullable<TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>,
TPopulate extends string,
TDeepPopulate extends Record<string, any>,
ArrayOfResults extends 'A' | 'O' = 'O',
Primative extends undefined | unknown = undefined,
Lean extends 'T' | 'F' = 'F',
ResultRecord = MRecordId<TModelParts> & (TModelParts['__ModRefIds'] extends undefined ? MResults<TModelParts> : MResults<TModelParts> & TModelParts['__ModRefIds']),
RecordTransformed =  ResultRecord & ExtractMRefTypes<TModelParts['__ModRef'], TDeepPopulate, TPopulate, TModelParts['__ModRefIds'] extends undefined ? 'T' :'F'>
> = Lean extends 'T' ? Primative extends undefined ? 
        ArrayOfResults extends 'O' ? 
            RecordTransformed | null
        : Array<RecordTransformed>
        : Primative
    : ArrayOfResults extends 'O' ? 
        Primative extends undefined ?
            RecordTransformed & DocumentEnhanced<TModelParts,'', {}> & IDocumentModel & MRecordId<TModelParts> | null
            : Primative & DocumentEnhanced<TModelParts,'', {}> & IDocumentModel & MRecordId<TModelParts>
        : Array<RecordTransformed & DocumentEnhanced<TModelParts, '',{}> & IDocumentModel & MRecordId<TModelParts>>

export type QueryResultsDocumentModel<TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>,
TPopulate extends string,
TDeepPopulate extends Record<string, any>,
ArrayOfResults extends 'A' | 'O' = 'O',
Primative extends undefined | unknown = undefined,
Lean extends 'T' | 'F' = 'F',
ResultRecord = MRecordId<TModelParts> & (TModelParts['__ModRefIds'] extends undefined ? MResults<TModelParts> : MResults<TModelParts> & TModelParts['__ModRefIds']),
RecordTransformed =  ResultRecord & ExtractMRefTypes<TModelParts['__ModRef'], TDeepPopulate, TPopulate, TModelParts['__ModRefIds'] extends undefined ? 'T' :'F'>
> = Lean extends 'T' ? Primative extends undefined ? 
        ArrayOfResults extends 'O' ? 
            RecordTransformed | null
        : Array<RecordTransformed>
        : Primative
    : ArrayOfResults extends 'O' ? 
        Primative extends undefined ?
            RecordTransformed & DocumentEnhanced<TModelParts,'', {}> & IDocumentModel & MRecordId<TModelParts> | null
            : Primative & DocumentEnhanced<TModelParts,'', {}> & IDocumentModel & MRecordId<TModelParts>
        : Array<RecordTransformed & DocumentEnhanced<TModelParts, '',{}> & IDocumentModel & MRecordId<TModelParts>>

type QueryRecord<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
    ExtractMRefTypesStr<TModelParts['__ModRef'],'','T'> & MResults<TModelParts>

type QueryNewRecord<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
    ExtractMRefTypesStr<TModelParts['__ModRef'],'','T'> & MNewRecord<TModelParts>

type QueryUpdateRecord<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
    Partial<ExtractMRefTypesStr<TModelParts['__ModRef'],'','T'>> & MUpdate<TModelParts>
        
type QueryNewDocumentResults<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
ExtractMRefTypesStr<TModelParts['__ModRef'],'','T'> & MResults<TModelParts> & DocumentEnhanced<TModelParts,'', {}> & IDocumentModel

type QueryDocumentResults<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = QueryDocumentResultsNotNullable<TModelParts> | null

type QueryDocumentResultsNotNullable<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
ExtractMRefTypesStr<TModelParts['__ModRef'],'','T'> & MResults<TModelParts> & DocumentEnhanced<TModelParts,'', {}> & IDocumentModel

type QueryResults<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>> = 
ExtractMRefTypesStr<TModelParts['__ModRef'],'','T'> & MResults<TModelParts>

export type SelectType<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>, K extends RecordKeysResult<TModelParts>> = Pick<RecordResult<TModelParts>, K> & {_id: TModelParts['__Id'];}

export type PickObjectValue<O extends Record<string, any>, Path extends Array<string>, Iter extends Extract<keyof Iterator, string> = '0', TPath extends any = Path> =
{
  [K in Iter] : Iter extends never ? 'Maxium Iterations Exceeded' :
  undefined extends TPath[Iter]  ? O :
  unknown extends O[TPath[Iter]]  ? O :
  PickObjectValue<O[TPath[Iter]], Path, Iterator[Iter]>
}[Iter]

export interface IModel<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>>
{
    rootKeyNameType: keyof RecordKeysResult<TModelParts>;
    updateStatmentType : MUpdateStatmentFor<MUpdateStatment<TModelParts>>;
    selectType: TModelParts;
    newType : QueryNewRecord<TModelParts>;    
    new(doc?: QueryNewRecord<TModelParts>, fields?: Object, skipInit?: boolean): QueryNewDocumentResults<TModelParts>;


    // This is required to overide the underlying hidden Model, in less you feel like copy and pasting everything to this level.
    new(doc?: Object, fields?: Object, skipInit?: boolean): 'Invalid Record' & void;

    // After using deepPopulate in our current version of mongo, populate methods can't be used again.
    // Issues apply the path constraints here recusively for some reason...
    deepPopulate<Paths extends ExtractValidate<TModelParts['__ModRef'], Paths>>(paths: string) : QueryEnhanced<TModelParts, '', Paths>;

    deepPopulate<Paths extends ExtractValidate<TModelParts['__ModRef'], Paths>>(paths: Array<string>) : QueryEnhanced<TModelParts, '', Paths>;

    create(doc: QueryNewRecord<TModelParts>, fn?: (err: any, res: MResults<TModelParts> & DocumentEnhanced<TModelParts, '',  {}>) => void): Promise<QueryNewDocumentResults<TModelParts>>;
    create(doc1: QueryNewRecord<TModelParts>, doc2: QueryNewRecord<TModelParts>, fn?: (err: any, res1: QueryNewDocumentResults<TModelParts>, res2: QueryNewDocumentResults<TModelParts>) => void): Promise<QueryNewDocumentResults<TModelParts>[]>;
    create(doc1: QueryNewRecord<TModelParts>, doc2: QueryNewRecord<TModelParts>, doc3: QueryNewRecord<TModelParts>, fn?: (err: any, res1: QueryNewDocumentResults<TModelParts>, res2: QueryNewDocumentResults<TModelParts>, res3: QueryNewDocumentResults<TModelParts>) => void): Promise<QueryNewDocumentResults<TModelParts>[]>;
    

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
 
    
    // findById(id: TModelParts['__Id'], callback?: (err: any, res: QueryDocumentResults<TModelParts>) => void) : QueryEnhanced<TModelParts>;
            
    find(): QueryEnhanced<TModelParts, '', {}, 'A'>;
    // I haven't taken the array wrapping into arroud for transform, I will need to strip that.
    find(cond: Object): QueryEnhanced<TModelParts, '', {}, 'A'>;
    find<TCallBack extends ((err: any, res: QueryDocumentResultsNotNullable<TModelParts>[]) => void) | undefined>(cond: Object, callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'A'> : void;
   
    find(cond: Object, fields: Object): QueryEnhanced<TModelParts, '', {}, 'A'>;
    find<TCallBack extends ((err: any, res: QueryDocumentResultsNotNullable<TModelParts>[]) => void) | undefined>(cond: Object, fields: Object, callback: TCallBack):TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'A'> : void;
    
    find(cond: Object, fields: Object, options: Object): QueryEnhanced<TModelParts, '', {}, 'A'>;
    find<TCallBack extends ((err: any, res: QueryDocumentResultsNotNullable<TModelParts>[]) => void) | undefined>(cond: Object, fields: Object, options: Object, callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'A'> :  void;
    
    
    findById(id: TModelParts['__Id']): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findById<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(id: TModelParts['__Id'], callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    
    findById(id: TModelParts['__Id'], fields: Object): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findById<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(id: TModelParts['__Id'], fields: Object, callback?: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    
    findById(id: TModelParts['__Id'], fields: Object, options: Object): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findById<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(id: TModelParts['__Id'], fields: Object, options: Object, callback?: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    
    findByIdAndRemove(id: TModelParts['__Id']): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findByIdAndRemove<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(id: TModelParts['__Id'], callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    
    findByIdAndRemove(id: TModelParts['__Id'], options: Object): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findByIdAndRemove<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(id: TModelParts['__Id'], options: Object, callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
        
    findByIdAndUpdate(id: TModelParts['__Id'], update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findByIdAndUpdate<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(id: TModelParts['__Id'], update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, callback: TCallBack):  TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    
    findByIdAndUpdate(id: TModelParts['__Id'], update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, options: FindAndUpdateOption): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findByIdAndUpdate<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(id: TModelParts['__Id'], update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, options: FindAndUpdateOption, callback: TCallBack):  TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    
    findOne(): QueryEnhanced<TModelParts, '', {}, 'O'>;

    findOne(cond: Object): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findOne<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(cond: Object, callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    
    findOne(cond: Object, fields: Object): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findOne<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(cond: Object, fields: Object, callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    
    findOne(cond: Object, fields: Object, options: Object): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findOne<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(cond: Object, fields: Object, options: Object, callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    
    findOneAndRemove(cond: Object): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findOneAndRemove<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(cond: Object, callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    findOneAndRemove(cond: Object, options: Object): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findOneAndRemove<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(cond: Object, options: Object, callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    findOneAndUpdate(cond: Object, update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findOneAndUpdate<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(cond: Object, update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, callback: TCallBack):  TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    findOneAndUpdate(cond: Object, update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, options: FindAndUpdateOption): QueryEnhanced<TModelParts, '', {}, 'O'>;
    findOneAndUpdate<TCallBack extends ((err: any, res: QueryDocumentResults<TModelParts>) => void) | undefined>(cond: Object, update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, options: FindAndUpdateOption, callback: TCallBack):  TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;

    //populate<U>(doc: U, options: Object, callback?: (err: any, res: U) => void): Promise<U>;
    //populate<U>(doc: U[], options: Object, callback?: (err: any, res: U[]) => void): Promise<U[]>;

    // These schema may need to change but I will have to look that up.
    update(cond: Object, update: {$pull?:Object, $set?:Object, $addToSet?: Object} | QueryUpdateRecord<TModelParts> | MUpdateStatmentFor<MUpdateStatment<TModelParts>>):QueryEnhanced<TModelParts, '', {}, 'O', number, 'T'>;
    update<TCallBack extends ((err: Error, affectedRows: number) => void) | undefined>(cond: Object, update: {$pull?:Object, $set?:Object, $addToSet?: Object} | QueryUpdateRecord<TModelParts> | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, callback: TCallBack): TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O', number, 'T'> : void;
    update(cond: Object, update: {$pull?:Object, $set?:Object, $addToSet?: Object} | QueryUpdateRecord<TModelParts> | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, options: Object) : QueryEnhanced<TModelParts, '', {}, 'O', number, 'T'>;
    update<TCallBack extends ((err: Error, affectedRows: number) => void) | undefined>(cond: Object, update: {$pull?:Object, $set?:Object, $addToSet?: Object} | QueryUpdateRecord<TModelParts> | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, options: Object, callback:TCallBack) : TCallBack extends undefined ? QueryEnhanced<TModelParts, '', {}, 'O', number, 'T'> : void;
    remove(cond: Object, callback?: (err: any) => void): Query<{}>;

    save(): QueryEnhanced<TModelParts, '', {}, 'O'>;

    save<TCallBack extends ((err: any, result: QueryDocumentResultsNotNullable<TModelParts>, numberAffected: number) => void) | undefined>(callback: TCallBack): undefined extends TCallBack ? QueryEnhanced<TModelParts, '', {}, 'O'> : void;
    // Need to look into this.
    //where(path: string, val?: Object): Query<T[]>;

    // These can be broken up even better, to improve performance.
    count(callback?: (err: any, count: number) => void): QueryEnhanced<TModelParts, '', {}, 'O', number>;

    count(criteria: Object, callback?: (err: any, count: number) => void): QueryEnhanced<TModelParts, '', {}, 'O', number>;

    $where(condition?: string): QueryEnhanced<TModelParts, '', {}, 'O'>;

    $where(funCondition: (this: (QueryRecord<TModelParts>)) => boolean): QueryEnhanced<TModelParts, '', {}, 'O'>;
}


// export type SchemaResultsDocumentModel<TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>> = MResults<TModelParts> & DocumentEnhanced<TModelParts>

export interface DocumentNewEnhanced<TModelParts extends IMModelParts<string, any, any, any, any, any, any, any, any, any, any, any>>
{
    //__TModelParts : TModelParts;
    
    save(): Promise<QueryDocumentResultsNotNullable<TModelParts>>;

    save<TCallBack extends ((err: any, res: QueryDocumentResultsNotNullable<TModelParts>) => void) | undefined>(callback: TCallBack): undefined extends TCallBack ? Promise<QueryDocumentResultsNotNullable<TModelParts>> : void;


    // Might needs some other form here going to use results, we shall see.
    equals<docType extends MResults<TModelParts>>(doc: docType): boolean;

    // Think the following should stil be relavent to newaly create records.
    invalidate<K extends keyof  RecordKeysResult<TModelParts>>(path: K, errorMsg: string, value: any): void;
    invalidate<K extends keyof  RecordKeysResult<TModelParts>>(path: K, error: Error, value: any): void;

    // These methods validators, need to run on the normal stuff, ohwell.
    // invalidate<Paths extends ExtractPickValidate<Schema,Paths>>(path: string, errorMsg: string, value: any): void;
    // invalidate<Paths extends ExtractPickValidate<Schema,Paths>>(path: string, error: Error, value: any): void;

    set<K extends keyof RecordKeysUpdate<TModelParts>>(path: K, val: RecordUpdate<TModelParts>[K], options?: Object): void;
    //set<Paths extends ExtractPickValidate<Schema,Paths>> (path: string, val: any, options?: Object): void;
    set<Paths extends Record<string,any>, Missing extends 'Missing Field'> (path: string, val: any, options?: Object): void;
    set(value: Partial<RecordUpdate<TModelParts>>): void;

    validate(cb: (err: any) => void): void;

    toJSON(options?: Object): ToJson<QueryResults<TModelParts>>;
    toObject(options?: Object): QueryResults<TModelParts>;

    isNew: boolean;
    errors: Object;
    schema: Object;
}


export interface DocumentEnhanced<TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>,
TPopulate extends string,
DeepPopulate extends Record<string, any>> //extends Document
{
   // __TModelParts : TModelParts;
    //__TDeepPopulate : DeepPopulate;

    save(): Promise<QueryDocumentResultsNotNullable<TModelParts>>;

    save<TCallBack extends ((err: any, res: QueryDocumentResultsNotNullable<TModelParts>) => void) | undefined>(callback: TCallBack): undefined extends TCallBack ? Promise<QueryDocumentResultsNotNullable<TModelParts>> : void;

    equals<docType extends RecordResult<TModelParts>>(doc: docType): boolean;

    populate<K extends Extract<keyof TModelParts['__ModRef'], string>>(path: K, callback?: 
        (err: any, res: QueryResultsDocumentModel<TModelParts, TPopulate | K, DeepPopulate>) => void): DocumentEnhanced<TModelParts, TPopulate | K, DeepPopulate>

    // populate<Opt extends ExtractPopulateOption<SchemaPartial,Opt>>(opt: Opt, 
    //     callback?: (err: any, res: any) => void): any

    // // deep populate now just stops everything else, need to implemented a look at head
    // // Record<string, any> = > Record<string,Record<string(dontcare),Record<string,any>>
    deepPopulate<Paths extends ExtractValidate<TModelParts['__ModRef'], Paths>>(paths: string, 
    callback?: (err: any, res: QueryResultsDocumentModel<TModelParts, TPopulate, Paths>) => void) : void

    deepPopulate<Paths extends  ExtractValidate<TModelParts['__ModRef'], Paths>>(paths: Array<string>, 
        callback?: (err: any, res: QueryResultsDocumentModel<TModelParts, TPopulate, Paths>) => void) : void    

    // QueryEnhanced<RawSchema, SchemaReadOnly, TransformRaw<SchemaPartial,Paths>, Lean>;

    remove<T>(callback?: (err: any) => void): QueryEnhanced<TModelParts>;

    update<T>(doc: Object, options: Object, callback: (err: any, affectedRows: number, raw?: any) => void): QueryEnhanced<TModelParts>;

    toJSON(options?: Object): ToJson<QueryResultsDocumentModelNotNullable<TModelParts, TPopulate, DeepPopulate, 'O', undefined, 'T'>>;
    toObject(options?: Object): QueryResultsDocumentModelNotNullable<TModelParts, TPopulate, DeepPopulate, 'O', undefined, 'T'>;

    validate(cb: (err: any) => void): void;

    invalidate<Paths extends RecordKeysUpdate<TModelParts>>(path: string, errorMsg: string, value: any): void;
    invalidate<Paths extends RecordKeysUpdate<TModelParts>>(path: string, error: Error, value: any): void;

    invalidate(path: string, errorMsg: string, value: any): void;
    invalidate(path: string, error: Error, value: any): void;

    invalidate<K extends RecordKeysUpdate<TModelParts>>(path: K, errorMsg: string, value: any): void;
    invalidate<K extends RecordKeysUpdate<TModelParts>>(path: K, error: Error, value: any): void;

    invalidate<Paths extends RecordKeysUpdate<TModelParts>>(path: string, errorMsg: string, value: any): void;
    invalidate<Paths extends RecordKeysUpdate<TModelParts>>(path: string, error: Error, value: any): void;

    set<K extends RecordKeysUpdate<TModelParts>>(path: K, val: MUpdate<TModelParts>[K], options?: Object): void;
    //set<Paths extends MUpdate<TModelParts>> (path: string, val: any, options?: Object): void;
    set<Missing extends 'Missing Field', Paths extends Record<string,any>> (path: string, val: any, options?: Object): void;
    set(value: MUpdate<TModelParts>): void;

    get<K extends ''>(path: string, type?: new(...args: any[]) => any): any;
    //get(path: string, type?: new(...args: any[]) => any): any;

    isNew: boolean;
    errors: Object;
    schema: Object;
}

export interface QueryEnhanced<
TModelParts extends IMModelParts<any, any, any, any, any, any, any, any, any, any, any, any>,
Populate extends string = never,
DeepPopulate extends Record<string, any> = {},
ArrayOfResults extends 'A' | 'O' = 'O',
Primative extends unknown | undefined = undefined,
Lean extends 'T' |'F' = 'F',
TWhere = never
>
    {
    lean() : QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative ,'T'>;
    lean(value : true) : QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, 'T'>;
    lean(value : false) : QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, 'F'>;
    lean(value : undefined) : QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, 'F'>;

    exec(): Promise<QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>>;

    exec<TCallBack extends ((err: any, res: QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>) => void) | undefined>
    (callback: TCallBack): undefined extends TCallBack ? Promise<QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>> : void;

    exec<TCallBack extends ((err: any, res: QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>) => void) | undefined>
    (operation: string, callback: TCallBack): undefined extends TCallBack ? Promise<QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>> : void;
   

    // exec(callback?: (err: any, res: QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>) => void):
    // Promise<QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>>;
    // exec(operation: string, callback?: (err: any, res: QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>) => void):
    // Promise<QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>>;
    // exec(operation: Function, callback?: (err: any, res: QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>) => void):
    // Promise<QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>>;

    // populate<K extends keyof TModelParts['__ModRefIds'], Sel extends keyof TransformPartial<SchemaPartial,K>[K]>
    // (path: K, select: Sel, match?: Object, options?: Object):
    // QueryEnhanced<RawSchema, {}, ObjectKeyPick<TransformPartial<SchemaPartial,K>,K,Sel>, ArrayOfResults, Primative, Lean>;

    populate<K extends Extract<keyof TModelParts['__ModRef'], string>>(path: K, select: undefined, match?: Object, options?: Object):
    QueryEnhanced<TModelParts, Populate | K, DeepPopulate, ArrayOfResults, Primative, Lean>;

    //ExtractValidate<TModelParts['__ModRef'], Paths>

    // // Need to figure out how to do this one again.
    // have to use an iterator here, leave this for later.
    // populate<K extends keyof TModelParts['__ModRef'], Sel extends [K]>(path: K, select: string, match?: Object, options?: Object):
    // QueryEnhanced<TModelParts, DeepPopulate | K, ArrayOfResults, ObjectKeyPick<TransformPartial<SchemaPartial,K>,K,Sel>, Lean>;

    populate<K extends Extract<keyof TModelParts['__ModRef'],string>>(path: K, select?: undefined, match?: Object, options?: Object):
    QueryEnhanced<TModelParts, Populate | K, DeepPopulate, ArrayOfResults, Primative, Lean>;
    
    populate<Which extends 'neasted', Paths extends ExtractValidate<TModelParts['__ModRef'], Paths>>(path: string, select?: undefined, match?: Object, options?: Object):
    QueryEnhanced<TModelParts, Populate, DeepPopulate & Paths, ArrayOfResults, Primative, Lean>;

    // populate<Opt extends ExtractPopulateOption<Schema,Opt>>(opt: Opt): 
    // QueryEnhanced<TModelParts, TransformPartialRaw<SchemaPartial,ObjectGetValue<Opt,'Path'>>, ArrayOfResults, Primative, Lean>;
    
    // Still required to write a partial version of this.
    //populate<Opt extends ExtractPopulateOption<SchemaPartial,Opt>>(opt: Opt, 
    //  callback?: (err: any, res: any) => void): any

    deepPopulate<Paths extends ExtractValidate<TModelParts['__ModRef'], Paths>>(paths: string) :
    QueryEnhanced<TModelParts, Populate, Paths, ArrayOfResults, Primative, Lean>;

    deepPopulate<Paths extends ExtractValidate<TModelParts['__ModRef'], Paths>>(paths: Array<string>) :
    QueryEnhanced<TModelParts, Populate, Paths, ArrayOfResults, Primative, Lean>;


    //  QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, ArrayOfResults ,'T'>;
    //  distinct(callback?: (err: any, res: T) => void): Query<T>;
    //  distinct(field: string, callback?: (err: any, res: T) => void): Query<T>;
    //  distinct(criteria: Object, field: string, callback?: (err: any, res: T) => void): Query<T>;
    //  distinct(criteria: Query<T>, field: string, callback?: (err: any, res: T) => void): Query<T>;


    distinct<K extends RecordKeysResult<TModelParts>>(field: K, callback?: (err: any, res: RecordResult<TModelParts>[K][]) => void): QueryEnhanced<TModelParts, Populate, DeepPopulate, 'A', MResults<TModelParts>[K], Lean>;
    distinct<K extends RecordKeysResult<TModelParts> = never>(field: string, callback?: (err: any, res: RecordResult<TModelParts>[K][]) => void): QueryEnhanced<TModelParts, Populate, DeepPopulate,'A', MResults<TModelParts>[K], Lean>;

    distinct<K extends RecordKeysResult<TModelParts>>(conditions: Object,field: K,callback?: (err: any, res: RecordResult<TModelParts>[K][]) => void): QueryEnhanced<TModelParts, Populate, DeepPopulate,'A', MResults<TModelParts>[K], Lean>
    distinct<K extends RecordKeysResult<TModelParts> = never>(conditions: Object, field: string,  callback?: (err: any, res: RecordResult<TModelParts>[K][]) => void): QueryEnhanced<TModelParts, Populate, DeepPopulate,'A', MResults<TModelParts>[K], Lean>;


    // Typiclally all of these should start from scratch again, were Lean should be reset.

    find(callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'A', Primative, Lean>) => void):
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'A', Primative, Lean>;
    find(criteria: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'A', Primative, Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'A', Primative, Lean>;
    findOne(callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;
    findOne(criteria: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative,  Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;
    findOneAndRemove(callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative,  Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative,  Lean>;
    findOneAndRemove(cond: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;
    findOneAndRemove(cond: Object, options: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;
    findOneAndUpdate(callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;
    findOneAndUpdate(update: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;
    findOneAndUpdate(cond: Object, update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;
    findOneAndUpdate(cond: Object, update: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, options: FindAndUpdateOption, callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;

    // PRIMATIVE OPTION REQUIRED, TAKE SUBKEY PARAMETER
    //limit(val: number): Query<T>;

    remove(callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O',Primative, Lean>) => void):
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;

    remove(criteria: Object, callback?: (err: any, res: 
        QueryResultsDocumentModel<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;

    sort(arg: Object): QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;
    sort(arg: string): QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;


    update(callback?: (err: Error, affectedRows: number) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', number, 'T'>;

    update(doc: Object, callback?: (err: Error, affectedRows: number) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', number, 'T'>;

    update(criteria: Object, doc: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, callback?: (err: Error, affectedRows: number) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', number, 'T'>;

    update(criteria: Object, doc: Object | MUpdateStatmentFor<MUpdateStatment<TModelParts>>, options: Object, callback?: (err: any, affectedRows: number) => void): 
                QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', number, 'T'>;

    count(callback?: (err: any, count: number) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', number, 'T'>;

    count(criteria: Object, callback?: (err: any, count: number) => void): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', number, 'T'>;

    limit(val: number): QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    select<K extends RecordKeysResult<TModelParts>>(arg: K):
         QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Pick<RecordResult<TModelParts>, K> & {_id:TModelParts['__Id']}, Lean>;

    select<Paths extends ExtractValidate<TModelParts['__ModRef'], Paths>>(arg: string):
        QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    select<Paths extends ExtractValidate<TModelParts['__ModRef'], Paths>>(arg: Object):
       QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>

    where<K extends RecordKeysResult<TModelParts>, V extends Pick<RecordResult<TModelParts>, K> | undefined>
      (path: K, val?: V): 
      QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean, RecordResult<TModelParts>[K]>;

    where<O extends Partial<RecordResult<TModelParts>>>(object: O): 
      QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean, O>;

      // Need the correct validation routine here...
    // where<Paths extends ExtractValidate<TModelParts['__ModRef'], Paths>>(path: string): 
    //   QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean, 'neasted pick required'>;

    where<Path extends Array<string>>(path: string): 
      QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean, PickObjectValue<RecordResult<TModelParts>, Path>>;

    or(criteria: Object): QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    // where(path?: string, val?: any): 
    //     QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;
    // where(path?: Object, val?: any): 
    //     QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    gt(val: TWhere): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;
    // gt(path: string, val:  RecordResult<TModelParts>[K]): 
    //     QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;
    gt<K extends RecordKeysResult<TModelParts>>(path: K, val: RecordResult<TModelParts>[K]): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;
    gte(val: TWhere): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    // gte(path: string, val: number): 
    //     QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    lt(val: TWhere): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;
    // lt(path: string, val: number): 
    //     QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;
    lt<K extends RecordKeysResult<TModelParts>>(path: K, val: RecordResult<TModelParts>[K]): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    lte(val: TWhere): 
        QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    lte<K extends RecordKeysResult<TModelParts>>(path: K, val: RecordResult<TModelParts>[K]): 
      QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    // lte(path: string, val: number): 
    //     QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    // Typicaly these need to be check that they have been preceed by some previous operation.
    // this woudl require nother parameter.
    equals(val: TWhere): QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults, Primative, Lean>;

    exists(val?: boolean): QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;
    exists(path: string, val?: boolean): QueryEnhanced<TModelParts, Populate, DeepPopulate, 'O', Primative, Lean>;

    $where(condition?: string): QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults>;

    $where(funCondition: (this: (QueryRecord<TModelParts>)) => boolean): QueryEnhanced<TModelParts, Populate, DeepPopulate, ArrayOfResults>;

    /*
    lt(val: number): Query<T>;
    lt(path: string, val: number): Query<T>;
    lte(val: number): Query<T>;
    lte(path: string, val: number): Query<T>;
    */
}


// type IModB = IMModelParts<string, {
//     modBRD : 'RequiredDefault'
// }, {
//     modBRND  : 'RequiredNoDefault'
// }, {
//     modBOD  : 'OptionalDefault'
// }, {
//     modBOND  : 'OptionalNoDefault'
// }, {
//    readonly ReadBRD  : 'RequiredDefault'
// }, {
//     readonly ReadBRND  : 'RequiredNoDefault'
// }, {
//     readonly ReadBOD  : 'OptionalDefault'
// }, {
//     readonly ReadBOND  : 'OptionalNoDefault'
// }, {
//     refB : string,
//     refNeastedB : string,
//     refNeastedBUndefined : string,
//     refNeastedBArrayUndefined : Array<string>
// },
// {},
// {
//     refB: IShapeTSRef<IModB, 'Req', 'Get', 'Nullable'>,
//     refNeastedB : IShapeTSArrayNeasted<IShapeTSRef<IModB, 'Req', 'Get', 'Nullable'>, 'Req', 'Get', 'Nullable'>, 
//     refNeastedBRecord : IShapeTSArrayRecord<{
//         ref : IShapeTSRef<IModB, 'Req', 'Get', 'Nullable'>
//     }, 'Req', 'Get', 'Nullable'>,
//     refBB : IShapeTSRef<IModB, 'Req', 'Get', 'Nullable'>,
// }>;

// const modelB = {} as IModel<IModB>

// type ModelAParts = IMModelParts<string, {
//     modRD : 'RequiredDefault', 
// }, {
//     modRND  : 'RequiredNoDefault'
// }, {
//     modOD  : 'OptionalDefault'
// }, {
//     modOND  : 'OptionalNoDefault'
// }, {
//    readonly ReadRD  : 'RequiredDefault'
// }, {
//     readonly ReadRND  : 'RequiredNoDefault'
// }, {
//     readonly ReadOD  : 'OptionalDefault'
// }, {
//     readonly ReadOND  : 'OptionalNoDefault'
// }, 
//     undefined,
// {},
// {
//     refA : IShapeTSRef<IModB, 'Req', 'Get', 'Nullable'>,
//     refNeastedA : IShapeTSArrayNeasted<IShapeTSRef<IModB, 'Req', 'Get', 'Nullable'>, 'Op', 'Get', 'Nullable'>, // this requires lookahead.
//     refNeastedArrayRecord : IShapeTSArrayRecord<{
//         ref : IShapeTSRef<IModB, 'Req', 'Get', 'Nullable'>
//     }, 'Req', 'Get', 'Nullable'>,
//     refNeastedRecord : IShapeTSRecord<{
//         ref : IShapeTSRef<IModB, 'Req', 'Get', 'Nullable'>
//     }, 'Req', 'Get', 'Nullable'>,
//     refAA : IShapeTSRef<IModB, 'Req', 'Get', 'Nullable'>,
// }>

// const modelA = {} as IModel<ModelAParts>


// //modelA.update({id: ''},{}) // This is working.

// // type rrr = ExtractValidate<{
// //     refA : IShapeTSRef<IModB>,
// //     refNeastedA : IShapeTSArrayNeasted<mm>, // this requires lookahead.
// //     refNeastedRecord : IShapeTSArrayRecord<{
// //         ref : IShapeTSRef<IModB>
// //     }>,
// //     refAA : IShapeTSRef<IModB>,
// // },{}>

// type results = ExtractMRefTypesStr<ModelAParts['__ModRef'], 'refA' | 'refAA' | 'refNeastedA','T'>;

// const test : results = {
//     refA:{
    
//     }
// }

// const res : results;

// res!.refNeastedRecord!.ref


// type rrrrr = ExtractMRefTypes<ModelAParts['__ModRef'], {refA:{refB:{refBB:{refNeastedBRecord:{ref:{}}}}, refNeastedRecord:{ref:{}}}, refNeastedA:{
//     refNeastedBRecord:{ref:{}}
// }, refAA:{
//     refB:{}
// }, refNeastedRecord:{ref:{refAA:{}}}}, 'F'>

// const rrrr : rrrrr = {
// refA: {
// refB
// }

// }
// rrrr!.refNeastedRecord!.ref!.
// rrrr!.refA = null
// rrrr!.refNeastedA!.refNeastedBRecord!.ref!.refNeastedBRecord!.ref;
// rrrr.refA.refB.refBB.refNeastedBRecord.ref.refNeastedBRecord.ref;
// rrrr.refAA.refB.refNeastedBRecord.ref;
// rrrr.refNeastedRecord.ref.refNeastedBRecord.ref;




// type uuuu = Record<string,never> extends typeof rrrr.refNeastedA ? 'T' :'F'



// modelA.findById('').populate('refA').lean(false).exec(function (err, results) {

//     test(results)
// });


// modelA.deepPopulate<{refA:{}, refAA:{}}>('refA').lean(false).exec(function (err, results) {

//     results.refNeastedA = 2323

//     test(results)
// });



// function test <T extends DocumentEnhanced<ModelAParts,''>>(rec : T)//ModelAParts & {__ModRefIds:{a:{}}},''>>(rec : T)
// {

//     testA(rec);

//     rec.save(function(err, results) {
//         results.save();
//     });
// }


// function testA<T extends DocumentEnhanced<ModelAParts,''>>(rec : T)
// {
//     rec..exec(function(err, results) {
//         results.save();
//     });
// // }
// db.FinancialProduct.findById(id).populate('lookups').populate('jurisdiction')
// .populate<'neasted', {documentRequirements:{documentTypes:{}}}>('documentRequirements.documentTypes')

/*

export type IFinancialProductModRefSchema = {
  company: IShapeTSRef<RefSchema.ICompanySchemaModelParts, 'Req', 'Set', 'Value'>;
  documentRequirements: IShapeTSArrayNeasted<IShapeTSRef<RefSchema.IDocumentRequirementSchemaModelParts, 'Req', 'Set', 'Value'>,'Req', 'Get', 'Value'>;
  financialTransactionConfigurationSet: IShapeTSRef<RefSchema.IFinancialTransactionConfigurationSetSchemaModelParts, 'Op', 'Set', 'Value'>;
  interestRate: IShapeTSRecord<
{
    deriver: IShapeTSRef<RefSchema.IFunctionLibrarySchemaModelParts, 'Req', 'Set', 'Value'>;
  }, 'Req', 'Set', 'Value'>
;
  jurisdiction: IShapeTSRef<RefSchema.IJurisdictionSchemaModelParts, 'Req', 'Set', 'Value'>;
  lookups: IShapeTSArrayNeasted<IShapeTSRef<RefSchema.ILookupSchemaModelParts, 'Req', 'Set', 'Value'>,'Req', 'Get', 'Value'>;
  messageTemplate: IShapeTSArrayNeasted<IShapeTSRef<RefSchema.IMessageTemplateSchemaModelParts, 'Req', 'Set', 'Value'>,'Req', 'Get', 'Value'>;
}
*/

// type rrrr = ExtractMRefTypes<RawSchemas.IFinancialProductSchemaModRef,{documentRequirements:{documentTypes:{}}, interestRate:{deriver:{}}}, "lookups" | "jurisdiction",'T'>;

// const rrrr : rrrr;
// rrrr.documentRequirements[0].documentTypes.
// rrrr.lookups[0].

// const test : RawSchemas.IFinancialProductSchemaParts
// test.documentRequirements[0]._id

// const uuuu : RawSchemas.IFinancialProductSchemaParts & rrrr;
// uuuu.lookups[0].accountT

// type uugu = ExtractValidate<RawSchemas.IFinancialProductModRefSchema,{documentRequirements:{documentTypes:{}}}>

//  & ExtractMRefTypes<RawSchemas.IFinancialProductModRefSchema,{documentRequirements:{documentTypes:{}}}, 'F'>
//  & ExtractMRefTypes<RawSchemas.IFinancialProductModRefSchema,{documentRequirements:{documentTypes:{}}}, 'F'>;

// test.company

// The question that I am asking myself is which 


// export declare type ILoanSchema<Paths extends ExtractValidate<RawSchemas.ILoanSchemaModRef, Paths> = {}> = RawSchemas.ILoanSchemaParts & ExtractMRefTypes<RawSchemas.ILoanSchemaModRef, Paths, never, 'T'>;

// // Seem to be working.
// const test : ExtractMRefTypes<RawSchemas.IAdminUserSchemaModRef, {userRoles:{department:{}, roles:{}}}, never, 'T'> & RawSchemas.IAdminUserSchemaParts

// //const test : ;
// test.userRoles[0].department.
// test.userRoles[0].roles.map(f => f.;
// // test.userRoles.map(f => f.roles[0].
// test.currentDepartmentAllocation.department.

// type rrr = keyof ILoanSchema['currentDepartmentAllocation']

// type uu = rrr extends 'department' ? 'T' :'F'

// type yy = Exclude<keyof ['a','b'], keyof Array<never>> extends Array<string> ? 'T' :'F'


// export type PickObjectValueValidator3<O extends Record<string, any>, Path extends Array<string>, TPath extends any = Path, Iter extends keyof Iterator = '0'
// //& Extract<keyof Iterator, string> = '0', TPath extends any = Path
// > =
// {
//   [K in keyof Path] :
//   K extends Iter ?  
//  // undefined extends Path[K] ? '1'://keyof O:
//  // unknown extends O[TPath[K]] ? 'Invalid Path' : 
//   '2'://K & Path[K] :
//   //TPath[K] & K & O[TPath[Iter]] & Iterator[Iter] & 
//   O[TPath[Iter]] & Iterator[Iter] & PickObjectValueValidator3<O[TPath[Iter]], Path>
// }


