import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { LoadingMainApp } from '../displayComponents';
import CouncilEditorPage from '../components/council/editor/CouncilEditorPage';
import { council } from '../queries';

const CouncilEditorContainer = ({
	company,
	match,
	translate,
	data
}) => {
	if (!company || data.loading) {
		return <LoadingMainApp />;
	}

	if (!data.council){
		return <Redirect to="/" />;
	}

	return (
		<CouncilEditorPage
			translate={translate}
			council={data.council}
			company={company}
			updateStep={() => data.refetch}
			councilID={+match.params.id}
		/>
	);
};

const mapStateToProps = state => ({
	translate: state.translate,
	company: state.companies.list[state.companies.selected]
});

export default graphql(council, {
	options: props => ({
		variables: {
			id: +props.match.params.id
		}
	})
})(connect(mapStateToProps)(withRouter(CouncilEditorContainer)));
