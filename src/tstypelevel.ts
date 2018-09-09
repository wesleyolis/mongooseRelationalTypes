export declare type Increment = {
    0: '1';
    1: '2';
    2: '3';
    3: '4';
    4: '5';
    5: '6';
    6: '7';
    7: '8';
    8: '9';
    9: '10';
    10: never;
};
export declare type StringToNumber = {
    0: 0;
    1: 1;
    2: 2;
    3: 3;
    4: 4;
    5: 5;
    6: 6;
    7: 7;
    8: 8;
    9: 9;
    10: 10;
};
export declare type Bool = 'T' | 'F';
export declare type If<B extends Bool, Then, Else> = {
    T: Then;
    F: Else;
}[B];
export declare type Not<B extends Bool> = If<B, 'F', 'T'>;
export declare type And<B1 extends Bool, B2 extends Bool> = If<B1, B2, 'F'>;
export declare type Or<B1 extends Bool, B2 extends Bool> = If<B1, 'T', B2>;
export declare type BoolEq<B1 extends Bool, B2 extends Bool> = If<B1, B2, Not<B2>>;
export declare type Option<A> = None | Some<A>;
export interface None {
    isNone: 'T';
    _A: never;
}
export interface Some<A> {
    isNone: 'F';
    _A: A;
}
export declare type IsNone<O extends Option<any>> = O['isNone'];
export declare type IsSome<O extends Option<any>> = Not<IsNone<O>>;
export declare type OptionUnsafeGet<O extends Option<any>> = O['_A'];
export declare type OptionGetOrElse<O extends Option<any>, A> = If<IsNone<O>, A, OptionUnsafeGet<O>>;
export interface Zero {
    isZero: 'T';
    prev: never;
}
export interface Succ<N extends Nat> {
    isZero: 'F';
    prev: N;
}
export declare type Nat = Zero | Succ<any>;
export declare type One = Succ<Zero>;
export declare type Two = Succ<One>;
export declare type Three = Succ<Two>;
export declare type Four = Succ<Three>;
export declare type Five = Succ<Four>;
export declare type Six = Succ<Five>;
export declare type Seven = Succ<Six>;
export declare type Eight = Succ<Seven>;
export declare type Nine = Succ<Eight>;
export declare type Ten = Succ<Nine>;
export declare type IsZero<N extends Nat> = N['isZero'];
export declare type Prev<N extends Nat> = N['prev'];
export declare type NatEq<N1 extends Nat, N2 extends Nat> = {
    T: IsZero<N2>;
    F: If<IsZero<N2>, 'F', NatEq<Prev<N1>, Prev<N2>>>;
}[IsZero<N1>];
export declare type Add<N1 extends Nat, N2 extends Nat> = {
    T: N2;
    F: Succ<Add<Prev<N1>, N2>>;
}[IsZero<N1>];
export declare type Sub<N1 extends Nat, N2 extends Nat> = {
    T: If<IsZero<N2>, Some<Zero>, None>;
    F: If<IsZero<N2>, Some<N1>, Sub<Prev<N1>, Prev<N2>>>;
}[IsZero<N1>];
export declare type UnsafeSub<N1 extends Nat, N2 extends Nat> = OptionGetOrElse<Sub<N1, N2>, Zero>;
export declare type Mult<N1 extends Nat, N2 extends Nat> = {
    T: Zero;
    F: If<IsZero<Prev<N1>>, N2, Add<N2, Mult<Prev<N1>, N2>>>;
}[IsZero<N1>];
export declare type Lte<N1 extends Nat, N2 extends Nat> = {
    T: 'T';
    F: If<IsZero<N2>, 'F', Lte<Prev<N1>, Prev<N2>>>;
}[IsZero<N1>];
export declare type Lt<N1 extends Nat, N2 extends Nat> = And<Lte<N1, N2>, Not<NatEq<N1, N2>>>;
export declare type Gte<N1 extends Nat, N2 extends Nat> = Not<Lt<N1, N2>>;
export declare type Gt<N1 extends Nat, N2 extends Nat> = Not<Lte<N1, N2>>;
export declare type Mod<N1 extends Nat, N2 extends Nat, R = Zero> = {
    T: R;
    F: Mod<N1, N2, UnsafeSub<N1, N2>>;
}[IsZero<N1>];
export declare type Min<N1 extends Nat, N2 extends Nat> = If<Lte<N1, N2>, N1, N2>;
export declare type Max<N1 extends Nat, N2 extends Nat> = If<Lte<N1, N2>, N2, N1>;
export declare type NatToString<N extends Nat, I extends keyof Increment = '0'> = {
    T: I;
    F: NatToString<Prev<N>, Increment[I]>;
}[IsZero<N>];
export declare type NatToNumber<N extends Nat> = StringToNumber[NatToString<N>];
export declare type StringToNat = {
    0: Zero;
    1: One;
    2: Two;
    3: Three;
    4: Four;
    5: Five;
    6: Six;
    7: Seven;
    8: Eight;
    9: Nine;
    10: Ten;
};
export declare type StringOmit<L1 extends string, L2 extends string> = ({
    [P in L1]: P;
} & {
    [P in L2]: never;
} & {
    [key: string]: never;
})[L1];
export declare type StringEq<L1 extends string, L2 extends string> = And<StringContains<L1, L2>, StringContains<L2, L1>>;
export declare type StringIntersection<L1 extends string, L2 extends string> = StringOmit<L1, StringOmit<L1, L2>>;
export declare type StringContains<S extends string, L extends string> = ({
    [K in S]: 'T';
} & {
    [key: string]: 'F';
})[L];
export declare type ObjectHasKey<O, L extends string> = StringContains<keyof O, L>;
export declare type ObjectOverwrite<O1, O2> = Pick<O1, StringOmit<keyof O1, keyof O2>> & O2;
export declare type ObjectOmit<O, K extends string> = Pick<O, StringOmit<keyof O, K>>;
export declare type ObjectDiff<O1 extends O2, O2> = ObjectOmit<O1, keyof O2> & Partial<O2>;
export declare type ObjectClean<T> = Pick<T, keyof T>;
export declare type ObjectOptional<O, K extends keyof O> = ObjectOmit<O, K> & Partial<Pick<O, K>>;
export declare type PickExact<O, K extends keyof O> = Pick<O, K> & {
    [K1 in StringOmit<keyof O, K>]?: never;
};
export declare type Required<T> = {
    [P in Purify<keyof T>]: NonNullable<T[P]>;
};
export declare type Purify<T extends string> = {
    [P in T]: T;
}[T];
export declare type NonNullable<T> = T & {};
export interface HNil {
    isHNil: 'T';
    head: never;
    tail: never;
}
export interface HCons<H, T extends HList> {
    isHNil: 'F';
    head: H;
    tail: T;
}
export declare type HList = HNil | HCons<any, any>;
export declare type IsHNil<L extends HList> = L['isHNil'];
export declare type Head<L extends HList> = L['head'];
export declare type Tail<L extends HList> = L['tail'];
export declare type TypeAt<L extends HList, I extends Nat> = {
    T: None;
    F: If<IsZero<I>, Some<Head<L>>, TypeAt<Tail<L>, Prev<I>>>;
}[IsHNil<L>];
export declare type UnsafeTypeAt<L extends HList, N extends Nat> = OptionGetOrElse<TypeAt<L, N>, never>;
export declare type Reverse<L extends HList, Acc extends HList = HNil> = {
    T: Acc;
    F: Reverse<Tail<L>, HCons<Head<L>, Acc>>;
}[IsHNil<L>];
export declare type HListLengthAsNat<L extends HList> = {
    T: Zero;
    F: Succ<HListLengthAsNat<Tail<L>>>;
}[IsHNil<L>];
export declare type HListLengthAsString<L extends HList> = {
    T: '0';
    F: Increment[HListLengthAsString<Tail<L>>];
}[IsHNil<L>];
export declare type HListLengthAsNumber<L extends HList> = StringToNumber[HListLengthAsString<L>];
export declare type HListToTuple<L extends HList> = {
    0: never;
    1: [Head<L>];
    2: [Head<L>, Head<Tail<L>>];
    3: [Head<L>, Head<Tail<L>>, Head<Tail<Tail<L>>>];
    4: [Head<L>, Head<Tail<L>>, Head<Tail<Tail<L>>>, Head<Tail<Tail<Tail<L>>>>];
    5: [Head<L>, Head<Tail<L>>, Head<Tail<Tail<L>>>, Head<Tail<Tail<Tail<L>>>>, Head<Tail<Tail<Tail<Tail<L>>>>>];
    6: [Head<L>, Head<Tail<L>>, Head<Tail<Tail<L>>>, Head<Tail<Tail<Tail<L>>>>, Head<Tail<Tail<Tail<Tail<L>>>>>, Head<Tail<Tail<Tail<Tail<Tail<L>>>>>>];
}[HListLengthAsString<L>];
export declare type HListConcat<L1 extends HList, L2 extends HList> = {
    T: L2;
    F: HCons<Head<L1>, HListConcat<Tail<L1>, L2>>;
}[IsHNil<L1>];
export declare type AnyTuple = Array<any> & {
    '0': any;
};
export declare type TupleToObject<T> = ObjectOmit<T, keyof Array<any>>;
export declare type TupleLengthAsString<T extends AnyTuple, I extends keyof Increment = '0'> = {
    T: TupleLengthAsString<T, Increment[I]>;
    F: I;
}[ObjectHasKey<T, I>];
export declare type TupleLengthAsNumber<T extends AnyTuple> = StringToNumber[TupleLengthAsString<T>];
export declare type TupleToHList<T extends AnyTuple, I extends keyof Increment & keyof T = '0', L extends HList = HNil> = {
    T: TupleToHList<T, Increment[I], HCons<T[I], L>>;
    F: Reverse<L>;
}[ObjectHasKey<T, I>];
