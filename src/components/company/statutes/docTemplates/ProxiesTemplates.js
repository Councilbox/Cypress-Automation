/* eslint-disable no-tabs */
import React from 'react';
import { SectionTitle, GridItem, Checkbox } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';

// const getCustomDocsTags = (type, translate) => {
// 	const TAGS = {
// 		PARTICIPANT: {
// 			value: '{{participantName}}',
// 			label: translate.participant
// 		},
// 		DELEGATE: {
// 			value: '{{delegateName}}',
// 			label: translate.delegate
// 		},
// 		DATE: {
// 			value: '{{dateFirstCall}}',
// 			label: translate.date
// 		},
// 		DATE2CALL: {
// 			value: '{{dateSecondCall}}',
// 			label: translate['2nd_call_date']
// 		},
// 		BUSINESS_NAME: {
// 			value: '{{business_name}}',
// 			label: translate.business_name
// 		},
// 		ADDRESS: {
// 			value: '{{address}}',
// 			label: translate.new_location_of_celebrate
// 		},
// 		CITY: {
// 			value: '{{city}}',
// 			label: translate.company_new_locality
// 		},
// 		SIGNATURE: {
// 			value: '{{signature}}',
// 			label: translate.new_signature
// 		}
// 	};

// 	const votes = {
// 		value: '{{votes}}',
// 		label: translate.votes
// 	};

// 	const types = {
// 		PROXY: Object.keys(TAGS).map(key => TAGS[key]),
// 		VOTE_LETTER: Object.keys(TAGS).filter(key => key !== 'DELEGATE').map(key => TAGS[key]),
// 		VOTE_LETTER_WITH_SENSE: [...Object.keys(TAGS).filter(key => key !== 'DELEGATE').map(key => TAGS[key]), votes],
// 	};

// 	return types[type] ? types[type] : [];
// };

