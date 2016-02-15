/****************************************************************************
 state props that uses context.store to pass proper mutation down
   MIT License (c) Juan Soulie, 2016
 npmjs.com/package/redux-state-props
****************************************************************************/

var React = require('react');
var stateProps = require('state-props');

var storeShape = React.PropTypes.shape({
  dispatch: React.PropTypes.func.isRequired,
  mutagen: React.PropTypes.func.isRequired
});

// gets store from context
function contextStateProps(state,mutations,opt) {
  return function(Component) {
    var SP = function(props,context) {
      var modOpts = _assign({},opt,{mutagen:context.store.mutagen});
      var componentWithMutagen = stateProps(state,mutations,modOpts)(Component);
      return React.createElement(componentWithMutagen,props);
    };
    SP.contextTypes = {store:storeShape};
    return SP;
  };
}

module.exports = contextStateProps;

// --------------------------------------------------------------------------
var _assign=Object.assign||function(x){for(var i=1;i<arguments.length;++i){var a=arguments[i];for(var k in a)if(a.hasOwnProperty(k))x[k]=a[k];}return x;};
