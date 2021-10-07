import {SpaRouterError} from './errors/spa-router.error';

export function setRoutes(
    routes: Readonly<string[]>,
    routeBaseRegExp: RegExp | undefined,
    routeBase?: string,
    /**
     * Used for a back button or for replacing routes with sanitized routes. In every other case,
     * pass false here or leave it empty (as it defaults to false).
     */
    replace = false,
): void {
    const path = createPathString(routes, routeBaseRegExp, routeBase);
    if (replace) {
        window.history.replaceState(undefined, '', path);
    } else {
        window.history.pushState(undefined, '', path);
    }
}

export function createPathString(
    routes: Readonly<string[]>,
    routeBaseRegExp: RegExp | undefined,
    routeBase = '',
): string {
    if (!routeBase && routeBaseRegExp != undefined) {
        throw new SpaRouterError(
            `Route base regexp was defined but routeBase string was not provided.`,
        );
    }
    const pathBase = containsRelativeBase(routeBaseRegExp) ? `/${routeBase}` : '';
    return `${pathBase}/${routes.join('/')}`;
}

function containsRelativeBase(routeBaseRegExp: RegExp | undefined): boolean {
    return !!(routeBaseRegExp && window.location.pathname.match(routeBaseRegExp));
}
