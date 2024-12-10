import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {
    consolidateGlobalUrlEvents,
    globalLocationChangeEventName,
} from './consolidate-global-url-events.js';

describe(consolidateGlobalUrlEvents.name, () => {
    it('emits locationchange events', () => {
        const events: Event[] = [];

        globalThis.addEventListener(globalLocationChangeEventName, (event) => events.push(event));

        globalThis.history.pushState(undefined, '', '/fake-path');
        globalThis.history.replaceState(undefined, '', '/fake-path-2');

        consolidateGlobalUrlEvents();

        globalThis.history.pushState(undefined, '', '/fake-path-3');
        globalThis.history.replaceState(undefined, '', '/fake-path-4');

        assert.isLengthExactly(events, 2);
    });
});
