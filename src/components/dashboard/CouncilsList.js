import React from 'react';
import { Table, CloseIcon, DateWrapper, Checkbox, Grid, GridItem } from '../../displayComponents';
import { bHistory } from '../../containers/App';
import { TableRow, TableCell } from 'material-ui';
import { withRouter } from 'react-router-dom';
import TableStyles from "../../styles/table";
import { getPrimary } from "../../styles/colors";
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";
import { isMobile } from 'react-device-detect';
import { Card } from 'material-ui';
import { sendGAevent } from '../../utils/analytics';
import { useHoverRow } from '../../hooks';

const CouncilsList = ({ councils, translate, openDeleteModal, company, link, selectedIds, ...props }) => {
    const [open, setOpen] = React.useState(false);

    const openCantAccessModal = () => {
        setOpen(true);
    }

    const closeCantAccessModal = () => {
        setOpen(false);
    }

    let headers = link === '/finished' ? [
        { selectAll: <Checkbox onChange={props.selectAll} value={selectedIds.size === councils.length} /> },
        { name: translate.date_real_start },
        { name: translate.table_councils_duration },
        { name: translate.name },
        { name: '' }
    ] : [
        { selectAll: <Checkbox onChange={props.selectAll} value={selectedIds.size === councils.length} /> },
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
                        select={props.select}
                        selected={selectedIds.has(council.id)}
                        showModal={openCantAccessModal}
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
                open={open}
                requestClose={closeCantAccessModal}
            />
        </Table>
    )
}


const CouncilListItem = withRouter(({ council, company, link, translate, selected, ...props }) => {
    const [show, handlers] = useHoverRow();
    const primary = getPrimary();

    const deleteIcon = councilID => {
        return (
            <CloseIcon
                style={{ color: primary }}
                onClick={event => {
                    props.openDeleteModal(councilID);
                    event.stopPropagation();
                }}
            />
        );
    }

    const getSectionTranslation = type => {
		const texts = {
			drafts: translate.companies_draft,
			calendar: translate.companies_calendar,
			live: translate.companies_live,
			act: translate.companies_writing,
			confirmed: translate.act_book,
			history: translate.dashboard_historical
		}

		return texts[type];
	}

    if (isMobile) {
        return (
            <Card
                style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
                onClick={() => {
                    props.disabled ?
                        props.showModal()
                        :
                        sendGAevent({
                            category: 'Reuniones',
                            action: `${getSectionTranslation(props.match.params.section)} - Acceso`,
                            label: company.businessName
                        })
                        bHistory.push(`/company/${company.id}/council/${council.id}${link}`)
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
                                    date={council.dateEnd}
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
                    {deleteIcon(council.id)}
                </div>
            </Card>
        )
    }

    return (
        <TableRow
            hover
            {...handlers}
            selected={selected}
            style={{ ...TableStyles.ROW, backgroundColor: props.disabled ? 'whiteSmoke' : 'inherit' }}
            onClick={() => {
                props.disabled ?
                    props.showModal()
                    :
                    sendGAevent({
                        category: 'Reuniones',
                        action: `${getSectionTranslation(props.match.params.section)} - Acceso`,
                        label: company.businessName
                    })
                    bHistory.push(
                        `/company/${company.id}/council/${council.id}${link}`
                    )
            }}
        >
            <TableCell onClick={event => event.stopPropagation()} style={{ cursor: 'auto' }}>
                <div style={{ width: '2em' }}>
                    {(show || selected) &&
                        <Checkbox
                            value={selected}
                            onChange={() =>
                                props.select(council.id)
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
                    date={council.dateStart}
                />
            </TableCell>
            {link === '/finished' &&
                <TableCell
                    style={TableStyles.TD}
                >
                    <div style={{ width: '15em', display: 'flex', flexDirection: 'row' }}>
                        <DateWrapper
                            format="HH:mm"
                            date={council.dateRealStart}
                        /> {` - `}
                        <DateWrapper
                            format="HH:mm"
                            date={
                                council.dateEnd
                            }
                        />
                    </div>
                </TableCell>
            }
            <TableCell
                style={{
                    ...TableStyles.TD,
                    width: "65%"
                }}
            >
                {council.name || translate.dashboard_new}
            </TableCell>
            <TableCell
                style={TableStyles.TD}
            >
                <div style={{ width: '3em' }}>
                    {show && deleteIcon(council.id)}
                </div>
            </TableCell>
        </TableRow>
    )
})


export default CouncilsList;