import * as Mongoose from 'mongoose'
//export default {Mongoose}
//export {Mongoose as default}

declare module 'mongoose'
{
    //extends Mongoose.Document
    export function model<T extends Mongoose.Document, S>(name: string, schema?: Schema, collection?: string, skipInit?: boolean): ModelEnhanced<T, S>
}
/*
(Mongoose.model as any) = function(name, schema, collection)
{
    return this.model(name, schema, collection)
}*/

export interface ModelEnhanced<T extends Mongoose.Document, S> extends Mongoose.Model<T>
{
    findById(id: any | string | number, callback?: (err: any, res: T | null) => void): RelationalDocumentQuery<T | null, S, T>;
}

export type RelationalDocumentQuery<T, S, DocType extends Mongoose.Document, TPopulate extends string [][] = Array<Array<never>>> = 
    DocumentQueryEnhanced<T, S, DocType, TPopulate> & Mongoose.DocumentQuery<T, DocType>

export type Paths = Array<Array<string>>

export interface DocumentQueryEnhanced<T, S, DocType extends Mongoose.Document, TPopulate extends string [][]> 
{
    // This is not going to work, with out support from typescript with improvements.
    // I will have to request a feature.
    // I will have to look at making this method now work with and object and using keysof,
    // which kind of sucks and defaults the point.
    populate<P extends Array<Array<string>>>(pathsItems : P ) : 
    //P



    //ObjectOmit<T, keyof Array<never>>
    //ExtractRefSchema<S,P>
    ExtractRelationshipType<S,P>

    //RelationalDocumentQuery<T, S, DocType, P>

    exec(callback?: (err: any, res: ExtractRelationshipType<S,TPopulate>) => void): Promise<ExtractRelationshipType<S,TPopulate>>;
    exec(operation: string | Function, callback?: (err: any, res: ExtractRelationshipType<S,TPopulate>) => void): Promise<ExtractRelationshipType<S,TPopulate>>;
}


export type ExtractRefSchema<T extends any, Paths extends any> =
{
    [K in keyof T] : T[K] extends Ref<any, any> ? K extends Paths ? 
    T[K]['RefImplem'] : T[K]['RefId'] : T[K]
}
    

export type ExtractMongooseSchema<T> = ExtractRelationshipType<T, Array<never>>

/*export type ExtractRelationshipType<T extends any, Paths extends {[index:string] : any}, Depth extends string = '0', iterate extends {[index:string] : string} = itemElements> = 
ObjectOmit<T, keyof Mongoose.Document>
//_ExtractRelationshipType<ObjectOmit<T, keyof Mongoose.Document>, Paths, Depth, iterate>
*/
/*

// There are two alternative ways to look at fixing things with partial items matcing.
// like radial sort, can't work backwards as information is only foward iteratable.
// looking at taking advantage of union of types
// the other is passing in the path item that matched, so we only check that.

export type ExtractRelationShipTypeFromArray<T extends any, Paths extends {[index:string] : any}, Depth extends string = '0'>
 = T extends Array<infer I> ? 
    ExtractRelationshipType<I, Paths, Depth>  []
    :
    ExtractRelationshipType<T, Paths, Depth>


// Need to add array iteration support.
export type ExtractRelationshipType<T extends any, Paths extends {[index:string] : any}, Depth extends string = '0', iterate extends {[index:string] : string} = itemElements> = 
{
    [K in keyof T] :

        KeyInPathsAtDepth<K, T, Paths, Depth> extends void ? 
            T[K] extends Ref<any, any> ? T[K]['RefId'] :
            ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth]> // could be an array still.
        : 
    (
    {        
    [Path in keyof ExtractArrayItems<Paths>] :
    
        ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
            Paths[Path][Depth] extends K ? 
                // Reduce paths to all those that match.

                

                T[K] extends Ref<any, any> ? 
                ExtractRelationShipTypeFromArray<T[K]['RefImplem'], Paths, iterate[Depth]> :
                ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth]>
            : 
            T[K] extends Ref<any, any> ? void: ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth]>            
        : void
    })[keyof ExtractArrayItems<Paths>] 
}

*/

