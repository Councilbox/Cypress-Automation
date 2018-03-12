import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { AlertConfirm, AgendaNumber } from '../displayComponents';
import { updateOrder } from '../../queries';
import { urlParser } from '../../utils';
import icon from '../../assets/img/reorder.PNG';
import SortableList from '../displayComponents/SortableList';
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
            const updatedAgenda = { ...agenda };
            updatedAgenda.order_index = index + 1; 
            return updatedAgenda;
        })

        console.log(reorderedAgenda);
        const response = await this.props.updateOrder({
            variables: {
                data: urlParser({
                    data: {
                        ...reorderedAgenda
                    }
                })
            }
        })
        if(response){
            this.props.refetch();
            this.setState({reorderModal: false});
        }
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
          agendas: arrayMove(this.state.agendas, oldIndex, newIndex),
        });
    };


    _renderNewPointBody = () => {
                
        return(
            <SortableList items={this.state.agendas} onSortEnd={this.onSortEnd} helperClass="draggable" />
        );
    }

    render(){
        const { translate } = this.props;
 
        return(
            <Fragment>
                <div style={{marginTop: '1em'}}>
                    <AgendaNumber
                        index={<img src={icon} alt="reorder icon" style={{width: '1.2em', height: 'auto'}}/>}
                        active={false}
                        onClick={() => this.setState({reorderModal: true})}
                        secondaryColor={'#888888'}
                    />
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

export default graphql(updateOrder, {
    name: 'updateOrder'
})(ReorderPointsModal);