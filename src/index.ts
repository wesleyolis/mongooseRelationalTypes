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
export type ExtractRelationshipType<T extends any, Paths extends {[index:string] : any}, Depth extends string = '0', iterate extends {[index:string] : string} = itemElements> = 
{
    [K in keyof T] :

        KeyInPathsAtDepth<K, T, Paths, Depth> extends void ? 
            T[K] extends Ref<any, any> ? T[K]['RefId'] :
            ExtractRelationshipType<T[K], Paths, iterate[Depth]> 
        : 
    (
    {        
    [Path in keyof ExtractArrayItems<Paths>] :
    
        ObjectHasKey<Paths[Path], Depth> extends 'T' ? 
            Paths[Path][Depth] extends K ? 

                T[K] extends Ref<any, any> ? 
                    ExtractRelationshipType<T[K]['RefImplem'], Paths, iterate[Depth]> :
                    ExtractRelationshipType<T[K], Paths, iterate[Depth]>
            : 
            T[K] extends Ref<any, any> ? void: ExtractRelationshipType<T[K], Paths, iterate[Depth]>            
        : void
    })[keyof ExtractArrayItems<Paths>] 
}

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


export type KeyInPathsAtDepthKey<K extends string, Paths extends {[index:string]:any}> =
{
    [Path in keyof Paths] : Path extends K ? 'T' : void        
}[keyof ExtractArrayItems<Paths>]


export type ExtractRelationshipTypeKeyRefIf<T extends any> = 
{
    [K in keyof T] : T[K] extends Ref<any, any> ? T[K]['RefId'] : ExtractRelationshipTypeKeyRefIf<T[K]>

}

// The flaw here is that I only iterate the given keys I need to iterate everything to strip ref from every where.
export type ExtractRelationshipTypeKey<T extends any, Paths extends {[index:string] : any}> = 
Paths extends '' ? ExtractRelationshipTypeKeyRefIf<T> :       
{
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
