request-state
===
A simple immutable request-state container. Inpired by [RemoteDatajs](https://github.com/jackfranklin/remote-data-js).

### Install
```bash
npm install request-state
```

**Motivation/Problem**

Defining and displaying the state of a request is not that hard, but can be unnecessarily complicated.

```javascript
const state = { loading: true, data: undefined }

const state = { loading: false, data: undefined, error: undefined }

// Updating this state is boring and might be repeted several places in our application
const state = { 
    loading: false, 
    data: undefined, 
    error: undefined, 
    isSuccess: false, 
    isError: false 
}

```


**Solution**

The solution is to have a state for all request-state scenarios. `request-state` have four different states that can easily be updated and passed to your react-components:

- IS_NOT_ASKED - request not started
- IS_FETCHING - request started
- SUCCESS - request success. We got some data
- ERROR - the request went wrong


### Example Usage with a redux reducer


`someReducer.js`


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
        request: state.someReducer
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

console.log(requestState.getData()) // [1,2]
```

### update state

Call one of these methods to update state and receive a new instance of requestState.

```js

- `.success(dataObj)` : will return a new instance with success status and set the data (if any)
- `.fetching()` : will return a new instance with fetching state.
- `.error(errorObj)` : will return a new instance with error state and set the error object (if any)

```

### checking the state

```js
- `.isNotAsked()` // Request not started
- `.isFetching()` // Fetching
- `.isSuccess()` // Success. We got some data
- `.isError()` // Error. We got an error

```


### Get data and error

```js

- `.getData()` : returns the data set with `.success(data)`.
- `.getError()` : returns the error set with `.error(err)`.

```

### Combine with other state
There is no problem combining the requestState instance with other state

```js
const defaultState = {
    isToggled: false,
    requestState: new RequestState()
}

```

