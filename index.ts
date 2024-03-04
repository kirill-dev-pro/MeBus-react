import type { TypeC, TypeOf } from 'io-ts';
import { EventSchema, MeBus } from "mebus";
import { useEffect, useMemo } from "react";

/**
 * React hook for MeBus. Accepts event schema and event callbacks and returns a publish function.
 *
 * @param {EventSchema} eventSchema - The event schema object.
 * @param {Object} eventCallbacks - The event callbacks object.
 * @returns function to publish events.
 *
 * @example
 * const publish = useMessageBus({
 *  eventSchema: {
 *   event1: t.type({
 *    payload: t.string,
 *  }),
 *  eventCallbacks: {
 *    event1: (payload) => console.log(payload),
 *  },
 * });
 * publish("event1", { payload: "foo" });
 */
export const useMeBus = <T extends EventSchema>({
  eventSchema,
  eventCallbacks,
}: {
  eventSchema: T;
  eventCallbacks?: { [K in keyof T]?: (payload: TypeOf<T[K]>) => void | Promise<void> };
}) => {
  const bus = useMemo(() => new MeBus(eventSchema), [eventSchema]);

  useEffect(() => {
    if (!eventCallbacks) return;
    const cleanups = Object.keys(eventSchema).map((event) => {
      const callback = eventCallbacks[event];
      if (!callback) return null;
      const unsubscribe = bus.subscribe(event, callback);
      return unsubscribe;
    });

    return () => {
      cleanups.forEach((cleanup) => {
        if (!cleanup) return;
        cleanup();
      });
    };
  }, [eventSchema, bus, eventCallbacks]);

  const publish = <K extends keyof T & string>(
    event: K,
    payload: TypeOf<T[K]>
  ) => {
    bus.publish(event, payload);
  };

  return publish;
};
