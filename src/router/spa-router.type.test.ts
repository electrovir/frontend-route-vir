import {createSpaRouter} from '..';

enum TestValidHash {
    thing = '#valid',
}

export const testRouter = createSpaRouter<string[], Record<string, string>, TestValidHash>();

// @ts-expect-error
testRouter.setRoutes({hash: 'derp'});
