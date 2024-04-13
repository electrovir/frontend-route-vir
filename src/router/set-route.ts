import {isTruthy} from '@augment-vir/common';
import {searchParamsToString} from 'url-vir';
import type {FullRoute} from './full-route';
import {doesWindowPathStartWithBaseRoute} from './route-base';

export function setRoutes(
    fullRoute: Readonly<FullRoute>,
    routeBase: string,
    /**
     * Used for a back button or for replacing routes with sanitized routes. In every other case,
     * pass false here or leave it empty (as it defaults to false).
     */
    replace = false,
): void {
    const fullRelativeUrl = createPathString(fullRoute, routeBase);
    if (replace) {
        globalThis.history.replaceState(undefined, '', fullRelativeUrl);
    } else {
        globalThis.history.pushState(undefined, '', fullRelativeUrl);
    }
}

export function createPathString(fullRoute: Readonly<FullRoute>, routeBase: string): string {
    const pathBase = doesWindowPathStartWithBaseRoute({
        routeBase,
        windowPath: globalThis.location.pathname,
    })
        ? routeBase
        : '';
    const searchString = fullRoute.search ? searchParamsToString(fullRoute.search) : '';

    const hashStarter = fullRoute.hash?.startsWith('#') ? '' : '#';
    const hashString = fullRoute.hash ? `${hashStarter}${fullRoute.hash}` : '';

    const paths = [
        pathBase,
        ...fullRoute.paths,
    ].filter(isTruthy);

    return `/${paths.join('/')}${searchString}${hashString}`;
}
