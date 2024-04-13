import {superBasicRouter} from './router-creation.example';

superBasicRouter.addRouteListener(true, (routes) => {
    console.info(routes);
});
