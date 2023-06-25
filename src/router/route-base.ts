/** Trim leading and trailing slashes, if they exist */
function trimRouteBase(inputRouteBase: string): string {
    return inputRouteBase.replace(/(?:^\/|\/+$)/g, '');
}

export function getRouteBase({
    routeBase: inputRouteBase,
    windowPath,
}: {
    routeBase: string;
    windowPath: string;
}): string {
    if (!inputRouteBase) {
        return '';
    }

    const trimmedRouteBase = trimRouteBase(inputRouteBase);

    if (doesWindowPathStartWithBaseRoute({routeBase: trimmedRouteBase, windowPath})) {
        return trimmedRouteBase;
    }

    const nextChildRoute = trimmedRouteBase.replace(/^[^\/]+\//, '');

    if (nextChildRoute && nextChildRoute !== trimmedRouteBase) {
        return getRouteBase({
            routeBase: nextChildRoute,
            windowPath,
        });
    } else {
        return '';
    }
}

export function doesWindowPathStartWithBaseRoute({
    routeBase: inputRouteBase,
    windowPath,
}: {
    routeBase: string;
    windowPath: string;
}): boolean {
    const trimmedRouteBase = trimRouteBase(inputRouteBase);

    if (!trimmedRouteBase) {
        return false;
    }

    return windowPath.startsWith(`/${trimmedRouteBase}`);
}
