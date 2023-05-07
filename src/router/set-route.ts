import {objectToUrlSearchParams} from '../search-params';
import {SpaRouterError} from './errors/spa-router.error';
import type {FullRoute} from './full-route';

export function setRoutes(
    fullRoute: Readonly<FullRoute>,
    routeBaseRegExp: RegExp | undefined,
    routeBase?: string,
    /**
     * Used for a back button or for replacing routes with sanitized routes. In every other case,
     * pass false here or leave it empty (as it defaults to false).
     */
    replace = false,
): void {
    const fullRelativeUrl = createPathString(fullRoute, routeBaseRegExp, routeBase);
    if (replace) {
        globalThis.history.replaceState(undefined, '', fullRelativeUrl);
    } else {
        globalThis.history.pushState(undefined, '', fullRelativeUrl);
    }
}

export function createPathString(
    fullRoute: Readonly<FullRoute>,
    routeBaseRegExp: RegExp | undefined,
    routeBase = '',
): string {
    if (!routeBase && routeBaseRegExp != undefined) {
        throw new SpaRouterError(
            `Route base regexp was defined but routeBase string was not provided.`,
        );
    }
    const pathBase = doesWindowContainsRelativeBase(routeBaseRegExp) ? `/${routeBase}` : '';
    const urlParamsString = fullRoute.search
        ? objectToUrlSearchParams(fullRoute.search).toString()
        : '';
    const searchString = urlParamsString ? `?${urlParamsString}` : '';

    const hashStarter = fullRoute.hash?.startsWith('#') ? '' : '#';
    const hashString = fullRoute.hash ? `${hashStarter}${fullRoute.hash}` : '';

    return `${pathBase}/${fullRoute.paths.join('/')}${searchString}${hashString}`;
}

function doesWindowContainsRelativeBase(routeBaseRegExp: RegExp | undefined): boolean {
    return !!(routeBaseRegExp && globalThis.location.pathname.match(routeBaseRegExp));
}
