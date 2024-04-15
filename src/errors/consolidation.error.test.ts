import {assert} from '@open-wc/testing';
import {GlobalUrlEventsConsolidationError} from './consolidation.error';

describe(GlobalUrlEventsConsolidationError.name, () => {
    it('includes the class name as the error name', () => {
        const error = new GlobalUrlEventsConsolidationError('hi');
        assert.strictEqual(error.name, 'GlobalUrlEventsConsolidationError');
        assert.strictEqual(error.message, 'hi');
    });
});
