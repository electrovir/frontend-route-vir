import {itCases} from '@augment-vir/browser-testing';
import {doesWindowPathStartWithBaseRoute, getRouteBase} from './route-base';

describe(getRouteBase.name, () => {
    itCases(getRouteBase, [
        {
            it: 'returns nothing if the window url is empty',
            input: {
                routeBase: '/my-path/',
                windowPath: '',
            },
            expect: '',
        },
        {
            it: 'returns the route base if window paths starts with it',
            input: {
                routeBase: '/my-path/',
                windowPath: '/my-path/stuff/more-stuff',
            },
            expect: 'my-path',
        },
        {
            it: 'returns a child of the route base if window paths starts with it',
            input: {
                routeBase: '/start-path/not-part-of-it/my-path/',
                windowPath: '/my-path/stuff/more-stuff',
            },
            expect: 'my-path',
        },
    ]);
});

describe(doesWindowPathStartWithBaseRoute.name, () => {
    itCases(doesWindowPathStartWithBaseRoute, [
        {
            it: 'finds a valid match',
            input: {
                routeBase: 'hello-there',
                windowPath: '/hello-there',
            },
            expect: true,
        },
        {
            it: 'works with surrounding slashes',
            input: {
                routeBase: '/hello-there/',
                windowPath: '/hello-there',
            },
            expect: true,
        },
        {
            it: 'rejects a base that the windowPath does not start with',
            input: {
                routeBase: 'books',
                windowPath: '/hello-there',
            },
            expect: false,
        },
    ]);
});
