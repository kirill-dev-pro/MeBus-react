# MeBus-React

## Description

React hook for MeBus. MeBus is a type-safe wrapper around the browser's native `MessageEvent` API.

This package has 3 dependencies:
- `io-ts` for event schema validation
- `mebus` for the core functionality
- `react` for the react hook

## Installation

```bash
npm install mebus-react
```

## Example

```jsx
import { useMeBus } from 'mebus-react';
import { useState } from "react";
import * as t from "io-ts";

const myEventSchema = {
  increaseCounter: t.type({ number: t.number }),
};

const Counter = () => {
  const [count, setCount] = useState(0);

  useMeBus({
    eventSchema: myEventSchema,
    eventCallbacks: {
      increaseCounter: (payload) => {
        setCount((count) => count + payload.number);
      },
    },
  });

  return <div>count is {count}</div>;
};

function App() {
  const publish = useMeBus({ eventSchema: myEventSchema });

  return (
    <button onClick={() => publish("increaseCounter", { number: 1 })}>
      <Counter />
    </button>
  );
}
```

## API

### `useMeBus`

```tsx
function useMeBus<T extends MeBusEventSchema>(options: {
  eventSchema: T;
  eventCallbacks?: MeBusEventCallbacks<T>;
}): MeBusPublish<T>;
```

- `eventSchema`: The event schema to use for the MeBus instance.

- `eventCallbacks`: An object with event names as keys and event handlers as values. The event handlers are called when a message is received with the corresponding event name.

- Returns a `publish` function that can be used to send messages to other MeBus instances.

## License

MIT



