import {isEnumValue} from 'augment-vir';
import type {FullRoute} from '../';
import {createSpaRouter} from '../';

export enum MainRoute {
    Home = 'home',
    Page1 = 'page1',
    Page2 = 'page2',
    About = 'about',
}

export type TestRoutes = [MainRoute] | [MainRoute, string];

const defaultRoute: FullRoute<TestRoutes> = {
    paths: [
        MainRoute.Home,
        'main',
    ],
};

export const testRouter = createSpaRouter<TestRoutes>({
    routeSanitizer: (fullRoute) => {
        if (!fullRoute.paths.length) {
            return {...(fullRoute as any), defaultRoute};
        }

        const mainRoute = fullRoute.paths[0];
        if (!isEnumValue(mainRoute, MainRoute)) {
            return {...(fullRoute as any), defaultRoute};
        }

        const secondaryRoute = fullRoute.paths[1];
        const sanitizedRoutes: TestRoutes =
            typeof secondaryRoute === 'string'
                ? [
                      mainRoute,
                      secondaryRoute,
                  ]
                : [mainRoute];

        // restrict hash string length to 3 (excluding the # symbol
        const sanitizedHash: string | undefined =
            fullRoute.hash?.replace(/^#/, '').length === 3 ? (fullRoute.hash as string) : undefined;

        // restrict search object key and value lengths to 3
        const sanitizedSearch = Object.keys(fullRoute.search || {}).every(
            (key) => key.length === 3 && fullRoute.search?.[key]?.length === 3,
        )
            ? (fullRoute.search as Record<string, string>)
            : undefined;

        const sanitizedRoute = {
            search: sanitizedSearch,
            hash: sanitizedHash,
            paths: sanitizedRoutes,
        };

        return sanitizedRoute;
    },
});
