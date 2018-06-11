import React from 'react';
import { Table, CloseIcon, DateWrapper } from '../../displayComponents';
import { bHistory } from '../../containers/App';
import { TableRow, TableCell } from 'material-ui';
import TableStyles from "../../styles/table";
import { getPrimary } from "../../styles/colors";


const CouncilsList = ({ councils, translate, deleteCouncil, openDeleteModal, company, link }) => {
    const deleteIcon = (councilID) => {
        const primary = getPrimary();
    
        return (
            <CloseIcon
                style={{ color: primary }}
                onClick={event => {
                    openDeleteModal(councilID);
                    event.stopPropagation();
                }}
            />
        );
    }

    return(
        <Table
            headers={[
                { name: translate.date_real_start },
                { name: translate.name },
                { name: translate.delete }
            ]}
            companyID={company.id}
        >
            {councils.map(council => {
                return (
                    <TableRow
                        hover
                        style={TableStyles.ROW}
                        key={`council${council.id}`}
                        onClick={() => {
                            bHistory.push(
                                `/company/${company.id}/council/${council.id}${link}`
                            );
                        }}
                    >
                        <TableCell
                            style={TableStyles.TD}
                        >
                            <DateWrapper
                                format="DD/MM/YYYY HH:mm"
                                date={
                                    council.dateStart
                                }
                            />
                        </TableCell>
                        <TableCell
                            style={{
                                ...TableStyles.TD,
                                width: "65%"
                            }}
                        >
                            {council.name ||
                                translate.dashboard_new}
                        </TableCell>
                        <TableCell
                            style={TableStyles.TD}
                        >
                            {deleteIcon(
                                council.id
                            )}
                        </TableCell>
                    </TableRow>
                );
            })}
        </Table>
    )
}

export default CouncilsList;