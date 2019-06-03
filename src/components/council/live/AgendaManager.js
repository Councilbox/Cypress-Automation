import React from "react";
import AgendaDetailsSection from "./AgendaDetailsSection";
import AgendaSelector from "./AgendaSelector";
import { Card } from "material-ui";
import { graphql } from "react-apollo";
import { agendaManager } from "../../../queries";
import { LoadingSection, Scrollbar, AlertConfirm } from "../../../displayComponents";
import { AGENDA_STATES } from '../../../constants';
import { isMobile } from 'react-device-detect';
import { useOldState } from "../../../hooks";

const AgendaManager = ({ data, translate, council, company, stylesDiv, ...props }, ref) => {
	const [state, setState] = useOldState({
		selectedPoint: null,
		loaded: false,
		editedVotings: false,
		votingsAlert: false
	});
	const agendaDetails = React.useRef();

	React.useEffect(() => {
		if(!data.loading){
			setState({
				loaded: true
			});
		}
	}, [data.loading]);


	React.useEffect(() => {
		if(state.loaded && state.selectedPoint === null){
			setState({
				selectedPoint: getInitialSelectedPoint()
			})
		}
	}, [state.loaded]);


	const changeEditedVotings = value => {
		setState({
			editedVotings: value
		})
	}

	const showVotingsAlert = cb => {
		setState({
			votingsAlert: true,
			acceptAction: () => {
				cb();
				setState({
					editedVotings: false,
					votingsAlert: false
				})
			}
		});
	}

	const closeVotingsAlert = () => {
		setState({
			votingsAlert: false
		});
	}

	const getInitialSelectedPoint = () => {
		const index = data.agendas.findIndex(agenda => agenda.pointState === AGENDA_STATES.DISCUSSION);
		return index !== -1? index : 0;
	}

	const changeSelectedPoint = index => {
		const cb = () => setState({
			selectedPoint: index
		});

		if(state.editedVotings){
			showVotingsAlert(cb);
		} else {
			cb();
		}
	};

	const nextPoint = () => {
		if(state.selectedPoint < data.agendas.length - 1){
			setState({
				selectedPoint: state.selectedPoint + 1
			});
		}
	}

	const handleKeyPress = event => {
		const key = event.nativeEvent;
		const { selectedPoint } = state;

		if (!key.altKey) {
			switch (key.keyCode) {
				case 38:
					if (selectedPoint > 0) {
						changeSelectedPoint(selectedPoint - 1);
					}
					break;
				case 40:
					if (selectedPoint < data.agendas.length - 1) {
						changeSelectedPoint(selectedPoint + 1);
					}
					break;
				default:
					return;
			}
		}
	}

	React.useImperativeHandle(ref, () => ({
		showVotingsAlert,
		state
	}))

	if (!data.agendas || state.selectedPoint === null) {
		return <LoadingSection />;
	}

	const { agendas } = data;


	if (props.fullScreen) {
		return (
			<div
				style={{
					width: "calc(100% - 2px)",
					height: "100%",
					maxHeight: 'calc(100% - 3em)',
					borderLeft: '1px solid gainsboro',
					overflow: "hidden",
					backgroundColor: "white",
				}}
				onClick={props.openMenu}
			>
				<Scrollbar>
					<AgendaSelector
						agendas={agendas}
						company={company}
						council={council}
						fullScreen={true}
						votingTypes={data.votingTypes}
						companyStatutes={data.companyStatutes}
						selected={state.selectedPoint}
						onClick={changeSelectedPoint}
						translate={translate}
						councilID={council.id}
						refetch={data.refetch}
					/>
				</Scrollbar>
			</div>
		);
	}

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "row",
			}}
		>
			<Card
				style={{
					width: isMobile? '3em' : "5em",
					height: "100%",
					borderLeft: '1px solid gainsboro',
					overflow: "auto",
					backgroundColor: "white"
				}}
			>
				<Scrollbar autoHide={true}>
					<AgendaSelector
						agendas={agendas}
						company={company}
						council={council}
						votingTypes={data.votingTypes}
						companyStatutes={data.companyStatutes}
						majorityTypes={data.majorityTypes}
						selected={state.selectedPoint}
						onClick={changeSelectedPoint}
						translate={translate}
						councilID={council.id}
						refetch={data.refetch}
					/>
				</Scrollbar>
			</Card>
			<div
				style={{
					width: `calc(100% - ${isMobile? '3em' : '5em'})`,
					height: "100%",
					padding: "0",
					display: "flex",
					flexDirection: "row",
					outline: 0
				}}
				tabIndex="0"
			>
				<AgendaDetailsSection
					ref={agendaDetails}
					recount={props.recount}
					council={council}
					agendas={agendas}
					editedVotings={state.editedVotings}
					changeEditedVotings={changeEditedVotings}
					showVotingsAlert={showVotingsAlert}
					nextPoint={nextPoint}
					data={data}
					selectedPoint={state.selectedPoint}
					majorityTypes={data.majorityTypes}
					votingTypes={data.votingTypes}
					companyStatutes={data.companyStatutes}
					participants={props.participants}
					councilID={props.councilID}
					translate={translate}
					refetchCouncil={props.refetch}
					refetch={data.refetch}
				/>
			</div>
			<AlertConfirm
				requestClose={closeVotingsAlert}
				open={state.votingsAlert}
				acceptAction={state.acceptAction}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={<div>{translate.unsaved_manual_votes}</div>}
				title={translate.warning}
			/>
		</div>
	);
}

export default graphql(agendaManager, {
	options: props => ({
		variables: {
			companyId: props.company.id,
			councilId: props.council.id
		},
		pollInterval: 5000,
		fetchPolicy: 'network-only',
		forceFetch: true
	}),
	withRef: true
})(React.forwardRef(AgendaManager));
