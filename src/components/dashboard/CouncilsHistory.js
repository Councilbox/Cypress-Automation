import React from 'react';
import { Table, DateWrapper, BasicButton } from '../../displayComponents';
import { bHistory } from '../../containers/App';
import { TableRow, TableCell } from 'material-ui';
import TableStyles from "../../styles/table";
import { getSecondary } from "../../styles/colors";

const CouncilsHistory = ({ councils, translate, deleteCouncil, openDeleteModal, company, link }) => {

    const generateLink = (council) => {
        return `/company/${company.id}/council/${council.id}`;
    }

    return(
        <Table
            headers={[
                { name: translate.date_real_start },
                { name: translate.table_councils_duration },
                { name: translate.name },
                { name: translate.certificates }
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
                                generateLink(council)
                            );
                        }}
                    >
                        <TableCell
                            style={TableStyles.TD}
                        >
                            <DateWrapper
                                format="DD/MM/YYYY"
                                date={
                                    council.dateStart
                                }
                            />
                        </TableCell>
                        <TableCell
                            style={TableStyles.TD}
                        >
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <DateWrapper
                                    format="HH:mm"
                                    date={
                                        council.dateRealStart
                                    }
                                /> {` - `}
                                <DateWrapper
                                    format="HH:mm"
                                    date={
                                        council.dateEnd
                                    }
                                />
                            </div>
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
                            <BasicButton
                                text={translate.certificates}
                                color="white"
                                textStyle={{textTransform: 'none'}}
                                buttonStyle={{border: `2px solid ${getSecondary()}`}}
                                onClick={(event) => {
                                    bHistory.push(`/company/${company.id}/council/${council.id}/certificates`);
                                    event.stopPropagation();
                                }}
                            />
                        </TableCell>
                    </TableRow>
                );
            })}
        </Table>
    )
}

export default CouncilsHistory;