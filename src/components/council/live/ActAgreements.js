import React from "react";
import {
	CollapsibleSection,
	Icon,
	LoadingSection
} from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import { darkGrey } from "../../../styles/colors";
import { compose, graphql } from "react-apollo";
import { updateAgenda } from "../../../queries/agenda";
import withSharedProps from "../../../HOCs/withSharedProps";
import LoadDraftModal from "../../company/drafts/LoadDraftModal";
import { changeVariablesToValues, checkForUnclosedBraces } from "../../../utils/CBX";
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";
import { moment } from '../../../containers/App';
import { toast } from 'react-toastify';

class ActAgreements extends React.Component {

	state = {
		loading: false,
		error: false
	};

	timeout = null;

	startUpdateTimeout = value => {
		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			this.updateAgreement(value);
		}, 450);
	};

	componentDidUpdate = prevProps => {
		if (prevProps.agenda.id !== this.props.agenda.id) {
			this.editor.setValue(this.props.agenda.comment);
		}
	};

	updateAgreement = async value => {

		if(checkForUnclosedBraces(value)){
			toast.dismiss();
			toast.error(this.props.translate.revise_text);
			this.setState({
				error: true
			});
			return;
		}
		if (value.replace(/<\/?[^>]+(>|$)/g, "").length > 0) {
			this.setState({ loading: true });
			const response = await this.props.updateAgenda({
				variables: {
					agenda: {
						id: this.props.agenda.id,
						councilId: this.props.council.id,
						comment: value
					}
				}
			});
			this.setState({ loading: false, error: false });

			console.log(response);
		}
	};

	_button = () => {
		const { translate } = this.props;

		return (
			<div
				style={{
					height: LIVE_COLLAPSIBLE_HEIGHT,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "50%",
						height: LIVE_COLLAPSIBLE_HEIGHT,
						display: "flex",
						alignItems: "center",
						paddingLeft: "1.5em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						edit
					</Icon>
					<span
						style={{
							marginLeft: "0.7em",
							color: darkGrey,
							fontWeight: "700"
						}}
					>{`${translate.comments_and_agreements}`}</span>
					{this.state.loading && <LoadingSection size={20} />}
				</div>
				<div
					style={{
						width: "25%",
						display: "flex",
						justifyContent: "flex-end",
						paddingRight: "2em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						keyboard_arrow_down
					</Icon>
				</div>
			</div>
		);
	};

	loadDraft = draft => {
		const correctedText = changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: this.props.council,
			votings: {
				positive: 1,
				negative: 43
			}
		});
		this.editor.setValue(correctedText);
		this.updateAgreement(correctedText);
		this.modal.close();
	};

	_section = () => {
		const { agenda, council, translate, company } = this.props;
		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		return (
			<div
				style={{
					padding: '0.9em',
					paddingTop: "1.2em",
					backgroundColor: "white"
				}}
			>
				<RichTextInput
					ref={editor => (this.editor = editor)}
					errorText={this.state.error}
					loadDraft={
						<LoadDraftModal
							ref={modal => (this.modal = modal)}
							translate={translate}
							companyId={company.id}
							loadDraft={this.loadDraft}
							statute={council.statute}
							statutes={this.props.data.companyStatutes}
							draftType={5}
						/>
					}
					tags={[
						{
							value: moment(council.dateStart).format("LLL"),
							label: translate.date
						},
						{
							value: company.businessName,
							label: translate.business_name
						},
						{
							value: `${council.street}, ${council.country}`,
							label: translate.new_location_of_celebrate
						},
						{
							value: company.country,
							label: translate.company_new_country
						}
					]}
					value={agenda.comment || ""}
					onChange={value => this.startUpdateTimeout(value)}
				/>
			</div>
		);
	};

	render() {
		return (
			<div
				style={{
					width: "100%",
					backgroundColor: "lightgrey",
					position: "relative"
				}}
			>
				<CollapsibleSection
					trigger={this._button}
					collapse={this._section}
				/>
			</div>
		);
	}
}

export default compose(graphql(updateAgenda, { name: "updateAgenda" }))(
	withSharedProps()(ActAgreements)
);
