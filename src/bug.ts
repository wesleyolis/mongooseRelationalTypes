

type TsTypesPrimatives = boolean | number | string | Date; 

type ID = 'T' | 'R' | 'AR' | 'AN' | 'Ref' | 'S'

type ITSShapes = 
IShapeTSType<any> 
| IShapeContainers
| IShapeTSRef<any>
| IShapeTSSchema<any>

type IShapeContainers = IShapeTSRecord<any> | IShapeTSArrayNeasted<any> | IShapeTSArrayRecord<any>


interface IShape<TID extends ID>{
    id: TID;
    neasted : Neasted
}

interface ITSShape<T, TID extends ID> extends IShape<ID>
{
    __tsType: T;
    __ID: TID;
}

class Shape<TShape extends ITSShape<any, any>> implements IShape<TShape['__ID']>
{
    constructor(public id: TShape['__ID'], public neasted : TShape['neasted'] | undefined = undefined)
    {
    }

    TSTypeCastUp() {
        return this as any as TShape
    }
}

type IShapeTSTypeExtends = boolean | number | null;

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
    __ID: 'R';
}

function ShapeTSRecord<T extends IShapeRecordExtends>(rec : T)
{
    return new Shape<IShapeTSRecord<T>>('R', rec).TSTypeCastUp();
}

type IShapeArrayNeastedExtends = ITSShapes | null;

interface IShapeTSArrayNeasted<T extends IShapeArrayNeastedExtends> extends ITSShape<T, 'AN'>
{
    __tsType : {w:T};
    __ID: 'AN';
}

function ShapeTSArray<T extends IShapeArrayNeastedExtends>(record : T)
{
    return new Shape<IShapeTSArrayNeasted<T>>('AN').TSTypeCastUp();
}

type IShapeTSArrayRecordExtends = Record<string, ITSShapes> | null;

interface IShapeTSArrayRecord<T extends IShapeTSArrayRecordExtends> extends ITSShape<T, 'AR'>
{
    __tsType : T;
    __ID: 'AR';
}

function ShapeTSArrayRecord<T extends IShapeTSArrayRecordExtends>()
{
    return new Shape<IShapeTSArrayRecord<T>>('AR').TSTypeCastUp();
}

interface IShapeTSRef<T extends TsTypesPrimatives> extends ITSShape<T,'Ref'>
{
    __tsType : T;
    __ID: 'Ref';
}

function ShapeTSRef<T extends TsTypesPrimatives>()
{
    return new Shape<IShapeTSRef<T>>('Ref').TSTypeCastUp();
}

interface IShapeTSSchema<T extends ISchemas<any, any, any, any, any, any, any, any, any, any, any>>
extends ITSShape<T, 'S'> 
{
    __tsType : T;
    __ID: 'S';
}

function ShapeTSSchema<T extends ISchemas<any, any, any, any, any, any, any, any, any, any, any>>()
{
    return new Shape<IShapeTSSchema<T>>('S').TSTypeCastUp();
}

type TsTypesPrimatives = boolean | number | string | Date; 

type TypesPrimative = 'Boolean' | 'Number' | 'String' | 'Date' | undefined

type _Required = 'Req' | 'Op'
type _Readonly = 'Get' | 'Set'
type _Nullable = 'Nullable' | 'Value'
type _Default = TsTypesPrimatives | Array<never> | Array<Record<string,TsTypesPrimatives>> | Record<string, TsTypesPrimatives> | null | undefined
type _RefType = any//ISchema<any, any, any, any, any, any, any, any, any, any, any, any> | undefined 
type _OptionsAnontations = Record<string, any>

type Neasted = IShapeContainers | undefined;

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
    TOptionsAnotations extends _OptionsAnontations,
    TShape extends ITSShape<any, any>,
    TRequired extends _Required,
    TReadonly extends _Readonly,
    TNullable extends _Nullable,
    TDefault extends _Default,
    TRefType extends _RefType
> extends IModifiers<TOptionsAnotations> {
    __ID: TShape['__ID'];
    __tsType: TShape['__tsType'];
    __Type: TypesPrimative;
    __Required: TRequired;
    __Readonly: TReadonly;
    __Nullable: TNullable;
    __Default: TDefault;
    __RefType: TRefType;
}

interface ITSModifiersWithConstraints<
    TOptionsAnotations extends _OptionsAnontations,
    TShape extends ITSShape<any,any>,
    TRequired extends _Required,
    TReadonly extends _Readonly,
    TNullable extends _Nullable,
    TDefault extends _Default,
    TRefType extends _RefType = undefined,
    RequiredConstraint extends _Required | undefined = TRequired, 
    ReadonlyConstraint extends _Readonly | undefined = TReadonly,
    NullableConstraint extends _Nullable | undefined = TNullable,
    DefaultConstraint extends _Default = TDefault,
    RefTypeConstraint extends _RefType = TRefType,
