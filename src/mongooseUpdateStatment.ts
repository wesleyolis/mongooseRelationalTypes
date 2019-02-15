export interface NextIter
{
  '0': '1',
  '1': '2',
  '2': '3',
  '3': '4',
  '4': '5'
  '5': '6',
  '6': '7',
  '7': '8',
  '8': '9',
  '9': '10',
  '10': '11',
  '11': '12',
  '12': '13',
  '13': '14',
  '14': '15',
  '15': '16',
  '16': '17',
  '17': '18',
  '18': '19',
  '19': '20'
}

export type KeyofT<T extends Record<any,any> | undefined> = T extends (undefined | infer A) ? keyof A : keyof T;

export type KeyofArrayT<T extends Record<any,any> | undefined> = T extends (undefined | infer A) ? 
A extends '' ? keyof A : PickArrayKeys<A>
: keyof T

export type PickArrayKeys<T extends Record<any, any>> = {[K in keyof T]: T[K] extends Array<infer I> ? K : K}[keyof T]


export type ValidatePathItem<T extends Record<any, any>, Path extends any, Depth, Iter extends keyof Path = '0', Depths extends Record<any, any> = NextIter> = {
  [K in Iter]: 
     Path[K] extends KeyofT<T> ? 
      K extends Depth ? 
         string ://& Path[K] : Would cause circular referance.
      ValidatePathItem<T[Path[K]], Path, Depth, Depths[K]> 
      : K extends Depth ? 
      Extract<KeyofT<T>, String> : never
}[Iter]

export type ValidatePath<T extends Record<any, any>, Path extends Array<string>> = {
   [K in keyof Path] : ValidatePathItem<T, Path, K>
};

export type KeyOfType<T extends any, KeysOfT extends Extract<keyof T, String> = Extract<keyof T, String>> = T extends Record<any,any> | undefined ?
KeysOfT extends keyof Date ? never :
//'Dnever' : 
KeysOfT : 
//'Rnever'
never

export type ValidateArrayPathItem<T extends Record<any, any>, Path extends any, Depth, Iter extends keyof Path = '0', Depths extends Record<any,any> = NextIter> = {
  [K in Iter]: 
    Path[K] extends KeyofT<T> ? 
      K extends Depth ? 
        string ://Path[K] | 'll':
          T[Path[K]] extends Array<infer A> ? 
          Depths[K] extends Depth ? '$' :
          ValidateArrayPathItem<A, Path, Depth, Depths[Depths[K]]>
          :
          ValidateArrayPathItem<T[Path[K]], Path, Depth, Depths[K]> // | 'pp'
    : K extends Depth ? KeyOfType<T>
    : never//Path[K] & K | 'never'
}[Iter]

export type ValidateArrayPath<T extends Record<any, any>, Path extends Array<string>, Paths extends Path = Path> = {
  [K in keyof Paths] : ValidateArrayPathItem<T, Path, K>
};

export type ExtractPathObjects<T extends Record<any, any>, Path extends any, Iter extends keyof Path = '0', Depths extends Record<any, any> = NextIter> = {
  [K in Iter] : undefined extends Path[K] ? T :
    Path[K] extends KeyofT<T> ? 
      ExtractPathObjects<T[Path[Iter]], Path, Depths[Iter]> :
      never
}[Iter]

export type ExtractPathArrays<T extends Record<any, any>, Path extends any, Iter extends keyof Path = '0', Depths extends Record<any, any> = NextIter> = {
  [K in Iter] : undefined extends Path[K] ? T :
    Path[K] extends KeyofT<T> ? 
      T[Path[Iter]] extends Array<infer A> | undefined ?
        ExtractPathArrays<A, Path, Depths[Iter]> :
        ExtractPathArrays<T[Path[Iter]], Path, Depths[Iter]> :
      never
}[Iter]


