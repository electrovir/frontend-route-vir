import {awaitedForEach, getEnumTypedKeys, getEnumTypedValues} from '@augment-vir/common';
import {assert, fixture as renderFixture} from '@open-wc/testing';
import {html} from 'element-vir';
import {TestAppElement} from './elements/app.element';
import {NavElement} from './elements/nav.element';
import {clickElement} from './interactions';
import {defaultTestAppRoutes, MainRoute} from './test-router';

describe('routing', () => {
    async function renderApp() {
        const rendered = await renderFixture(
            html`
                <${TestAppElement}></${TestAppElement}>
            `,
        );
        assert.isTrue(TestAppElement.isStrictInstance(rendered));
        return rendered as (typeof TestAppElement)['instanceType'];
    }

    it('should render', async () => {
        await renderApp();
    });

    it('should default to home route', async () => {
        await renderApp();
        assert.strictEqual(window.location.pathname, '/' + defaultTestAppRoutes.paths.join('/'));
    });

    it('should change the route path when clicking nav buttons', async () => {
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
            assert.strictEqual(window.location.pathname, '/' + routeName);
        });
    });
});
