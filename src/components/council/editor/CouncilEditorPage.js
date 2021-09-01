import React from 'react';
import { withRouter } from 'react-router-dom';
import { CardPageLayout } from '../../../displayComponents';
import CouncilEditorNotice from './StepNotice';
import CouncilEditorCensus from './census/StepCensus';
import CouncilEditorAgenda from './agenda/StepAgenda';
import CouncilEditorAttachments from './attachments/StepAttachments';
import CouncilEditorOptions from './options/StepOptions';
import CouncilEditorPreview from './StepPreview';
import { bHistory } from '../../../containers/App';
import { checkCouncilState } from '../../../utils/CBX';
import EditorStepper from './EditorStepper';


const CouncilEditorPage = ({ council, translate, company }) => {
	const [step, setStep] = React.useState(council.step);
	const actualStep = React.useRef(council.step);

	React.useEffect(() => {
		checkCouncilState(
			{
				state: council.state,
				id: council.id
			},
			company,
			bHistory,
			'draft'
		);
	}, [council.state]);

	React.useEffect(() => {
		if (step !== council.step) {
			setStep(council.step);
		}
	}, [council.step]);


	const nextStep = () => {
		const index = step + 1;
		setStep(index);
	};

	const goToPage = page => {
		if (page < +step) {
			setStep(page);
		}
	};

	const previousStep = () => {
		const index = step - 1;
		setStep(index);
	};

	return (
		<CardPageLayout disableScroll={true}>
			{/* <div
				style={{
					width: '100%',
					textAlign: 'center',
				}}
			>
				<div style={{
					marginBottom: '1.2em', marginTop: '0.8em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem'
				}}>
					<EditorStepper
						translate={translate}
						active={step - 1}
						goToPage={goToPage}
					/>
				</div>
			</div> */}
			<div style={{ width: '100%', height: 'calc(100% - 3em)' }}>
				{step === 1 && (
					<CouncilEditorNotice
						step={step}
						versionControl={Math.random()}
						nextStep={nextStep}
						actualStep={actualStep}
						councilID={council.id}
						company={company}
						translate={translate}
					/>
				)}
				{step === 2 && (
					<CouncilEditorCensus
						step={step}
						nextStep={nextStep}
						previousStep={previousStep}
						actualStep={actualStep}
						councilID={council.id}
						companyID={company.id}
						translate={translate}
					/>
				)}
				{step === 3 && (
					<CouncilEditorAgenda
						step={step}
						nextStep={nextStep}
						previousStep={previousStep}
						actualStep={actualStep}
						councilID={council.id}
						company={company}
						translate={translate}
					/>
				)}
				{step === 4 && (
					<CouncilEditorAttachments
						step={step}
						nextStep={nextStep}
						previousStep={previousStep}
						actualStep={actualStep}
						councilID={council.id}
						companyID={company.id}
						translate={translate}
					/>
				)}
				{step === 5 && (
					<CouncilEditorOptions
						step={step}
						nextStep={nextStep}
						previousStep={previousStep}
						actualStep={actualStep}
						councilID={council.id}
						companyID={company.id}
						translate={translate}
					/>
				)}
				{step === 6 && (
					<CouncilEditorPreview
						step={step}
						nextStep={nextStep}
						previousStep={previousStep}
						actualStep={actualStep}
						councilID={council.id}
						dateStart={council.dateStart}
						company={company}
						goToPage={goToPage}
						translate={translate}
					/>
				)}
			</div>
		</CardPageLayout>
	);
};


export default withRouter(CouncilEditorPage);
