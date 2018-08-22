import React from "react";
import { CardPageLayout, LoadingSection } from "../../displayComponents";
import ChangePasswordForm from "./ChangePasswordForm";
import UpdateUser from "./UpdateUser";
import { graphql } from "react-apollo";
import { languages } from "../../queries/masters";
import withSharedProps from '../../HOCs/withSharedProps';

const UserSettingsPage = ({ data, user, translate }) => {
	if (data.loading) {
		return <LoadingSection />;
	}

	return (
		<CardPageLayout title={translate.settings}>
			<div style={{margin: 0, marginTop: '0.6em'}}>
				<UpdateUser
					translate={translate}
					user={user}
					languages={data.languages}
				/>
			</div>
			<div style={{marginTop: '3.5em'}}>
				<ChangePasswordForm translate={translate} />
			</div>
		</CardPageLayout>
	);
}

export default graphql(languages)(withSharedProps()(UserSettingsPage));
