import type {FullRoute} from './full-route';

export function areRoutesEqual(a: Readonly<FullRoute>, b: Readonly<FullRoute>): boolean {
    if (a.paths.join(' ') !== b.paths.join(' ')) {
        return false;
    }

    if (typeof a.search === 'object' && typeof b.search === 'object') {
        const aString: string = Object.entries(a.search).join(' ');
        const bString: string = Object.entries(b.search).join(' ');

        if (aString !== bString) {
            return false;
        }
    } else if (a.search !== b.search) {
        return false;
    }

    return a.hash === b.hash;
}
