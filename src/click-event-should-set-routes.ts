import {FullRoute, ValidHashBase, ValidRoutesBase, ValidSearchBase} from './router/full-route';
import {SpaRouter} from './router/spa-router';

/** 0 is left click and the default mouse button if none were read. */
const LeftClick = 0;

export function shouldMouseEventTriggerRoutes(mouseEvent: MouseEvent): boolean {
    /** Don't trigger route updates for anything other than a click event. */
    if (mouseEvent.type !== 'click') {
        return false;
    }
    /**
     * Do not trigger a route if a modifier key was held because the user was intending to do
     * something else, such as open the right click menu or open the link in a new tab.
     */
    if (mouseEvent.metaKey || mouseEvent.altKey || mouseEvent.ctrlKey || mouseEvent.shiftKey) {
        return false;
    }
    /** Only route on left click, or if no click button was read . */
    if (mouseEvent.button !== LeftClick) {
        return false;
    }

    return true;
}

export function routeOnLinkClick<
    ValidRoutes extends ValidRoutesBase = ValidRoutesBase,
    ValidSearch extends ValidSearchBase | undefined = ValidSearchBase | undefined,
    ValidHash extends ValidHashBase | undefined = ValidHashBase | undefined,
>(
    mouseEvent: MouseEvent,
    routes: Readonly<FullRoute<ValidRoutes, ValidSearch, ValidHash>>,
    router: SpaRouter<ValidRoutes, ValidSearch, ValidHash>,
) {
    if (shouldMouseEventTriggerRoutes(mouseEvent)) {
        mouseEvent.preventDefault();
        router.setRoutes(routes);
    }
}
