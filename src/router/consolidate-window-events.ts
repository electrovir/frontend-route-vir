import {WindowEventConsolidationError} from './errors/consolidation.error';
export const RouteChangeEventName = 'locationchange' as const;

// this should only ever be executed once
let consolidatedAlready = false;

const originalPushState = globalThis.history.pushState;
function newPushState(...args: any) {
    const originalResult = originalPushState.apply(globalThis.history, args);
    globalThis.dispatchEvent(new Event(RouteChangeEventName));
    return originalResult;
}

const originalReplaceState = globalThis.history.replaceState;
function newReplaceState(...args: any) {
    const originalResult = originalReplaceState.apply(globalThis.history, args);
    globalThis.dispatchEvent(new Event(RouteChangeEventName));
    return originalResult;
}

// consolidate url changes to RouteChangeEventName events
export function consolidateWindowEvents() {
    if (consolidatedAlready) {
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
    consolidatedAlready = true;

    globalThis.history.pushState = newPushState;
    globalThis.history.replaceState = newReplaceState;

    globalThis.addEventListener('popstate', () => {
        globalThis.dispatchEvent(new Event(RouteChangeEventName));
    });
}