export type ExtractPathArraysWithDollar<T extends Record<any, any>, Path extends any, Iter extends keyof Path = '0', Depths extends Record<any, any> = NextIter> = {
  [K in Iter] : undefined extends Path[K] ? T :
      T[Path[Iter]] extends Array<infer A> | undefined ?
        Path[Depths[K]] extends '$' ? 
          ExtractPathArraysWithDollar<A, Path, Depths[Depths[Iter]]> :
          never
        : Path[K] extends KeyofT<T> ? 
        ExtractPathArraysWithDollar<T[Path[Iter]], Path, Depths[Iter]> :
      never
}[Iter]


export type ValidateArrayIdentifierPathItem<T extends Record<any, any>, Path extends any, Depth, Iter extends keyof Path = '0', Depths extends Record<any,any> = NextIter> = {
  [K in Iter]: 
    Path[K] extends KeyofT<T> ? 
      K extends Depth ? 
        string ://Path[K] | 'll':
          T[Path[K]] extends Array<infer A> ? 
          Depths[K] extends Depth ? '$[' :
          Depths[Depths[K]] extends Depth ? string :
          Depths[Depths[Depths[K]]] extends Depth ? ']' :
          ValidateArrayIdentifierPathItem<A, Path, Depth, Depths[Depths[Depths[Depths[K]]]]>
          :
          ValidateArrayIdentifierPathItem<T[Path[K]], Path, Depth, Depths[K]> // | 'pp'
    : K extends Depth ? KeyOfType<T>
    : never//Path[K] & K | 'never'
}[Iter]

export type ValidateArrayIdentifierPath<T extends Record<any, any>, Path extends Array<string>, Paths extends Path = Path> = {
  [K in keyof Paths] : ValidateArrayIdentifierPathItem<T, Path, K>
};

// Clearly it would be very easy to create a hybride path function for validation and extraction..
// which means things become even more simple.

export type ExtractPathArraysIdentifiers<T extends Record<any, any>, Path extends any, Iter extends keyof Path = '0', Depths extends Record<any, any> = NextIter> = {
  [K in Iter] : undefined extends Path[K] ? T :
      T[Path[Iter]] extends Array<infer A> | undefined ?
        Path[Depths[K]] extends '$[' ? 
        Path[Depths[Depths[K]]] extends string ?
        Path[Depths[Depths[Depths[K]]]] extends ']' ?
        ExtractPathArraysIdentifiers<A, Path, Depths[Depths[Depths[Depths[Iter]]]]>:
          never : never : never
        : Path[K] extends KeyofT<T> ? 
        ExtractPathArraysIdentifiers<T[Path[Iter]], Path, Depths[Iter]> :
      never
}[Iter]



export type ExtractKeysWithPrefixAndSuffix<Path extends any, Prefix extends string = '$[', Suffix extends string =']', Iter extends keyof Path = '0', Depths extends Record<any, any> = NextIter> = {
  [K in Iter] : undefined extends Path[K] ? never :
        Path[Depths[K]] extends Prefix ? 
        Path[Depths[Depths[K]]] extends string ?
        Path[Depths[Depths[Depths[K]]]] extends Suffix ?
        Path[Depths[Depths[K]]] | ExtractKeysWithPrefixAndSuffix<Path, Prefix, Suffix, Depths[Depths[Depths[Depths[Iter]]]]>:
        ExtractKeysWithPrefixAndSuffix<Path, Prefix, Suffix, Depths[Iter]> :
        ExtractKeysWithPrefixAndSuffix<Path, Prefix, Suffix, Depths[Iter]>: 
        ExtractKeysWithPrefixAndSuffix<Path, Prefix, Suffix, Depths[Iter]>
}[Iter]


type iji = ValidateArrayPath<{a:{b2:{b2a:{}},b:{c:{},d:{},h:{}}}, array:[{b:{g:{}},ooo:{a:number,ar:[{dd:[{g:number}],e:{}}]}}]}, ['array','$','ooo','ar','$','dd']>


type rrrr23 = ValidateArrayIdentifierPath<{a:{b2:{b2a:{}},b:{c:{},d:{},h:{}}}, array:[{b:{g:{}},ooo:{a:number,ar:[{dd:[{g:number}],e:{}}]}}]},['array','$[','identifier',']','ooo','ar','$[','identifer2',']','dd','$[','identifier3',']','g']>

