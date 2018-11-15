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

const PARTNERS_LIMIT = 50;

class PartnersBookPage extends React.Component {

    state = {
        deleteModal: false,
        selectedId: null
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
                    ref={table => (this.table = table)}
                    translate={translate}
                    defaultLimit={PARTNERS_LIMIT}
                    menuButtons={
                        <div style={{ marginRight: '0.9em' }}>
                            <BasicButton
                                text={this.props.translate.add_partner}
                                onClick={this.addPartner}
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
                    page={1}
                    loading={this.props.data.loading}
                    length={this.props.data.bookParticipants.list.length}
                    total={this.props.data.bookParticipants.total}
                    refetch={this.props.data.refetch}
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
                            value: "position",
                            translation: translate.position
                        }
                    ]}
                    headers={headers}
                >
                    {this.props.data.bookParticipants.list.map(
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

        if(isMobile){
            return(
                <Card
                    style={{marginBottom: '0.5em', padding: '0.3em', position: 'relative'}}
                    onClick={() => bHistory.push(`/company/${this.props.companyId}/book/${participant.id}`)}
                >
                    <Grid>
                        <GridItem xs={4} md={4} style={{fontWeight: '700'}}>
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

                        <GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.participant_data}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							<span style={{fontWeight: '700'}}>{`${participant.name} ${participant.surname}`}</span>
                        </GridItem>

						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.dni}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{participant.dni}
                        </GridItem>

						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.position}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{participant.position}
                        </GridItem>

                        <GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.subscribe_date}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {participant.subscribeDate? moment(participant.subscribeDate).format('LLL') : '-'}
                        </GridItem>

                        <GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.unsubscribe_date}
                        </GridItem>
                        <GridItem xs={7} md={7}>
                            {participant.unsubscribeDate? moment(participant.unsubscribeDate).format('LLL') : '-'}
                        </GridItem>
                    </Grid>
                    <div style={{position: 'absolute', top: '5px', right: '5px'}}>
                        <CloseIcon onClick={event => {
                            event.stopPropagation();
                            this.props.deleteBookParticipant(participant.id);
                        }}/>
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
                    <span style={{fontWeight: '700'}}>{`${participant.name} ${participant.surname}`}</span>
                    {representative &&
                        <React.Fragment>
                            <br/>{`${representative.name} ${representative.surname}`}
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
                    {participant.subscribeDate? moment(participant.subscribeDate).format('LLL') : '-'}
                </TableCell>
                <TableCell>
                    {participant.unsubscribeDate? moment(participant.unsubscribeDate).format('LLL') : '-'}
                </TableCell>
                <TableCell>
                    <div style={{ width: '3em' }}>
                        {this.state.showActions &&
                            <CloseIcon onClick={event => {
                                event.stopPropagation();
                                this.props.deleteBookParticipant(participant.id);
                            }}/>
                        }
                    </div>
                </TableCell>
            </TableRow>
        )
    }
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
                }
                position
                surname
                subscribeDate
                unsubscribeDate
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
                limit: PARTNERS_LIMIT,
                offset: 0,
                orderBy: 'fullName',
                orderDirection: 'asc'
            }
        },
        notifyOnNetworkStatusChange: true
    })
}),
graphql(deleteBookParticipant)
)(withTranslations()(withRouter(PartnersBookPage)));