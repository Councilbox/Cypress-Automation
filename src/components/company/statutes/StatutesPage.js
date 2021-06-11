import React from 'react';
import { CardPageLayout } from '../../../displayComponents';
import withSharedProps from '../../../HOCs/withSharedProps';
import StatutesBody from './StatutesBody';

const StatutesPage = ({ match, translate }) => (
	<CardPageLayout title={translate.council_types} disableScroll={true}>
		<StatutesBody
			statuteId={match.params.statuteId}
			companyId={+match.params.company}
		/>
	</CardPageLayout>
);

export default withSharedProps()(StatutesPage);