type rrrr24 = ExtractPathArraysIdentifiers<{a:{b2:{b2a:{}},b:{c:{},d:{},h:{}}}, array:[{b:{g:{}},ooo:{a:number,ar:[{dd:[{g:number}],e:{}}]}}]},['array','$[','sdfsdf',']','ooo','ar','$[','sdfsdf',']','dd','$[','sdfsdfsdf',']']>//,'ar','$[','identifer2',']','dd','$[','identifier3',']','g']>

type rrrr34 = ExtractKeysWithPrefixAndSuffix<['array','$[','A1',']','ooo','ar','$[','A2',']','dd','$[','A3',']']>//,'ar','$[','identifer2',']','dd','$[','identifier3',']','g']>

//type rrrr3d4 = ExtractPathArrayGeneric<{a:{b2:{b2a:{}},b:{c:{},d:{},h:{}}}, array:[{b:{g:{}},ooo:{a:number,ar:[{dd:[{g:number}],e:{}}]}}]},['array','$','ooo','ar','$']>
//,'$[','A1',']','ooo','ar','$[','A2',']','dd','$[','A3',']']>//,'ar','$[','identifer2',']','dd','$[','identifier3',']','g']>


// I will have to use an iterator wrapper,
// that can then capture the information and be wrapper with another level again.
// then I can iterator backwards and forward in that link list
// to be able to get were I want to be.
// function Cap<Update extends MUpdateStatmentWithFilter<any,any>,A extends string, B extends string,C extends string,D extends string>(update : Update, a: A, b: B, c: C, d: D) : MUpdateStatmentWithFilter<Update['___updateForMongoose'], Update['___filterKeys'] & {A:{type : A}}>
// {
//   return {} as any;
// }

// const test = Cap(Cap({} as MUpdateStatmentWithFilter<{}, ['a']>, 'A', 'B', 'C', 'D'),'G','H','I','J');

// type uu = typeof test['___filterKeys']

// // to be able to look up an identitiy, I need to reverse the search path, so I can narrow into the identifier.
// // Well I can do this it is not a problem, just write and ACC, when look list is created.
// // then from there I can norrow everything...

// function ArrayFilter<U extends MUpdateStatmentWithFilter<any, any>, Ident extends U['___filterKeys'], A extends U['___filterKeys']>(updateStatement: U, identifier: Ident, a : A,  value : value)
// function ArrayFilter<U extends MUpdateStatmentWithFilter<any, any>, Ident extends U['___filterKeys'], A extends U['___filterKeys']>(updateStatement: U, identifier: Ident, value : value)
// {

// }

type rrrr = ExtractPathArrays<{a:{b2:{b2a:{}},b:{c:{},d:{},h:{}}}, array:[{b:{g:{}},ooo:{a:number,ar:[{dd:[{g:number}],e:{}}]}}]},['array','$[','sdfsdf',']','ooo']>


type rrrr2 = ExtractPathArraysWithDollar<{a:{b2:{b2a:{}},b:{c:{},d:{},h:{}}}, array:[{b:{g:{}},ooo:{a:number,ar:[{dd:[{g:number}],e:{}}]}}]},['array','$','ooo','ar','$','dd','$']>



type rrrrr = ExtractPathObjects<{a:{b2:{b2a:{}},b:{c:{},d:{},h:{}}}},['a']>


export type PushArray<T extends Record<string,any>> = T | {$each: Array<T>, $slice?: number, $position?:number, $sort?: Record<Extract<KeyofT<T>, String>, number>}

export interface MUpdateStatmentFor<T extends Record<any, any>>  {
  readonly ___updateForMongoose: T 
};

export interface MUpdateStatmentWithFilter<T extends Record<any, any>, Filters extends Array<string>> extends MUpdateStatment<T> {
  readonly ___filterKeys: T 
};

export interface MUpdateStatment<T extends Record<any, any>> extends MUpdateStatmentFor<T> {
  readonly $set?: Record<string, any>
  readonly $push?: Record<string, PushArray<any>>
};

