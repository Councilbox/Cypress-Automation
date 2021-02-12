import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { LoadingSection } from '../../../../displayComponents';
import { useQueryReducer } from '../../../../hooks';
import { getPrimary } from '../../../../styles/colors';
import { useSubdomain } from '../../../../utils/subdomain';
import Stars from '../../../participant/survey/Stars';

const labels = {
	satisfaction: 'rate_the_satisfaction',
	performance: 'rate_performance',
	recommend: 'degree_recomend_use',
	care: 'rate_care_received'
}

const CouncilSurveyRecounts = ({ council, translate, client }) => {
	const primary = getPrimary();
	const { data, errors, loading } = useQueryReducer({
		client,
		query: gql`
            query CouncilSurveyRecount($councilId: Int!){
                councilSurveyRecount(councilId: $councilId){
                    total
                    recounts
                }
            }
        `,
		variables: {
			councilId: council.id
		},
		pollInterval: 60000
	});
	const subdomain = useSubdomain();

	if (loading && !data) {
		return <LoadingSection />;
	}

	return (
		<div style={{ padding: '1em 3em' }}>
			{data.councilSurveyRecount.total > 0 ?
				<>
					<h5>{translate.results}</h5>
					{Object.keys(data.councilSurveyRecount.recounts).map(key => (
						<div
							key={key}
						>
							<div>
								{labels[key] ? translate[labels[key]].replace(/{{appName}}/, subdomain.name || 'Councilbox') : key}
							</div>
							<div
								style={{
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Stars
									name={key}
									value={Math.round(data.councilSurveyRecount.recounts[key])}
									disabled={true}
								/>
								<div
									style={{
										fontWeight: '700',
										color: primary,
										marginLeft: '1em',

									}}
								>
									{data.councilSurveyRecount.recounts[key].toFixed(2)}
								</div>
							</div>
						</div>
					))}
				</>
				: translate.no_results}
		</div>
	);
};

export default withApollo(CouncilSurveyRecounts);