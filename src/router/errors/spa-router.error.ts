export class SpaRouterError extends Error {
    public override name = 'SpaRouterError';
    constructor(message: string) {
        super(message);
    }
}
