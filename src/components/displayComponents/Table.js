import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import TableStyles from '../../styles/table';

const TableWrapper = ({ headers = [], children }) => (
    <Table style={{maxWidth: '100%'}}>
        <TableHead>
            <TableRow>
                {headers.map((header, index) => {
                    return(
                        <TableCell style={TableStyles.TH} key={`header_${index}`} sortDirection={header.order}>
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
