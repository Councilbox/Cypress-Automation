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
					<CouncilSurveyComments
						council={council}
						translate={translate}
					/>
				</>
				: translate.no_results}
		</div>
	);
};

const CouncilSurveyComments = withApollo(({ council, translate, client }) => {
	const { data, loading } = useQueryReducer({
		client,
		query: gql`
            query councilSurveySuggestions($councilId: Int!){
                councilSurveySuggestions(councilId: $councilId){
                    suggestions
					creationDate
					id
                    participant {
						name
						surname
					}
                }
            }
        `,
		variables: {
			councilId: council.id
		},
		pollInterval: 60000
	});

	if (loading && !data) {
		return <LoadingSection />;
	}

	return (
		<div style={{ marginTop: '2em' }}>
			{data.councilSurveySuggestions.length > 0 ?
				<>
					<h4 style={{ marginBottom: '1em' }}>{translate.suggestions}</h4>
					{data.councilSurveySuggestions.map(suggestion => (
						<div
							key={`suggestion_${suggestion.id}`}
							style={{
								borderBottom: '1px solid black',
								paddingBottom: '0.6em'
							}}
						>
							<div
								dangerouslySetInnerHTML={{
									__html: suggestion.suggestions
								}}
								style={{
									fontStyle: 'italic',
									fontSize: '0.85em'
								}}
							></div>
							<span
								style={{ fontSize: '0.73rem', fontWeight: '700' }}
							>{`${suggestion.participant.name} ${suggestion.participant.surname || ''}`}
							</span>
						</div>

					))}
				</>
				: ''}
		</div>
	);
});

export default withApollo(CouncilSurveyRecounts);