> extends ITSModifiers<TOptionsAnotations, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>{
    __RequiredConstraint : RequiredConstraint
    __ReadonlyConstraint : ReadonlyConstraint
    __NullableConstraint : NullableConstraint
    __DefaultConstraint : DefaultConstraint
    __RefTypeConstraint : RefTypeConstraint
}

function New<TAvaliableOptions extends _OptionsAnontations,
    TShape extends ITSShape<any, any>,
    TRequired extends _Required,
    TReadonly extends _Readonly,
    TNullable extends _Nullable,
    TDefault extends _Default,
    TRefType extends _RefType
    >(shape : TShape, type : TypesPrimative, required : TRequired, readonly : TReadonly, nullable : TNullable, init : TDefault, refType : TRefType ) : TRequired//IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>
    {
        return new Modifiers<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>
        (shape, type, required, readonly, nullable, init, refType, undefined) as any;// as IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>;
    }

const shape = ShapeTSType<number>();


const testing = New(shape, 'Number', 'Req', 'Set', 'Nullable', undefined, undefined)

type uusu = (typeof testing)['__Required']


testing.Nullable().Required();

type uuu = (typeof testing)['__Required']


function Mutate<TAvaliableOptions extends Record<string, any>,
    TShape extends ITSShape<any, any>,
    TRequired extends _Required,
    TReadonly extends _Readonly,
    TNullable extends _Nullable,
    TDefault extends _Default,
    TRefType extends _RefType
    >(mod : Modifiers<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>) : 
    ITSModifiersWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>
    {
        return mod as any;
    }


interface IModifiersFunctions<
TAvaliableOptions extends _OptionsAnontations,
TShape extends ITSShape<any, any>,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType>
{
    Anotations(options : TAvaliableOptions): IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>
    Options(options : TAvaliableOptions): IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>
    Required(): IModifiersFunWithConstraints<TAvaliableOptions, TShape, 'Req', TReadonly, TNullable, TDefault, TRefType>
    Optional(): IModifiersFunWithConstraints<TAvaliableOptions, TShape, 'Op', TReadonly, TNullable, TDefault, TRefType>
    Nullable() : IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, 'Nullable', TDefault, TRefType>
    Readonly() : IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, 'Get', TNullable, TDefault, TRefType>
    Default<DValue extends TDefault | (TNullable extends 'Nullable' ? null : never)>(dValue : DValue) : ITSModifiersWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, DValue, TRefType>
}

interface IModifiersFunWithConstraints<
TAvaliableOptions extends _OptionsAnontations,
TShape extends ITSShape<any, any>,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType>
extends ITSModifiersWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>, 
IModifiersFunctions<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType> {

}

class Modifiers<
TAvaliableOptions extends _OptionsAnontations,
TShape extends ITSShape<any, any>,
TRequired extends _Required,
TReadonly extends _Readonly,
TNullable extends _Nullable,
TDefault extends _Default,
TRefType extends _RefType>
implements IModifiers<TAvaliableOptions>, 
//IShape<TShape['__ID'], TShape['__Neasted']>,
IModifiersFunctions<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>
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
    public Anotations(options :TAvaliableOptions) : IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>
    {
        this.options = options;
        return this as any;
    }

    public Options(options : TAvaliableOptions) : IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, TDefault, TRefType>
    {
        this.options = options;
        return this as any;
    }

    public Required() : IModifiersFunWithConstraints<TAvaliableOptions, TShape, 'Req', TReadonly, TNullable, TDefault, TRefType>
    {
        this.required = 'Req';
        return this as any;
    }

    public Optional() : IModifiersFunWithConstraints<TAvaliableOptions, TShape, 'Op', TReadonly, TNullable, TDefault, TRefType>
    {        
        this.required = 'Op';
        return this as any;
    }

    public Nullable() : IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, 'Nullable', TDefault, TRefType>
    {
        this.nullable = 'Nullable';
        return this as any;
    }

    public Readonly() : IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, 'Get', TNullable, TDefault, TRefType>
    {
        this.readonly = 'Get';
        return this as any;
    }

    public Default<DValue extends TDefault | (TNullable extends 'Nullable' ? null : never)>(dValue : DValue) : 
    IModifiersFunWithConstraints<TAvaliableOptions, TShape, TRequired, TReadonly, TNullable, DValue, TRefType>
    {
        this.init = dValue;
        return this as any;
    }
}

type BaseGenConstraints = Record<string, Record<string,any>>;

interface Base<T extends BaseGenConstraints>
{
    fieldA : T
}

class Mod<T extends BaseGenConstraints> implements Base<BaseGenConstraints>
{

    constructor(public fieldA : BaseGenConstraints)
    {

    }
}

