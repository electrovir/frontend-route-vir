import {isEnumValue} from '@augment-vir/common';
import type {FullRoute} from '../';
import {createSpaRouter} from '../';

export enum MainRoute {
    Home = 'home',
    Page1 = 'page1',
    Page2 = 'page2',
    About = 'about',
}

export type TestAppRoutePaths = [MainRoute] | [MainRoute, string];

export type FullTestAppRoute = Readonly<FullRoute<TestAppRoutePaths>>;

export const defaultTestAppRoutes: FullTestAppRoute = {
    paths: [
        MainRoute.Home,
        'main',
    ],
    hash: undefined,
    search: undefined,
};

export const testRouter = createSpaRouter<TestAppRoutePaths>({
    routeSanitizer: (fullRoute) => {
        if (!fullRoute.paths.length) {
            return {...fullRoute, paths: defaultTestAppRoutes.paths};
        }

        const mainRoute = fullRoute.paths[0];
        if (!isEnumValue(mainRoute, MainRoute)) {
            return {...fullRoute, paths: defaultTestAppRoutes.paths};
        }

        const secondaryRoute = fullRoute.paths[1];
        const sanitizedRoutes: TestAppRoutePaths =
            typeof secondaryRoute === 'string'
                ? [
                      mainRoute,
                      secondaryRoute,
                  ]
                : [mainRoute];

        // restrict hash string length to 3 (excluding the # symbol
        const sanitizedHash: string | undefined =
            fullRoute.hash?.replace(/^#/, '').length === 3 ? fullRoute.hash : undefined;

        // restrict search object key and value lengths to 3
        const sanitizedSearch = Object.keys(fullRoute.search || {}).every(
            (key) => key.length === 3 && fullRoute.search?.[key]?.length === 3,
        )
            ? fullRoute.search
            : undefined;

        const sanitizedRoute = {
            search: sanitizedSearch,
            hash: sanitizedHash,
            paths: sanitizedRoutes,
        };

        return sanitizedRoute;
    },
});
