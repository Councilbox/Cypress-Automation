import React from "react";
import { GridItem } from "./";
import { hasMorePages } from "../utils/pagination";
import { getPrimary, getSecondary } from "../styles/colors";

const primary = getPrimary();
const secondary = getSecondary();
const paginationButtonStyle = {
	cursor: "pointer",
	padding: "0.5em",
	paddingTop: "0.2em",
	paddingBottom: "0.2em",
	border: "1px solid",
	borderColor: secondary,
	color: secondary,
	marginLeft: "1px",
	marginRight: "1px"
};

const PaginationFooter = ({
	page,
	translate,
	length,
	total,
	limit,
	changePage
}) => {
	const totalPages = Math.ceil(total / limit);

	return (
		<React.Fragment>
			<GridItem xs={6} lg={6} md={6} style={{fontSize: '0.8rem'}}>
				{length > 0
					? `${translate.table_showing_part1} ${(page - 1) * limit +
							1} ${translate.table_showing_part2} ${(page - 1) *
							limit +
							length} ${translate.table_showing_part3} ${total} ${
							translate.table_showing_part4
					  }`
					: translate.table_no_results}
			</GridItem>
			<GridItem xs={6} lg={6} md={6}>
				<div style={{ float: "right" }}>
					{page > 1 && (
						<React.Fragment>
							<span
								onClick={() => changePage(1)}
								style={paginationButtonStyle}
							>
								{translate.table_button_first}
							</span>
							<span
								onClick={() => changePage(page - 1)}
								style={paginationButtonStyle}
							>
								{translate.table_button_previous}
							</span>
						</React.Fragment>
					)}
					{showPages(totalPages, page, changePage)}
					{hasMorePages(page, total, limit) && (
						<React.Fragment>
							<span
								onClick={() => changePage(page + 1)}
								style={paginationButtonStyle}
							>
								{translate.table_button_next}
							</span>
							<span
								onClick={() =>
									changePage(Math.ceil(total / limit))
								}
								style={paginationButtonStyle}
							>
								{translate.table_button_last}
							</span>
						</React.Fragment>
					)}
				</div>
			</GridItem>
		</React.Fragment>
	);
};

const showPages = (numPages, active, changePage) => {
	let pages = [];
	for (let i = 1; i <= numPages; i++) {
		pages.push(
			<span
				key={`page_${i}`}
				onClick={active !== i ? () => changePage(i) : () => {}}
				style={{
					...paginationButtonStyle,
					borderColor: active === i ? primary : secondary,
					color: active === i ? primary : secondary
				}}
			>
				{i}
			</span>
		);
	}
	return pages;
};

export default PaginationFooter;
