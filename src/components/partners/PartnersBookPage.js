import React from 'react'
import { CardPageLayout, EnhancedTable, LoadingSection, CloseIcon, BasicButton, Grid, GridItem, AlertConfirm } from '../../displayComponents';
import { TableRow, TableCell, Card } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { bHistory } from '../../containers/App';
import { getPrimary } from '../../styles/colors';
import withTranslations from '../../HOCs/withTranslations';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { moment } from '../../containers/App';
import { unaccent } from '../../utils/CBX';
import { council } from '../../queries';
let XLSX;
import('xlsx').then(data => XLSX = data);


class PartnersBookPage extends React.Component {

    state = {
        deleteModal: false,
        selectedId: null,
        partners: [],
        appliedFilters: {
            limit: 50,
            text: 0,
            field: 'fullName',
            page: 1,
            notificationStatus: null,
            orderBy: 'name',
            orderDirection: 'asc'
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.data.loading) {
            const councilParticipants = nextProps.data.bookParticipants;
            const filteredParticipants = applyFilters(councilParticipants ? councilParticipants.list : [], prevState.appliedFilters)
            const offset = (prevState.appliedFilters.page - 1) * prevState.appliedFilters.limit;
            let paginatedParticipants = filteredParticipants.slice(offset, offset + prevState.appliedFilters.limit);
            return {
                participants: paginatedParticipants,
                total: filteredParticipants.length
            }
        }

        return null;
    }

    updateFilteredParticipants = appliedFilters => {
        const councilParticipants = this.props.data.bookParticipants;
        const filteredParticipants = applyFilters(councilParticipants ? councilParticipants.list : [], appliedFilters)
        const offset = (appliedFilters.page - 1) * appliedFilters.limit;
        let paginatedParticipants = filteredParticipants.slice(offset, offset + appliedFilters.limit);
        return {
            participants: paginatedParticipants,
            total: filteredParticipants.length
        }
    }

    resetPage = () => {
        this.table.setPage(this.state.appliedFilters.page);
    }

    updateFilters = value => {
        const appliedFilters = {
            ...this.state.appliedFilters,
            text: value.filters[0] ? value.filters[0].text : '',
            field: value.filters[0] ? value.filters[0].field : '',
            page: (value.options.offset / value.options.limit) + 1,
            limit: value.options.limit,
            orderBy: value.options.orderBy,
            orderDirection: value.options.orderDirection
        }

        const filteredParticipants = this.updateFilteredParticipants(appliedFilters);

        this.setState({
            appliedFilters,
            participants: filteredParticipants.participants,
            total: filteredParticipants.total
        }, () => this.resetPage());
    }


    componentDidMount() {
        this.props.data.refetch();
    }

    addPartner = () => {
        bHistory.push(`/company/${this.props.match.params.company}/book/new`);
    }

    showDeleteModal = () => {
        this.setState({
            deleteModal: true
        });
    }

    closeDeleteModal = () => {
        this.setState({
            deleteModal: false,
            selectedId: null
        })
    }

    selectedIdToDelete = id => {
        this.setState({
            selectedId: id,
            deleteModal: true
        })
    }

    deleteBookParticipant = async () => {
        const response = await this.props.mutate({
            variables: {
                participantId: this.state.selectedId
            }
        });

        if (response) {
            this.props.data.refetch();
            this.closeDeleteModal();
        }
    }


    createXLSX = () => {
        this.props.data.refetch();
        let lista = this.props.data.bookParticipants.list;
        let arrayFinal = []
        for (let index = 0; index < lista.length; index++) {
            let arrayRepresentative
            let { representative, __typename, ...list } = lista[index];
            if (representative !== null) {
                let { id, dni, name, position, state, surname } = representative;
                arrayRepresentative = {
                    rId: id,
                    rDni: dni,
                    rName: name,
                    rPosition: position,
                    rState: state,
                    rSurname: surname
                }
            }
            let a = Object.assign(list, arrayRepresentative)
            arrayFinal.push(a);
        }

        var ws = XLSX.utils.json_to_sheet(arrayFinal);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Libro de socios");
        XLSX.writeFile(wb, "LibroDeSocios-" + this.props.match.params.company + ".xlsx");
    }

