import browser from "webextension-polyfill";
import type { Endpoint } from "comlink";
import { tinyassert } from "@hiogawa/utils";
import * as comlink from "comlink";
import * as superjson from "superjson";

// cf. https://github.com/GoogleChromeLabs/comlink/blob/dffe9050f63b1b39f30213adeb1dd4b9ed7d2594/src/node-adapter.ts#L24

// TODO: `browser.Runtime.Port` doesn't support "transfer" thus callback proxy is not possible
//        https://github.com/GoogleChromeLabs/comlink/blob/dffe9050f63b1b39f30213adeb1dd4b9ed7d2594/src/comlink.ts#L209

export function createComlinkEndpoint(port: browser.Runtime.Port): Endpoint {
  const listerMap = new WeakMap<object, any>();

  return {
    postMessage: (message: any, transfer?: Transferable[]) => {
      tinyassert((transfer ?? []).length === 0);
      message = superjson.stringify(message); // support sending e.g. Date
      port.postMessage(message);
    },

    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
      _options?: {}
    ) => {
      tinyassert(type === "message");
      const wrapper = (message: any, _port: browser.Runtime.Port) => {
        message = superjson.parse(message);
        const comlinkEvent = { data: message } as MessageEvent;
        if ("handleEvent" in listener) {
          listener.handleEvent(comlinkEvent);
        } else {
          listener(comlinkEvent);
        }
      };
      port.onMessage.addListener(wrapper);
      listerMap.set(listener, wrapper);
    },

    removeEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
      _options?: {}
    ) => {
      tinyassert(type === "message");
      const wrapper = listerMap.get(listener);
      if (wrapper) {
        port.onMessage.removeListener(wrapper);
        listerMap.delete(listener);
      }
    },
  };
}

export function createComlinkProxy<T>(portName: string): comlink.Remote<T> {
  const port = browser.runtime.connect({ name: portName });
  const endpoint = createComlinkEndpoint(port);
  const proxy = comlink.wrap<T>(endpoint);
  return proxy;
}

export function exposeComlinkService(portName: string, service: unknown) {
  const handler = (port: browser.Runtime.Port) => {
    if (port.name === portName) {
      comlink.expose(service, createComlinkEndpoint(port));
      return;
    }
  };
  browser.runtime.onConnect.addListener(handler);
  return () => {
    browser.runtime.onConnect.removeListener(handler);
  };
}
