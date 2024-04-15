import {assert} from '@open-wc/testing';
import {SanitizationDepthMaxed} from './sanitization-depth-maxed.error';

describe(SanitizationDepthMaxed.name, () => {
    it('includes the class name as the error name', () => {
        const error = new SanitizationDepthMaxed('hi');
        assert.strictEqual(error.name, 'SanitizationDepthMaxed');
        assert.strictEqual(error.message, 'hi');
    });
});