    render() {

        const { translate } = this.props;
        const primary = getPrimary();

        if (!this.props.data.bookParticipants) {
            return <LoadingSection />;
        }

        let headers = [
            {
                text: translate.state,
                name: 'state',
                canOrder: true
            },
            {
                text: translate.participant_data,
                name: "fullName",
                canOrder: true
            },
            {
                text: translate.dni,
                name: "dni",
                canOrder: true
            },
            {
                text: translate.position,
                name: "position",
                canOrder: true
            },
            {
                text: translate.subscribe_date,
                name: 'subscribeDate',
                canOrder: true
            },
            {
                text: translate.unsubscribe_date,
                name: 'unsubscribeDate',
                canOrder: true
            },
            {
                text: translate.subscribe_act_number,
                name: 'actaAlta',
                canOrder: true
            },
            {
                text: translate.unsubscribe_act_number,
                name: 'actaBaja',
                canOrder: true
            },
            {
                text: '',
                name: '',
                canOrder: false
            },
        ];



        return (
            <CardPageLayout title={this.props.translate.simple_book}>
                <AlertConfirm
                    title={translate.send_to_trash}
                    bodyText={translate.delete_items}
                    open={this.state.deleteModal}
                    buttonAccept={translate.send_to_trash}
                    buttonCancel={translate.cancel}
                    modal={true}
                    acceptAction={this.deleteBookParticipant}
                    requestClose={this.closeDeleteModal}
                />
                <EnhancedTable
                    exporXLSX={true}
                    ref={table => (this.table = table)}
                    translate={translate}
                    defaultLimit={50}
                    menuButtons={
                        <div style={{ marginRight: '0.9em' }}>
                            <BasicButton
                                text={this.props.translate.add_partner}
                                onClick={this.addPartner}
                                color={'white'}
                                buttonStyle={{ border: `2px solid ${primary}`, marginRight: "0.9em" }}
                                textStyle={{ color: primary, textTransform: 'none', fontWeight: '700' }}
                            />
                            <BasicButton
                                text={"Exportar a XLSX"} //TRADUCCION
                                onClick={this.createXLSX}
                                color={'white'}
                                buttonStyle={{ border: `2px solid ${primary}` }}
                                textStyle={{ color: primary, textTransform: 'none', fontWeight: '700' }}
                            />
                        </div>
                    }
                    selectedCategories={[{
                        field: "state",
                        value: 'all',
                        label: translate.all_plural
                    }]}
                    categories={[[
                        {
                            field: "state",
                            value: 'all',
                            label: translate.all_plural
                        },
                        {
                            field: "state",
                            value: 1,
                            label: translate.subscribed
                        },
                        {
                            field: "state",
                            value: 0,
                            label: translate.unsubscribed
                        },
                        {
                            field: "state",
                            value: 2,
                            label: translate.other
                        }
                    ]]}
                    defaultFilter={"fullName"}
                    defaultOrder={["fullName", "asc"]}
                    limits={[50, 100]}
                    page={this.state.appliedFilters.page}
                    loading={this.props.data.loading}
                    length={this.state.participants.length}
                    total={this.state.total}
                    refetch={this.updateFilters}
                    fields={[
                        {
                            value: "fullName",
                            translation: translate.participant_data
                        },
                        {
                            value: "dni",
                            translation: translate.dni
                        },
                        {
                            value: "state",
                            translation: translate.state
                        },
                        {
                            value: "position",
                            translation: translate.position
                        },
                        {
                            value: "nActa",
                            translation: "Nº de acta"//translate.subscribe_act
                        },
                    ]}
                    headers={headers}
                >
                    {this.state.participants.map(
                        (participant, index) => {
                            return (
                                <HoverableRow
                                    key={`participant${participant.id}`}
                                    deleteBookParticipant={this.selectedIdToDelete}
                                    participant={participant}
                                    representative={participant.representative}
                                    translate={translate}
                                    companyId={this.props.match.params.company}
                                />
                            );
                        }
                    )}
                </EnhancedTable>
            </CardPageLayout>
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


    render() {
        const { participant, translate, representative } = this.props;

        if (isMobile) {
            return (
                <Card
                    style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
                    onClick={() => bHistory.push(`/company/${this.props.companyId}/book/${participant.id}`)}
                >
                    <Grid>
                        <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                            {translate.state}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {participant.state === 1 &&
                                this.props.translate.subscribed
                            }
                            {participant.state === 0 &&
                                this.props.translate.unsubscribed
                            }
                            {participant.state === 2 &&
                                this.props.translate.other
                            }
                        </GridItem>

                        <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                            {translate.participant_data}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            <span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname}`}</span>
                        </GridItem>

                        <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                            {translate.dni}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {participant.dni}
                        </GridItem>

                        <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                            {translate.position}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {participant.position}
                        </GridItem>

                        <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                            {translate.subscribe_date}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {participant.subscribeDate ? moment(participant.subscribeDate).format('LL') : '-'}
                        </GridItem>

                        <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                            {translate.unsubscribe_date}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {participant.unsubscribeDate ? moment(participant.unsubscribeDate).format('LL') : '-'}
                        </GridItem>
                        <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                            {translate.subscribe_act_number}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {`${participant.subscribeActNumber || '-'}`}
                        </GridItem>
                        <GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
                            {translate.unsubscribe_act_number}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {`${participant.unsubscribeActNumber || '-'}`}
                        </GridItem>
                    </Grid>
                    <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                        <CloseIcon onClick={event => {
                            event.stopPropagation();
                            this.props.deleteBookParticipant(participant.id);
                        }} />
                    </div>
                </Card>
            )
        }

        return (
            <TableRow
                hover={true}
                onMouseOver={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
                onClick={() => bHistory.push(`/company/${this.props.companyId}/book/${participant.id}`)}
                style={{
                    cursor: "pointer",
                    fontSize: "0.5em"
                }}
            >
                <TableCell>
                    {participant.state === 1 &&
                        this.props.translate.subscribed
                    }
                    {participant.state === 0 &&
                        this.props.translate.unsubscribed
                    }
                    {participant.state === 2 &&
                        this.props.translate.other
                    }
                </TableCell>
                <TableCell>
                    <span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname}`}</span>
                    {representative &&
                        <React.Fragment>
                            <br />{`${representative.name} ${representative.surname}`}
                        </React.Fragment>
                    }
                </TableCell>
                <TableCell>
                    {`${participant.dni || ''}`}
                </TableCell>
                <TableCell>
                    {`${participant.position || ''}`}
                </TableCell>
                <TableCell>
                    {participant.subscribeDate ? moment(participant.subscribeDate).format('LL') : '-'}
                </TableCell>
                <TableCell>
                    {participant.unsubscribeDate ? moment(participant.unsubscribeDate).format('LL') : '-'}
                </TableCell>
                <TableCell>
                    {`${participant.subscribeActNumber || ''}`}
                </TableCell>
                <TableCell>
                    {`${participant.unsubscribeActNumber || ''}`}
                </TableCell>
                <TableCell>
                    <div style={{ width: '3em' }}>
                        {this.state.showActions &&
                            <CloseIcon onClick={event => {
                                event.stopPropagation();
                                this.props.deleteBookParticipant(participant.id);
                            }} />
                        }
                    </div>
                </TableCell>
            </TableRow>
        )
    }
}

const applyFilters = (participants, filters) => {

    return applyOrder(participants.filter(participant => {

        if (filters.text) {
            const unaccentedText = unaccent(filters.text.toLowerCase());

            if (filters.field === 'fullName') {
                const fullName = participant.name + " " + participant.surname;
                let repreName = '';
                if (participant.representative !== null) {
                    repreName = `${participant.representative.name} ${participant.representative.surname}`;
                }
                if (!unaccent(fullName.toLowerCase()).includes(unaccentedText)
                    && !unaccent(repreName.toLowerCase()).includes(unaccentedText)) {
                    return false;
                }
            }

            if (filters.field === 'position') {
                if (participant.representative !== null) {
                    if (!unaccent(participant.position.toLowerCase()).includes(unaccentedText) &&
                        !unaccent(participant.representative.position.toLowerCase()).includes(unaccentedText)) {
                        return false;
                    }
                } else {
                    if (!unaccent(participant.position.toLowerCase()).includes(unaccentedText)) {
                        return false;
                    }
                }
            }

            if (filters.field === 'dni') {
                if (participant.representative !== null) {
                    if (!unaccent(participant.dni.toLowerCase()).includes(unaccentedText) &&
                        !unaccent(participant.representative.dni.toLowerCase()).includes(unaccentedText)) {
                        return false;
                    }
                } else {
                    if (!unaccent(participant.dni.toLowerCase()).includes(unaccentedText)) {
                        return false;
                    }
                }
            }

            if (filters.field === 'state') {
                if (participant.representative !== null) {
                    if (!unaccent(participant.state.toString().toLowerCase()).includes(unaccentedText) &&
                        !unaccent(participant.representative.state.toString().toLowerCase()).includes(unaccentedText)) {
                        return false;
                    }
                } else {
                    if (!unaccent(participant.state.toLowerCase()).includes(unaccentedText)) {
                        return false;
                    }
                }
            }

            if (filters.field === 'nActa') {
                const nActa = `${participant.subscribeActNumber} ${participant.unsubscribeActNumber}`;
                if (!unaccent(nActa.toLowerCase()).includes(unaccentedText)) {
                    return false;
                }
            }
        }

        if (filters.notificationStatus) {
            if (participant.representative) {
                if (participant.representative.notifications[0].reqCode !== filters.notificationStatus) {
                    return false;
                }
            } else {
                if (participant.notifications[0].reqCode !== filters.notificationStatus) {
                    return false;
                }
            }
        }

        return true;
    }), filters.orderBy, filters.orderDirection);
}

const applyOrder = (participants, orderBy, orderDirection) => {
    return participants;
    return participants.sort((a, b) => {
        let participantA = a;
        let participantB = b;
        return participantA[orderBy] > participantB[orderBy]
    });
}

const bookParticipants = gql`
    query BookParticipants($companyId: Int!, $filters: [FilterInput], $options: OptionsInput){
        bookParticipants(companyId: $companyId, filters: $filters, options: $options){
            list {
                name
                id
                dni
                state
                representative {
                    id
                    name
                    surname
                    dni
                    state
                    position
                }
                position
                surname
                subscribeDate
                unsubscribeDate
                unsubscribeActNumber
                subscribeActNumber
            }
            total
        }
    }
`;
const deleteBookParticipant = gql`
    mutation deleteBookParticipant($participantId: Int!){
        deleteBookParticipant(participantId: $participantId){
            success
            message
        }
    }
`;

export default compose(
    graphql(bookParticipants, {
        options: props => ({
            variables: {
                companyId: props.match.params.company,
                options: {
                    orderBy: 'fullName',
                    orderDirection: 'asc'
                }
            },
            notifyOnNetworkStatusChange: true
        })
    }),
    graphql(deleteBookParticipant)
)(withTranslations()(withRouter(PartnersBookPage)));