export type FullRoute<ValidRoutes extends string[]> = {
    paths: Readonly<ValidRoutes>;
    search?: URLSearchParams | undefined;
    hash?: string | undefined;
};

export function isFullRoute<ValidRoutes extends string[]>(
    input: any,
): input is FullRoute<ValidRoutes> {
    const validHash = input.hasOwnProperty('hash')
        ? input.hash === undefined || typeof input.hash === 'string'
        : true;
    const validSearch = input.hashOwnProperty('search')
        ? input.search instanceof URLSearchParams || input.search === undefined
        : true;
    const validPaths =
        input.hasOwnProperty('paths') &&
        Array.isArray(input.paths) &&
        input.paths.every((path: any) => typeof path === 'string');

    return validHash && validSearch && validPaths;
}