export type KeyInPathsAtDepth_2<K extends string, T, Paths extends {[index:string]:any}, Depth extends string, PathKeys extends string = keyof ExtractArrayItems<Paths>> =
{
    [Path in PathKeys] :

        ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
            Paths[Path][Depth] extends K ? 
                'T'
            : void
        : void
}[PathKeys]

export type ExtractRelationShipTypeFromArray_<T extends any, Paths extends {[index:string] : any}, Depth extends string = '0', PathKeys extends string = keyof ExtractArrayItems<Paths>>
 = T extends Array<infer I> ? 
    ExtractRelationshipType<I, Paths, Depth, PathKeys>  []
    :
    ExtractRelationshipType<T, Paths, Depth, PathKeys>


export type NarrowsPathKeys<K extends string, Paths extends {[index:string] : any}, Depth extends string, Keys extends string> = ({
[Path in Keys] :
        ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
            Paths[Path][Depth] extends K ? 
                Path
            : ''
        : ''
}
&
{
    [index:string] : ''
})[Keys]

type uu =  NarrowsPathKeys<'b', [['b']], '0', '0'>



/*
{
    [K in keyof T] :
    
    ({
        [Path in PathKeys] :
            ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
                Paths[Path][Depth] extends K ? 
                    Path
                : never
            : never
    })[PathKeys]
    // If there are not more path keys, then just do simple extraction for Ref,
    // if there are path keys then we need to evaluate the next level.
         
        KeyInPathsAtDepth<K, T, Paths, Depth> extends void ? 
            T[K] extends Ref<any, any> ? 
                T[K]['RefId'] :
               //'F'
               ExtractRelationshipType<T[K], Paths, iterate[Depth], PathKeys> // could be an array still.
        : 
        
    {

        

        // Could attempt to narrow all the paths first..
        [Path in PathKeys] :
            (ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
                Paths[Path][Depth] extends K ?
                    T[K] extends Ref<any, any> ? 
                        '1'
                        //ExtractRelationShipTypeFromArray<T[K]['RefImplem'], Paths, iterate[Depth], Path> 
                        : '2'//ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth], Path>
                :
                '3'
                // void //
            : 
            '4'
            //void
        )
    }[PathKeys]
}*/

// doesn't work wrapping 'w' issues, works at top level, because I am alreayd wrapping arrrays..
// how to fix this..
export type ExtractRelationShipTypeFromArray<T extends any, Paths extends {[index:string] : any}, Depth extends string, PathKeys extends string>
 = T extends Array<infer I> ? 
    I extends Record<string, any> ? 
        ExtractRelationshipType<I, Paths, Depth, PathKeys> [] :
        ExtractRelationshipTypeItem<I, Paths, Depth, PathKeys> []        
    :
    ExtractRelationshipType<T, Paths, Depth, PathKeys>

export type ExtractRelationshipTypeItem<K extends string, T extends any, Paths extends {[index:string] : any}, Depth extends string = '0', Keys extends string = keyof ExtractArrayItems<Paths>, iterate extends {[index:string] : string} = itemElements> = 
    
    NarrowsPathKeys<K, Paths, Depth, Keys> extends '' ?         
        Depth extends '2' ? K & 'T' & T[K] :    
        T[K] extends Ref<any, any> ?
            T[K]['RefId'] 
        : ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth], ''>
        
    :
    T[K] extends Ref<any, any> ? 
        ExtractRelationShipTypeFromArray<T[K]['RefImplem'], Paths, iterate[Depth], NarrowsPathKeys<K, Paths, Depth, Keys>> 
    : ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth], NarrowsPathKeys<K, Paths, Depth, Keys>> 


