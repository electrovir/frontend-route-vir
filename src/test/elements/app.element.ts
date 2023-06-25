import {assign, css, defineElementNoInputs, html, listen} from 'element-vir';
import {defaultTestAppRoutes} from '../test-router';
import {NavElement} from './nav.element';

export const TestAppElement = defineElementNoInputs({
    tagName: 'vir-spa-router-test-app',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            padding: 32px;
        }

        ${NavElement} {
            margin-bottom: 16px;
        }
    `,
    stateInitStatic: {
        currentRoute: defaultTestAppRoutes,
    },
    renderCallback({state, updateState}) {
        return html`
            <${NavElement}
                ${assign(NavElement, {
                    currentRoute: state.currentRoute,
                })}
                ${listen(NavElement.events.routeChange, (event) => {
                    updateState({currentRoute: event.detail});
                })}
            ></${NavElement}>
            <div>
                <span>current main route path: ${state.currentRoute.paths[0]}</span>
            </div>
        `;
    },
});
