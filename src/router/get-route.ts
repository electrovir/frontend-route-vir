import type {FullRoute} from './full-route';

export function getFullRoute(routeBaseRegExp: RegExp | undefined): Readonly<FullRoute<string[]>> {
    // remove the relative base if it exists
    const windowPath = routeBaseRegExp
        ? window.location.pathname.replace(routeBaseRegExp, '')
        : window.location.pathname;
    const paths = windowPath.split('/').filter((path) => !!path);

    const windowSearch = window.location.search;
    const search = windowSearch ? new URLSearchParams(window.location.search) : undefined;

    const hash = window.location.hash || undefined;

    return {
        paths,
        search,
        hash,
    };
}
