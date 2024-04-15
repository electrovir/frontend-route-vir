import {SpaRouter} from './spa-router';
import {sanitizeMockPaths} from './spa-router.mock';
window.history.replaceState(undefined, '', '/about/team#hi');

const mockRouter = new SpaRouter({
    sanitizeRoute(rawRoute) {
        return {
            paths: sanitizeMockPaths(rawRoute) as string[],
            search: undefined,
            hash: undefined,
        };
    },
});
