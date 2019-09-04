import React from "react";
import { LoadingSection, Icon } from "../../../../displayComponents";
import RichTextInput from "../../../../displayComponents/RichTextInput";
import { darkGrey } from "../../../../styles/colors";
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../../styles/constants";
import { changeVariablesToValues, checkForUnclosedBraces } from "../../../../utils/CBX";
import { graphql } from 'react-apollo';
import LoadDraftModal from '../../../company/drafts/LoadDraftModal';
import { updateCouncilAct } from '../../../../queries';


class ActLiveSection extends React.Component {
	state = {
		open: false,
		conclusion: ''
	};

	timeout = null;

	startUpdateTimeout = value => {
		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			this.updateCouncilAct(value);
		}, 450);
	};


	updateCouncilAct = async () => {
		if(!checkForUnclosedBraces(this.state.conclusion)){
			this.setState({
				updating: true,
				disableButtons: false
			});
			const response = await this.props.updateCouncilAct({
				variables: {
					councilAct: {
						conclusion: this.state.conclusion,
						id: this.props.council.act.id
					}
				}
			});
			if(!!response){
				this.setState({
					updating: false
				});
			}
		}
	}


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
						width: "25%",
						height: LIVE_COLLAPSIBLE_HEIGHT,
						display: "flex",
						alignItems: "center",
						paddingLeft: "1.5em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						book
					</Icon>
					<span
						style={{
							marginLeft: "0.7em",
							color: darkGrey,
							fontWeight: "700"
						}}
					>
						{translate.proposed_act}
					</span>
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

    _section = () => {
		const { council, translate, companyId } = this.props;
		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		return (
        	<div
				style={{
					paddingTop: "1.2em",
					backgroundColor: "white"
				}}
			>
				<RichTextInput
					ref={editor => (this.editor = editor)}
					required
					translate={translate}
					loadDraft={
						<LoadDraftModal
							ref={modal => (this.modal = modal)}
							translate={translate}
							companyId={companyId}
							loadDraft={this.loadDraft}
							statute={council.statute}
							statutes={this.props.data.companyStatutes}
							draftType={4}
						/>
					}
					tags={[
						{
							value: council.president,
							label: translate.president
						},
                        {
                            value: council.secretary,
                            label: translate.secretary
                        }
					]}
					floatingText={translate.conclusion}
					value={this.props.council.act.conclusion || ""}
					onChange={value => {
						this.setState({
							conclusion: value
						})
						this.startUpdateTimeout()
					}}
				/>
			</div>
		);
	};

    loadDraft = async draft => {
		const correctedText = await changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: this.props.council,
			votings: {
				positive: 1,
				negative: 43
			}
		}, this.props.translate);
		this.editor.setValue(correctedText);
		this.updateAct(correctedText);
		this.modal.close();
	};

	render() {
		return (
			<div
				style={{
					width: "100%",
					position: "relative"
				}}
			>
				{/* <CollapsibleSection
					trigger={this._button}
					collapse={this._section}
				/> */}
				{
					this._section()
				}
			</div>
		);
	}
}

export default graphql(updateCouncilAct, {
	name: 'updateCouncilAct'
})(ActLiveSection);
