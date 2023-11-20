import {getEnumTypedValues, randomString} from '@augment-vir/common';
import {defineElement, defineElementEvent, html} from 'element-vir';
import {RouteListener, routeOnLinkClick} from '../../';
import {areRoutesEqual} from '../../router/route-equality';
import {FullTestAppRoute, MainRoute, TestAppRoutePaths, testRouter} from '../test-router';

function routeClicked(
    clickEvent: MouseEvent,
    routes: Readonly<FullTestAppRoute>,
    router: typeof testRouter,
) {
    routeOnLinkClick(clickEvent, routes, router);
}

export const NavElement = defineElement<{currentRoute: FullTestAppRoute}>()({
    tagName: 'vir-spa-nav',
    stateInitStatic: {
        router: testRouter,
        routeListener: undefined as undefined | RouteListener<TestAppRoutePaths>,
    },
    events: {
        routeChange: defineElementEvent<FullTestAppRoute>(),
    },
    initCallback({state, dispatch, events}) {
        state.router.addRouteListener(true, (fullRoute) => {
            dispatch(new events.routeChange(fullRoute));
        });
    },
    renderCallback({state, inputs}) {
        if (!areRoutesEqual(inputs.currentRoute, state.router.getCurrentRawRoutes())) {
            state.router.setRoutes(inputs.currentRoute);
        }

        return html`
            <nav>
                ${getEnumTypedValues(MainRoute).map((mainRoute) => {
                    const linkRoute: FullTestAppRoute = {paths: [mainRoute]};
                    const path = state.router.createRoutesUrl(linkRoute);
                    const label = mainRoute;

                    return html`
                        <a
                            href=${path}
                            data-route-name=${mainRoute}
                            @click=${(clickEvent: MouseEvent) =>
                                routeClicked(clickEvent, linkRoute, state.router)}
                        >
                            ${label}
                        </a>
                    `;
                })}

                <button
                    @click=${() => {
                        state.router.setRoutes({
                            hash: randomString(3),
                        });
                    }}
                >
                    add hash
                </button>
                <button
                    class="add-encoded-character"
                    @click=${() => {
                        state.router.setRoutes({
                            search: {key: '%23'},
                        });
                    }}
                >
                    add encoded character
                </button>
                <button
                    @click=${() => {
                        state.router.setRoutes({
                            search: {[randomString(3)]: randomString(3)},
                        });
                    }}
                >
                    add search
                </button>
            </nav>
        `;
    },
});
