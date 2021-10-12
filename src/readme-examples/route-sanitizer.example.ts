import {createSpaRouter} from '../';

export const routerWithRouteBase = createSpaRouter({
    routeSanitizer: (rawRoutes) => {
        return rawRoutes.filter((route) => !!route);
    },
});