// Need to add array iteration support, add  supports for arrays..
export type ExtractRelationshipType<T extends any, Paths extends {[index:string] : any}, Depth extends string = '0', Keys extends string = keyof ExtractArrayItems<Paths>, iterate extends {[index:string] : string} = itemElements> = 
{
    [K in keyof T] : ExtractRelationshipTypeItem<K, T, Paths, Depth, Keys>
/*

    NarrowsPathKeys<K, Paths, Depth, Keys> extends '' ?         
        Depth extends '2' ? K & 'T' & T[K] :    
        T[K] extends Ref<any, any> ?
            //K & 'T' & T[K]
            T[K]['RefId'] 
        : ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth], ''>
        
    :
    T[K] extends Ref<any, any> ? 
        ExtractRelationShipTypeFromArray<T[K]['RefImplem'], Paths, iterate[Depth], NarrowsPathKeys<K, Paths, Depth, Keys>> 
    : ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth], NarrowsPathKeys<K, Paths, Depth, Keys>> */
}

type SchemaArrayTest = {
    e : 'e'    
}

type SchemaArray = {
    //a : number,
  /*  b : { 
        e: Ref<'B-E', SchemaArrayTest>
    },*/
    c : {
        e: Ref<'C-E', SchemaArrayTest> []
    }
}

type rrr = ExtractRelationshipType<SchemaArray, [['b','e']
//,['c','e']
]>

const mm : rrr = {
   // a : 1,
    /*b : {
        e :
        //'B-E'
        {
            e :
            'e'
        }
    },*/
    c : {
        e:
        'C-E'
       /* {
            e :
            'e'
        }*/
    }
}

/*

Attemt another simpler method first.

export type NarrowPaths<K extends string, Paths extends {[index:string] : any}, Depth extends string = '0'> = 

({[Path in keyof ExtractArrayItems<Paths>] : 
    ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
        Paths[Path][Depth] extends K ? Paths[Path] : never
    : never
                    
})[keyof ExtractArrayItems<Paths>]



export type ExtractRelationShipTypeFromArray<T extends any, Paths extends {[index:string] : any}, Depth extends string = '0'>
 = T extends Array<infer I> ? 
    ExtractRelationshipType<I, Paths, Depth>  []
    :
    ExtractRelationshipType<T, Paths, Depth>


// Need to add array iteration support.
export type ExtractRelationshipType<T extends any, Paths extends {[index:string] : any}, Depth extends string = '0', iterate extends {[index:string] : string} = itemElements> = 
{
    [K in keyof T] :

        KeyInPathsAtDepth<K, T, Paths, Depth> extends void ? 
            T[K] extends Ref<any, any> ? T[K]['RefId'] :
            ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth]> // could be an array still.
        : 

    NarrowPaths<K, Paths, Depth>    // ['a','b'] | ['a','c'], but write the code as if we extending one of them, may need this to be void not never, since resuilts is anded. know has to be void
    T[K] extends Ref<any, any> ? 
    ExtractRelationShipTypeFromArray<T[K]['RefImplem'], Paths, iterate[Depth]> :
    ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth]>

    
    (
    {        
    [Path in keyof ExtractArrayItems<Paths>] :
    
        ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
            Paths[Path][Depth] extends K ? 
                // Reduce paths to all those that match.

                

                T[K] extends Ref<any, any> ? 
                ExtractRelationShipTypeFromArray<T[K]['RefImplem'], Paths, iterate[Depth]> :
                ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth]>
            : 
            T[K] extends Ref<any, any> ? void: ExtractRelationShipTypeFromArray<T[K], Paths, iterate[Depth]>            
        : void
    })[keyof ExtractArrayItems<Paths>] 
}
*/

export type Ref<RefId, RefImplem> = {
    RefId : RefId,
    RefImplem : RefImplem
}

