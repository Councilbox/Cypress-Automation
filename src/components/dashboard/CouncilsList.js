import React from 'react';
import { Table, CloseIcon, DateWrapper } from '../../displayComponents';
import { bHistory } from '../../containers/App';
import { TableRow, TableCell } from 'material-ui';
import TableStyles from "../../styles/table";
import { getPrimary } from "../../styles/colors";

const CouncilsList = ({ councils, translate, openDeleteModal, company, link }) => {
    let headers = link === '/finished' ? [
        { name: translate.date_real_start },
        { name: translate.table_councils_duration },
        { name: translate.name },
        { name: '' }
    ] : [
        { name: translate.date_real_start },
        { name: translate.name },
        { name: '' }
    ]
    return(
        <Table
            headers={headers}
            companyID={company.id}
        >
            {councils.map(council => {
                return (
                    <HoverableRow
                        council={council}
                        company={company}
                        key={`council${council.id}`}
                        translate={translate}
                        openDeleteModal={openDeleteModal}
                        link={link}
                    />
                );
            })}
        </Table>
    )
}

class HoverableRow extends React.PureComponent {

    state = {
        showActions: false
    }

    mouseEnterHandler = () => {
        this.setState({
            showActions: true
        })
    }

    mouseLeaveHandler = () => {
        this.setState({
            showActions: false
        })
    }

    deleteIcon = (councilID) => {
        const primary = getPrimary();

        return (
            <CloseIcon
                style={{ color: primary }}
                onClick={event => {
                    this.props.openDeleteModal(councilID);
                    event.stopPropagation();
                }}
            />
        );
    }


    render() {
        const { council, company, link, translate } = this.props;


        return (
            <TableRow
                hover
                onMouseEnter={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
                style={TableStyles.ROW}
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
                        format="DD/MM/YYYY"
                        date={
                            council.dateStart
                        }
                    />
                </TableCell>
                {link === '/finished' && <TableCell
                    style={TableStyles.TD}
                >
                    <div style={{width: '15em', display: 'flex', flexDirection: 'row'}}>
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
                </TableCell>}
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
                    <div style={{width: '3em'}}>
                        {this.state.showActions &&
                            this.deleteIcon(
                                council.id
                            )
                        }
                    </div>
                </TableCell>
            </TableRow>
        )
    }
}

export default CouncilsList;