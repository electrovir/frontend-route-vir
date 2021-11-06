import {createSpaRouter} from '../';

export const routerWithRouteBase = createSpaRouter({
    routeSanitizer: (rawRoutes) => {
        return {
            ...rawRoutes,
            paths: rawRoutes.paths.filter((route) => !!route),
        };
    },
});