// Should Rather use the builder pattern with a class here, that gets initialized as then return new object with methods on it for update.
export function update(op : keyof MUpdateStatment<any>, updateStatement : MUpdateStatmentFor<any>, args : IArguments, value : any) : void
{
  const updatePath = Array.prototype.slice.call(arguments, 1, arguments.length - 2);
  
  const updateStrPath = updatePath.join('.'); 

  let update = (updateStatement as any as MUpdateStatment<any>)[op] || {}
  update[updateStrPath] = value;
  (updateStatement as any)[op] = update;

  return updateStatement as any;
}

export function $setValue<U extends MUpdateStatmentFor<any>, A extends ValidatePath<U['___updateForMongoose'], [A]>['0']>(updateStatment:U, a : A, value : ExtractPathObjects<U['___updateForMongoose'],[A]>) : void
export function $setValue<U extends MUpdateStatmentFor<any>, A extends ValidatePath<U['___updateForMongoose'], [A]>['0'], B extends ValidatePath<U['___updateForMongoose'], [A, B]>['1']>
(updateStatment:U, a : A, b : B, value : ExtractPathObjects<U['___updateForMongoose'],[A,B]>) : void
export function $setValue<U extends MUpdateStatmentFor<any>, 
A extends ValidatePath<U['___updateForMongoose'], [A]>['0'], B extends ValidatePath<U['___updateForMongoose'], [A, B]>['1'], C extends ValidatePath<U['___updateForMongoose'], [A, B, C]>['2']>
(updateStatment:U, a : A, b : B, c : C, value : ExtractPathObjects<U['___updateForMongoose'],[A,B,C]>) : void

export function $setValue(updateStatment:any, a : any, value : any) : void
{
  return update('$set', updateStatment, arguments, value);
}

 
export function $pushArrayField<U extends MUpdateStatmentFor<any>, A extends ValidatePath<U['___updateForMongoose'], [A]>['0']>(updateStatment:U, a : A, value : PushArray<ExtractPathArrays<U['___updateForMongoose'],[A]>>) : void
export function $pushArrayField<U extends MUpdateStatmentFor<any>, A extends ValidatePath<U['___updateForMongoose'], [A]>['0'], B extends ValidatePath<U['___updateForMongoose'], [A, B]>['1']>
(updateStatment:U, a : A, b : B, value : PushArray<ExtractPathArrays<U['___updateForMongoose'],[A, B]>>) : void
export function $pushArrayField<U extends MUpdateStatmentFor<any>, A extends ValidatePath<U['___updateForMongoose'], [A]>['0'], B extends ValidatePath<U['___updateForMongoose'], [A, B]>['1'], C extends ValidatePath<U['___updateForMongoose'], [A, B, C]>['2']>
(updateStatment:U, a : A, b : B, c : C, value : PushArray<ExtractPathArrays<U['___updateForMongoose'],[A, B, C]>>) : void
export function $pushArrayField<U extends MUpdateStatmentFor<any>, A extends ValidatePath<U['___updateForMongoose'], [A]>['0'], B extends ValidatePath<U['___updateForMongoose'], [A, B]>['1'], C extends ValidatePath<U['___updateForMongoose'], [A, B, C]>['2'], D extends ValidatePath<U['___updateForMongoose'], [A, B, C, D]>['3']>
(updateStatment:U, a : A, b : B, c : C, d : D, value : PushArray<ExtractPathArrays<U['___updateForMongoose'],[A, B, C, D]>>) : void
export function $pushArrayField<U extends MUpdateStatmentFor<any>, A extends ValidatePath<U['___updateForMongoose'], [A]>['0'], B extends ValidatePath<U['___updateForMongoose'], [A, B]>['1'], C extends ValidatePath<U['___updateForMongoose'], [A, B, C]>['2'], D extends ValidatePath<U['___updateForMongoose'], [A, B, C, D]>['3'], E extends ValidatePath<U['___updateForMongoose'], [A, B, C, D, E]>['4']>
(updateStatment:U, a : A, b : B, c : C, d : D, e : E, value : PushArray<ExtractPathArrays<U['___updateForMongoose'],[A, B, C, D, E]>>) : void

