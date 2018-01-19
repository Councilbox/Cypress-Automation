import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import {i18nReducer} from 'react-redux-i18n';

export default function configureStore() {
  return createStore(
    rootReducer,
    applyMiddleware(thunk)

  );
}
