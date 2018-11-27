import * as chai from 'chai'
import {} from 'mocha'
import {Schema, Document} from 'mongoose'
import * as mongoose from 'mongoose'
import {Ref, ExtractRelationshipType}  from './index'

import { ObjectID, ObjectId } from 'bson';
import { model } from 'mongoose';

interface Oid extends String {

}

describe("ensuring populate and types still work", function()
{

    it("", function()
    {

        interface SchemaRight {
            id : Oid
            propA : 'RV-A',
            propB : 'RV-B',
            propC : 'RV-C'
        }

        const schemaRight = new Schema({
            id : ObjectId,
            propA : String,
            propB : String,
            propC : String
        });

        interface SchemaLeft {
            propA : boolean,
            propB : number,
            propC : string,
            propD : Ref<Oid,SchemaRight> 
        }

        const schemaLeft = new Schema({
            id : Schema.Types.ObjectId,
            propA : Boolean,
            propB : Number,
            propC : String,
            right : {type : Schema.Types.ObjectId, default : undefined}
        });

        const modelLeft = mongoose.model<SchemaLeft & Document, SchemaLeft>('col-left', schemaLeft);

        const test : ExtractRelationshipType<SchemaLeft, [["propD"]]>;
        test.propD;

       const res =  modelLeft.findById({}).populate<[["sdf"],["propD","propC"]]>([["propD","propC"]]);
       res.propD
        
       /* .exec().then(function(result){

            result!.
        });*/


    })
});