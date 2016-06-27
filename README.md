request-state
===
A module for simple state maintence when using redux. Inpired of the Elm request architecture and [RemoteDatajs](https://github.com/jackfranklin/remote-data-js)

### Install
```bash
npm install request-state
```

**Motivation/Problem**

A normal way of representing a request state in your app might look like this:

```javascript
const state = { loading: true, data: undefined }
or:
const state = { loading: false, data: undefined, error: undefined }
or even:
const state = { 
    loading: false, 
    data: undefined, 
    error: undefined, 
    isSuccess: false, 
    isError: false 
}

```

This state does not cover all scenarios possible and is also difficult to maintain.

**Solution**

The request-state creates a thin wrapper around all possible states your request will have.

- IS_NOT_ASKED - request not started
- IS_FETCHING - request started
- SUCCESS - request success. We got some data
- ERROR - the request went wrong


### Example Usage with a redux reducer


`reducer.js`


```javascript
const RequestState = require('request-state');
const { FETCHING_DATA, 
        DATA_RECEIVED, 
        FAILED_TO_RECEIVE_DATA } = require('./actions');

const defaultState = new RequestState();

module.exports = (state = defaultState, action) => {
    switch (action.type) {
        case FETCHING_DATA:
            return state.fetching();
        case DATA_RECEIVED:
            return state.success(action.data); 
                // action.data = { name: 'Billy' }
        case FAILED_TO_RECEIVE_DATA:
            return state.error(action.err); 
                // action.err = { message: 'could not get user' }
        default:
            return state.get();
    }
};
```

`app.js`

```javascript
const App = React.createClass({
    componentDidMount: function() {
        dispatch(fetchUser('Billy'))
    },

    render: function() {
        const request = this.props;

        if (request.isNotAsked()) return <h2>Request not started</h2>
        if (request.isFetching()) return <h2>Request started. Loading<h2>
        
        if (request.isSuccess()) {
            const user = request.getData();
            return <h2>{ user.name }</h2> // 'Billy'
        }

        if (request.isError()) {
            const error = request.getError();
            return <h2>{ error.message }</h2> // 'could not get user'
        }

        return null;
    }
})

module.exports = connect((state) => {
    return {
        request: state.requestReducer
    }
})(App)

```


## API

### Creating a `request-state` instances


```js
const RequestState = request('request-state');

const requestState = new RequestState(); //with default state

// with inital data. Will be merged with default state
const requestStateSuccess = new RequestState({ isSuccess: true, data: [1,2] })

console.log(requestStateSuccess.getData()) // [1,2]
```

### update state

Call one of these methods to update state and receive a new instance of requestState.

```js

- `succes(dataObj)` : will return a new instance with success status and set the data (if any)
- `fetching()` : will return a new instance with fetching state.
- `error(errorObj)` : will return a new instance with error state and set the error object (if any)

```

### Checking the status of a request

```js
- `.isNotAsked()` : true if a request has succeeded or failed.
- `.isSuccess()` : true if the request hasn't been asked for (this is the default state).
- `.isFetching()`
- `.isSuccess()`
- `.isError()`

```


### Get data and error

```js

- `.getData()` : returns the data if any (should call `.isSuccess()` first)
- `.getError()` : returns the error if any (should call `.isError()` first)

```

### Combine with other state
There is no problem combining the requestState instance with other state

```js
const defaultState = {
    isToggled: false,
    requestState: new RequestState()
}

```

