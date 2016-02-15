/****************************************************************************
  Redux-style reducer for state-props
    MIT License (c) Juan Soulie, 2016
  npmjs.com/package/redux-state-props
****************************************************************************/

var ReduxStateProps = {};
ReduxStateProps.createReducer = require('./reducer');
ReduxStateProps.Enhancer = require('./enhancer');
ReduxStateProps.Provider = require('./provider');
ReduxStateProps.Mutagen = require('./mutagen');
ReduxStateProps.stateProps = require('./context-state-props');

module.exports = ReduxStateProps;