export function $pushArrayField(updateStatment:any, a : any, value : any) : void
{
  return update('$push', updateStatment, arguments, value);
}

export function $pushArrayItemField<U extends MUpdateStatmentFor<any>, A extends ValidateArrayPath<U['___updateForMongoose'], [A]>['0']>(updateStatment:U, a : A, value : PushArray<ExtractPathArraysWithDollar<U['___updateForMongoose'],[A]>>) : void
export function $pushArrayItemField<U extends MUpdateStatmentFor<any>, A extends ValidateArrayPath<U['___updateForMongoose'], [A]>['0'], B extends ValidateArrayPath<U['___updateForMongoose'], [A, B]>['1']>
(updateStatment:U, a : A, b : B, value : PushArray<ExtractPathArraysWithDollar<U['___updateForMongoose'],[A, B]>>) : void
export function $pushArrayItemField<U extends MUpdateStatmentFor<any>, A extends ValidateArrayPath<U['___updateForMongoose'], [A]>['0'], B extends ValidateArrayPath<U['___updateForMongoose'], [A, B, C]>['1'], C extends ValidateArrayPath<U['___updateForMongoose'], [A, B, C]>['2']>
(updateStatment:U, a : A, b : B, c : C, value : PushArray<ExtractPathArraysWithDollar<U['___updateForMongoose'],[A, B, C]>>) : void
export function $pushArrayItemField<U extends MUpdateStatmentFor<any>, A extends ValidateArrayPath<U['___updateForMongoose'], [A]>['0'], B extends ValidateArrayPath<U['___updateForMongoose'], [A, B]>['1'], C extends ValidateArrayPath<U['___updateForMongoose'], [A, B, C]>['2'], D extends ValidateArrayPath<U['___updateForMongoose'], [A, B, C, D]>['3']>
(updateStatment:U, a : A, b : B, c : C, d : D, value : PushArray<ExtractPathArraysWithDollar<U['___updateForMongoose'],[A, B, C, D]>>) : void
export function $pushArrayItemField<U extends MUpdateStatmentFor<any>, A extends ValidateArrayPath<U['___updateForMongoose'], [A]>['0'], B extends ValidateArrayPath<U['___updateForMongoose'], [A, B]>['1'], C extends ValidateArrayPath<U['___updateForMongoose'], [A, B, C]>['2'], D extends ValidateArrayPath<U['___updateForMongoose'], [A, B, C, D]>['3'], E extends ValidateArrayPath<U['___updateForMongoose'], [A, B, C, D, E]>['4']>
(updateStatment:U, a : A, b : B, c : C, d : D, e : E, value : PushArray<ExtractPathArraysWithDollar<U['___updateForMongoose'],[A, B, C, D, E]>>) : void
export function $pushArrayItemField(updateStatment:any, a : any, value : any) : void
{
  return update('$push', updateStatment, arguments, value);
}


export function InitOpStatment<S, T extends MUpdateStatmentFor<S>, K extends keyof MUpdateStatment<any>>(object: T, ...op : K[]) : Pick<MUpdateStatment<T>, K>
{
  let obj = {} as Pick<MUpdateStatment<S>, K>;
  op.forEach(k => (obj as any)[k] = {});
  return obj;
}

export function newStatmentBuilder<T extends MUpdateStatmentFor<any>>()
{
  //return new NewStatmentBuilder<T>();
}

// This needs to build the were clause and the updateoperator and array modifiers.
// some now need to figure out how to allow the were clause to be build and capture that information
// for use later on, to validate the $ operators type syntax's.
class NewStatmentBuilder<T extends MUpdateStatmentFor<any>> {

  constructor(public updateStatment : T)
  {
  }

  // So that we can validate the were against the query and the arrayfilter/ upset and multi statments.
  // which 3 different parameters, using the newStatmentBuilder, then have wrapper execute function
  // for monngoose, using function signature to constraint the input and return the respective ReturnType of that function.
   
  // exec(func:() => any) {
  //   func.call(whereClause, updateStatment, updateModifiers);
  // }
}

