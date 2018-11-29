
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