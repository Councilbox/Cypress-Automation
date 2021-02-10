import React from 'react';
import * as CBX from '../../../../utils/CBX';
import Tag from './Tag';

export const TAG_TYPES = {
	COMPANY_TYPE: 0,
	STATUTE: 1,
	GOVERNING_BODY: 2,
	DRAFT_TYPE: 3,
	CUSTOM: 99
};

export const getTagColor = type => {
	const colors = {
		0: 'rgb(134, 102, 102)',
		1: 'rgba(125, 33, 128, 0.58)',
		2: 'rgba(33, 98, 128, 0.58)',
		3: 'rgba(33, 70, 128, 0.58)',
		99: 'rgba(128, 78, 33, 0.58)'
	};
	return colors[type] ? colors[type] : colors[99];
};

export const createTag = (data, type, translate) => {
	const types = {
		0: () => ({
			label: translate[data.label] || data.label,
			name: data.label,
			type
		}),
		1: () => ({
			label: translate[data.title] || data.title,
			name: data.id ? `statute_${data.id}` : data.title,
			type
		}),
		2: () => ({
			name: data.label,
			label: translate[data.label],
			type
		}),
		3: () => {
			const {
				votingTypes, majorityTypes, addTag, ...draft
			} = data;
			return ({
				name: draft.label,
				label: translate[draft.label],
				type,
				childs: (draft.label === 'agenda' && votingTypes) ?
					CBX.filterAgendaVotingTypes(votingTypes).map(votingType => (
						<Tag
							childs={CBX.hasVotation(votingType.value) ?
								majorityTypes.map(majority => (
									<Tag
										key={`tag_${majority.value}`}
										text={translate[majority.label]}
										color={getTagColor(type)}
										action={() => addTag({
											name: draft.label,
											segments: [draft.label, votingType.label, majority.label],
											label: translate[majority.label],
											type,
										})}
									/>
								)) : null}
							text={translate[votingType.label]}
							color={getTagColor(type)}
							action={() => addTag({
								name: draft.label,
								segments: [draft.label, votingType.label],
								label: translate[votingType.label],
								type,
							})}
							key={`tag_${votingType.value}`}
						/>
					))
					: null
			});
		}
	};
	return types[type]();
};
