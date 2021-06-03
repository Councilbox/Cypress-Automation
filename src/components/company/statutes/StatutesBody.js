import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { withRouter } from 'react-router-dom';
import withSharedProps from '../../../HOCs/withSharedProps';
import {
	Scrollbar,
	LoadingSection,
} from '../../../displayComponents';
import { statutes } from '../../../queries';
import { censuses } from '../../../queries/census';
import StatuteEditor from './StatuteEditor';
import StatutesList from './StatutesList';
import StatuteCreateButton from './StatuteCreateButton';


const StatutesPage = ({
	data, translate, client, hideCardPageLayout, statuteId, ...props
}) => {
	const [censusList, setCensusList] = React.useState(null);

	React.useEffect(() => {
		const requestCensus = async () => {
			const response = await client.query({
				query: censuses,
				variables: {
					companyId: +props.company.id
				}
			});

			setCensusList(response.data);
		};

		requestCensus();
	}, [censuses]);

	const { companyStatutes } = data;

	if (!companyStatutes) {
		return <LoadingSection />;
	}

	if (statuteId) {
		return (
			<StatuteEditor
				statuteId={statuteId}
				censusList={censusList}
				company={props.company}
				translate={translate}
				organization={props.organization}
			/>
		);
	}

	return (
		<div
			style={{
				height: '100%'
			}}
		>
			<Scrollbar>
				<div
					style={{
						padding: '1em'
					}}
				>
					<StatuteCreateButton
						refetch={data.refetch}
					/>
					<StatutesList
						statutes={data.companyStatutes}
						translate={translate}
						refetch={data.refetch}
					/>
				</div>
			</Scrollbar>
		</div>
	);
};


export default withSharedProps()(
	compose(
		graphql(statutes, {
			options: props => ({
				variables: {
					companyId: props.companyId
				},
				notifyOnNetworkStatusChange: true,
				fetchPolicy: 'network-only'
			})
		})
	)(withRouter(withApollo(StatutesPage)))
);
