import {combineReducers} from 'redux';
import main from './main';
import translate from './translate';
//import { i18nReducer } from 'react-redux-i18n';

const rootReducer = combineReducers({
    main,
    translate
});

export default rootReducer;