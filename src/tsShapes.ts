
type TSPrimatives = boolean | number | string | Date;

type TSShapes = ShapeTsType<any> | ShapeTsRecord<any> | ShapeTsArrayPrimative<any> | ShapeTsArrayRecord<any>;

interface ShapeTsType<T extends TSPrimatives>
{
    __Type : T
    __Shape: 'T'
}

interface ShapeTsRecord<T extends Record<string, TSShapes>>
{
    __Record : T
    __Shape: 'R'
}

interface ShapeTsArrayPrimative<T extends TSShapes>
{
    __ArrayPrimative : {w:T}
    __Shape:'AP'
}

interface ShapeTsArrayRecord<T extends Record<string,TSShapes>>
{
    __ArrayRecord : T
    __Shape:'AR'
}

interface TypeModifiers<Required extends 'Req' | 'Op' = 'Req', ReadOnly extends 'Get' | 'Set' = 'Set'>
{
    __Required : Required;
    __ReadOnly : ReadOnly;
}


// type RecordShape = Record<string, TSShapes & TypeModifiers<'Req',any>>
// const recordShape : RecordShape = {
//     a : {} as ShapeTsType<boolean> & TypeModifiers<'Req','Set'>
// }


type RecordShape = Record<string, TSShapes & TypeModifiers<'Req',any>>
const recordShape : RecordShape = {
    a : {} as ShapeTsType<boolean> & TypeModifiers<'Op','Set'>
}

Type 'ShapeTsType<boolean> & TypeModifiers<"Op", "Set">' is not assignable to type '(ShapeTsType<any> & TypeModifiers<"Req", any>) | (ShapeTsRecord<any> & TypeModifiers<"Req", any>) | (ShapeTsArrayPrimative<any> & TypeModifiers<"Req", any>) | (ShapeTsArrayRecord<...> & TypeModifiers<...>)'.
  Type 'ShapeTsType<boolean> & TypeModifiers<"Op", "Set">' is not assignable to type 'ShapeTsArrayRecord<any> & TypeModifiers<"Req", any>'.
    Type 'ShapeTsType<boolean> & TypeModifiers<"Op", "Set">' is not assignable to type 'ShapeTsArrayRecord<any>'.
      Property '__ArrayRecord' is missing in type 'ShapeTsType<boolean> & TypeModifiers<"Op", "Set">'. [2322]

      [ts]

/*
type RecordShape = Record<string, ShapeTsType<any> & TypeModifiers<'Req',any>>
const recordShape : RecordShape = {
    a : {} as ShapeTsType<boolean> & TypeModifiers<'Op','Set'>
}
Type 'ShapeTsType<boolean> & TypeModifiers<"Op", "Set">' is not assignable to type 'ShapeTsType<any> & TypeModifiers<"Req", any>'.
  Type 'ShapeTsType<boolean> & TypeModifiers<"Op", "Set">' is not assignable to type 'TypeModifiers<"Req", any>'.
    Types of property '__Required' are incompatible.
      Type '"Op"' is not assignable to type '"Req"'. [2322]
*/

type ExtractShape<T extends ShapeTsType<any>> = T['__Type']

type ExractTsShape<T extends TSShapes> = ({
    'T' : ExtractShape<T>
    'R' : T['__Record']
    'AP' : T['__ArrayPrimative']
    'AR' : T['__ArrayRecord']
})[T['__Shape']]

type ExtractRecordTSShape<T extends Record<string, TSShapes>> = 
{
    [K in keyof T] : ExractTsShape<T[K]>
}

type NeastedShapeConstraintAny = NeastedShapeConstraint<any>

type NeastedShapeConstraint<Shape extends TSShapes> = 
 Shape


 

interface IMTypeModifiersWithNeastedConstraints<
Optional extends 'Req' | 'Op',
Readonly extends 'Get' | 'Set'
> extends IMTypeModifiers<Optional, Readonly> {
    __Optional : Optional
    __Readonly : Readonly
}

interface IMTypeModifiers <Optional, Readonly> {
    __Optional : Optional
    __Readonly : Readonly
}

type IMongooseShape<
Shape extends TSShapes,
Optional extends 'Req' | 'Op',
Readonly extends 'Get' | 'Set'
> = Shape & IMTypeModifiersWithNeastedConstraints<Optional, Readonly>
 
type IDS<T extends ShapeTsType<any>> = T


class MyClass<Shape extends IDS<any>> {

    constructor(public __ID : Shape)
    {

    }
}

function capture<Shape extends IMongooseShape<any,any,any>, ID extends Shape['__ID']['__Type']>(shape : Shape) : IMongooseShape<ShapeTsType<ID>, 'Req','Set'>
{
    return {} as any;
}

const myClass = new MyClass({a:false} as any as ShapeTsType<boolean>);

const captured = capture(myClass);

interface Builder<A extends string, B extends string>
{
    __A : A,
    __B : B
}

type AString = 'A' | 'E' | 'G';
type BString = 'B' | 'F' | 'H';

