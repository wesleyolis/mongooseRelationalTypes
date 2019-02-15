# mongooseRelationalTypes
Wrapper enhancements for mongoose, that allow for populate and deep populate method to automatically replace the oid/id with the right hand side of the relationship

## Wrapper around mongoose to provide type support for relationship in documents, when using populate and deeppopulate functionality.

```.ts

export interface LeftSchema {
    a : number,
    Item0: {
        Item1: {
            Item2:Ref<string,number>
        },
        Item11: {     Item12:Ref<'12-A','12-B'>}
        ItemA : { ItemB : Ref<'AB-A', RightSchema>}
        b : boolean,
        c : string,
        d : number
    }
}

export interface RightSchema {
    a : number,
    B : Ref<'12B-A','12B-B'>
}

```

### Using the following command, the following projections will be produced before.

```.ts
model.findById({}).populate([['ItemA',ItemAB'],['ItemD','ItemDE'],['ItemA','ItemAC']]).exec().then(function(results) {
const value =  results.ItemA.ItemAB;
const value2 = results.ItemD.ItemDE;
const value3 = results.ItemA.ItemAC;
});
```
As of current waiting on support for type inferance of string literals for and array<array<string> for functions, otherwise one must spesify
this as generic input and then also as runtime value.
https://github.com/Microsoft/TypeScript/issues/26841

Currently working on another method, in which the current system supports type inferance, just a couple corner cases still to sort out.
In which cases these be achivable, with out repeating or stuttering on the parameter need be supplied, the wrapper will do the rest for ou.

### Projections Produced

```.ts

// Good only right hand keys, no fails positives.
let caseItem0JoinedNoFalsePositivesB : ExtractRelationshipType<LeftSchema, [['Item0'],['Item0','f'],['Item0','Item11'],['Item0','Item11','d']]> = {
    a : 1,
    Item0 : {
        Item1 : {Item2 : '234'},
         Item11 : {Item12 : '12-A'},
         ItemA : {    ItemB : 
            'AB-A'
        },
        b : true, 
        c : "string",
        d : 234
    }
}

//Fails item0Item11.Item12 fails, should be left hand key
let caseItem0Item11Item12JoinedNoFalsePositivesB : ExtractRelationshipType<LeftSchema, [['Item0'],['Item0','f'],['Item0','Item11'],['Item0','Item11','d']]> = {
    a : 1,
    Item0 : {
        Item1 : {Item2 : '234'},
         Item11 : {Item12 : '12-B'},
         ItemA : {    ItemB : 
            'AB-A'
        },
        b : true, 
        c : "string",
        d : 234
    }
}

// Good no fail positives.
let caseItem0Item11Item12 : ExtractRelationshipType<LeftSchema, [['Item0'],['Item0','f'],['Item0','Item11'],['Item0','Item11','Item12']]> = {
    a : 1,
    Item0 : {
        Item1 : {Item2 : '234'},
         Item11 : {Item12 : '12-B'},
         ItemA : {    ItemB : 
            'AB-A'
        },
        b : true, 
        c : "string",
        d : 234
    }
}
```

## How to use mongoose.ts
```.ts
// Define the schema parts, so that schema, can generate all mixs of these schemas.
export type ISchemaModelParts = IMModelParts<String,
ISchemaModRDSchema, ISchemaModRNDSchema, ISchemaModODSchema, ISchemaModONDSchema, ISchemaReadRDSchema, ISchemaReadRNDSchema, ISchemaReadODSchema, ISchemaReadONDSchema, undefined, {}, ISchemaModRef>;

export type ISchemaModRDSchema = {
  requiredModifiableFieldWithDefaultValue : number;
}

export type ISchemaModRNDSchema = {
  requiredModifiableFieldsWithNoDefault: number;
  requiredModifiableNeastedFieldWithNoDefault: {
    a: number,
    b: string,
    c: boolean
  }
}

export type ISchemaModODSchema = {
  optionalModifiableFieldWithDefault:number;
}

export type ISchemaModONDSchema = {
  optionalModifiableNoDefault : number;
}

export type ISchemaReadRDSchema = {
  readonly readOnlyRequiredModifiableFieldWithDefaultValue : number;
}

export type ISchemaReadRNDSchema = {
  readonly readOnlyRequiredModifiableFieldsWithNoDefault: number;
  readonly readOnlyRequiredModifiableNeastedFieldWithNoDefault: {
    readonly a: number,
    readonly b: string,
    readonly c: boolean
  }
}

export type ISchemaReadODSchema = {
  readonly readOnlyOptionalModifiableNoDefault : number;

}

export type ISchemaReadONDSchema = {
  readonly readOnlyRequiredModifiableFieldWithDefaultValue : number;
}

// This is the relational part of the schema, which allows the deepPopulate and populate methods
// schema to automatically be generated.
// There are a set of wrappers defined, because they are faster and simpler and more backward compatible if need be to
// ts 2.4 days, but have moved to extends keywords.. these wrappers we feel are also faster.

// You can find a list of wrappers the mongoose definitions, for wrapping varius archetectural layout of information.
// IShapeTSRef<Right Hand side Interface implementation of IMModelParts, Required, Set/Get, DefaultValue>
// IShapeTSRecord<neasted record, Required, Set/Get, DefaultValue>// used to wrapp neasted records, so that we can walk them to search for more Referances.
// Arrays are more complex, because one can't merge arrays with intersecting interfaces, which means all arrays that container  neasted referances
// will have to be define in ModRef interface.
// IShapeTSArrayNeasted
// IShapeTSArrayRecordExtends
// IShapeTSArrayRecordContainingRef

export type ISchemaModRef = {
  simpleRef: IShapeTSRef<IMModelParts<...>, 'Req', 'Set', 'Value'>;
  arrayPrimative:IShapeTSArrayNeasted<number, 'Req', 'Set', 'Value'>;
  arrayRecord: IShapeTSArrayRecordContainingRef<IMModelParts<...>, 'Req', 'Set', 'Value'>;
  arrayneastedRef: IShapeTSArrayNeasted<IShapeTSRef<IMModelParts<...>, 'Req', 'Set', 'Value'>,'Req', 'Get', 'Value'>;
  neastedliteralObject: IShapeTSRecord<{
    neastedRef: IShapeTSRef<IMModelParts<....>, 'Req', 'Set', 'Value'>;
  }, 'Req', 'Set', 'Value'>;
}

const schema = model<ISchemaModelParts>('SchemaName');
schema.findById('...').populate('simpleRef').populate('rootFieldRef').populate<{234234:234234:{}}>('234234.234234').exec(function(err,results)...).then...
schema.findById('...').deepPopuldate<{neastedliteralObject:neastedRef{}}>('neasteLiteralObject.neastedRef').exec(function(err,result)..).then()
// Note deepPopulate and populate for certain version will not work togather.
// We types we allow them to work to gather so can use populate or 

```
