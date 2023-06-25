import {urlSearchParamsToObject} from '../search-params';
import type {FullRoute} from './full-route';

export function getFullRoute(routeBase: string): Required<Readonly<FullRoute>> {
    const pathnameBase = `/${routeBase}`;

    // remove the relative base if it exists
    const windowPath =
        routeBase && globalThis.location.pathname.startsWith(pathnameBase)
            ? globalThis.location.pathname.replace(pathnameBase, '')
            : globalThis.location.pathname;
    const paths = windowPath.split('/').filter((path) => !!path);

    const windowSearch = globalThis.location.search;
    const search = windowSearch
        ? urlSearchParamsToObject(new URLSearchParams(globalThis.location.search))
        : undefined;

    const hash = globalThis.location.hash || undefined;

    return {
        paths,
        search,
        hash,
    };
}
