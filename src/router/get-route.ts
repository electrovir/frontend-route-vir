import {urlSearchParamsToObject} from '../search-params';
import type {FullRoute} from './full-route';

export function getFullRoute(routeBaseRegExp: RegExp | undefined): Required<Readonly<FullRoute>> {
    // remove the relative base if it exists
    const windowPath = routeBaseRegExp
        ? globalThis.location.pathname.replace(routeBaseRegExp, '')
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
