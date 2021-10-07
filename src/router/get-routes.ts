export function getRoutes(routeBaseRegExp: RegExp | undefined): Readonly<string[]> {
    // remove the relative base if it exists
    const path = routeBaseRegExp
        ? window.location.pathname.replace(routeBaseRegExp, '')
        : window.location.pathname;
    const routes = path.split('/');
    return routes.filter((route) => !!route);
}
