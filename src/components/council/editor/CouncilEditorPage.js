import React from 'react';
import { CardPageLayout, MobileStepper } from '../../../displayComponents';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import CouncilEditorNotice from './CouncilEditorNotice';
import CouncilEditorCensus from './census/CouncilEditorCensus';
import CouncilEditorAgenda from './CouncilEditorAgenda';
import CouncilEditorAttachments from './CouncilEditorAttachments';
import CouncilEditorOptions from './CouncilEditorOptions';
import CouncilEditorPreview from './CouncilEditorPreview';
import { bHistory } from '../../../containers/App';
import withWindowSize from '../../../HOCs/withWindowSize';
import { checkCouncilState } from '../../../utils/CBX';

const pointerStep = {
    cursor: 'pointer',
};

class CouncilEditorPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: this.props.step,
            actualStep: this.props.step
        };
    }

    componentDidMount() {
        if (this.state.step !== this.props.step) {
            this.setState({
                step: this.props.step
            });
        }
        checkCouncilState({
            state: this.props.councilState,
            id: this.props.councilID
        }, this.props.company, bHistory, 'draft');
    }

    nextStep = () => {
        const index = this.state.step + 1;
        this.props.updateStep();
        this.setState({ step: index });
    };

    goToPage = (page) => {
        if (page < this.props.step) {
            this.setState({
                step: page
            });
        }
    };

    previousStep = () => {
        const index = this.state.step - 1;
        this.setState({ step: index });
    };

    send = () => {
        if (true) {
            this.setState({ success: true });
        }
    };

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
        const { translate, windowSize } = this.props;

        return (<CardPageLayout title={translate.dashboard_new}>
            {/*<div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>*/}
            <div style={{
                width: '100%',
                textAlign: 'center'
            }}>
                {windowSize === 'xs' ?

                    <MobileStepper
                        active={this.state.step - 1}
                        total={6}
                    />

                    :

                    <Stepper alternativeLabel activeStep={this.state.step - 1} orientation="horizontal">
                        <Step
                            {...(this.state.step > 1 ? {
                                onClick: () => this.goToPage(1),
                                style: pointerStep
                            } : {})}>
                            <StepLabel classes={{ marginTop: '0' }}>
                                {translate.wizard_convene}
                            </StepLabel>
                        </Step>
                        <Step
                            {...(this.state.step > 2 ? {
                                onClick: () => this.goToPage(2),
                                style: pointerStep
                            } : {})}>
                            <StepLabel>
                                {translate.census}
                            </StepLabel>
                        </Step>
                        <Step
                            {...(this.state.step > 3 ? {
                                onClick: () => this.goToPage(3),
                                style: pointerStep
                            } : {})}>
                            <StepLabel>
                                {translate.wizard_agenda}
                            </StepLabel>
                        </Step>
                        <Step
                            {...(this.state.step > 4 ? {
                                onClick: () => this.goToPage(4),
                                style: pointerStep
                            } : {})}>
                            <StepLabel>
                                {translate.wizard_attached_documentation}
                            </StepLabel>
                        </Step>
                        <Step
                            {...(this.state.step > 5 ? {
                                onClick: () => this.goToPage(5),
                                style: pointerStep
                            } : {})}>
                            <StepLabel>
                                {translate.wizard_options}
                            </StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>
                                {translate.wizard_preview}
                            </StepLabel>
                        </Step>
                    </Stepper>

                }
            </div>
            <div style={{ width: '100%' }}>
                {this.state.step === 1 && <CouncilEditorNotice
                    nextStep={this.nextStep}
                    actualStep={this.state.actualStep}
                    councilID={this.props.councilID}
                    company={this.props.company}
                    translate={translate}
                />}
                {this.state.step === 2 && <CouncilEditorCensus
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    actualStep={this.state.actualStep}
                    councilID={this.props.councilID}
                    companyID={this.props.company.id}
                    translate={translate}
                />}
                {this.state.step === 3 && <CouncilEditorAgenda
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    actualStep={this.state.actualStep}
                    councilID={this.props.councilID}
                    company={this.props.company}
                    translate={translate}
                />}
                {this.state.step === 4 && <CouncilEditorAttachments
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    actualStep={this.state.actualStep}
                    councilID={this.props.councilID}
                    companyID={this.props.company.id}
                    translate={translate}
                />}
                {this.state.step === 5 && <CouncilEditorOptions
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    actualStep={this.state.actualStep}
                    councilID={this.props.councilID}
                    companyID={this.props.company.id}
                    translate={translate}
                />}
                {this.state.step === 6 && <CouncilEditorPreview
                    nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    actualStep={this.state.actualStep}
                    councilID={this.props.councilID}
                    companyID={this.props.company.id}
                    translate={translate}
                />}
            </div>
            {/*</div>*/}
        </CardPageLayout>);
    }

}

export default withWindowSize(CouncilEditorPage);