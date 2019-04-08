import React from "react";
import { graphql } from "react-apollo";
import { AlertConfirm } from "../../../displayComponents";
import { updateAgendas } from "../../../queries/agenda";
import SortableList from "../../../displayComponents/SortableList";
import { arrayMove } from "react-sortable-hoc";
import * as CBX from '../../../utils/CBX';


const ReorderPointsModal = ({ updateAgendas, translate, ...props}) => {
	const [agendas, setAgendas] = React.useState(props.agendas);
	const [reorderModal, setReorderModal] = React.useState(false);

	React.useEffect(() => {
		setAgendas(props.agendas);
	}, [props.agendas]);

	const updateOrder = async () => {
		const reorderedAgenda = agendas.map((agenda, index) => {
			const updatedAgenda = CBX.cleanAgendaObject(agenda);
			updatedAgenda.orderIndex = index + 1;
			return updatedAgenda;
		});

		const response = await updateAgendas({
			variables: {
				agendaList: [...reorderedAgenda]
			}
		});
		if (response) {
			props.refetch();
			setReorderModal(false);
		}
	};

	const reset = () => {
		setReorderModal(false);
		setAgendas(props.agendas);
	}

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setAgendas(arrayMove(agendas, oldIndex, newIndex));
	};

	const _renderNewPointBody = () => {
		let opened = [];
		let unOpened = [];
		agendas.forEach(agenda => {
			if(CBX.agendaPointNotOpened(agenda)){
				unOpened.push(agenda);
			} else {
				opened.push(agenda);
			}
		});
		return (
			<React.Fragment>
				{opened.map((agenda) => (
					<li
						key={`reorderAgenda_${agenda.id}`}
						style={{
							opacity: 1,
							width: "100%",
							color: 'lightgrey',
							display: "flex",
							alignItems: "center",
							padding: "0.5em",
							height: "3em",
							border: `2px solid lightgrey`,
							listStyleType: "none",
							borderRadius: "3px",
							marginTop: "0.5em"
						}}
						className="draggable"
					>
						{`${agenda.orderIndex} - ${agenda.agendaSubject}`}
					</li>
				))}
				<SortableList
					items={unOpened}
					offset={opened.length}
					onSortEnd={onSortEnd}
					helperClass="draggable"
				/>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<div
				onClick={() => setReorderModal(true)}
				style={props.style}
			>
				{props.children}
			</div>
			<AlertConfirm
				requestClose={reset}
				open={reorderModal}
				acceptAction={updateOrder}
				buttonAccept={translate.save}
				scrollable={true}
				buttonCancel={translate.cancel}
				bodyText={_renderNewPointBody()}
				title={translate.reorder_agenda_points}
			/>
		</React.Fragment>
	);
}

export default graphql(updateAgendas, {
	name: "updateAgendas"
})(ReorderPointsModal);
