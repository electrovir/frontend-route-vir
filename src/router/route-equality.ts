export function areRoutesEqual(a: Readonly<string[]>, b: Readonly<string[]>): boolean {
    if (a.length !== b.length) {
        return false;
    }

    return a.every((entryA, index) => b[index] === entryA);
}
