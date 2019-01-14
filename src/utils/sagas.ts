import { CallEffect, call } from "redux-saga/effects";

// like the saga `call` effect, but more convenient for objects
export function callMethod<O, A, B, T extends (x: A) => void>(o: O, m: (o: O) => T, action: A): CallEffect
export function callMethod<O, A, B, T extends (x: A) => B>(o: O, m: (o: O) => T, action: A): CallEffect {
    return call((m(o) as any).bind(o), action);
}