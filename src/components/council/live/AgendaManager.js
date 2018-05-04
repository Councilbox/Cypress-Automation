import React, { Component } from 'react';
import AgendaDetailsSection from './AgendaDetailsSection';
import AgendaSelector from './AgendaSelector';
import { Card } from 'material-ui';
import { graphql } from 'react-apollo';
import { agendaManager } from '../../../queries';
import { LoadingSection } from '../../../displayComponents';

class AgendaManager extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedPoint: 0
        }
    }

    changeSelectedPoint = (index) => {
        this.setState({
            selectedPoint: index
        })
    }

    render(){
        const { council, translate, company } = this.props;
        const { agendas } = this.props.council;

        if(this.props.data.loading){
            return <LoadingSection />
        }

        if(this.props.fullScreen){
            return(
                <Card style={{width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'white'}} onClick={this.props.openMenu} >
                    <AgendaSelector
                        agendas={agendas}
                        company={company}
                        council={council}
                        votingTypes={this.props.data.votingTypes}
                        companyStatutes={this.props.data.companyStatutes}
                        selected={this.state.selectedPoint}
                        onClick={this.changeSelectedPoint}
                        translate={translate}
                        councilID={council.id}
                        refetch={this.props.refetch}
                    />
                </Card>
            )
        }

        return(
            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
                <Card style={{width: '5em', height: '100%', overflow: 'auto', backgroundColor: 'white'}} >
                    <AgendaSelector
                        agendas={agendas}
                        company={company}
                        council={council}
                        votingTypes={this.props.data.votingTypes}
                        companyStatutes={this.props.data.companyStatutes}
                        majorityTypes={this.props.data.majorityTypes}                        
                        selected={this.state.selectedPoint}
                        onClick={this.changeSelectedPoint}
                        translate={translate}
                        councilID={council.id}
                        refetch={this.props.refetch}
                    />
                </Card>
                <div style={{width: '94%', height: '92vh', padding: '0', display: 'flex', flexDirection: 'row'}}>
                    <AgendaDetailsSection
                        council={council}
                        agendas={agendas}
                        majorities={this.props.data.majorityTypes}
                        selectedPoint={this.state.selectedPoint}
                        attachments={council.agenda_attachments}
                        participants={this.props.participants}
                        councilID={this.props.councilID}
                        translate={translate}
                        refetch={this.props.refetch}
                    />
                </div>
            </div>
        );
    }
}

export default graphql(
    agendaManager,
    {
        options: (props) => ({
            variables: {
                companyId: props.company.id
            }
        })

    }
)(AgendaManager);