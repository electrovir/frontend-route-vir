import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {SanitizationDepthMaxed} from './sanitization-depth-maxed.error.js';

describe(SanitizationDepthMaxed.name, () => {
    it('includes the class name as the error name', () => {
        const error = new SanitizationDepthMaxed('hi');
        assert.strictEquals(error.name, 'SanitizationDepthMaxed');
        assert.strictEquals(error.message, 'hi');
    });
});
