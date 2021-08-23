import React from 'react';
import { TextInput } from '../../../../displayComponents';

const CompanyTagForm = ({
	tag, translate, setTag, errors
}) => (
	<React.Fragment>
		<TextInput
			required
			value={tag.key}
			errorText={errors.key}
			floatingText={translate.key}
			onChange={event => setTag({ key: event.target.value })}
			id="company-tag-key"
		/>

		<TextInput
			required
			value={tag.value}
			errorText={errors.value}
			floatingText={translate.value}
			onChange={event => setTag({ value: event.target.value })}
			id="company-tag-value"
		/>

		<TextInput
			value={tag.description}
			errorText={errors.description}
			floatingText={translate.description}
			onChange={event => setTag({ description: event.target.value })}
			id="company-tag-description"
		/>
	</React.Fragment>
);

export default CompanyTagForm;
