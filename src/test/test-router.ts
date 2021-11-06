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

const defaultRoute: FullRoute<TestRoutes> = {paths: [MainRoute.Home, 'main']};

export const testRouter = createSpaRouter<TestRoutes>({
    routeSanitizer: (fullRoute) => {
        if (!fullRoute.paths.length) {
            return defaultRoute;
        }
        const mainRoute = fullRoute.paths[0];
        if (!isEnumValue(mainRoute, MainRoute)) {
            return defaultRoute;
        }

        const secondaryRoute = fullRoute.paths[1];
        const sanitizedRoutes: TestRoutes =
            typeof secondaryRoute === 'string' ? [mainRoute, secondaryRoute] : [mainRoute];

        return {...fullRoute, paths: sanitizedRoutes};
    },
});
