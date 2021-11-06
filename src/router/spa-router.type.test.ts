import {createSpaRouter} from '..';

enum TestValidHash {
    thing = '#valid',
}

export const testRouter = createSpaRouter<string[], Record<string, string>, TestValidHash>();

// @ts-expect-error
testRouter.setRoutes({hash: 'derp'});
// @ts-expect-error
testRouter.setRoutes({search: undefined});
// @ts-expect-error
testRouter.setRoutes({hash: undefined});

testRouter.addRouteListener(true, (fullRoute) => {
    fullRoute.hash;
});
