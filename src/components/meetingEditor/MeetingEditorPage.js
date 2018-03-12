import React from 'react';
import * as councilActions from '../../actions/councilActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, CardContent } from 'material-ui';
import { lightGrey } from '../../styles/colors';
import {Step, Stepper, StepLabel } from 'material-ui/Stepper';


class MeetingEditorPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: this.props.step || 5
        };
    }

    componentDidMount(){
        this.props.actions.getData({
            councilID: this.props.councilID,
            companyID: this.props.companyID,
            step: this.state.step
        });
        this.props.actions.getParticipants(this.props.councilID);
    }

    nextStep = () => {
        const index = this.state.step + 1;
        this.setState({step: index});
        this.props.actions.getData({
            councilID: this.props.councilID,
            companyID: this.props.companyID,
            step: index
        });
    }

    previousStep = () => {
        const index = this.state.step - 1;
        this.setState({step: index});
        this.props.actions.getData({
            councilID: this.props.councilID,
            companyID: this.props.companyID,
            step: index
        });
    }

    send = () => {
        if (true) {
            this.setState({success: true});
        }
    }

    setDate = (dateTime) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                date: dateTime
            }
        })
    };


    render() {
        return(
            <div style = {{display: 'flex', flexDirection: 'column', backgroundColor: lightGrey, height: '100%', alignItems: 'center', justifyContent: 'flex'}} >
                <h3>Crear junta</h3>
                <Card style={{width: '95%', padding: 0, borderRadius: '0.3em', overflow: 'auto'}} containerStyle={{padding: 0}}>
                    <CardContent style={{padding: 0}}>
                        <div style={{display: 'flex', flexDirection: 'row', height:'75vh'}}>
                            <div style={{backgroundColor: 'lightgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1em', width: '12em', height: '100%'}}>
                                <Stepper activeStep={this.state.step - 1} orientation="vertical">
                                    <Step>
                                        <StepLabel>Convocatoria</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Censo</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Orden del día</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Documentación</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Opciones</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Previsualización</StepLabel>
                                    </Step>
                                </Stepper>
                            </div>
                            Este va a ser el editor de meetings
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
  
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(councilActions, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(MeetingEditorPage);