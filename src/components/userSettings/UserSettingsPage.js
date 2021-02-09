import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { CardPageLayout, LoadingSection } from '../../displayComponents';
import UpdateUser from './UpdateUser';
import { languages } from '../../queries/masters';
import withSharedProps from '../../HOCs/withSharedProps';
import influencer from '../../assets/img/influencer.svg';

const userQuery = gql`
    query user($id: Int!){
        user(id: $id){
            actived
			email
			phone
			code
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

const UserSettingsPage = ({ data, user, translate, company, match, client }) => {
	const [dataUser, setDataUser] = React.useState(user.id !== match.params.id ? null : user);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: userQuery,
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

	const admin = !!((match.params.company && match.params.id));

	return (
		<CardPageLayout title={
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<div style={{ width: '1.2em', display: 'flex' }}>
					<img src={influencer} style={{ marginRight: '0.6em', width: '100%', height: '100%' }} />
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
};

export default graphql(languages)(withSharedProps()(withRouter(withApollo(UserSettingsPage))));
