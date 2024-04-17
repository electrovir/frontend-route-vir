import {Overwrite} from '@augment-vir/common';
import {defineShape, or} from 'object-shape-tester';
import {FullRoute, ValidHashBase, ValidPathsBase, ValidSearchBase} from './full-route';

/**
 * A function that sanitizes a route, ensuring that the raw input matches the type safety of a
 * specific `SpaRouter` implementation.
 *
 * @category Types
 */
export type RouteSanitizer<
    ValidPaths extends ValidPathsBase = ValidPathsBase,
    ValidSearch extends ValidSearchBase | undefined = undefined,
    ValidHash extends ValidHashBase | undefined = undefined,
> = (
    rawRoute: Readonly<Required<FullRoute>>,
) => Readonly<Required<FullRoute<ValidPaths, ValidSearch, ValidHash>>>;

/**
 * Used to verify if an object is a valid `SpaRouterParams` instance.
 *
 * @category Types
 */
export const spaRouterParamsShape = defineShape({
    /**
     * This can used to provide a base route for the router to consider the root of your SPA. This
     * must NOT also be a part of your route's valid paths array.
     *
     * Example: in GitHub Pages, the root of each page is a relative path:
     * `<user>.github.io/<repo-name>`. To make this router work in GitHub pages as well as local
     * development, use the `<repo-name>` part as your `basePath`.
     *
     * Concrete example: in `electrovir.github.io/threejs-experiments`, `threejs-experiments` is the
     * `basePath`.
     *
     * @default `''`
     */
    basePath: or('', undefined),
    /**
     * Use this to rewrite a route before it makes it to your application. This is necessary to
     * ensure that the types for your route is maintained.
     */
    sanitizeRoute: ((route) => route) as RouteSanitizer,
    /**
     * Used mostly for debugging purposes to prevent yourself from accidentally adding tons of event
     * listeners. When left undefined or set to zero, this property isn't used at all and there is
     * no maximum listener count. When set to a truthy number, the maximum comes into effect.
     *
     * @default 1
     */
    maxListenerCount: or(1, undefined),
    /** Set to `true` to turn off warning logs. */
    disableWarnings: or(undefined, false),
    /**
     * Set this to `true` to disable the router without destroying it. Use this if you have multiple
     * routers to ensure you only have one running at a time.
     */
    isPaused: or(false, undefined),
});

/**
 * Construction params for `SpaRouter`.
 *
 * @category Types
 */
export type SpaRouterParams<
    ValidPaths extends ValidPathsBase = ValidPathsBase,
    ValidSearch extends ValidSearchBase | undefined = undefined,
    ValidHash extends ValidHashBase | undefined = undefined,
> = Overwrite<
    {
        [Prop in keyof typeof spaRouterParamsShape.runTimeType as undefined extends (typeof spaRouterParamsShape.runTimeType)[Prop]
            ? never
            : Prop]: (typeof spaRouterParamsShape.runTimeType)[Prop];
    } & {
        [Prop in keyof typeof spaRouterParamsShape.runTimeType as undefined extends (typeof spaRouterParamsShape.runTimeType)[Prop]
            ? Prop
            : never]?: (typeof spaRouterParamsShape.runTimeType)[Prop];
    },
    {
        /**
         * Use this to rewrite a route before it makes it to your application. This is necessary to
         * ensure that the types for your route is maintained.
         */
        sanitizeRoute: RouteSanitizer<ValidPaths, ValidSearch, ValidHash>;
    }
>;
