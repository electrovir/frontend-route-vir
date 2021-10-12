import {isEnumValue} from 'augment-vir';
import {createSpaRouter} from '../';

export enum MainRoute {
    Home = 'home',
    Page1 = 'page1',
    Page2 = 'page2',
    About = 'about',
}

export type TestRoutes = [MainRoute] | [MainRoute, string];

const defaultRoute: TestRoutes = [MainRoute.Home, 'main'];

export const testRouter = createSpaRouter<TestRoutes>({
    routeSanitizer: (routes) => {
        if (!routes || !routes.length) {
            return defaultRoute;
        }
        const mainRoute = routes[0];
        if (!isEnumValue(mainRoute, MainRoute)) {
            return defaultRoute;
        }

        const secondaryRoute = routes[1];
        const sanitizedRoutes: TestRoutes =
            typeof secondaryRoute === 'string' ? [mainRoute, secondaryRoute] : [mainRoute];

        return sanitizedRoutes;
    },
});
