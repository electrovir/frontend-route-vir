import {itCases} from '@augment-vir/browser-testing';
import {createPathString} from './set-route';

describe(createPathString.name, () => {
    itCases(createPathString, [
        {
            it: 'does not encode characters',
            inputs: [
                {
                    paths: [
                        'hi',
                        'there',
                    ],
                    hash: undefined,
                    search: {thing1: ['a,b,c']},
                },
                '',
            ],
            expect: '/hi/there?thing1=a,b,c',
        },
        {
            it: 'excludes search if there is none',
            inputs: [
                {
                    paths: [
                        'hi',
                        'there',
                    ],
                    hash: undefined,
                    search: undefined,
                },
                '',
            ],
            expect: '/hi/there',
        },
    ]);
});
