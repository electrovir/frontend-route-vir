import {createSpaRouter} from '..';
import {ValidRoutesBase, ValidSearchBase} from './full-route';

enum TestValidHash {
    thing = '#valid',
}

export const testRouter = createSpaRouter<ValidRoutesBase, ValidSearchBase, TestValidHash>();

// @ts-expect-error
testRouter.setRoutes({hash: 'derp'});
// @ts-expect-error
testRouter.setRoutes({search: undefined});
// @ts-expect-error
testRouter.setRoutes({hash: undefined});

testRouter.addRouteListener(true, (fullRoute) => {
    fullRoute.hash;
});
