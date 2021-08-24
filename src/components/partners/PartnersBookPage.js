/* eslint-disable no-unused-vars */
import React from 'react';
import { TableRow, TableCell, Card } from 'material-ui';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import withTranslations from '../../HOCs/withTranslations';
import { getPrimary } from '../../styles/colors';
import { bHistory, moment } from '../../containers/App';
import {
	CardPageLayout, EnhancedTable, LoadingSection, CloseIcon, BasicButton, Grid, GridItem, AlertConfirm
} from '../../displayComponents';
import { isMobile } from '../../utils/screen';

let XLSX;
import('xlsx').then(data => {
	XLSX = data;
});

const deleteBookParticipants = gql`
	mutation deleteBookParticipant($participantId: Int!){
		deleteBookParticipant(participantId: $participantId){
			success
			message
		}
	}
`;

const bookParticipants = gql`
	query BookParticipants($companyId: Int!, $filters: [FilterInput], $options: OptionsInput){
		bookParticipants(companyId: $companyId, filters: $filters, options: $options){
			list {
				name
				id
				dni
				state
				numParticipations
				socialCapital
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

const PartnersBookPage = ({ translate, client, ...props }) => {
	const [state, setState] = React.useState({
		deleteModal: false,
		selectedId: null,
		partners: [],
		appliedFilters: {
			limit: 50,
			text: '',
			field: 'fullName',
			page: 1,
			notificationStatus: null,
			orderBy: 'name',
			orderDirection: 'asc'
		}
	});
	const [bookParticipantsData, setBookParticipantsData] = React.useState();
	const [bookParticipantsTotal, setBookParticipantsTotal] = React.useState();
	const [loading, setLoading] = React.useState(true);
	const table = React.useRef();
	const primary = getPrimary();


	const getData = React.useCallback(async sinFiltros => {
		const response = await client.query({
			query: bookParticipants,
			variables: {
				companyId: +props.match.params.company,
				filters: !sinFiltros ? [{ field: state.appliedFilters.field, text: state.appliedFilters.text }] : [{ field: 'fullName', text: '' }],
				options: {
					limit: !sinFiltros ? state.appliedFilters.limit : 0,
					offset: !sinFiltros ? (state.appliedFilters.page - 1) * state.appliedFilters.limit : 0,
					orderDirection: !sinFiltros ? state.appliedFilters.orderDirection : 'asc',
					orderBy: !sinFiltros ? state.appliedFilters.orderBy : 'name',
				},
			},
		});
		setBookParticipantsData(response.data.bookParticipants.list);
		setBookParticipantsTotal(response.data.bookParticipants.total);
		setLoading(false);
		if (sinFiltros) {
			return response.data.bookParticipants.list;
		}
	}, [state.appliedFilters.page, state.appliedFilters.orderDirection, state.appliedFilters.orderBy, state.appliedFilters.text, state.appliedFilters.limit]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const updateFilters = value => {
		const appliedFilters = {
			...state.appliedFilters,
			text: value.filters[0] ? value.filters[0].text : '',
			field: value.filters[0] ? value.filters[0].field : '',
			page: (value.options.offset / value.options.limit) + 1,
			limit: value.options.limit,
			orderBy: value.options.orderBy,
			orderDirection: value.options.orderDirection
		};

		setState({
			...state,
			appliedFilters,
		});
	};

	const addPartner = () => {
		bHistory.push(`/company/${props.match.params.company}/book/new`);
	};


	const closeDeleteModal = () => {
		setState({
			...state,
			deleteModal: false,
			selectedId: null
		});
	};

	const selectedIdToDelete = id => {
		setState({
			...state,
			selectedId: id,
			deleteModal: true
		});
	};

	const deleteBookParticipant = async () => {
		const response = await client.mutate({
			mutation: deleteBookParticipants,
			variables: {
				participantId: state.selectedId
			}
		});

		if (response) {
			getData();
			closeDeleteModal();
		}
	};


	const createXLSX = async () => {
		const lista = await getData(true);
		const arrayFinal = [];
		for (let index = 0; index < lista.length; index++) {
			let arrayRepresentative;
			const {
				representative, __typename, name, dni, state: s, position, surname, subscribeDate, unsubscribeDate, unsubscribeActNumber, subscribeActNumber, id
			} = lista[index];
			const listaFinal = {
				id,
				[translate.state]: state === 1 ? 'Alta' : 'Baja',
				[translate.name]: name,
				[translate.surname]: surname,
				[translate.dni]: dni,
				[translate.position]: position,
				[translate.subscribe_date]: subscribeDate,
				[translate.unsubscribe_date]: unsubscribeDate,
				[translate.subscribe_act_number]: subscribeActNumber,
				[translate.unsubscribe_act_number]: unsubscribeActNumber,
			};
			if (representative !== null) {
				// eslint-disable-next-line no-shadow
				const { id, dni, name, position, state, surname } = representative;
				arrayRepresentative = {
					rId: id,
					[`r${translate.state}`]: state === 1 ? 'Alta' : 'Baja',
					[`r${translate.name}`]: name,
					[`r${translate.surname}`]: surname,
					[`r${translate.dni}`]: dni,
					[`r${translate.position}`]: position,
				};
			}
			const a = Object.assign(listaFinal, arrayRepresentative);
			arrayFinal.push(a);
		}

		const ws = XLSX.utils.json_to_sheet(arrayFinal);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Libro de socios');
		XLSX.writeFile(wb, `LibroDeSocios-${props.match.params.company}.xlsx`);
	};

	if (loading) {
		return <LoadingSection />;
	}

	const headers = [
		{
			text: translate.state,
			name: 'state',
			canOrder: true
		},
		{
			text: translate.participant_data,
			name: 'fullName',
			canOrder: true
		},
		{
			text: translate.dni,
			name: 'dni',
			canOrder: true
		},
		{
			text: translate.position,
			name: 'position',
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
		<CardPageLayout title={translate.simple_book}>
			<AlertConfirm
				title={translate.send_to_trash}
				bodyText={translate.delete_items}
				open={state.deleteModal}
				buttonAccept={translate.send_to_trash}
				buttonCancel={translate.cancel}
				modal={true}
				acceptAction={deleteBookParticipant}
				requestClose={closeDeleteModal}
			/>
			<EnhancedTable
				exporXLSX={true}
				ref={table}
				id="partners"
				translate={translate}
				defaultLimit={state.appliedFilters.limit}
				searchInMovil={isMobile}
				hideTextFilter={isMobile}
				menuButtons={
					<div style={{ marginRight: '0.9em' }}>
						<BasicButton
							text={translate.add_partner}
							onClick={addPartner}
							color={'white'}
							buttonStyle={{ border: `2px solid ${primary}`, marginRight: '0.9em' }}
							textStyle={{ color: primary, textTransform: 'none', fontWeight: '700' }}
							id={'add-partner-button'}
						/>
						<BasicButton
							text={`${translate.export_doc} XLSX`}
							onClick={createXLSX}
							id="export-partners-book"
							color={'white'}
							buttonStyle={{ border: `2px solid ${primary}` }}
							textStyle={{ color: primary, textTransform: 'none', fontWeight: '700' }}
						/>
					</div>
				}
				selectedCategories={[{
					field: 'state',
					value: 'all',
					label: translate.all_plural
				}]}
				categories={[[
					{
						field: 'state',
						value: 'all',
						label: translate.all_plural
					},
					{
						field: 'state',
						value: 1,
						label: translate.subscribed
					},
					{
						field: 'state',
						value: 0,
						label: translate.unsubscribed
					},
					{
						field: 'state',
						value: 2,
						label: translate.other
					}
				]]}
				defaultFilter={'fullName'}
				defaultOrder={['fullName', 'asc']}
				limits={[50, 100]}
				page={1}
				loading={loading}
				length={bookParticipantsData.length}
				total={bookParticipantsTotal}
				refetch={updateFilters}
				fields={[
					{
						value: 'fullName',
						translation: translate.participant_data
					},
					{
						value: 'dni',
						translation: translate.dni
					},
					{
						value: 'position',
						translation: translate.position
					},
					{
						value: 'subscribeActNumber',
						translation: 'Nº de acta'// translate.subscribe_act
					},
				]}
				headers={headers}
			>
				{bookParticipantsData.map(
					(participant, index) => (
						<HoverableRow
							id={`participant-${index}`}
							key={`participant-${participant.id}`}
							deleteBookParticipant={selectedIdToDelete}
							participant={participant}
							representative={participant.representative}
							translate={translate}
							companyId={props.match.params.company}
						/>
					)
				)}
			</EnhancedTable>
		</CardPageLayout>
	);
};

class HoverableRow extends React.PureComponent {
	state = {
		showActions: false
	}

	mouseEnterHandler = () => {
		this.setState({
			showActions: true
		});
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		});
	}


	render() {
		const { participant, translate, representative } = this.props;

		if (isMobile) {
			return (
				<Card
					style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
					id={this.props.id}
					onClick={() => bHistory.push(`/company/${this.props.companyId}/book/${participant.id}`)}
				>
					<Grid>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.state}
						</GridItem>
						<GridItem xs={7} md={7}>
							{participant.state === 1
								&& this.props.translate.subscribed
							}
							{participant.state === 0
								&& this.props.translate.unsubscribed
							}
							{participant.state === 2
								&& this.props.translate.other
							}
						</GridItem>

						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.participant_data}
						</GridItem>
						<GridItem xs={7} md={7}>
							<span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname || ''}`}</span>
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
			);
		}

		return (
			<TableRow
				hover={true}
				id={this.props.id}
				className={'rowLibroSocios'}
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				onClick={() => bHistory.push(`/company/${this.props.companyId}/book/${participant.id}`)}
				style={{
					cursor: 'pointer',
					fontSize: '0.5em'
				}}
			>
				<TableCell>
					{participant.state === 1
						&& this.props.translate.subscribed
					}
					{participant.state === 0
						&& this.props.translate.unsubscribed
					}
					{participant.state === 2
						&& this.props.translate.other
					}
				</TableCell>
				<TableCell>
					<span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname || ''}`}</span>
					{representative
						&& <React.Fragment>
							<br />{`${representative.name} ${representative.surname || ''}`}
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
						{this.state.showActions
							&& <CloseIcon onClick={event => {
								event.stopPropagation();
								this.props.deleteBookParticipant(participant.id);
							}} />
						}
					</div>
				</TableCell>
			</TableRow>
		);
	}
}

export default withTranslations()(withRouter(withApollo(PartnersBookPage)));
