import React, { Fragment } from 'react';
import { graphql } from 'react-apollo';
import { MenuItem } from 'material-ui';
import { getSecondary } from '../../styles/colors';
import { languages } from '../../queries/masters';
import { setLanguage } from '../../actions/mainActions';
import { DropDownMenu } from '../../displayComponents';
import { store } from '../../containers/App';

const secondary = getSecondary();

const changeLanguage = language => {
	store.dispatch(setLanguage(language));
};

const LanguageSelector = ({ selectedLanguage, data, onChange }) => (
	<DropDownMenu
		color="transparent"
		text={selectedLanguage ? selectedLanguage.toUpperCase() : 'ES'}
		textStyle={{ color: secondary }}
		id="language-selector"
		type="flat"
		icon={
			<i className="fa fa-angle-down" aria-hidden="true" style={{ color: secondary, fontSize: '22px', marginLeft: '3px' }}></i>
		}
		items={
			<Fragment>
				{!!data.languages
					&& data.languages.map(language => (
						<MenuItem
							id={`language-${language.columnName}`}
							key={`language_${language.columnName}`}
							onClick={() => {
								if (onChange) {
									onChange(language.columnName);
								}
								changeLanguage(language.columnName);
							}}
						>
							{language.columnName.toUpperCase()}
						</MenuItem>
					))
				}
			</Fragment>
		}
	/>
);

export default graphql(languages)(LanguageSelector);
