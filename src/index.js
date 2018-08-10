const Immutable = require('immutable');

const IS_NOT_ASKED = 'isNotAsked';
const IS_FETCHING = 'isFetching';
const IS_SUCCESS = 'isSuccess';
const IS_ERROR = 'isError';
const DATA = 'data';
const ERROR = 'error';

var RequestState = function (existingState) {
    let defaultState = {
            [IS_NOT_ASKED]: true,
            [IS_FETCHING]: false,
            [IS_SUCCESS]: false,
            [IS_ERROR]: false,
            [DATA]: null,
            [ERROR]: null
        };

    this.state = (existingState != null) ?
        Immutable.Map(Object.assign({}, defaultState, existingState)) :
        Immutable.Map(defaultState);
}
RequestState.prototype.get = function() {
    return new RequestState(this.state.toJS());
}
RequestState.prototype.fetching = function() {
    return new RequestState(this.state.set(DATA, null).set(IS_NOT_ASKED, false).set(IS_FETCHING, true).set(IS_ERROR, false).set(IS_SUCCESS, false).toJS());
}
RequestState.prototype.success = function(data) {
    return new RequestState(this.state.set(DATA, data).set(IS_NOT_ASKED, false).set(IS_FETCHING, false).set(IS_ERROR, false).set(IS_SUCCESS, true).toJS());
}
RequestState.prototype.error = function(err) {
    return new RequestState(this.state.set(DATA, null).set(ERROR, err).set(IS_NOT_ASKED, false).set(IS_FETCHING, false).set(IS_ERROR, true).set(IS_SUCCESS, false).toJS());
}
RequestState.prototype.isFetching = function() {
    return this.state.get(IS_FETCHING);
}
RequestState.prototype.isSuccess = function() {
    return this.state.get(IS_SUCCESS);
}
RequestState.prototype.isError = function() {
    return this.state.get(IS_ERROR);
}
RequestState.prototype.isNotAsked = function() {
    return this.state.get(IS_NOT_ASKED);
}

RequestState.prototype.getError = function() {
  return this.state.get(ERROR);
}
RequestState.prototype.getData = function() {
  return this.state.get(DATA);
}

module.exports = RequestState;