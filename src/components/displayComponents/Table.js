import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

const TableWrapper = ({ headers = [], children }) => (
    <Table>
        <TableHead>
            <TableRow>
                {headers.map((header, index) => {
                    return(
                        <TableCell key={`header_${index}`}>{header.name}</TableCell>
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
