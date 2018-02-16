import React from 'react';
import { CardPageLayout } from '../displayComponents';
import { lightGrey } from '../../styles/colors';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import CouncilEditorNotice from './CouncilEditorNotice';
import CouncilEditorCensus from './CouncilEditorCensus';
import CouncilEditorAgenda from './CouncilEditorAgenda';
import CouncilEditorAttachments from './CouncilEditorAttachments';
import CouncilEditorOptions from './CouncilEditorOptions';
import CouncilEditorPreview from './CouncilEditorPreview';
import { bHistory } from '../../containers/App';


class CouncilEditorPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.step),
            actualStep: parseInt(this.props.step)
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            step: parseInt(nextProps.step)
        })
    }

    nextStep = () => {
        const index = this.state.step + 1;        
        bHistory.push(`/company/${this.props.companyID}/council/${this.props.councilID}/${index}`);
        this.setState({step: index});
    }

    previousStep = () => {
        const index = this.state.step - 1;
        bHistory.push(`/company/${this.props.companyID}/council/${this.props.councilID}/${index}`);        
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
            <CardPageLayout title={translate.dashboard_new}>
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
                            actualStep={this.state.actualStep}
                            councilID={this.props.councilID}
                            companyID={this.props.companyID}
                            translate={translate}
                        />
                    }
                    {this.state.step === 2 &&
                        <CouncilEditorCensus
                            nextStep={this.nextStep}
                            previousStep={this.previousStep}
                            actualStep={this.state.actualStep}                                    
                            councilID={this.props.councilID}
                            companyID={this.props.companyID}
                            translate={translate}
                        />
                    }
                    {this.state.step === 3 &&
                        <CouncilEditorAgenda
                            nextStep={this.nextStep}
                            previousStep={this.previousStep}
                            actualStep={this.state.actualStep}                                    
                            councilID={this.props.councilID}
                            companyID={this.props.companyID}
                            translate={translate} 
                        />
                    }
                    {this.state.step === 4 &&
                        <CouncilEditorAttachments
                            nextStep={this.nextStep}
                            previousStep={this.previousStep}
                            actualStep={this.state.actualStep}                                    
                            councilID={this.props.councilID}
                            companyID={this.props.companyID}
                            translate={translate}
                        />
                    }
                    {this.state.step === 5 &&
                        <CouncilEditorOptions
                            nextStep={this.nextStep}
                            previousStep={this.previousStep}
                            actualStep={this.state.actualStep}                                    
                            councilID={this.props.councilID}
                            companyID={this.props.companyID}
                            translate={translate} 
                        />
                    }
                    {this.state.step === 6 &&
                        <CouncilEditorPreview
                            nextStep={this.nextStep}
                            previousStep={this.previousStep}
                            actualStep={this.state.actualStep}                                    
                            councilID={this.props.councilID}
                            companyID={this.props.companyID}
                            translate={translate} 
                        />
                    }
                </div>
            </CardPageLayout>
        );
    }
  
}

export default CouncilEditorPage;