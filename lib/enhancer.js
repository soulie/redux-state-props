/****************************************************************************
 store enhancer
   MIT License (c) Juan Soulie, 2016
 npmjs.com/package/redux-state-props
****************************************************************************/

function Enhancer(statePropsReducer) {
  return function (createStoreFn) {
    return function() { // ...
      var store = createStoreFn.apply(null,arguments);
      store.mutagen = statePropsReducer.mutagen;
      return store;
    };
  };
}

module.exports = Enhancer;
