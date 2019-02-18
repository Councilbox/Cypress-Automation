import React from 'react';
import { Table, CloseIcon, DateWrapper, Checkbox, Grid, GridItem } from '../../displayComponents';
import { bHistory } from '../../containers/App';
import { TableRow, TableCell } from 'material-ui';
import TableStyles from "../../styles/table";
import { getPrimary } from "../../styles/colors";
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";
import { isMobile } from 'react-device-detect';
import { Card } from 'material-ui';


class CouncilsList extends React.Component {

    state = {
        open: false,
        selectedIds: new Map()
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
        const { councils, translate, openDeleteModal, company, link, selectedIds } = this.props;
        let headers = link === '/finished' ? [
            { selectAll: <Checkbox onChange={this.props.selectAll} value={selectedIds.size === councils.length} /> },
            { name: translate.date_real_start },
            { name: translate.table_councils_duration },
            { name: translate.name },
            { name: '' }
        ] : [
                { selectAll: <Checkbox onChange={this.props.selectAll} value={selectedIds.size === councils.length} /> },
                { name: translate.date_real_start },
                { name: translate.name },
                { name: '' }
            ]
        return (
            <Table
                headers={headers}
                companyID={company.id}
            >
                {councils.map(council => {
                    return (
                        <CouncilListItem
                            council={council}
                            company={company}
                            select={this.props.select}
                            selected={selectedIds.has(council.id)}
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

class CouncilListItem extends React.PureComponent {

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

    deleteIcon = councilID => {
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
        const { council, company, link, translate, selected } = this.props;
        
        if (isMobile) {
            return (
                <Card
                    style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
                    onClick={() => {
                        this.props.disabled ?
                            this.props.showModal()
                            :
                            bHistory.push(
                                `/company/${company.id}/council/${council.id}${link}`
                            )
                    }}
                >
                    <Grid>
                        <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                            {translate.name}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {council.name || translate.dashboard_new}
                        </GridItem>

                        {link === '/finished' ?
                            <React.Fragment>
                                <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                                    {translate.table_councils_duration}
                                </GridItem>
                                <GridItem xs={7} md={7}>
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
                                </GridItem>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                                    {translate.date_real_start}
                                </GridItem>
                                <GridItem xs={7} md={7}>
                                    <DateWrapper
                                        format="DD/MM/YYYY"
                                        date={
                                            council.dateStart
                                        }
                                    />
                                </GridItem>
                            </React.Fragment>
                        }
                    </Grid>
                    <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                        {this.deleteIcon(council.id)}
                    </div>
                </Card>
            )
        }

        return (
            <TableRow
                hover
                onMouseOver={this.mouseEnterHandler}
                selected={selected}
                onMouseLeave={this.mouseLeaveHandler}
                style={{ ...TableStyles.ROW, backgroundColor: this.props.disabled ? 'whiteSmoke' : 'inherit' }}
                onClick={() => {
                    this.props.disabled ?
                        this.props.showModal()
                        :
                        bHistory.push(
                            `/company/${company.id}/council/${council.id}${link}`
                        )
                }}
            >
                <TableCell onClick={event => event.stopPropagation()} style={{ cursor: 'auto' }}>
                    <div style={{ width: '2em' }}>
                        {(this.state.showActions || selected) &&
                            <Checkbox
                                value={selected}
                                onChange={() =>
                                    this.props.select(council.id)
                                }
                            />
                        }
                    </div>
                </TableCell>
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
                    <div style={{ width: '15em', display: 'flex', flexDirection: 'row' }}>
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
                    <div style={{ width: '3em' }}>
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