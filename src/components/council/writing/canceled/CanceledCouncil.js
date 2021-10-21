import React from 'react';
import { Card } from 'material-ui';
import { CardPageLayout } from '../../../../displayComponents';
import CouncilHeader from '../CouncilHeader';

const CanceledCouncil = ({ council, translate, goTo }) => (
	<CardPageLayout title={translate.not_held_council} goTo={goTo}>
		<CouncilHeader
			council={council}
			translate={translate}
		/>
		{!!council.noCelebrateComment
			&& <Card
				elevation={0}
				style={{
					marginTop: '1em',
					padding: '0.8em'
				}}
			>
				<h5>{translate.message}</h5>
				<div dangerouslySetInnerHTML={{ __html: council.noCelebrateComment }} />
			</Card>
		}
	</CardPageLayout>
);

export default CanceledCouncil;
