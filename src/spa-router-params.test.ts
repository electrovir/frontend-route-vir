import {assert} from '@open-wc/testing';
import {assertValidShape} from 'object-shape-tester';
import {assertTypeOf} from 'run-time-assertions';
import {FullRoute} from './full-route';
import {RouteSanitizer, SpaRouterParams, spaRouterParamsShape} from './spa-router-params';
import {MockValidPaths} from './spa-router.mock';

describe('SpaRouterParams', () => {
    it('only requires the sanitizeRoute param', () => {
        const exampleParams = {
            sanitizeRoute(rawRoute) {
                return rawRoute as any;
            },
        } as const satisfies SpaRouterParams;

        assertValidShape(exampleParams, spaRouterParamsShape);
        assertTypeOf(exampleParams).toBeAssignableTo<SpaRouterParams>();
        assertTypeOf({}).not.toBeAssignableTo<SpaRouterParams>();
    });

    it('allows undefined for all optional params', () => {
        const exampleParams = {
            sanitizeRoute(rawRoute) {
                return rawRoute as any;
            },
            basePath: undefined,
            disableWarnings: undefined,
            isPaused: undefined,
            maxListenerCount: undefined,
        } as const satisfies SpaRouterParams;

        assertValidShape(exampleParams, spaRouterParamsShape);
        assertTypeOf(exampleParams).toBeAssignableTo<SpaRouterParams>();
    });

    it('has correct types for all params', () => {
        const exampleParams: SpaRouterParams = {
            sanitizeRoute(rawRoute: Required<FullRoute>) {
                return rawRoute as any;
            },
            basePath: '',
            disableWarnings: true,
            isPaused: true,
            maxListenerCount: 3,
        };
        assertValidShape(exampleParams, spaRouterParamsShape);
        assertTypeOf(exampleParams).toBeAssignableTo<SpaRouterParams>();
    });
});

describe('RouteSanitizer', () => {
    it('has the correct input type', () => {
        const sanitizerExample: RouteSanitizer = (input) => {
            assertTypeOf(input).toEqualTypeOf<Readonly<Required<FullRoute>>>();
            return input as any;
        };
    });

    it('requires the correct output type', () => {
        const goodSanitizerExample: RouteSanitizer<MockValidPaths, undefined, undefined> = () => {
            return {
                paths: ['home'],
                hash: undefined,
                search: undefined,
            };
        };
        // @ts-expect-error: the return type has not been sanitized
        const badSanitizerExample: RouteSanitizer<MockValidPaths, undefined, undefined> = (
            input,
        ) => {
            return input;
        };
    });

    it('just returns the current route from the default sanitizer', () => {
        const route = {
            hash: undefined,
            paths: [
                'hello',
                'some route',
            ],
            search: undefined,
        };
        assert.strictEqual(spaRouterParamsShape.defaultValue.sanitizeRoute(route), route);
    });
});