export type KeyInPathsAtDepth<K extends string, T, Paths extends {[index:string]:any}, Depth extends string> =
{
        [Path in keyof ExtractArrayItems<Paths>] :
    
            ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
                Paths[Path][Depth] extends K ? 
                    'T'
                : void
            : void
}[keyof ExtractArrayItems<Paths>]

// Required to have another level of abstraction other it fails.
/*export type ObjectHasKey<S extends string, L extends string> = ({
    [K in keyof S]: 'T';
} & {
    [key: string]: 'F';
})[L];*/

export type ObjectHasKey<O, L extends string> = StringContains<keyof O, L>;
export type StringContains<S extends string, L extends string> = ({
    [K in S]: 'T';
} & {
    [key: string]: 'F';
})[L];


export type itemElements = {
    '0' : '1'
    '1' : '2'
    '2' : '3'
    '3' : '4'
    '4' : '5'
    '5' : '6'
    '6' : '7'
    '7' : '8'
    '8' : '9'
    '9' : '10'
    '10' : '11'
    '11' : '12'
    '12' : '13'
    '13' : '14'
    '14' : '15'
    '15' : '16'
    '16' : '17'
    '17' : '18'
    '18' : '19'
    '19' : '20'
}

export type ExtractArrayItems<T> = ObjectOmit<T, keyof Array<never>>

export type ObjectOmit<T, K extends string> = {
    [P in 
    
        ({
            [P in keyof T]: P;
        } & {
            [P in K]: never;
        } & {
            [key: string]: never;
        })[keyof T]
    
    ]: T[P];
};


export type KeyInPathsAtDepthKey<K extends string, Paths extends {[index:string]:any} | ''> =
{
    [Path in keyof Paths] : Path extends K ? 'T' : void        
}[keyof Paths]


export type ExtractRelationshipTypeKeyRefIf<T extends any> = 
{
    [K in keyof T] : T[K] extends Ref<any, any> ? T[K]['RefId'] : ExtractRelationshipTypeKeyRefIf<T[K]>

}

export type HasKeys<T extends any> = 
({
    [K in keyof T] : 'T'
}
&
{
    [index:string] : 'F'
}
&
{
    never : 'F'
}
)[keyof T]




// The flaw here is that I only iterate the given keys I need to iterate everything to strip ref from every where.
export type ExtractRelationshipTypeKey<T extends any, Paths extends {[index:string] : any}> = 
//T extends '' ? 'T' :'F'
// ExtractRelationshipTypeKeyRefIf<T> : 'sdf'
Paths extends '' ? ExtractRelationshipTypeKeyRefIf<T>
: {
    [K in keyof T] :        
        KeyInPathsAtDepthKey<K, Paths> extends void ?
            T[K] extends Ref<any, any> ? T[K]['RefId']             
              : ExtractRelationshipTypeKeyRefIf<T[K]>       
        :                             
    ({        
    [Path in keyof Paths] :
        Path extends K ? 
            T[K] extends Ref<any, any> ? 
                ExtractRelationshipTypeKey<T[K]['RefImplem'], Paths[K]> :
                ExtractRelationshipTypeKey<T[K], Paths[K]>                
            : void        
    }
    )[keyof Paths] 
}


const MongooseTypes = {
    String : () => void,
    Boolean : () => void
}

var schema = new Schema({
    name:    String,
    binary:  Buffer,
    living:  Boolean,
    updated: { type: Date, default: Date.now },
    age:     { type: Number, min: 18, max: 65 },
    mixed:   Schema.Types.Mixed,
    _someId: Schema.Types.ObjectId,
    decimal: Schema.Types.Decimal128,
    array: [],
    ofString: [String],
    ofNumber: [Number],
    ofDates: [Date],
    ofBuffer: [Buffer],
    ofBoolean: [Boolean],
    ofMixed: [Schema.Types.Mixed],
    ofObjectId: [Schema.Types.ObjectId],
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
  })