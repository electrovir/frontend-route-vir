export class SpaRouterError extends Error {
    public name = 'SpaRouterError';
    constructor(message: string) {
        super(message);
    }
}
