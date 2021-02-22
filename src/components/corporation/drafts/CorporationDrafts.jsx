import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { TableCell, TableRow } from 'material-ui/Table';
import { withRouter } from 'react-router-dom';
import { CardPageLayout, EnhancedTable, ErrorWrapper } from '../../../displayComponents';
import { corporationDrafts as corporationDraftsQuery } from '../../../queries/corporation';
import withSharedProps from '../../../HOCs/withSharedProps';
import { DRAFTS_LIMITS } from '../../../constants';
import TableStyles from '../../../styles/table';

class CorporationDrafts extends React.Component {
state = {
	selectedIndex: -1,
	selectedValues: []
};

componentDidMount() {
	this.props.data.refetch();
}

render() {
	const { translate } = this.props;
	const { loading, error, corporationDrafts, draftTypes } = this.props.data;

	return (
		<CardPageLayout title={translate.general_drafts}>
			{error ? (
				<div>
					{error.graphQLErrors.map((err, index) => (
						<ErrorWrapper
							key={`error_${index}`}
							error={err}
							translate={translate}
						/>
					))}
				</div>
			) : (
				!!corporationDrafts && (
					<EnhancedTable
						translate={translate}
						defaultLimit={DRAFTS_LIMITS[0]}
						defaultFilter={'title'}
						defaultOrder={['title', 'asc']}
						limits={DRAFTS_LIMITS}
						page={1}
						loading={loading}
						length={corporationDrafts.list.length}
						total={corporationDrafts.total}
						refetch={this.props.data.refetch}
						headers={[
							{
								name: 'title',
								text: translate.name,
								canOrder: true
							},
							{
								name: 'type',
								text: translate.type,
								canOrder: true
							}
						]}
					>
						{corporationDrafts.list.map(
							(draft, index) => (
								<TableRow
									key={`draft${draft.id}`}
								>
									<TableCell
										style={
											TableStyles.TD
										}
										onClick={() => this.setState({
											selectedIndex: index
										})
										}
									>
										{draft.title}
									</TableCell>
									<TableCell>
										{translate[draftTypes[draft.type].label]}
									</TableCell>
								</TableRow>
							)
						)}
					</EnhancedTable>
				)
			)}

		</CardPageLayout>
	);
}
}

export default withSharedProps()(
	compose(
		graphql(corporationDraftsQuery, {
			options: () => ({
				notifyOnNetworkStatusChange: true
			})
		})
	)(withRouter(withApollo(CorporationDrafts)))
);
