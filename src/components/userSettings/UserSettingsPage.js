import React from "react";
import { CardPageLayout, LoadingSection } from "../../displayComponents";
import ChangePasswordForm from "./ChangePasswordForm";
import UpdateUser from "./UpdateUser";
import { graphql, withApollo } from "react-apollo";
import { languages } from "../../queries/masters";
import withSharedProps from '../../HOCs/withSharedProps';
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import influencer from '../../assets/img/influencer.svg';


const UserSettingsPage = ({ data, user, translate, company, match, client, ...props }) => {
	const [dataUser, setDataUser] = React.useState(user.id !== match.params.id ? null : user);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: userquery,
			variables: {
				id: +match.params.id
			}
		});
		setDataUser(response.data.user);
	}, [match.params.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	if (!dataUser) {
		return <LoadingSection />;
	}

	let admin = (match.params.company && match.params.id) ? true : false;

	return (
		<CardPageLayout title={
			<div style={{ display: "flex", alignItems: "center" }}>
				<div style={{ width:"1.2em", display: "flex" }}>
					<img src={influencer} style={{ marginRight: '0.6em', width: "100%", height: "100%" }} />
				</div>
				<div>
					{translate.user_data}
				</div>
			</div>
		} disableScroll>
			<div style={{ margin: 0, marginTop: '0.6em', height: '100%' }}>
				<UpdateUser
					translate={translate}
					user={dataUser}
					admin={admin}
					company={company}
					refetch={getData}
					languages={data.languages}
					edit={true}
				/>
			</div>
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
			companies {
				id
				logo
				businessName
			}
            name
			surname
        }
    }
`;

export default graphql(languages)(withSharedProps()(withRouter(withApollo(UserSettingsPage))));
