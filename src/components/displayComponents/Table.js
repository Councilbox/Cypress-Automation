import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

const TableWrapper = ({ headers, children }) => (
    <Table>
        <TableHead>
            <TableRow>
                {headers.map((header) => {
                    return(
                        <TableCell key={`header${header.name}`}>{header.name}</TableCell>
                    )
                })}
            </TableRow>
        </TableHead>
        <TableBody 
        >
            {children}
        </TableBody>
    </Table>
);

export default TableWrapper;
