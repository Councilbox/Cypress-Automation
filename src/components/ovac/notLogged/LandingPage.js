import React from 'react';
import { NotLoggedLayout } from '../../../displayComponents';
import withSharedProps from '../../../HOCs/withSharedProps';


const LandingPage = ({ translate }) => {
	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={true}
		>
			<div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<div style={{ width: '300px', height: '100%', backgroundColor: 'white' }}>
					OVAC
				</div>
			</div>
		</NotLoggedLayout>
	);
};

export default withSharedProps()(LandingPage);
