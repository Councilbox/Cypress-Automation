import React from "react";
import { graphql } from "react-apollo";
import { AlertConfirm } from "../../../displayComponents";
import { updateAgendas } from "../../../queries/agenda";
import SortableList from "../../../displayComponents/SortableList";
import { arrayMove } from "react-sortable-hoc";
import * as CBX from '../../../utils/CBX';

class ReorderPointsModal extends React.PureComponent {
	state = {
		reorderModal: false,
		agendas: this.props.agendas
	};


	static getDerivedStateFromProps(nextProps){
		if(nextProps.agendas){
			return {
				agendas: nextProps.agendas
			}
		}

		return null;
	}

	updateOrder = async () => {
		const reorderedAgenda = this.state.agendas.map((agenda, index) => {
			const { __typename, attachments, ...updatedAgenda } = agenda;
			updatedAgenda.orderIndex = index + 1;
			return updatedAgenda;
		});

		const response = await this.props.updateAgendas({
			variables: {
				agendaList: [...reorderedAgenda]
			}
		});
		if (response) {
			this.props.refetch();
			this.setState({ reorderModal: false });
		}
	};

	onSortEnd = ({ oldIndex, newIndex }) => {
		this.setState({
			agendas: arrayMove(this.state.agendas, oldIndex, newIndex)
		});
	};

	_renderNewPointBody = () => {
		let opened = [];
		let unOpened = [];
		const filteredAgendas = this.state.agendas.forEach((agenda) => {
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
					onSortEnd={this.onSortEnd}
					helperClass="draggable"
				/>
			</React.Fragment>
			
		);
	};

	render() {
		const { translate } = this.props;

		return (
			<React.Fragment>
				<div
					onClick={() => this.setState({ reorderModal: true })}
					style={this.props.style}
				>
					{this.props.children}
				</div>
				<AlertConfirm
					requestClose={() =>
						this.setState({
							reorderModal: false,
							agendas: this.props.agendas
						})
					}
					open={this.state.reorderModal}
					acceptAction={this.updateOrder}
					buttonAccept={translate.save}
					scrollable={true}
					buttonCancel={translate.cancel}
					bodyText={this._renderNewPointBody()}
					title={translate.reorder_agenda_points}
				/>
			</React.Fragment>
		);
	}
}

export default graphql(updateAgendas, {
	name: "updateAgendas"
})(ReorderPointsModal);
