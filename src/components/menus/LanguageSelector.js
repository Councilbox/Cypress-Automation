import React, { Fragment } from 'react';
import { getSecondary } from '../../styles/colors';
import { graphql } from 'react-apollo';
import { languages } from '../../queries/masters';
import { setLanguage } from '../../actions/mainActions';
import { MenuItem } from 'material-ui';
import { Icon, DropDownMenu, LoadingSection } from '../../displayComponents';
import { store } from '../../containers/App';
const secondary = getSecondary();

const LanguageSelector = ({ selectedLanguage, data }) => {

    if(data.loading || !selectedLanguage){
        return(
            <LoadingSection />
        )
    }

    return(
        <DropDownMenu
            color="transparent"
            text={selectedLanguage.toUpperCase()}
            textStyle={{color: secondary}}
            type="flat"
            icon={<Icon className="material-icons" style={{color: secondary}}>keyboard_arrow_down</Icon>}
            items={
                <Fragment>
                    {data.languages.map((language) =>
                        <MenuItem
                            key={`language_${language.columnName}`}
                            onClick={() => changeLanguage(language.columnName)}
                        >
                            {language.columnName.toUpperCase()}
                        </MenuItem>
                    )}
                </Fragment>
            }
        />
    )

}

const changeLanguage = (language) => {
    store.dispatch(setLanguage(language));
}


export default graphql(languages)(LanguageSelector);