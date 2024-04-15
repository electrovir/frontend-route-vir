import {assert} from '@open-wc/testing';
import {
    consolidateGlobalUrlEvents,
    globalLocationChangeEventName,
} from './consolidate-global-url-events';

describe(consolidateGlobalUrlEvents.name, () => {
    it('emits locationchange events', () => {
        const events: Event[] = [];

        globalThis.addEventListener(globalLocationChangeEventName, (event) => events.push(event));

        globalThis.history.pushState(undefined, '', '/fake-path');
        globalThis.history.replaceState(undefined, '', '/fake-path-2');

        consolidateGlobalUrlEvents();

        globalThis.history.pushState(undefined, '', '/fake-path-3');
        globalThis.history.replaceState(undefined, '', '/fake-path-4');

        assert.lengthOf(events, 2);
    });
});
