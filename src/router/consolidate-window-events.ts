import {WindowEventConsolidationError} from './errors/consolidation.error';
export const RouteChangeEventName = 'locationchange' as const;

// this should only ever be executed once
let consolidatedAlready = false;

const originalPushState = window.history.pushState;
function newPushState(...args: any) {
    const originalResult = originalPushState.apply(window.history, args);
    window.dispatchEvent(new Event(RouteChangeEventName));
    return originalResult;
}

const originalReplaceState = window.history.replaceState;
function newReplaceState(...args: any) {
    const originalResult = originalReplaceState.apply(window.history, args);
    window.dispatchEvent(new Event(RouteChangeEventName));
    return originalResult;
}

// consolidate url changes to RouteChangeEventName events
export function consolidateWindowEvents() {
    if (consolidatedAlready) {
        return;
    }
    if (window.history.pushState === newPushState) {
        throw new WindowEventConsolidationError(
            `The consolidation module thinks that window events have not been consolidated yet but window.history.pushState has already been overridden. Does this module have two copies in your repo?`,
        );
    }
    if (window.history.replaceState === newReplaceState) {
        throw new WindowEventConsolidationError(
            `The consolidation module thinks that window events have not been consolidated yet but window.history.replaceState has already been overridden. Does this module have two copies in your repo?`,
        );
    }
    consolidatedAlready = true;

    window.history.pushState = newPushState;
    window.history.replaceState = newReplaceState;

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event(RouteChangeEventName));
    });
}
