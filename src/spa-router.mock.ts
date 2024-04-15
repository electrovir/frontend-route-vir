import {FullRoute} from './full-route';

export type MockValidPaths =
    | ['home']
    | ['gallery', /** Specific gallery id. */ string]
    | ['about']
    | ['about', 'team' | 'website'];

export function sanitizeMockPaths(rawRoute: Readonly<Pick<FullRoute, 'paths'>>): MockValidPaths {
    const topLevelPath = rawRoute.paths[0];

    if (topLevelPath === 'about') {
        if (rawRoute.paths[1] !== 'team' && rawRoute.paths[1] !== 'website') {
            return ['about'];
        } else {
            return [
                'about',
                rawRoute.paths[1],
            ];
        }
    } else if (topLevelPath === 'gallery' && rawRoute.paths[1]) {
        return [
            'gallery',
            rawRoute.paths[1],
        ];
    } else {
        /** Default to this route. */
        return ['home'];
    }
}
