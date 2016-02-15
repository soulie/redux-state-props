/****************************************************************************
 provider: puts a reducer and a store into context
   MIT License (c) Juan Soulie, 2016
 npmjs.com/package/redux-state-props
****************************************************************************/

var React = require('react');

var storeShape = React.PropTypes.shape({
  dispatch: React.PropTypes.func.isRequired
});

var Provider = React.createClass({
  getChildContext: function() {
    return {
      store: this.props.store
    };
  },
  render: function() {
    return React.Children.only(this.props.children);
  }
});

Provider.propTypes = {
  store: storeShape.isRequired,
  children: React.PropTypes.element.isRequired
};

Provider.childContextTypes = {
  store: storeShape
};

module.exports = Provider;
