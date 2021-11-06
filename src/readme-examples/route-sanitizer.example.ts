import {createSpaRouter} from '../';

export const routerWithRouteBase = createSpaRouter({
    routeSanitizer: (rawRoutes) => {
        return {
            paths: rawRoutes.paths.filter((route) => !!route),
        };
    },
});