const ProxiesTemplates = ({ statute, updateState, translate }) => {
	const primary = getPrimary();
	// const internalState = React.useRef({
	// 	proxy: statute.proxy,
	// 	proxySecondary: statute.proxySecondary,
	// 	voteLetter: statute.voteLetter,
	// 	voteLetterSecondary: statute.voteLetterSecondary,
	// 	voteLetterWithSense: statute.voteLetterWithSense,
	// 	voteLetterWithSenseSecondary: statute.voteLetterWithSenseSecondary,
	// });
	// const proxyTemplate = React.useRef();
	// const proxySecondary = React.useRef();
	// const voteLetter = React.useRef();
	// const voteLetterSecondary = React.useRef();
	// const voteLetterWithSense = React.useRef();
	// const voteLetterWithSenseSecondary = React.useRef();

	// const handleUpdate = object => {
	// 	clearTimeout(timeout);
	// 	internalState.current = {
	// 		...internalState.current,
	// 		...object
	// 	};

	// 	timeout = setTimeout(() => {
	// 		updateState(internalState.current);
	// 	}, 350);
	// };

	// React.useEffect(() => {
	// 	proxyTemplate.current.setValue(statute.proxy || '');
	// 	proxySecondary.current.setValue(statute.proxySecondary || '');
	// 	voteLetter.current.setValue(statute.voteLetter || '');
	// 	voteLetterSecondary.current.setValue(statute.voteLetterSecondary || '');
	// 	voteLetterWithSense.current.setValue(statute.voteLetterWithSense || '');
	// 	voteLetterWithSenseSecondary.current.setValue(statute.voteLetterWithSenseSecondary || '');
	// }, [statute.id]);

	return (
		<>
			<SectionTitle
				text={translate.documents}
				color={primary}
				style={{
					marginTop: '2em',
					marginBottom: '1em'
				}}
			/>
			<GridItem xs={12} md={12} lg={12}>
				<Checkbox
					id="council-type-double-column"
					label={translate.double_column}
					value={statute.doubleColumnDocs === 1}
					onChange={(event, isInputChecked) => updateState({
						doubleColumnDocs: isInputChecked ? 1 : 0
					})
					}
				/>
			</GridItem>
			<GridItem xs={12} md={12} lg={12}>
				<Checkbox
					id="council-type-require-proxy"
					label={translate.require_proxies}
					value={statute.requireProxy === 1}
					onChange={(event, isInputChecked) => updateState({
						requireProxy: isInputChecked ? 1 : 0
					})
					}
				/>
			</GridItem>
			{/*
			<GridItem xs={12} md={12} lg={12}>
				<RichTextInput
					id="council-type-proxy"
					ref={proxyTemplate}
					translate={translate}
					floatingText={translate.custom_proxy}
					value={
						internalState.proxy ?
							internalState.proxy
							: ''
					}
					onChange={value => handleUpdate({
						proxy: value
					})
					}
					tags={getCustomDocsTags('PROXY', translate)}
				/>
			</GridItem>
			<GridItem xs={12} md={12} lg={12} style={{ ...(statute.doubleColumnDocs === 0 ? { display: 'none' } : {}) }}>
				<RichTextInput
					id="council-type-proxy-secondary"
					ref={proxySecondary}
					translate={translate}
					floatingText={translate.proxy_right_column}
					value={
						internalState.proxySecondary ?
							internalState.proxySecondary
							: ''
					}
					onChange={value => handleUpdate({
						proxySecondary: value
					})
					}
					tags={getCustomDocsTags('PROXY', translate)}
				/>
			</GridItem>
			<GridItem xs={12} md={12} lg={12}>
				<RichTextInput
					id="council-type-vote-letter"
					ref={voteLetter}
					translate={translate}
					floatingText={translate.vote_letter}
					value={
						internalState.voteLetter ?
							internalState.voteLetter
							: ''
					}
					onChange={value => handleUpdate({
						voteLetter: value
					})
					}
					tags={getCustomDocsTags('VOTE_LETTER', translate)}
				/>
			</GridItem>
			<GridItem xs={12} md={12} lg={12} style={{ ...(statute.doubleColumnDocs === 0 ? { display: 'none' } : {}) }}>
				<RichTextInput
					id="council-type-vote-letter-secondary"
					ref={voteLetterSecondary}
					translate={translate}
					floatingText={translate.vote_letter_right_column}
					value={
						internalState.voteLetterSecondary ?
							internalState.voteLetterSecondary
							: ''
					}
					onChange={value => handleUpdate({
						voteLetterSecondary: value
					})
					}
					tags={getCustomDocsTags('VOTE_LETTER', translate)}
				/>
			</GridItem>
			<GridItem xs={12} md={12} lg={12}>
				<RichTextInput
					id="council-type-vote-letter-with-sense"
					ref={voteLetterWithSense}
					translate={translate}
					floatingText={translate.vote_letter_with_voting_sense}
					value={
						internalState.voteLetterWithSense ?
							internalState.voteLetterWithSense
							: ''
					}
					onChange={value => handleUpdate({
						voteLetterWithSense: value
					})
					}
					tags={getCustomDocsTags('VOTE_LETTER_WITH_SENSE', translate)}
				/>
			</GridItem>
			<GridItem xs={12} md={12} lg={12} style={{ ...(statute.doubleColumnDocs === 0 ? { display: 'none' } : {}) }}>
				<RichTextInput
					id="council-type-vote-letter-with-sense-secondary"
					ref={voteLetterWithSenseSecondary}
					translate={translate}
					floatingText={translate.right_column_vote_letter_with_voting_sense}
					value={
						internalState.voteLetterWithSenseSecondary ?
							internalState.voteLetterWithSenseSecondary
							: ''
					}
					onChange={value => handleUpdate({
						voteLetterWithSenseSecondary: value
					})
					}
					tags={getCustomDocsTags('VOTE_LETTER_WITH_SENSE', translate)}
				/>
			</GridItem> */}
		</>
	);
};

export default ProxiesTemplates;