type RecordBuilder<A extends AString, B extends BString> = Record<string, Builder<A,B>>

const builderRecord = {
    a : {} as any as Builder<'A','B'>,
    e : {} as any as Builder<'E','F'>,
   // g : {} as any as Builder<'G','F'>,
}

type ExtractRecordComponent<Shape extends Record<string,any>, T extends Record<string, Shape>, Key extends string> = ({
    [K in keyof T] : T[K][Key]
})[keyof T]

function Capture<A extends 'A' |'E', B extends BString, Rec extends RecordBuilder<A, B>>(record : Rec)
 : {Ra:ExtractRecordComponent<Builder<any,any>,Rec,'__A'>, Rb:ExtractRecordComponent<Builder<any,any>,Rec,'__B'>}
{
    return {} as any;// as {Ra:A,Rb:B};
}

const result =
{
    a:Capture(builderRecord)
}

typeSection TypeSectionName<Gen1 extends 'Gen1A' | 'Gen1B', Gen2 extends 'Gen2A' | 'Gen2B'>

// whole bunch of functions and statics, which can't be customized, narrow more spesifically
// from a generic pattern to more spesifics, when capturing runtime information in shapes.

function ArrayItems<Param1 extends string, Gen1Mod extends Gen1,
Gen2Mod extends Gen2, ReturnTypeResult extends GenBuilder<ArrayItems,Gen1Mod, Gen2Mod>>(arrayItems : Record<string, infer Param1>, gen1 : infer Gen1Mod, gen2 : infer Gen2Mod) : 
ReturnTypeResult
{
    return new ArrayItems(arrayItems, gen1 : gen2);
}

typeSectionEnd

type GenBuilderNarrowMap<Gen1 extends 'Gen1A' | 'Gen1B', Gen2 extends 'Gen2A' | 'Gen2B'> = 
{
    'Gen1A' : 'Required'
    'Gen1B' : 'Optional'
}[Gen1]
|
{
    'Gen2A' : 'Nullable'
    'Gen2B' : never
}[Gen2]

type GenBuilder<
Base extends GenBuilder<any,any>,
Gen1 extends 'Gen1A' | 'Gen1B', Gen2 extends 'Gen2A' | 'Gen2B',
Keys = GenBuilderNarrowMap<Gen1, Gen2>>
= Pick<Base<Gen1Mod, Gen2Mod>, Keys>  & Remove<Base<Gen1,Gen2>, Keys>

interface GenBuilder<Gen1Mod extends Gen1, Gen2Mod extends Gen2>
{
    Required() : Arrayitems<'Gen1A', Gen2>

    Optional() : ArrayItems<'Gen2B',Gen2>

    Nullable() : ArrayItems<Gen1, 'Gen2A'>
}

class ArrayItems<Gen1 extends 'Gen1A' | 'Gen1B', Gen2 extends 'Gen2A' | 'Gen2B'> 
extends GenBuilder<Gen1,Gen2>
{
    Required() : Arrayitems<'Gen1A', Gen2>

    Optional() : ArrayItems<'Gen2B',Gen2>

    Nullable() : ArrayItems<Gen1, 'Gen2A'>

    ArraySpesific() : number;
}


interface IConstraints<Param1 extends 'Param1A' | 'Param1B',
Param2 extends 'Param2A' | 'Param2B',
Param3 extends 'Param3A' | 'Param3B'> = {
__Param1 : Param1
__Param2 : Param2
__Param3 : Param3
}
// Typically Record< IConstraints.. Is a recursive record capture pattern, with neasted records
class RecordContraints<Gen1 extends 'Gen1A' | 'Gen1B', Gen2 extends 'Gen2A' | 'Gen2B'>
// TypeSectionName means that for the next inner neasted evaluations of the record patterns,
// all those type signatures, will have become more spesification by the TypSectionName Generic Specialization.
extends Record<string, TypeSectionName<Ge1,Gen2>, (RecordContraints<Gen1, Gen2> | IConstraints<Gen1,Gen2>)
{
 // Use the constructor to capture the runtime sets of information.
}


function CaptureInferDefault<Required extends 'Req' | 'Op' = 'Req', Optional extends 'Get' | 'Set' = 'Get'>
(object : {required? : Required, optional? : Optional}) {
    return {} as {R : Required, O :Optional}
}

const req = CaptureInferDefault({required:'Req'});

type Neasted<Required extends 'Req' | 'Op' = 'Req', Optional extends 'Get' | 'Set' = 'Set'

> = {R : Required, O :Optional}


function CaptureInferDefault2<Required extends 'Req' | 'Op' = 'Req', Optional extends 'Get' | 'Set' = 'Set'>
(object : {required? : Required, optional? : Optional}) {
    return {} as Neasted<Required, Optional>
}

const req2 = CaptureInferDefault2({required:'Req'});




type Neasted3<Required extends 'Req' | 'Op' = 'Req', Optional extends 'Get' | 'Set' = 'Set',
RequiredConstraint extends 'Req' | 'Op' = Required, OptionalConstraint extends 'Get' | 'Set' = Optional

