import React from "react";
import { GridItem } from "./";
import { hasMorePages } from "../utils/pagination";
import { getPrimary, getSecondary } from "../styles/colors";
import Select from 'antd/lib/select';
import SelectInput from "./SelectInput";
import { MenuItem } from "material-ui";
import { isMobile } from "../utils/screen";


const primary = getPrimary();
const secondary = getSecondary();
const paginationButtonStyle = {
	cursor: "pointer",
	padding: "0.5em",
	paddingTop: "0.2em",
	paddingBottom: "0.2em",
	border: "1px solid",
	borderColor: secondary,
	userSelect: 'none',
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
	md,
	xs,
	changePage
}) => {
	const totalPages = Math.ceil(total / limit);

	if (isMobile) {
		return (
			<div style={{}}>
				<div>
					{length > 0
						? `${translate.table_showing_part1} ${(page - 1) * limit +
						1} ${translate.table_showing_part2} ${(page - 1) *
						limit +
						length} ${translate.table_showing_part3} ${total} ${
						translate.table_showing_part4
						}`
						: translate.table_no_results}
				</div>
				<div style={{ marginTop: "0.6em", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<React.Fragment>
						{page > 1 && (
							<span
								onClick={() => changePage(page - 1)}
								style={paginationButtonStyle}
							>
								{translate.table_button_previous}
							</span>
						)}
						{hasMorePages(page, total, limit) && (
							<span
								onClick={() => changePage(page + 1)}
								style={paginationButtonStyle}
							>
								{translate.table_button_next}
							</span>
						)}
						<div style={{ display: 'flex' }}>
							{showPagesMobile(totalPages, page, changePage)}
						</div>
					</React.Fragment>
				</div>
			</div>
		)
	}
	return (
		<React.Fragment>
			<GridItem xs={window.innerWidth < 480 ? 12 : xs ? xs : 5} lg={5} md={md ? md : 6} style={{ fontSize: '0.7rem' }}>
				{length > 0
					? `${translate.table_showing_part1} ${(page - 1) * limit +
					1} ${translate.table_showing_part2} ${(page - 1) *
					limit +
					length} ${translate.table_showing_part3} ${total} ${
					translate.table_showing_part4
					}`
					: translate.table_no_results}
			</GridItem>
			<GridItem xs={window.innerWidth < 480 ? 12 : xs ? xs : 7} lg={7} md={md ? md : 7} style={{ display: 'flex', justifyContent: 'flex-end' }}>
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
					<div style={{ display: 'flex' }}>
						{showPages(totalPages, page, changePage)}
					</div>
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
		const index = i;
		pages.push(
			<span
				key={`page_${index}`}
				onClick={active !== index ? () => changePage(index) : () => { }}
				style={{
					...paginationButtonStyle,
					borderColor: active === index ? primary : secondary,
					color: active === index ? primary : secondary,
					cursor: active === index ? 'auto' : 'pointer'
				}}
			>
				{index}
			</span>
		);
		if (i === 3 && numPages > 6) {
			const value = (active > 3 && active < numPages - 3) ? active : '...';
			const options = [];
			for (let j = 4; j < (numPages - 2); j++) {
				options.push(<Select.Option key={`pagination_${j}`} value={j}><span>{j}</span></Select.Option>)
			}
			pages.push(
				<Select
					key={value}
					size="small"
					defaultValue="..."
					dropdownMatchSelectWidth={false}
					showSearch
					value={value}
					onChange={changePage}
					style={{
						padding: '0.1em'
					}}
				>
					{options}
				</Select>
			);
			i = numPages - 3;
		}
	}
	return pages;
};


const showPagesMobile = (numPages, active, changePage) => {
	
	if (numPages > 1) {
		return (
			<div>
				<SelectInput
					value={active}
					onChange={event => changePage(event.target.value)}
					styles={{ marginTop: "0", marginLeft: "2px" }}
				>
					{Array.from(Array(numPages).keys()).map(page =>
						<MenuItem value={page + 1} key={page + 1} >{page + 1}</MenuItem>

					)}
				</SelectInput>
			</div>
		)
	}
};

export default PaginationFooter;
