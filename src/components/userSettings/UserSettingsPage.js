import React from "react";
import { CardPageLayout, LoadingSection } from "../../displayComponents";
import ChangePasswordForm from "./ChangePasswordForm";
import UpdateUser from "./UpdateUser";
import { graphql, withApollo } from "react-apollo";
import { languages } from "../../queries/masters";
import withSharedProps from '../../HOCs/withSharedProps';
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';


const UserSettingsPage = ({ data, user, translate, match, client }) => {
	const [dataUser, setDataUser] = React.useState([]);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: userquery,
			variables: {
				id: match.params.id
			}
		});
		setDataUser(response.data.user);
	}, [match.params.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	if (data.loading) {
		return <LoadingSection />;
	}

	let admin = (match.params.company && match.params.id) ? false : true;

	return (
		<CardPageLayout title={translate.user_data}>
			<div style={{ margin: 0, marginTop: '0.6em' }}>
				<UpdateUser
					translate={translate}
					user={match.params.company && match.params.id ? dataUser : user }
					languages={data.languages}
					edit={true}
				/>
			</div>
			{admin &&
				<div style={{ marginTop: '3.5em' }}>
					<ChangePasswordForm translate={translate} />
				</div>
			}
		</CardPageLayout>
	);
}

const userquery = gql`
    query user($id: Int!){
        user(id: $id){
            actived
			email
			phone
			preferredLanguage
			roles
            id
            name
            surname
        }
    }
`;

export default graphql(languages)(withSharedProps()(withRouter(withApollo(UserSettingsPage))));
