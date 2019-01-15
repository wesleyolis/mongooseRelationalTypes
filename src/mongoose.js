"use strict";
exports.__esModule = true;
// import { Aggregate } from 'mongoose';
var UpdateStatment = require("./mongooseUpdateStatment");
exports.UpdateStatment = UpdateStatment;
var Shape = /** @class */ (function () {
    function Shape(id, neasted) {
        if (neasted === void 0) { neasted = undefined; }
        this.id = id;
        this.neasted = neasted;
    }
    Shape.prototype.TSTypeCastUp = function () {
        return this;
    };
    return Shape;
}());
exports.Shape = Shape;
function ShapeTSType() {
    return new Shape('T').TSTypeCastUp();
}
exports.ShapeTSType = ShapeTSType;
function ShapeTSRecord(rec) {
    return new Shape('R', rec).TSTypeCastUp();
}
exports.ShapeTSRecord = ShapeTSRecord;
function ShapeTSArray(record) {
    return new Shape('AN', record).TSTypeCastUp();
}
exports.ShapeTSArray = ShapeTSArray;
function ShapeTSArrayRecord(record) {
    return new Shape('AR', record).TSTypeCastUp();
}
exports.ShapeTSArrayRecord = ShapeTSArrayRecord;
function ShapeTSArrayRecordContainingRef(record) {
    return new Shape('ARF', record).TSTypeCastUp();
}
exports.ShapeTSArrayRecordContainingRef = ShapeTSArrayRecordContainingRef;
// interface IShapeTSRef<T extends ISchema<any, any, any, any, any, any, any, any, any, any, any, any, any>> extends ITSShape<T,'Ref'>
// {
//     __tsType : T;
// }
// Going to have to put in some work here.. as number capture, doesn't reveal
// the runtime type, which is what previously happened.
// The right hand side of the schema wil be captured on the right.
// lets just get this all working.
function ShapeTSRef() {
    return new Shape('Ref').TSTypeCastUp();
}
exports.ShapeTSRef = ShapeTSRef;
function ShapeTSSchema() {
    return new Shape('S').TSTypeCastUp();
}
exports.ShapeTSSchema = ShapeTSSchema;
// The schemaOptions need to be defined as typesript information and not as runtime informaiton.
// This means that I am going to need a helper function, which takes in the runtime information
// and then takes on some typescript constraints __tsTheOption anme.
function NewAdapterConfiguration(config) {
    return config;
}
exports.NewAdapterConfiguration = NewAdapterConfiguration;
var SchemaGenerator = /** @class */ (function () {
    function SchemaGenerator(adaptors) {
        this.adaptors = adaptors;
    }
    SchemaGenerator.prototype.Generate = function (adapterName) {
        return 'Not Implemented Yet';
    };
    // All the typescript type definitions, which must be define on this class, so that 
    // all the correct typing signatures will exist on the functions.
    SchemaGenerator.prototype.NewSchema = function (name, id, modRD, modRND, modOD, modOND, readRD, readRND, readOD, readOND, modRef, neastedSchemas, options) {
        return new Schema(name, id, modRD, modRND, modOD, modOND, readRD, readRND, readOD, readOND, modRef, neastedSchemas, options);
    };
    SchemaGenerator.prototype.NewPartialSchema = function () {
        return {};
    };
    // Binding of the TSIterationPattern with, the more complex type variants.
    SchemaGenerator.prototype.ObjectIdString = function () {
        return NewModifiers(ShapeTSType(), 'ObjectIdString', {});
    };
    SchemaGenerator.prototype.Boolean = function () {
        return NewModifiers(ShapeTSType(), 'Boolean', {});
    };
    SchemaGenerator.prototype.Number = function () {
        return NewModifiers(ShapeTSType(), 'Number', {});
    };
    SchemaGenerator.prototype.String = function () {
        return NewModifiers(ShapeTSType(), 'String', {});
    };
    SchemaGenerator.prototype.Date = function () {
        return NewModifiers(ShapeTSType(), 'Date', {});
    };
    SchemaGenerator.prototype.Record = function (rec) {
        return NewModifiersWithConstraints(ShapeTSRecord(rec), 'Record', {}, {}, {}, {}, {}, {}, {});
    };
    // Because types can't differentiate which method to call, there is no
    // way to capture the runtime differances, but with runTime methods with different names.
    SchemaGenerator.prototype.Array = function (items) {
        return NewModifiers(ShapeTSArray(items), 'ArrayNeasted', {});
    };
    SchemaGenerator.prototype.ArrayRecord = function (items) {
        return NewModifiersWithConstraints(ShapeTSArrayRecord(items), 'ArrayRecord', {}, {}, {}, {}, {}, {}, {});
    };
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
    SchemaGenerator.prototype.RefType = function (record) {
        return NewModifiersWithConstraintsAndRefType(ShapeTSRef(), 'RefType', {}, undefined, // Doesn't make logical sense.
        {}, {}, undefined, {}, {}, {});
    };
    // At runtime, this could have been merge with the existing iteration stucture
    // It is only broken appart here for the typings.
    SchemaGenerator.prototype.Schema = function (object) {
        return NewModifiersWithConstraints(ShapeTSSchema(), 'Schema', {}, undefined, {}, {}, undefined, {}, {});
    };
    return SchemaGenerator;
}());
exports.SchemaGenerator = SchemaGenerator;
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
function NewModifiers(shape, type, __options) {
    return new Modifiers(shape, type, 'Op', 'Set', 'Value', undefined, undefined, undefined);
}
exports.NewModifiers = NewModifiers;
function NewModifiersWithConstraints(shape, type, __options, __ShapeIDConstraints, __RequiredConstraints, __ReadonlyConstraints, __NullableConstraints, __DefaultConstraints, __RefTypeConstraints) {
    return new Modifiers(shape, type, 'Op', 'Set', 'Value', undefined, undefined);
}
function NewModifiersWithConstraintsAndRefType(shape, type, __options, __ShapeIDConstraints, __RequiredConstraints, __ReadonlyConstraints, __NullableConstraints, __DefaultConstraints, __RefTypeConstraints, __RefType) {
    return new Modifiers(shape, type, 'Op', 'Set', 'Value', undefined, __RefType ? __RefType['__Name'] : undefined);
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
var Modifiers = /** @class */ (function () {
    function Modifiers(shape, type, required, readonly, nullable, init, refType, options, id, neasted) {
        if (options === void 0) { options = undefined; }
        if (id === void 0) { id = shape.id; }
        if (neasted === void 0) { neasted = shape.neasted; }
        this.type = type;
        this.required = required;
        this.readonly = readonly;
        this.nullable = nullable;
        this.init = init;
        this.refType = refType;
        this.options = options;
        this.id = id;
        this.neasted = neasted;
    }
    // Problem here is that I am missing the funtion signatures..
    Modifiers.prototype.Anotations = function (options) {
        this.options = options;
        return this;
    };
    Modifiers.prototype.Options = function (options) {
        this.options = options;
        return this;
    };
    Modifiers.prototype.Required = function () {
        this.required = 'Req';
        return this;
    };
    Modifiers.prototype.Optional = function () {
        this.required = 'Op';
        return this;
    };
    Modifiers.prototype.Nullable = function () {
        this.nullable = 'Nullable';
        return this;
    };
    Modifiers.prototype.Readonly = function () {
        this.readonly = 'Get';
        return this;
    };
    Modifiers.prototype.Default = function (dValue) {
        this.init = dValue;
        return this;
    };
    return Modifiers;
}());
exports.Modifiers = Modifiers;
var Schema = /** @class */ (function () {
    function Schema(__Name, __Id, __ModRD, __ModRND, __ModOD, __ModOND, __ReadRD, __ReadRND, __ReadOD, __ReadOND, __ModRef, __NeastedSchemas, __SchemaOptions) {
        this.__Name = __Name;
        this.__Id = __Id;
        this.__ModRD = __ModRD;
        this.__ModRND = __ModRND;
        this.__ModOD = __ModOD;
        this.__ModOND = __ModOND;
        this.__ReadRD = __ReadRD;
        this.__ReadRND = __ReadRND;
        this.__ReadOD = __ReadOD;
        this.__ReadOND = __ReadOND;
        this.__ModRef = __ModRef;
        this.__NeastedSchemas = __NeastedSchemas;
        this.__SchemaOptions = __SchemaOptions;
    }
    return Schema;
}());
exports.Schema = Schema;
var SchemaPartial = /** @class */ (function () {
    function SchemaPartial(PartialName, baseSchema, __ModRD, __ModRND, __ModOD, __ModOND, __ReadRD, __ReadRND, __ReadOD, __ReadOND, __ModRef, __NeastedSchemas, __SchemaOptions, __Id, __Name) {
        if (__SchemaOptions === void 0) { __SchemaOptions = baseSchema['__SchemaOptions']; }
        if (__Id === void 0) { __Id = baseSchema['__Id']; }
        this.PartialName = PartialName;
        this.baseSchema = baseSchema;
        this.__ModRD = __ModRD;
        this.__ModRND = __ModRND;
        this.__ModOD = __ModOD;
        this.__ModOND = __ModOND;
        this.__ReadRD = __ReadRD;
        this.__ReadRND = __ReadRND;
        this.__ReadOD = __ReadOD;
        this.__ReadOND = __ReadOND;
        this.__ModRef = __ModRef;
        this.__NeastedSchemas = __NeastedSchemas;
        this.__SchemaOptions = __SchemaOptions;
        this.__Id = __Id;
        this.__Name = __Name;
    }
    return SchemaPartial;
}());
exports.SchemaPartial = SchemaPartial;
