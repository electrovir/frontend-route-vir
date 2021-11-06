export function urlSearchParamsToObject(searchParams: URLSearchParams): Record<string, string> {
    return Array.from(searchParams.entries()).reduce((accum: Record<string, string>, tuple) => {
        accum[tuple[0]] = tuple[1];
        return accum;
    }, {});
}

export function objectToUrlSearchParams(input: Record<string, string>): URLSearchParams {
    const searchParamsString = Object.entries(input).reduce((accum: string, entry) => {
        const newString = `${entry[0]}=${entry[1]}`;
        return `${accum}&${newString}`;
    }, '');
    return new URLSearchParams(searchParamsString);
}
