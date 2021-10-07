import {getEnumTypedValues} from 'augment-vir';
import {defineFunctionalElement, ElementEvent, eventInit, html, onDomCreated} from 'element-vir';
import {RouteListener, routeOnLinkClick, SpaRouter} from '../../';
import {MainRoute, testRouter, TestRoutes} from '../test-router';

function routeClicked(
    clickEvent: MouseEvent,
    routes: Readonly<TestRoutes>,
    router: SpaRouter<TestRoutes>,
) {
    routeOnLinkClick(clickEvent, routes, router);
}

export const NavElement = defineFunctionalElement({
    tagName: 'vir-spa-nav',
    props: {
        router: testRouter,
        currentRoute: undefined as undefined | Readonly<TestRoutes>,
        routeListener: undefined as undefined | RouteListener<TestRoutes>,
    },
    events: {
        routeChange: eventInit<Readonly<TestRoutes>>(),
    },
    renderCallback: ({props, dispatchEvent, events}) => {
        return html`
            <nav
                ${onDomCreated(() => {
                    // the route listener is attached after the DOM has been created to make sure
                    // there's something to send events to.
                    if (!props.routeListener) {
                        props.routeListener = props.router.addRouteListener(true, (routes) => {
                            dispatchEvent(new ElementEvent(events.routeChange, routes));
                        });
                    }
                })}
            >
                ${getEnumTypedValues(MainRoute).map((mainRoute) => {
                    const routes: Readonly<TestRoutes> = [mainRoute];
                    const path = props.router.createRoutesUrl(routes);
                    const label = mainRoute;

                    return html`
                        <a
                            href=${path}
                            @click=${(clickEvent: MouseEvent) =>
                                routeClicked(clickEvent, routes, props.router)}
                        >
                            ${label}
                        </a>
                    `;
                })}
            </nav>
        `;
    },
});
