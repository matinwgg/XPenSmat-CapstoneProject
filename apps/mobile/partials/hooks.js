import React from "react";

/**
 * Bind a component to a set of props.
 *
 * `useComponent(Component, props)` returns a component that always renders
 * `Component` with `props` merged with whatever it is rendered with. The
 * helper is used by the calendar wrapper to inject layout configuration.
 */
export function useComponent(Component, props = {}) {
  return function BoundComponent(extraProps = {}) {
    return React.createElement(Component, { ...props, ...extraProps });
  };
}

export default useComponent;
