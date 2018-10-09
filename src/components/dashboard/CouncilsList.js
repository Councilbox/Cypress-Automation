import React from 'react';
import { Table, CloseIcon, DateWrapper } from '../../displayComponents';
import { bHistory } from '../../containers/App';
import { TableRow, TableCell } from 'material-ui';
import TableStyles from "../../styles/table";
import { getPrimary } from "../../styles/colors";
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";

class CouncilsList extends React.Component {

    state = {
        open: false
    }

    openCantAccessModal = () => {
        this.setState({
            open: true
        });
    }

    closeCantAccessModal = () => {
        this.setState({
            open: false
        })
    }

    render() {
        const { councils, translate, openDeleteModal, company, link } = this.props;
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
                            showModal={this.openCantAccessModal}
                            key={`council${council.id}`}
                            translate={translate}
                            disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
                            openDeleteModal={openDeleteModal}
                            link={link}
                        />
                    );
                })}
                <CantCreateCouncilsModal
                    translate={translate}
                    open={this.state.open}
                    requestClose={this.closeCantAccessModal}
                />
            </Table>
        )
    }
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
                style={{...TableStyles.ROW, backgroundColor: this.props.disabled? 'whiteSmoke' : 'inherit'}}
                onClick={() => {
                    this.props.disabled?
                        this.props.showModal()
                    :
                        bHistory.push(
                            `/company/${company.id}/council/${council.id}${link}`
                        )
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