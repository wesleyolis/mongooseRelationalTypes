"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mongoose = require("mongoose");
exports.default = { Mongoose: Mongoose };
Mongoose.model = function (name, schema, collection) {
    return this.model(name, schema, collection);
};
/*
declare module 'mongoose' {

   export function model<T extends Document, S extends Schema>(name: string, schema?: S, collection?: string, skipInit?: boolean): string//Model<T, S>
}
*/
/*


mongooseBase.model as any = function model<T extends Document>(name: string, schema?: Schema, collection?: string,
    skipInit?: boolean): Model<T>
    {

    }

export

interface mongooseEnhanced {


}


export default interface mongooseRelational extends
{}

{
    model<T extends mongooseBase.Document, S extends mongooseBase.Schema>(name: string, schema?: S, collection?: string, skipInit?: boolean): Models<T, S>
} & mongooseBase
*

export var Model : Models<any,any>
/*;
function model<T extends mongooseBase.Document, S extends mongooseBase.Schema>(name: string, schema?: S, collection?: string, skipInit?: boolean): Models<T, S>
{
    return this.model(name, schema, collection) as Models<T,S>
}*/
/*
interface Models<T extends mongooseBase.Document, S extends mongooseBase.Schema> extends MongooseModel<T>
{
    new(doc?: any): T;

    //findById(id: any | string | number, callback?: (err: any, res: T | null) => void): RelationalDocumentQuery<T | null, T>;
}

type RelationalDocumentQuery<T, DocType extends mongooseBase.Document, TPopulate extends string [][] = []> =
    DocumentQueryEnhanced<T, DocType, TPopulate> & MongooseDocumentQuery<T, DocType>

interface DocumentQueryEnhanced<T, DocType extends mongooseBase.Document, TPopulate extends string [][] = []>
{
    populate<P extends string [][]>(pathsItems : P) : DocumentQueryEnhanced<T, DocType, P>
}

const schema = new Schema({
    a : String
})

//const model = new Model('collection', schema)
*/ 
