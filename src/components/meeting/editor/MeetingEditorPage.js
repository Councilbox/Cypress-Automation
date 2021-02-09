import React from 'react';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import { CardPageLayout, MobileStepper } from '../../../displayComponents';
import { bHistory } from '../../../containers/App';
import withWindowSize from '../../../HOCs/withWindowSize';
import MeetingEditorConfig from './MeetingEditorConfig';
import MeetingEditorCensus from './MeetingEditorCensus';
import { checkCouncilState } from '../../../utils/CBX';

class MeetingEditorPage extends React.Component {
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
		checkCouncilState(
			{
				state: this.props.councilState,
				id: this.props.councilID
			},
			this.props.company,
			bHistory,
			'draft'
		);
	}


	nextStep = () => {
		const index = this.state.step + 1;
		this.props.updateStep();
		this.setState({ step: index });
	};

	goToPage = page => {
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

	setDate = dateTime => {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				date: dateTime
			}
		});
	};


	render() {
		const { translate, windowSize } = this.props;

		return (
			<CardPageLayout title={translate.dashboard_new_meeting}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%'
					}}
				>
					<div
						style={{
							backgroundColor: 'lightgrey',
							borderRadius: '5px',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							paddingTop: '1em',
							width: '100%',
							height: '100%'
						}}
					>
						{windowSize === 'xs' ? (
							<MobileStepper
								active={this.state.step - 1}
								total={2}
							/>
						) : (
							<Stepper
								activeStep={this.state.step - 1}
								orientation="horizontal"
							>
								<Step>
									<StepLabel>
										{translate.wizard_convene}
									</StepLabel>
								</Step>
								<Step>
									<StepLabel>{translate.census}</StepLabel>
								</Step>
							</Stepper>
						)}
					</div>
					<div style={{ width: '100%' }}>
						{this.state.step === 1 && (
							<MeetingEditorConfig
								nextStep={this.nextStep}
								actualStep={this.state.actualStep}
								councilID={this.props.councilID}
								companyID={this.props.company.id}
								translate={translate}
							/>
						)}
						{this.state.step === 2 && (
							<MeetingEditorCensus
								nextStep={this.nextStep}
								previousStep={this.previousStep}
								actualStep={this.state.actualStep}
								councilID={this.props.councilID}
								companyID={this.props.company.id}
								translate={translate}
							/>
						)}
					</div>
				</div>
			</CardPageLayout>
		);
	}
}

export default withWindowSize(MeetingEditorPage);
