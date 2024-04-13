import {WindowEventConsolidationError} from './errors/consolidation.error';

export const routeChangeEventName = 'locationchange' as const;

declare global {
    var SPA_ROUTER_VIR_HISTORY_EVENTS_CONSOLIDATED_ALREADY: boolean;
}

globalThis.SPA_ROUTER_VIR_HISTORY_EVENTS_CONSOLIDATED_ALREADY = false;

const originalPushState = globalThis.history.pushState;
function newPushState(...args: any) {
    const originalResult = originalPushState.apply(globalThis.history, args);
    globalThis.dispatchEvent(new Event(routeChangeEventName));
    return originalResult;
}

const originalReplaceState = globalThis.history.replaceState;
function newReplaceState(...args: any) {
    const originalResult = originalReplaceState.apply(globalThis.history, args);
    globalThis.dispatchEvent(new Event(routeChangeEventName));
    return originalResult;
}

// consolidate url changes to RouteChangeEventName events
export function consolidateWindowEvents() {
    // this should only ever be executed once
    if (globalThis.SPA_ROUTER_VIR_HISTORY_EVENTS_CONSOLIDATED_ALREADY) {
        return;
    }
    if (globalThis.history.pushState === newPushState) {
        throw new WindowEventConsolidationError(
            `The consolidation module thinks that window events have not been consolidated yet but globalThis.history.pushState has already been overridden. Does this module have two copies in your repo?`,
        );
    }
    if (globalThis.history.replaceState === newReplaceState) {
        throw new WindowEventConsolidationError(
            `The consolidation module thinks that window events have not been consolidated yet but globalThis.history.replaceState has already been overridden. Does this module have two copies in your repo?`,
        );
    }
    globalThis.SPA_ROUTER_VIR_HISTORY_EVENTS_CONSOLIDATED_ALREADY = true;

    globalThis.history.pushState = newPushState;
    globalThis.history.replaceState = newReplaceState;

    globalThis.addEventListener('popstate', () => {
        globalThis.dispatchEvent(new Event(routeChangeEventName));
    });
}
