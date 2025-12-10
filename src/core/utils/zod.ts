import { z, type ZodLiteral } from 'zod';

// Primitive 타입 정의 (zod 내부에서 사용하는 타입)
type Primitive = string | number | boolean | null | undefined;

type MappedZodLiterals<T extends readonly Primitive[]> = {
    -readonly [K in keyof T]: ZodLiteral<T[K]>;
};

export function createManyUnion<
    A extends Readonly<[Primitive, Primitive, ...Primitive[]]>,
>(literals: A) {
    return z.union(
        literals.map((value) => z.literal(value)) as unknown as MappedZodLiterals<A>,
    );
}

export function createUnionSchema<T extends readonly Primitive[]>(values: T) {
    if (values.length > 1) {
        return createManyUnion(
            values as typeof values & [Primitive, Primitive, ...Primitive[]],
        );
    } else if (values.length === 1) {
        return z.literal(values[0] as (typeof values)[0]);
    }
    throw new Error('Array must have a length');
}