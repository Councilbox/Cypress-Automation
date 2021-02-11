export const buildTagColumns = (draft, formatLabelFromName) => {
	const { tags } = draft;
	const columns = {};
	if (tags) {
		Object.keys(tags).forEach(key => {
			const tag = tags[key];
			const formatted = {
				...draft.tags[key],
				label: formatLabelFromName(draft.tags[key])
			};

			columns[tag.type] = columns[tag.type] ? [...columns[tag.type], formatted] : [formatted];
		});
	}

	return columns;
};

export const formatLabelFromName = (companyStatutes, translate) => tag => {
	if (tag.type === 1) {
		let statute = null;

		if (companyStatutes) {
			statute = companyStatutes.find(item => item.id === +tag.name.split('_')[tag.name.split('_').length - 1]);
		}
		const title = statute ? translate[statute.title] ? translate[statute.title] : statute.title : tag.label;
		return translate[title] || title;
	}

	return tag.segments ?
		`${tag.segments.reduce((acc, curr) => {
			if (curr !== tag.label) return `${acc + (translate[curr] || curr)}. `;
			return acc;
		}, '')}`
		: translate[tag.name] ? translate[tag.name] : tag.name;
};
