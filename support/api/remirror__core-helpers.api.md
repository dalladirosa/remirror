## API Report File for "@remirror/core-helpers"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { AnyConstructor } from '@remirror/core-types';
import type { AnyFunction } from '@remirror/core-types';
import { BaseError } from 'make-error';
import { camelCase } from 'case-anything';
import { capitalCase } from 'case-anything';
import { constantCase } from 'case-anything';
import { debounce } from 'throttle-debounce';
import { ErrorConstant } from '@remirror/core-constants';
import { kebabCase } from 'case-anything';
import type { Nullable } from '@remirror/core-types';
import omit from 'object.omit';
import { pascalCase } from 'case-anything';
import { pathCase } from 'case-anything';
import pick from 'object.pick';
import type { Predicate } from '@remirror/core-types';
import type { Primitive } from 'type-fest';
import type { RemirrorIdentifier } from '@remirror/core-constants';
import type { RemirrorIdentifierShape } from '@remirror/core-types';
import type { Shape } from '@remirror/core-types';
import { snakeCase } from 'case-anything';
import { spaceCase } from 'case-anything';
import { throttle } from 'throttle-debounce';
import type { UnknownShape } from '@remirror/core-types';

// @public
export function bool<Value>(value: Value): value is Exclude<Value, Falsy>;

// @public
export function callIfDefined<Method extends AnyFunction>(fn: Nullable<Method>, ...args: Parameters<Method>): void;

export { camelCase }

export { capitalCase }

// @public
export function capitalize(string: string): string;

// @public
export function Cast<Type = any>(argument: any): Type;

// @public
export function clamp({ min, max, value }: ClampParameter): number;

// @public
export function cleanupOS(os: string, pattern?: string, label?: string): string;

// @public
export function clone<Type extends object>(value: Type): Type;

export { constantCase }

export { debounce }

// @public
export function deepMerge<Type = any>(...objects: Array<UnknownShape | unknown[]>): Type;

// @public
export function entries<Type extends object, Key extends Extract<keyof Type, string>, Value extends Type[Key], Entry extends [Key, Value]>(value: Type): Entry[];

// @public
export function findMatches(text: string, regexp: RegExp, runWhile?: (match: RegExpExecArray | null) => boolean): RegExpExecArray[];

// @public
export function flattenArray<Type>(array: any[]): Type[];

// @public
export function format(string: string): string;

// @public
export const freeze: <Target extends object>(target: Target, options?: FreezeOptions) => Readonly<Target>;

// @public
export function get<Return = any>(path: string | Array<string | number>, obj: any, fallback?: any): Return;

// @public
export function getLazyArray<Type>(value: Type[] | (() => Type[])): Type[];

// @public
export function hasOwnProperty<Obj extends object, Property extends string | number | symbol>(object_: Obj, key: Property): object_ is Property extends keyof Obj ? Obj : Obj & {
    Key: unknown;
};

// @public
export function includes<Type>(array: Type[] | readonly Type[], item: unknown, fromIndex?: number): item is Type;

// @public
export function invariant(condition: unknown, options: RemirrorErrorOptions): asserts condition;

// @public
export function isAndroidOS(): boolean;

// @public
export const isArray: (arg: any) => arg is any[];

// @public
export function isBoolean(value: unknown): value is boolean;

// @public @deprecated
export function isClass(value: unknown): value is AnyConstructor;

// @public
export const isDate: (value: unknown) => value is Date;

// @public
export function isDirectInstanceOf<Type>(instance: unknown, Constructor: AnyConstructor<Type>): instance is Type;

// @public
export function isEmptyArray(value: unknown): boolean;

// @public
export function isEmptyObject(value: unknown): boolean;

// @public
export const isEqual: any;

// @public
export const isError: (value: unknown) => value is Error;

// @public
export const isFunction: (value: unknown) => value is AnyFunction<any>;

// @internal
export function isIdentifierOfType(value: RemirrorIdentifierShape, type: RemirrorIdentifier | RemirrorIdentifier[]): boolean;

// @public
export function isInstanceOf<Constructor extends AnyConstructor>(Constructor: Constructor): (value: unknown) => value is InstanceType<Constructor>;

// @public
export function isInteger(value: unknown): value is number;

// @public
export function isMap(value: unknown): value is Map<unknown, unknown>;

// @public
export function isNativePromise(value: unknown): value is Promise<unknown>;

// @public
export function isNull(value: unknown): value is null;

// @public
export function isNullOrUndefined(value: unknown): value is null | undefined;

// @public
export const isNumber: (value: unknown) => value is number;

// @public
export function isObject<Type extends Shape>(value: unknown): value is Type;

// @public
export function isPlainObject<Type = unknown>(value: unknown): value is UnknownShape<Type>;

// @public
export function isPrimitive(value: unknown): value is Primitive;

// @public
export function isPromise(value: unknown): value is Promise<unknown>;

// @public
export const isRegExp: (value: unknown) => value is RegExp;

// @internal
export const isRemirrorType: (value: unknown) => value is RemirrorIdentifierShape;

// @public
export function isSafeInteger(value: unknown): value is number;

// @public
export function isSet(value: unknown): value is Set<unknown>;

// @public
export const isString: (value: unknown) => value is string;

// @public
export const isSymbol: (value: unknown) => value is symbol;

// @public
export const isUndefined: (value: unknown) => value is undefined;

export { kebabCase }

// @public
export function keys<Type extends object, Key extends Extract<keyof Type, string>>(value: Type): Key[];

// @public
export function last<Type>(array: Type[]): Type;

// @public
export class Merge {
    static delete(): any;
    static overwrite<Return = any>(object_?: UnknownShape): Return;
}

// @public (undocumented)
export interface Merge {
    [key: string]: unknown;
}

// @public
export function noop(): void;

// @public
export function not<Type>(predicate: Predicate<Type>): (a: unknown) => boolean;

// @public
export function object<Type extends object>(value?: Type): Type;

export { omit }

// @public (undocumented)
export function omitUndefined(object: UnknownShape): any;

export { pascalCase }

export { pathCase }

export { pick }

// @public
export function randomFloat(min: number, max?: number): number;

// @public
export function randomInt(min: number, max?: number): number;

// @public
export function range(start: number, end?: number): number[];

// @public
export class RemirrorError extends BaseError {
    static create(options?: RemirrorErrorOptions): RemirrorError;
    errorCode: ErrorConstant;
}

// @public
export function shallowClone<Type extends object>(value: Type): Type;

export { snakeCase }

// @public
export function sort<Type>(array: Type[], compareFn: (a: Type, b: Type) => number): Type[];

export { spaceCase }

// @public
export function startCase(string: string): string;

// @public
export function take<Type extends any[]>(array: Type, number: number): any[];

export { throttle }

// @public
function toString_2(value: unknown): any;

export { toString_2 as toString }

// @public
export function trim(string: string): string;

// @public
export function uniqueArray<Type>(array: Type[], fromStart?: boolean): any[];

// @public
export function uniqueBy<Item = any, Key = any>(array: Item[], getValue: ((item: Item) => Key) | string | Array<string | number>, fromStart?: boolean): Item[];

// @public
export function uniqueId(prefix?: string): string;

// @public
export function values<Type extends object, Key extends Extract<keyof Type, string>, Value extends Type[Key]>(value: Type): Value[];

// @public
export function within(value: number, ...rest: Array<number | undefined | null>): boolean;


// (No @packageDocumentation comment for this package)

```