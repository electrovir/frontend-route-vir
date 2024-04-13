export type ValidRoutesBase = string[];
export type ValidSearchBase = Record<string, string[]>;
export type ValidHashBase = string;

export type FullRoute<
    ValidRoutes extends ValidRoutesBase = ValidRoutesBase,
    ValidSearch extends ValidSearchBase | undefined = ValidSearchBase | undefined,
    ValidHash extends ValidHashBase | undefined = ValidHashBase | undefined,
> = {
    paths: Readonly<ValidRoutes>;
    search?: ValidSearch;
    hash?: ValidHash;
};

export function isFullRoute(input: any): input is FullRoute {
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
