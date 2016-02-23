/****************************************************************************
 reducer: a dynamic reducer for state-props to affect a redux store
   MIT License (c) Juan Soulie, 2016
 npmjs.com/package/redux-state-props
****************************************************************************/

var Enhancer = require('./enhancer');

// [UNDOCUMENTED:] These options alter the "Action" objects dispatched and reduced
var defaultOptions = {
  filter: '@state-props@',   // the type used for all actions
  idPrefix: 'E',             // string to prefix the id
  // Action Fields (defining Action shape):
  filterField: "type",       // identifies the filtering field (usually "type")
  elemField: "elem",         // identifies the target element
  mutationField: "mid",      // identifies the mutation to apply
  argumentsField: "args"     // arguments passed
};

// --------------------------------------------------------------------------
// createReducer
//  creates a dynamic reducer able to mount state-props
function createReducer(opt) {
  opt = opt ? _assign({},defaultOptions,opt) : defaultOptions;

  // private state:
  var _cx = 1;                // intances counter
  var _shapeChanged = false;  // true if some elements were added/removed
  // per React Element:
  var _setters = {};
  var _mutations = {};
  var _states = {};

  // reshape: adjust state to new shape
  var reshape = function(state) {   // uses: _mutators & _initialState & _shapeChanged
    if (!_shapeChanged) return state;
    var nextState = {};
    for (var k in _mutations) if (_mutations.hasOwnProperty(k)) nextState[k] = state[k] || _states[k];
    _shapeChanged = false;
    return nextState;
  };

  // reduces one action:
  var reduceAction = function(state,action) {  // uses: _mutators
    var nextState = state || {};
    // filter whether the action is valid and for this reducer:
    if ( action &&
        (action[opt.filterField] === opt.filter) &&
        (typeof action[opt.elemField] !== 'undefined') &&
        (typeof action[opt.mutationField] !== 'undefined') ) {
      var id = action[opt.elemField];
      var mutId = action[opt.mutationField];
      if (_mutations[id]) {
        var change = _mutations[id][mutId].apply(this,action[opt.argumentsField]||[]);
        if (change.apply) {
          var modifiedState = change(nextState[id]);
          if (modifiedState != nextState[id]) {
            if (state==nextState) nextState=_assign({},state);
            nextState[id] = modifiedState;
          }
        }
        else {
          nextState = _assign({}, nextState);
          _assign(nextState[id],change);
        }
      }
    }
    return nextState;
  };

  // The single dynamic reducer - handles local state for *all elements*
  var reducer = function(state,action) {
    if (!state) return _assign({},_states);
    var nextState = reduceAction(reshape(state),action);
    var id = action[opt.elemField];
    if ( (nextState !== state) && (_setters[id]) ) {
      _setters[id](nextState[id]);
    }
    return nextState;
  };

  // returns a Mutator Generator specific for an element:
  reducer.mutagen = function(dispatch) {
    return function(elemThis) {
      // access elemThis:
      var initialState = elemThis.state.localState;
      var replaceState = elemThis.replaceLocalState;

      var id = opt.idPrefix+_cx++;
      _states[id] = initialState;
      _mutations[id] = [];
      _setters[id] = replaceState;
      _shapeChanged = true;

      // createMutator: a mutator applies a mutation to the element's state
      var createMutator = function (mutation) {
        var mutationId = _mutations[id].push(mutation)-1;
        return function() {
          var action = {};
          action[opt.filterField] = opt.filter;
          action[opt.elemField] = id;
          action[opt.mutationField] = mutationId;
          action[opt.argumentsField] = Array.prototype.slice.call(arguments);
          dispatch(action);
        };
      };
      createMutator.unmount = function() {
        delete _states[id],_mutations[id],_setters[id];
        _shapeChanged = true;
      };
      return createMutator;
    };
  };

  reducer.enhancer = Enhancer(reducer);

  return reducer;
}

module.exports = createReducer;

// --------------------------------------------------------------------------
var _assign=Object.assign||function(x){for(var i=1;i<arguments.length;++i){var a=arguments[i];for(var k in a)if(a.hasOwnProperty(k))x[k]=a[k];}return x;};
