import React from 'react';
import * as councilActions from '../../actions/councilActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, CardText } from 'material-ui';
import { lightGrey } from '../../styles/colors';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import CouncilEditorNotice from './CouncilEditorNotice';
import CouncilEditorCensus from './CouncilEditorCensus';
import CouncilEditorAgenda from './CouncilEditorAgenda';
import CouncilEditorAttachments from './CouncilEditorAttachments';
import CouncilEditorOptions from './CouncilEditorOptions';
import CouncilEditorPreview from './CouncilEditorPreview';


class CouncilEditorPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: this.props.step || 5
        };
    }

    componentDidMount(){
        this.props.actions.getParticipants(this.props.councilID);
    }

    nextStep = () => {
        const index = this.state.step + 1;
        this.setState({step: index});
    }

    previousStep = () => {
        const index = this.state.step - 1;
        this.setState({step: index});
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
        const { translate } = this.props;

        return(
            <div style = {{display: 'flex', flexDirection: 'column', backgroundColor: lightGrey, height: '100%', alignItems: 'center', justifyContent: 'flex'}} >
                <h3>{translate.dashboard_new}</h3>
                <Card style={{width: '95%', padding: 0, borderRadius: '0.3em', overflow: 'auto'}} containerStyle={{padding: 0}}>
                    <CardText style={{padding: 0}}>
                        <div style={{display: 'flex', flexDirection: 'row', height:'75vh'}}>
                            <div style={{backgroundColor: 'lightgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1em', width: '12em', height: '100%'}}>
                                <Stepper activeStep={this.state.step - 1} orientation="vertical">
                                    <Step>
                                        <StepLabel>{translate.wizard_convene}</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>{translate.census}</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>{translate.wizard_agenda}</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>{translate.wizard_attached_documentation}</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>{translate.wizard_options}</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>{translate.wizard_preview}</StepLabel>
                                    </Step>
                                </Stepper>
                            </div>
                            {this.state.step === 1 &&
                                <CouncilEditorNotice 
                                    nextStep={this.nextStep}
                                    councilID={this.props.councilID}
                                    companyID={this.props.companyID}
                                    translate={translate}
                                />
                            }
                            {this.state.step === 2 &&
                                <CouncilEditorCensus
                                    nextStep={this.nextStep}
                                    previousStep={this.previousStep}
                                    councilID={this.props.councilID}
                                    companyID={this.props.companyID}
                                    translate={translate}
                                />
                            }
                            {this.state.step === 3 &&
                                <CouncilEditorAgenda
                                    nextStep={this.nextStep}
                                    previousStep={this.previousStep}
                                    councilID={this.props.councilID}
                                    companyID={this.props.companyID}
                                    translate={translate} 
                                />
                            }
                            {this.state.step === 4 &&
                                <CouncilEditorAttachments
                                    nextStep={this.nextStep}
                                    previousStep={this.previousStep}
                                    councilID={this.props.councilID}
                                    companyID={this.props.companyID}
                                    translate={translate}
                                />
                            }
                            {this.state.step === 5 &&
                                <CouncilEditorOptions
                                    nextStep={this.nextStep}
                                    previousStep={this.previousStep}
                                    councilID={this.props.councilID}
                                    companyID={this.props.companyID}
                                    translate={translate} 
                                />
                            }
                            {this.state.step === 6 &&
                                <CouncilEditorPreview
                                    nextStep={this.nextStep}
                                    previousStep={this.previousStep}
                                    councilID={this.props.councilID}
                                    companyID={this.props.companyID}
                                    translate={translate} 
                                />
                            }
                        </div>
                    </CardText>
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

export default connect(null, mapDispatchToProps)(CouncilEditorPage);