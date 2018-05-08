import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { AlertConfirm } from '../../../displayComponents';
import { updateAgendas } from '../../../queries/agenda';
import SortableList from '../../../displayComponents/SortableList';
import { arrayMove } from 'react-sortable-hoc';


class ReorderPointsModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            reorderModal: false,
            agendas: this.props.agendas,
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            agendas: nextProps.agendas
        })
    }
    
    updateOrder = async () => {
        const reorderedAgenda = this.state.agendas.map((agenda, index) => {
            const {  __typename, ...updatedAgenda } = agenda;
            updatedAgenda.orderIndex = index + 1; 
            return updatedAgenda;
        });

        const response = await this.props.updateAgendas({
            variables: {
                agendaList: [ ...reorderedAgenda ]
            }
        });
        if(response){
            this.props.refetch();
            this.setState({reorderModal: false});
        }
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
          agendas: arrayMove(this.state.agendas, oldIndex, newIndex),
        });
    };


    _renderNewPointBody = () => {
                
        return(
            <SortableList items={this.state.agendas}
                          onSortEnd={this.onSortEnd}
                          helperClass="draggable" />
        );
    };

    render(){
        const { translate } = this.props;
 
        return(
            <Fragment>
                <div onClick={() => this.setState({reorderModal: true})}
                     style={this.props.style}>
                    {this.props.children}
                </div>
                <AlertConfirm
                    requestClose={() => this.setState({reorderModal: false, agendas: this.props.agendas})}
                    open={this.state.reorderModal}
                    acceptAction={this.updateOrder}
                    buttonAccept={translate.save}
                    scrollable={true}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderNewPointBody()}
                    title={translate.reorder_agenda_points}
                />
            </Fragment>
        );
    }
}

export default graphql(updateAgendas, {
    name: 'updateAgendas'
})(ReorderPointsModal);