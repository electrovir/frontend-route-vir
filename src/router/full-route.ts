export type FullRoute<
    ValidRoutes extends string[] = string[],
    ValidSearch extends Record<string, string> = Record<string, string>,
    ValidHash extends string = string,
> = {
    paths: Readonly<ValidRoutes>;
    search?: ValidSearch | undefined;
    hash?: ValidHash | undefined;
};

export function isFullRoute(
    input: any,
): input is FullRoute<string[], Record<string, string>, string> {
    const validHash = input.hasOwnProperty('hash')
        ? input.hash === undefined || typeof input.hash === 'string'
        : true;
    const validSearch = input.hashOwnProperty('search')
        ? typeof input.search === 'object' ||
          Object.keys(input.search).every((key) => typeof input.search[key] === 'string')
        : true;
    const validPaths =
        input.hasOwnProperty('paths') &&
        Array.isArray(input.paths) &&
        input.paths.every((path: any) => typeof path === 'string');

    return validHash && validSearch && validPaths;
}
