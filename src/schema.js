"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var MSchema = /** @class */ (function (_super) {
    __extends(MSchema, _super);
    function MSchema(modSchema, T, options) {
        var _this = this;
        _this.__ID = 'O';
        _this.__InputForm = 'P';
        var combinedSchema = _this = _super.call(this, definition, options) || this;
        _this.__tsType = definition;
        return _this;
    }
    return MSchema;
}(mongoose_1.Schema));
function MongooseTypes(schemaType) {
    var options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        options[_i - 1] = arguments[_i];
    }
    if (options) {
        var mType = __assign({ type: schemaType }, options);
        return mType;
    }
    else
        return schemaType;
}
/*
interface MObject
{
    // define function, but doesn't excistin so I would have to inject it in the resulting prototype to make it work.
}*/
var MTypes = {
    Boolean: function (options) { return MongooseTypes(mongoose_1.Schema.Types.Boolean, options); },
    Number: function (options) { return MongooseTypes(mongoose_1.Schema.Types.Number, options); },
    Decimal128: function (options) { return MongooseTypes(mongoose_1.Schema.Types.Number, options); },
    String: function (options) { return MongooseTypes(mongoose_1.Schema.Types.String, options); },
    //Date : () => <Options>(options? : Options) => MongooseTypes(Schema.Types.Date, options) as MString, //MoggooseType<Schema.Types.Boolean, Options, MDate>,        
    ObjectId: function (options) { return MongooseTypes(mongoose_1.Schema.Types.Boolean, options); },
    Buffer: function (options) { return MongooseTypes(mongoose_1.Schema.Types.Boolean, options); },
    Array: function (items, options) {
        return MongooseTypes(mongoose_1.Schema.Types.Array, options);
    },
    Schema: function (object, options) { return MongooseTypes(object, options); },
    Object: function (object, options) { return MongooseTypes(object, options); },
    //Object :  <T extends SchemaType, Options>(object : T, options? : Options) => MongooseTypes(object, options) as MObject<T>,
    // ensure that the two join key types are the same, we enhance that checking.
    Ref: function (RefId, RefImplem, options) { return MongooseTypes(RefId, options); }
};
// naturally nest documents....
// Map, is basically a document. and an Array
var mMumberSchema = new MSchema({ a: MTypes.Number() });
var arrayTest = MTypes.Array(MTypes.Object({
    e: MTypes.Boolean(),
    f: MTypes.Number(),
    h: MTypes.String(),
    Ref: MTypes.Ref(MTypes.String(), mMumberSchema)
}));
var mSchema = new MSchema({
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
    tArrayObject: arrayTest
});
// Empty doesn't work it is a problem.
// New bug is that when we have mutiple keys the second key stops working
// as it no longer seems to match any more, I will have to fixure this out.
var test = {
    /*  tBoolean : true,
      tNumber : 345,
      tObjectId : 'sdf',
      tString : 'sdf',
      tBuffer : 'sdf',
      tDecimal : 123,*/
    // tArrayPBoolean : [true, false],
    //tArrayPNumber : [1,2,3,4,5],
    tArrayObject: [{ e: true, f: 234, h: "sdf", Ref: 
            // 234
            //true
            //"kkk"
            //{RefId:'sdf', RefImplem : {a : 1}}
            { a: 1 }
        }]
};
//validation of array of arrays now seem to fail!!
// need to figure out why things are falling over.
// Bug seem to be fixed in version 3.1
var test2 = {
    tBoolean: true,
    tNumber: 345,
    tObjectId: 'sdf',
    tString: 'sdf',
    tBuffer: 'sdf',
    //Ref :  'sdf'
    tDecimal: 123,
    //tArrayPBoolean : [true, false],
    //tArrayPNumber : [1,2,3,4,5],
    tArrayObject: [{ e: true, f: 234, h: "sdf", Ref: "sdf" }],
    Ref: { a: 123 },
    object: {
        a: 1,
        b: 'sdf',
        c: true,
        Ref: 'sdf'
        //{a : 1}        
    },
    schema: { a: 1 }
};
// Can it ever work in older versions?
var test3 = {
    tBoolean: true,
    tNumber: 345,
    tObjectId: 'sdf',
    tString: 'sdf',
    tBuffer: 'sdf',
    tDecimal: 123,
    // tArrayPBoolean : [true, false],
    //tArrayPNumber : [1,2,3,4,5],
    tArrayObject: [{ e: true, f: 234, h: "sdf", Ref: { a: 1 }
            //"xc"
        }, { e: true, f: 234, h: "ssdf", Ref: { a: 1 }
            //""
        }],
    //Ref :  'sdf'
    Ref: { a: 123 },
    object: {
        a: 1,
        b: 'sdf',
        c: true,
        Ref: 
        //'sdf'
        { a: 1 }
    },
    schema: { a: 1 }
};
var schema = new mongoose_1.Schema({
    name: String,
    binary: Buffer,
    living: Boolean,
    updated: { type: Date, "default": Date.now },
    age: { type: Number, min: 18, max: 65 },
    mixed: mongoose_1.Schema.Types.Mixed,
    _someId: mongoose_1.Schema.Types.ObjectId,
    decimal: mongoose_1.Schema.Types.Decimal128,
    array: [],
    ofString: [String],
    ofNumber: [Number],
    ofDates: [Date],
    ofBuffer: [Buffer],
    ofBoolean: [Boolean],
    ofMixed: [mongoose_1.Schema.Types.Mixed],
    ofObjectId: [mongoose_1.Schema.Types.ObjectId],
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
});
