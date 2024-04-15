/**
 * Any error intentionally thrown from `SpaRouter` methods is of this type.
 *
 * @category Errors
 */
export class SpaRouterError extends Error {
    public override name = 'SpaRouterError';
}
