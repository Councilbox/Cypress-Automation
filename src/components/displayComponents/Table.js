import React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

const TableWrapper = ({ headers, children }) => (
    <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
                {headers.map((header) => {
                    return(
                        <TableHeaderColumn key={`header${header.name}`}>{header.name}</TableHeaderColumn>
                    )
                })}
            </TableRow>
        </TableHeader>
        <TableBody 
            displayRowCheckbox={false}
            showRowHover={true}
        >
            {children}
        </TableBody>
    </Table>
);

export default TableWrapper;
