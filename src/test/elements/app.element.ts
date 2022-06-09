import {css, defineFunctionalElement, html, listen} from 'element-vir';
import {NavElement} from './nav.element';

export const TestAppElement = defineFunctionalElement({
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
    props: {
        currentRoute: '',
    },
    renderCallback: ({props, setProps}) => {
        return html`
            <${NavElement}
                ${listen(NavElement.events.routeChange, (event) => {
                    setProps({currentRoute: event.detail.join('/')});
                })}
            ></${NavElement}>
            <div>
                <span>currentRoute: ${props.currentRoute}</span>
            </div>
        `;
    },
});
