import {MaybePromise} from '@augment-vir/common';
import {assert, waitUntil} from '@open-wc/testing';
import {assertThrows} from 'run-time-assertions';
import {parseUrl} from 'url-vir';
import {FullRoute, ValidHashBase, ValidPathsBase, ValidSearchBase} from './full-route';
import {SpaRouter} from './spa-router';
import {SpaRouterParams} from './spa-router-params';
import {MockValidPaths, sanitizeMockPaths} from './spa-router.mock';

describe(SpaRouter.name, () => {
    function testRouter<
        ValidPaths extends ValidPathsBase = MockValidPaths,
        ValidSearch extends ValidSearchBase | undefined = undefined,
        ValidHash extends ValidHashBase | undefined = undefined,
    >(
        init: Partial<SpaRouterParams<ValidPaths, ValidSearch, ValidHash>>,
        callback: (
            mockRouter: SpaRouter<ValidPaths, ValidSearch, ValidHash>,
            hrefBefore: string,
        ) => MaybePromise<void>,
    ) {
        return async () => {
            const hrefBefore = window.location.href;
            let mockRouter = new SpaRouter<ValidPaths, ValidSearch, ValidHash>({
                sanitizeRoute(rawRoute) {
                    return {
                        paths: sanitizeMockPaths(rawRoute) as string[] as ValidPaths,
                        search: undefined as ValidSearch,
                        hash: undefined as ValidHash,
                    };
                },
                ...init,
            });

            try {
                await callback(mockRouter, hrefBefore);
            } finally {
                mockRouter?.destroy();
            }
        };
    }

    it(
        'sanitizes the current route on construction',
        testRouter({}, (mockRouter, hrefBefore) => {
            const hrefAfter = window.location.href;

            assert.notStrictEqual(hrefBefore, hrefAfter);
            assert.strictEqual(parseUrl(window.location.href).pathname, '/home');
            assert.deepStrictEqual(mockRouter.readCurrentRoute(), {
                hash: undefined,
                paths: ['home'],
                search: undefined,
            });
        }),
    );

    it(
        'sanitizes a route',
        testRouter({}, (mockRouter) => {
            assert.deepStrictEqual(
                mockRouter.sanitizeRoute({
                    paths: [
                        'this is not',
                        'a',
                        'valid path',
                    ],
                    search: {
                        what: ['some value'],
                    },
                    hash: 'what-is-this',
                }),
                {
                    hash: undefined,
                    paths: ['home'],
                    search: undefined,
                },
            );
        }),
    );

    it(
        'creates route URLs',
        testRouter({}, (mockRouter) => {
            const sanitizedInvalidUrl = mockRouter.createRouteUrl({
                paths: [
                    // @ts-expect-error: this is not a valid path
                    'invalid path',
                ],
            });
            const validUrl = mockRouter.createRouteUrl({
                paths: [
                    'gallery',
                    'some id',
                ],
            });

            assert.notStrictEqual(
                sanitizedInvalidUrl,
                parseUrl(sanitizedInvalidUrl).fullPath,
                'created url should include more than just the path',
            );
            assert.strictEqual(parseUrl(sanitizedInvalidUrl).fullPath, '/home');
            assert.strictEqual(parseUrl(validUrl).fullPath, '/gallery/some id');
        }),
    );

    it(
        'creates URLs with the base path',
        testRouter(
            {
                basePath: 'some-base',
            },
            (mockRouter) => {
                window.history.replaceState(undefined, '', '/some-base');
                const validUrl = mockRouter.createRouteUrl({
                    paths: [
                        'gallery',
                        'some id',
                    ],
                });

                assert.strictEqual(parseUrl(validUrl).fullPath, '/some-base/gallery/some id');
            },
        ),
    );

    it(
        'excludes base URL if current URL excludes it',
        testRouter({}, (mockRouter) => {
            const validUrl = mockRouter.createRouteUrl({
                paths: [
                    'gallery',
                    'some id',
                ],
            });

            assert.strictEqual(parseUrl(validUrl).fullPath, '/gallery/some id');
        }),
    );

    it(
        'creates a url with partial paths',
        testRouter(
            {
                sanitizeRoute(rawRoute) {
                    return {
                        paths: sanitizeMockPaths(rawRoute),
                        search: undefined,
                        hash: rawRoute.hash || 'hi',
                    };
                },
            },
            (mockRouter) => {
                assert.isTrue(
                    mockRouter.setRoute({
                        paths: [
                            'about',
                            'team',
                        ],
                    }),
                );
                const validUrl = mockRouter.createRouteUrl({
                    hash: '#hello-there',
                });

                assert.strictEqual(parseUrl(validUrl).fullPath, '/about/team#hello-there');
                assert.strictEqual(parseUrl(globalThis.location.href).fullPath, '/about/team#hi');
                assert.deepStrictEqual(mockRouter.readCurrentRoute(), {
                    hash: 'hi',
                    paths: [
                        'about',
                        'team',
                    ],
                    search: undefined,
                });
            },
        ),
    );

    it(
        'does not set a route if paused',
        testRouter({isPaused: true}, (mockRouter, hrefBefore) => {
            const newRoute = {
                paths: [
                    'about',
                    'team',
                ],
            } as const satisfies Partial<FullRoute<MockValidPaths>>;
            const newUrl = mockRouter.createRouteUrl(newRoute);

            assert.isFalse(mockRouter.setRoute(newRoute));

            assert.strictEqual(globalThis.location.href, hrefBefore);
            assert.notStrictEqual(globalThis.location.href, newUrl);

            globalThis.history.replaceState(undefined, '', '/test');
            assert.strictEqual(
                globalThis.location.pathname,
                '/test',
                'path should not have gotten sanitized',
            );
        }),
    );

    it(
        'removes a listener',
        testRouter({isPaused: true}, (mockRouter) => {
            assert.strictEqual(mockRouter.getListenerCount(), 0);
            const removeListener = mockRouter.listen(true, () => {});
            assert.strictEqual(mockRouter.getListenerCount(), 1);
            removeListener();
            assert.strictEqual(mockRouter.getListenerCount(), 0);
        }),
    );

    it(
        'blocks multiple listeners by default',
        testRouter({isPaused: true}, (mockRouter) => {
            assertThrows(() => {
                mockRouter.listen(true, () => {});
                mockRouter.listen(true, () => {});
            });
        }),
    );

    it(
        'allows a customized listener max',
        testRouter({isPaused: true, maxListenerCount: 3}, (mockRouter) => {
            mockRouter.listen(true, () => {});
            mockRouter.listen(true, () => {});
            mockRouter.listen(true, () => {});
            assertThrows(() => {
                mockRouter.listen(true, () => {});
            });
        }),
    );

    it(
        'does not set an identical route',
        testRouter({}, (mockRouter) => {
            const events: FullRoute[] = [];

            mockRouter.listen(false, (route) => {
                events.push(route);
            });

            assert.isTrue(
                mockRouter.setRoute({
                    paths: [
                        'gallery',
                        'team',
                    ],
                }),
            );
            assert.lengthOf(events, 1);
            assert.isFalse(
                mockRouter.setRoute({
                    paths: [
                        'gallery',
                        'team',
                    ],
                }),
            );

            assert.lengthOf(events, 1);
        }),
    );

    it(
        'reads back button events',
        testRouter({}, async (mockRouter) => {
            const events: FullRoute[] = [];

            mockRouter.listen(false, (route) => {
                events.push(route);
            });

            assert.isTrue(
                mockRouter.setRoute({
                    paths: [
                        'about',
                    ],
                }),
            );
            assert.lengthOf(events, 1);
            globalThis.history.back();

            await waitUntil(() => {
                return events.length === 2;
            });
        }),
    );

    it(
        'reads back button events',
        testRouter({}, async (mockRouter) => {
            const events: FullRoute[] = [];

            mockRouter.listen(false, (route) => {
                events.push(route);
            });

            assert.isTrue(
                mockRouter.setRoute({
                    paths: [
                        'about',
                        'team',
                    ],
                }),
            );
            assert.lengthOf(events, 1);
            globalThis.history.back();

            await waitUntil(() => {
                return events.length === 2;
            });
        }),
    );

    it(
        'routes from setRouteOnDirectNavigation',
        testRouter({}, (mockRouter, hrefBefore) => {
            assert.isTrue(
                mockRouter.setRouteOnDirectNavigation(
                    {
                        paths: [
                            'about',
                            'team',
                        ],
                    },
                    {
                        altKey: false,
                        button: 0,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: false,
                        type: 'mousedown',
                        preventDefault() {},
                    },
                ),
            );

            assert.strictEqual(parseUrl(globalThis.location.href).fullPath, '/about/team');
            assert.notStrictEqual(hrefBefore, '/about/team');
        }),
    );

    it(
        'does not route from setRouteOnDirectNavigation on right click',
        testRouter({}, (mockRouter, hrefBefore) => {
            assert.isFalse(
                mockRouter.setRouteOnDirectNavigation(
                    {
                        paths: [
                            'about',
                        ],
                    },
                    {
                        altKey: false,
                        button: 1,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: false,
                        type: 'mousedown',
                        preventDefault() {},
                    },
                ),
            );

            assert.notStrictEqual(parseUrl(globalThis.location.href).fullPath, '/about/website');
            assert.strictEqual(globalThis.location.href, hrefBefore);
        }),
    );
});
