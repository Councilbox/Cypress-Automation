import React from 'react';
import { CardPageLayout, MobileStepper } from '../displayComponents';
import RegularCard from '../displayComponents/RegularCard';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import CouncilEditorNotice from './CouncilEditorNotice';
import CouncilEditorCensus from './CouncilEditorCensus';
import CouncilEditorAgenda from './CouncilEditorAgenda';
import CouncilEditorAttachments from './CouncilEditorAttachments';
import CouncilEditorOptions from './CouncilEditorOptions';
import CouncilEditorPreview from './CouncilEditorPreview';
import { bHistory } from '../../containers/App';
import withWindowSize from '../../HOCs/withWindowSize';


class CouncilEditorPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            actualStep: 1
        };
    }

    componentDidMount(){
        this.props.updateSize();
        window.addEventListener('resize', this.props.updateSize);
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.props.updateSize);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            step: parseInt(nextProps.step, 10)
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
        const { translate, size } = this.props;

        return(
            <CardPageLayout title={translate.dashboard_new}>
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{backgroundColor: 'lightgrey', borderRadius: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingTop: '1em', width: '100%', height: '100%'}}>
                        {size === 'xs'? 
                            <MobileStepper
                                active={this.state.step - 1}
                                total={6}
                            
                            />
                        :
                            <Stepper activeStep={this.state.step - 1} orientation="horizontal">
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
                        }
                    </div>
                    <div style={{width: '100%'}}>
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
                </div>
            </CardPageLayout>
        );
    }
  
}

export default withWindowSize(CouncilEditorPage);