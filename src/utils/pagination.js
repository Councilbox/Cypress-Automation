export const hasMorePages = (page, total, limit) => {
	return page * limit < total;
};
