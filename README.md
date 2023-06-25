# spa-router-vir

The heroic, simple, frontend router for single page applications.

# Install

Install via npm:

```bash
npm i spa-router-vir
```

# Examples

-   The [GitHub repo for this package](https://github.com/electrovir/spa-router-vir) contains [an example](https://github.com/electrovir/spa-router-vir/tree/main/src/test) which can be tested using `npm start`.
-   My [`threejs-experiments` repo](https://github.com/electrovir/threejs-experiments) utilizes this package.

# Creating a router

First you must create an instance of your router. Only create one of these at a time or super wacky things will probably happen. This is the most basic setup for a router without any option parameter:

<!-- example-link: src/readme-examples/router-creation.example.ts -->

```TypeScript
import {createSpaRouter} from 'spa-router-vir';

export const superBasicRouter = createSpaRouter();
```

## Route sanitizing

A `routeSanitizer` property is available for sanitizing routes before they make it to your application. Use it like so:

<!-- example-link: src/readme-examples/route-sanitizer.example.ts -->

```TypeScript
import {createSpaRouter} from 'spa-router-vir';

export const routerWithRouteBase = createSpaRouter({
    routeSanitizer: (rawRoutes) => {
        return {
            ...rawRoutes,
            paths: rawRoutes.paths.filter((route) => !!route),
        };
    },
});
```

This callback will be called when routes are updated but before any of your listeners are fired. If the callback's returned routes different from the current routes, the current routes are updated to match. Automatic infinite-sanitizing-loops prevention is included (the max depth is 2).

## With type parameters

Supply type information to make your routes more type safe. Make sure to supply a sanitizer that forces the routes to follow whatever your given type is.

<!-- example-link: src/test/test-router.ts -->

```TypeScript
import {isEnumValue} from '@augment-vir/common';
import type {FullRoute} from 'spa-router-vir';
import {createSpaRouter} from 'spa-router-vir';

export enum MainRoute {
    Home = 'home',
    Page1 = 'page1',
    Page2 = 'page2',
    About = 'about',
}

export type TestAppRoutePaths = [MainRoute] | [MainRoute, string];

export type FullTestAppRoute = Readonly<FullRoute<TestAppRoutePaths>>;

export const defaultTestAppRoutes: FullTestAppRoute = {
    paths: [
        MainRoute.Home,
        'main',
    ],
    hash: undefined,
    search: undefined,
};

export const testRouter = createSpaRouter<TestAppRoutePaths>({
    routeBase: 'spa-router-vir',
    routeSanitizer: (fullRoute) => {
        if (!fullRoute.paths.length) {
            return {...fullRoute, paths: defaultTestAppRoutes.paths};
        }

        const mainRoute = fullRoute.paths[0];
        if (!isEnumValue(mainRoute, MainRoute)) {
            return {...fullRoute, paths: defaultTestAppRoutes.paths};
        }

        const secondaryRoute = fullRoute.paths[1];
        const sanitizedRoutes: TestAppRoutePaths =
            typeof secondaryRoute === 'string'
                ? [
                      mainRoute,
                      secondaryRoute,
                  ]
                : [mainRoute];

        // restrict hash string length to 3 (excluding the # symbol
        const sanitizedHash: string | undefined =
            fullRoute.hash?.replace(/^#/, '').length === 3 ? fullRoute.hash : undefined;

        // restrict search object key and value lengths to 3
        const sanitizedSearch = Object.keys(fullRoute.search || {}).every(
            (key) => key.length === 3 && fullRoute.search?.[key]?.length === 3,
        )
            ? fullRoute.search
            : undefined;

        const sanitizedRoute = {
            search: sanitizedSearch,
            hash: sanitizedHash,
            paths: sanitizedRoutes,
        };

        return sanitizedRoute;
    },
});
```

## Supporting SPAs on GitHub Pages

To use a SPA and this router on GitHub Pages, you must supply a `routeBase` property to `createSpaRouter`. This ensures that your GitHub Pages repo path is maintained:

<!-- example-link: src/readme-examples/route-base.example.ts -->

```TypeScript
import {createSpaRouter} from 'spa-router-vir';

export const routerWithRouteBase = createSpaRouter({routeBase: 'spa-router-vir'});
```

You can see this in action in my [`threejs-experiments`](https://electrovir.github.io/threejs-experiments/home) page. Notice that `github.io/threejs-experiments` being at the beginning of the URL path does not affect the router.

In addition to setting the router up, to get a SPA to work on GitHub Pages you need to copy paste your `index.html` and rename the copy to `404.html` in the top-level of your GitHub Pages deployed directory. In my `threejs-experiments` repo I do that [as part of the deploy pipeline script](https://github.com/electrovir/threejs-experiments/blob/673be54beec6ce86f297841e863e4523f531b2ab/package.json#L17).

# Using a router

## Listening to route changes

Use `addRouteListener` to add router listeners. When `true`, the first parameter, `fireImmediately`, will force your router to immediately call the given listener callback. This prevents the need to manually call your own callback to update route-specific content on page load.

<!-- example-link: src/readme-examples/listen-to-routes.example.ts -->

```TypeScript
import {superBasicRouter} from './router-creation.example';

superBasicRouter.addRouteListener(true, (routes) => {
    console.log(routes);
});
```

Listeners can be removed with the `removeRouteListener()` method. Make sure to pass in the return value of `addRouteListener()` as the listener to remove.

## Creating a URL for links

To create a URL with a given array of routes, use the `createRoutesUrl()` method. This will create a URL that takes `routeBase` into account, if it's provided, so you don't have to manually handle that yourself.

<!-- example-link: src/readme-examples/create-route-url.example.ts -->

```TypeScript
import {superBasicRouter} from './router-creation.example';

document.getElementsByTagName('a')[0]!.href = superBasicRouter.createRoutesUrl({
    paths: [
        'page1',
        'sub-page',
    ],
});
```
