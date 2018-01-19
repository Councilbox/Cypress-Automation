import {combineReducers} from 'redux';
import main from './main';
import company from './company';
import user from './user';
import translate from './translate';
import { i18nReducer } from 'react-redux-i18n';

const rootReducer = combineReducers({
    main,
    company,
    user,
    translate,
    i18nReducer
});

export default rootReducer;