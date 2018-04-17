import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';

const TableWrapper = ({ headers = [], children }) => (
    <Table>
        <TableHead>
            <TableRow>
                {headers.map((header, index) => {
                    return(
                        <TableCell key={`header_${index}`} sortDirection={header.order}>
                            {header.canOrder?
                                <TableSortLabel
                                    active={header.active}
                                    direction={header.order}
                                    onClick={() => header.handler()}
                                >
                                    {header.name}
                                </TableSortLabel>
                            :
                                header.name
                            }
                        </TableCell>
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
