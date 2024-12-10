import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {GlobalUrlEventsConsolidationError} from './consolidation.error.js';

describe(GlobalUrlEventsConsolidationError.name, () => {
    it('includes the class name as the error name', () => {
        const error = new GlobalUrlEventsConsolidationError('hi');
        assert.strictEquals(error.name, 'GlobalUrlEventsConsolidationError');
        assert.strictEquals(error.message, 'hi');
    });
});
