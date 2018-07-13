import React from "react";
import { CardPageLayout } from "../../../displayComponents";
import CouncilEditorNotice from "./StepNotice";
import CouncilEditorCensus from "./census/StepCensus";
import CouncilEditorAgenda from "./agenda/StepAgenda";
import CouncilEditorAttachments from "./attachments/StepAttachments";
import CouncilEditorOptions from "./StepOptions";
import CouncilEditorPreview from "./StepPreview";
import { bHistory } from "../../../containers/App";
import { checkCouncilState } from "../../../utils/CBX";
import EditorStepper from './EditorStepper';


class CouncilEditorPage extends React.Component {
	state = {
		step: this.props.step,
		actualStep: this.props.step
	};

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
			"draft"
		);
	}

	nextStep = () => {
		const index = this.state.step + 1;
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
		const { translate } = this.props;

		return (
			<CardPageLayout title={translate.dashboard_new} disableScroll={true}>
				<div
					style={{
						width: "100%",
						textAlign: "center"
					}}
				>
					<div style={{marginBottom: '1.2em', marginTop: '0.8em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '1.5em'}}>
						<EditorStepper
							translate={translate}
							active={this.state.step - 1}
							goToPage={this.goToPage}
						/>
					</div>
				</div>
				<div style={{width: '100%', height: 'calc(100% - 3em)'}}>
					{this.state.step === 1 && (
						<CouncilEditorNotice
							nextStep={this.nextStep}
							actualStep={this.state.actualStep}
							councilID={this.props.councilID}
							company={this.props.company}
							translate={translate}
						/>
					)}
					{this.state.step === 2 && (
						<CouncilEditorCensus
							nextStep={this.nextStep}
							previousStep={this.previousStep}
							actualStep={this.state.actualStep}
							councilID={this.props.councilID}
							companyID={this.props.company.id}
							translate={translate}
						/>
					)}
					{this.state.step === 3 && (
						<CouncilEditorAgenda
							nextStep={this.nextStep}
							previousStep={this.previousStep}
							actualStep={this.state.actualStep}
							councilID={this.props.councilID}
							company={this.props.company}
							translate={translate}
						/>
					)}
					{this.state.step === 4 && (
						<CouncilEditorAttachments
							nextStep={this.nextStep}
							previousStep={this.previousStep}
							actualStep={this.state.actualStep}
							councilID={this.props.councilID}
							companyID={this.props.company.id}
							translate={translate}
						/>
					)}
					{this.state.step === 5 && (
						<CouncilEditorOptions
							nextStep={this.nextStep}
							previousStep={this.previousStep}
							actualStep={this.state.actualStep}
							councilID={this.props.councilID}
							companyID={this.props.company.id}
							translate={translate}
						/>
					)}
					{this.state.step === 6 && (
						<CouncilEditorPreview
							nextStep={this.nextStep}
							previousStep={this.previousStep}
							actualStep={this.state.actualStep}
							councilID={this.props.councilID}
							company={this.props.company}
							translate={translate}
						/>
					)}
				</div>
			</CardPageLayout>
		);
	}
}

export default CouncilEditorPage;
