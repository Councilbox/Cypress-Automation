import React from 'react';
import { GridItem } from '.';
import { isMobile } from '../utils/screen';


const PaginationTableShowing = ({
	page,
	translate,
	length,
	total,
	limit,
	lg,
	md,
	xs,
}) => {
	if (isMobile) {
		return (
			<div style={{ marginBottom: '1em' }}>
				<div>
					{length > 0 ?
						`${translate.table_showing_part1} ${(page - 1) * limit
						+ 1} ${translate.table_showing_part2} ${(page - 1)
						* limit
						+ length} ${translate.table_showing_part3} ${total} ${translate.table_showing_part4
						}`
						: translate.table_no_results}
				</div>
			</div>
		);
	}
	return (
		<React.Fragment>
			<GridItem xs={window.innerWidth < 480 ? 12 : xs || 12} lg={lg || 12} md={md || 12} style={{ fontSize: '0.7rem' }}>
				{length > 0 ?
					`${translate.table_showing_part1} ${(page - 1) * limit
					+ 1} ${translate.table_showing_part2} ${(page - 1)
					* limit
					+ length} ${translate.table_showing_part3} ${total} ${translate.table_showing_part4
					}`
					: translate.table_no_results}
			</GridItem>
		</React.Fragment>
	);
};

export default PaginationTableShowing;
