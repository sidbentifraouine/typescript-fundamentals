// https://github.com/typescript-cheatsheets/react-typescript-cheatsheet

// import * as React from "react";
// import * as ReactDOM from "react-dom";

/**
 * In TypeScript 2.7+, you can run TypeScript with --allowSyntheticDefaultImports (or add "allowSyntheticDefaultImports": true to tsconfig) to import like in regular jsx:
 */

import React from "react";

/**
 * Explanation
 * Function Components
 * These can be written as normal functions that take a props argument and return a JSX element.
 */

type AppProps = { message: string }; /* could also use interface */
const App = ({ message }: AppProps) => <div>{message}</div>;

/**
 * useState
 * Type inference works very well most of the time:
 */

const [val, toggle] = React.useState(false); // `val` is inferred to be a boolean, `toggle` only takes booleans

/**See also the Using Inferred Types section if you need to use a complex type that you've relied on inference for.

*However, many hooks are initialized with null-ish default values, and you may wonder how to provide types. Explicitly declare the type, and use a union type:
*/

interface IUser {
  name: string;
}

const [user, setUser] = React.useState<IUser | null>(null);

// later...
setUser({ name: "John" });

/**
 * useRef
 * When using useRef, you have two options when creating a ref container that does not have an initial value:
 */

const ref1 = React.useRef<HTMLElement>(null!);
const ref2 = React.useRef<HTMLElement | null>(null);

/*
*The first option will make ref1.current read-only, and is intended to be passed in to built-in ref attributes that React will manage (because React handles setting the current value for you).

*The second option will make ref2.current mutable, and is intended for "instance variables" that you manage yourself.
*/

/**
 * useEffect
 * When using useEffect, take care not to return anything other than a function or undefined, otherwise both TypeScript and React will yell at you. This can be subtle when using arrow functions:
 */

function DelayedEffect(props: { timerMs: number }) {
  const { timerMs } = props;
  // bad! setTimeout implicitly returns a number because the arrow function body isn't wrapped in curly braces
  React.useEffect(
    () =>
      setTimeout(() => {
        /* do stuff */
      }, timerMs),
    [timerMs]
  );
  return null;
}

/**
 * useRef
 */

function TextInputWithFocusButton() {
  // initialise with null, but tell TypeScript we are looking for an HTMLInputElement
  const inputEl = React.useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    // strict null checks need us to check if inputEl and current exist.
    // but once current exists, it is of type HTMLInputElement, thus it
    // has the method focus! ✅
    if (inputEl && inputEl.current) {
      inputEl.current.focus();
    }
  };
  return (
    <>
      {/* in addition, inputEl only can be used with input elements. Yay! */}
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}

/**
 * useReducer
 * You can use Discriminated Unions for reducer actions. Don't forget to define the return type of reducer, otherwise Typescript will infer it.
 */

type AppState = {};
type Action =
  | { type: "SET_ONE"; payload: string }
  | { type: "SET_TWO"; payload: number };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_ONE":
      return {
        ...state,
        one: action.payload, // `payload` is string
      };
    case "SET_TWO":
      return {
        ...state,
        two: action.payload, // `payload` is number
      };
    default:
      return state;
  }
}

/**
 * Custom Hooks
 * If you are returning an array in your Custom Hook, you will want to avoid type inference as Typescript will infer a union type (when you actually want different types in each position of the array). Instead, use TS 3.4 const assertions:
 */

export function useLoading() {
  const [isLoading, setState] = React.useState(false);
  const load = (aPromise: Promise<any>) => {
    setState(true);
    return aPromise.finally(() => setState(false));
  };
  return [isLoading, load] as const; // infers [boolean, typeof load] instead of (boolean | typeof load)[]
}
