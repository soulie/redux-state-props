# State Props connector for Redux store

**stateProps** is as a *Higher-order Component* to insert state
as `props` into [Statless React Components](//facebook.github.io/react/docs/reusable-components.html#stateless-functions)
in a declarative way (see [stateProps](//npmjs.org/package/state-props) for more info).

This package extends **stateProps** to use **redux** as a store.

## Usage
```
import {render} from 'react-dom';
import {createStore} from 'redux';
import {createReducer,Enhancer,Provider} from 'redux-state-props';

var reducer = createReducer();
var store = createStore(reducer,Enhancer(reducer));

ReactDOM.render(
  <Provider store={store}>
    <RootComponent />
  </Provider>,
  rootElement
);
```
While a possible `RootComponent` could be this simple counter:
```
import {stateProps} from 'redux-state-props';

const initialState = {
  counter = 0;
};

const mutations = {
  increment: () => state => ({counter:state.counter+1}),
  reset: () => state => ({counter:0})
};

const componentView = ({state,increment,reset}) => ({
  <div>
    Counter: {state.counter}
    <button onClick={increment}>Increment</button>
    <button onClick={reset}>Reset</button>
  </div>
});

const RootComponent = stateProps(initialState,mutations)(componentView);
```
Where `componentView` is a [stateless react component](//facebook.github.io/react/docs/reusable-components.html#stateless-functions) (React v0.14+).

## Package components
This package offers the following utilities to connect **stateProps** to a redux
store:
* **createReducer():** Returns a dynamic **Reducer**, to which **stateProps** components can be mounted.
* **Enhancer:** Enhancer for [createStore](//github.com/rackt/redux/blob/master/docs/api/createStore.md). Enables a redux store to mount components on the reducer above.
* **Provider:** A component that puts in *context* the **redux store**.
* **stateProps():** Higher-order component, just like the original [stateProps](//npmjs.org/package/state-props), but automatically using the **redux store** in *context*.

## createReducer

The `createReducer` function generates a *dynamic reducer function*. It is a regular reducer (see [redux](//http://rackt.org/redux)) that follows the convention of returning the same `state` object as received as first argument if there are no changes. It can either be used directly as the reducer for [redux](//http://rackt.org/redux/) or passed to [`combineReducers`](http://rackt.org/redux/docs/api/combineReducers.html) as a sub-reducer.

On creation, the reducer created by this function simply returns the `state` it is passed, unchanged. When new components under `Provider` that have [`stateProps`](//npmjs.com/package/state-props) are *mounted*, the reducer is modified to accommodate the state of the new component's state.

## Enhancer
An **enhancer** is a function that expands the **store** created by redux's `createStore`. This enhancer allows components to mount their *state props* into the *dynamic reducer* created by the function above.

## Provider
For the `stateProps` components to use the *dynamic reducer*, the components need the **store** in *context*. For this, it is enough to add a top-level `Provider` component with the proper `store` prop:

Note: This is the same `Provider` as provided by [react-redux](//github.com/rackt/react-redux/) as of version 4.0 (they both simply put the the **react** store in *context*). No need to *"provide"* it twice if you use both.

## stateProps
This is the same *Higher-order component* as the original [stateProps](//npmjs.org/package/state-props), but which automatically uses the *enhanced* **redux store** passed in context by the **Provider** above.


## License

MIT License (c) Juan Soulie, 2016
