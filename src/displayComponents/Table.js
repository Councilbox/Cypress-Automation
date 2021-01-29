import React from "react";
import Table, {
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableSortLabel
} from "material-ui/Table";
import TableStyles from "../styles/table";
import { isMobile } from "../utils/screen";

const TableWrapper = ({ headers = [], children, forceMobileTable, stylesHeader, stylesHeaderRow }) => (
	<React.Fragment>
		{isMobile && !forceMobileTable ?
			children
			:
			<Table className={'tableReuniones'} style={{ maxWidth: "100%", width: '100%' }}>
				<TableHead style={{ ...stylesHeader }} className={'hearderReunionesTabla'}>
					<TableRow style={{ ...stylesHeaderRow }}>
						{headers.map((header, index) => (
								header.selectAll ?
									<TableCell key={`header_${index}`}>
										{header.selectAll}
									</TableCell>
									:
									<TableCell
										style={TableStyles.TH}
										key={`header_${index}`}
										sortDirection={header.order}
									>
										{header.canOrder ? (
											<TableSortLabel
												active={header.active}
												direction={header.order}
												onClick={() => header.handler()}
											>
												{header.name}
											</TableSortLabel>
										) : (
												header.name
											)}
									</TableCell>
							))}
					</TableRow>
				</TableHead>
				<TableBody>{children}</TableBody>
			</Table>
		}
	</React.Fragment>

);

export default TableWrapper;