> = {R : Required, O :Optional, RC : RequiredConstraint, OC: OptionalConstraint}


function CaptureInferDefault3<
RequiredConstraint extends 'Req' | 'Op', OptionalConstraint extends 'Get' | 'Set',
Required extends 'Req' | 'Op' = 'Req', Optional extends 'Get' | 'Set' = 'Get'
>
(object : {required? : Required, optional? : Optional}) {
    return {} as Neasted3<Required, Optional,RequiredConstraint, OptionalConstraint>
}

const req3 = CaptureInferDefault3({required:'Req'});





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
// DefaultsOptional = Optional = false(Required) & Readonly = false & Default = true    //  these would typically be optional.
// ReadOnlyRequired = Optional = false(Required) & ReadOnly = true & Default = false
// ReadOnlyOptional = Optional = false(Required) & ReadOnly = true & Default = true
// Default          = Optional = true(Optional) & ReadOnly = any & Default = true
// InvalidDBHack = Optional = true(Optional) & ReadOnly = any & Default = true    // As it is always going to be there, disable this combination.
                                                                        // Will disable this at schema definition time.


// DefaultsOptional = Optional = false(required) & Readonly = false & Default = true    //  these would typically be optional.
// ReadOnlyRequired = Optional = falser(required) & ReadOnly = true & Default = false
// ReadOnlyOptional = Optional = false(required) & ReadOnly = true & Default = true
// Default          = Optional = true(optional) & ReadOnly = any & Default = false wtf is going on here I need to take a relook at this.


// Somthing that is optional and has a default, can't be optional, it is impossible.
// --------------------------------------------------
// Alias
// --------------------------------------------------
// ReadOnly = Readonly = true & Default = any => ReadOnlyRequired & Partial<ReadOnlyOptional>
// New = (Default & Partial<DefaultsOptional>)*[SchemaNew] & ReadonlyRequired & Partial<ReadOnlyOptional> & Partial<SchemaMod>
// Required, Readonly = false, default = any
// + Optional, Readonly = false, default = any
// COmplex part is the readonly fields really.
// Readonly = true, Optional, default = any, must be created at new record time, but are optional.
// Readonly = true, Required, default = false => must be created at new record time.
// Readonly = true, Required, default = true => Optional for new record.
// Readonly = true, Required

// ModUpdate = Partial<SchemaMod>   // Partial<Required, Readonly = false, default = any>
                                    // + Optional, Readonly = false, default = any
// ModResults = SchemaMod & ReadOnlyRequired & RequiredOnlyOptional
// Required/Optional, Readonly=any, default = any, everything..
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

// NewRecord    = Optional, Readonly = false, default = true/false      // Set ModOp
// +            = Required, Readonly = false, default = false
// +            = Partial<Required, Readonly = false, default = true>  // Set Partial<ModReqDefault>
// +            = Required, Readonly = false, default = false           // Set ModRequiredNoDefault
// +            = Partial<Requied, Readonly = true, default = true> // The db does the setting. //Partial<RequiredReaOnlyDefault
// +            = Required, Readonly = true, default = false // as is have to be filled in. // RequiredReadOnlyNoDefault
// +            = Optional, Readonly = true, default = true/false // It remains optional    // OpReadOnly

// Update = Partial<Required, Readonly = false, default=true/false> // Set Partial<ModReqDefault + ModRequiredNoDefault>
//          + Optional, Readonly = false, default=true/false    // Set ModOp

// Results = Required, Readonly = false, default=true/false,     // Set ModReqDefault + ModRequiredNoDefault
//          + Optional, Readonly = false, default=true/false    // Set ModOp
//          + Required, Readonly = true, default=true/false,    // Set RequiredReadOnlyDefault + RequiredReadonlyNoDefault
//          + Optional, Readonly = true, default=true/false     // Set OpReadonly

// What are the simplist set of information I need.




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


// Update = Partial<Required, Readonly = false, default=true>   //-- Partial<ModRequiredDefault>
//          + Partial<Required, Readonly = false, default=false> //-- Partial<ModRequiredNoDefault>
//          + Optional, Readonly = false, default=true    // Present for  Mod,  --ModOptionalDefault
//          + Optional, Readonly = false, default=false    // Set ModOp,        --ModOptionalNoDefault

// Results = Required, Readonly = false, default=true/false,        //-- ModRequiredDefault + ModRequiredNoDefault
//       + Required<Optional, Readonly = false, default=true>       //-- RequiredRecord<ModOptionalDefault>
//          + Optional, Readonly = false, default=false             //-- ModOptionalNoDefault
//          + Required, Readonly = true, default=true/false,        //-- RequiredReadOnlyDefault + RequiredReadonlyNoDefault
//          + Optional, Readonly = true, default=false              //-- OptionalReadonlyNoDefault
//       + Required<Optional, Readonly = true, default=true>        //-- RequiredRecord<OptionalReadonlyDefault>
