import type {FullRoute} from './full-route';

export function areRoutesEqual(a: Readonly<FullRoute>, b: Readonly<FullRoute>): boolean {
    if (a.paths.length !== b.paths.length) {
        return false;
    }

    return (
        a.hash === b.hash &&
        a.search === b.search &&
        a.paths.every((entryA, index) => b.paths[index] === entryA)
    );
}
