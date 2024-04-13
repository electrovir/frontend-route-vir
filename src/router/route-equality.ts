import {isJsonEqual} from 'run-time-assertions';
import type {FullRoute} from './full-route';

export function areRoutesEqual(a: Readonly<FullRoute>, b: Readonly<FullRoute>): boolean {
    return isJsonEqual(a, b);
}
