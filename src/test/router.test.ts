import {
    awaitedForEach,
    getEnumTypedKeys,
    getEnumTypedValues,
    waitUntilTruthy,
} from '@augment-vir/common';
import {assert, fixture as renderFixture} from '@open-wc/testing';
import {html} from 'element-vir';
import {assertInstanceOf} from 'run-time-assertions';
import {TestAppElement} from './elements/app.element';
import {NavElement} from './elements/nav.element';
import {clickElement} from './interactions';
import {MainRoute, defaultTestAppRoutes} from './test-router';

describe('routing', () => {
    async function renderApp() {
        const rendered = await renderFixture(html`
            <${TestAppElement}></${TestAppElement}>
        `);
        assertInstanceOf(rendered, TestAppElement);
        assert.strictEqual(
            globalThis.location.pathname,
            '/' + defaultTestAppRoutes.paths.join('/'),
        );
        return rendered;
    }

    it('renders to default route', async () => {
        await renderApp();
    });

    it('changes the route path when clicking nav buttons', async () => {
        const app = await renderApp();
        const links = Array.from(
            app.shadowRoot!.querySelector(NavElement.tagName)!.shadowRoot!.querySelectorAll('a'),
        );
        assert.strictEqual(links.length, getEnumTypedKeys(MainRoute).length);
        await awaitedForEach(links, async (linkElement) => {
            const routeName = linkElement.getAttribute('data-route-name');
            assert.isDefined(routeName);
            assert.isNotEmpty(routeName);
            assert.include(getEnumTypedValues(MainRoute), routeName);
            await clickElement(linkElement);
            assert.strictEqual(globalThis.location.pathname, '/' + routeName);
        });
    });

    it('does not decode values', async () => {
        const app = await renderApp();

        const addEncodedCharacterButton = app
            .shadowRoot!.querySelector(NavElement.tagName)!
            .shadowRoot!.querySelector('.add-encoded-character');

        assertInstanceOf(addEncodedCharacterButton, HTMLButtonElement);

        await clickElement(addEncodedCharacterButton);

        await waitUntilTruthy(
            () => {
                return globalThis.location.search === '?key=%23';
            },
            undefined,
            {
                timeout: {milliseconds: 1000},
            },
        );
    });
});
