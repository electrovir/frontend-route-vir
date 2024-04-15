import {itCases} from '@augment-vir/browser-testing';
import {assertTypeOf} from 'run-time-assertions';
import {FullRoute, ValidHashBase, ValidPathsBase, ValidSearchBase, isFullRoute} from './full-route';
import {MockValidPaths} from './spa-router.mock';

describe('ValidPathsBase', () => {
    it('matches more specific sub types', () => {
        assertTypeOf<['hello there']>().toBeAssignableTo<ValidPathsBase>();
        assertTypeOf<[]>().toBeAssignableTo<ValidPathsBase>();
    });

    it('only allows strings', () => {
        assertTypeOf<[number]>().not.toBeAssignableTo<ValidPathsBase>();
        assertTypeOf<[symbol]>().not.toBeAssignableTo<ValidPathsBase>();
    });
});

describe('ValidSearchBase', () => {
    it('matches more specific sub types', () => {
        assertTypeOf<{
            singleValue: [string];
        }>().toBeAssignableTo<ValidSearchBase>();
        assertTypeOf<{
            multiValue: string[];
        }>().toBeAssignableTo<ValidSearchBase>();
    });

    it('blocks individual string values', () => {
        assertTypeOf<{
            singleValue: string;
        }>().not.toBeAssignableTo<ValidSearchBase>();
    });
});

describe('ValidHashBase', () => {
    it('matches more specific sub types', () => {
        assertTypeOf<`hello=there`>().toBeAssignableTo<ValidHashBase>();
    });

    it('only allows strings', () => {
        assertTypeOf<number>().not.toBeAssignableTo<ValidHashBase>();
        assertTypeOf<symbol>().not.toBeAssignableTo<ValidHashBase>();
    });
});

describe('FullRoute', () => {
    it('restricts a route to its type parameters', () => {
        assertTypeOf<{
            paths: ['home'];
        }>().toBeAssignableTo<FullRoute<MockValidPaths, undefined, undefined>>();
        assertTypeOf<{
            paths: ['home'];
            search: {
                notAllowedKey: ['not allowed value'];
            };
        }>().not.toBeAssignableTo<FullRoute<MockValidPaths, undefined, undefined>>();
        assertTypeOf<{
            paths: ['home'];
            hash: 'derp';
        }>().not.toBeAssignableTo<FullRoute<MockValidPaths, undefined, undefined>>();
    });
});

describe(isFullRoute.name, () => {
    itCases(isFullRoute, [
        {
            it: 'accepts a minimal FullRoute',
            input: {
                paths: ['hi'],
            },
            expect: true,
        },
        {
            it: 'accepts a full FullRoute',
            input: {
                paths: ['hi'],
                search: {hi: ['hi']},
                hash: 'hi',
            },
            expect: true,
        },
        {
            it: 'rejects search with just a string value',
            input: {
                paths: ['hi'],
                search: {hi: 'hi'},
            },
            expect: false,
        },
        {
            it: 'rejects string search',
            input: {
                paths: ['hi'],
                search: 'hi',
            },
            expect: false,
        },
        {
            it: 'rejects numeric search',
            input: {
                paths: ['hi'],
                search: {hi: [32]},
            },
            expect: false,
        },
        {
            it: 'rejects missing paths',
            input: {
                search: {hi: ['hi']},
                hash: 'hi',
            },
            expect: false,
        },
        {
            it: 'rejects numeric paths',
            input: {
                paths: [5],
                search: {hi: ['hi']},
                hash: 'hi',
            },
            expect: false,
        },
    ]);
});
