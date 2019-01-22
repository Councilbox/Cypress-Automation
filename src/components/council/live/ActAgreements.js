import React from "react";
import { Icon, LiveToast, LoadingSection } from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import { darkGrey } from "../../../styles/colors";
import { compose, graphql } from "react-apollo";
import { updateAgenda } from "../../../queries/agenda";
import withSharedProps from "../../../HOCs/withSharedProps";
import LoadDraftModal from "../../company/drafts/LoadDraftModal";
import { changeVariablesToValues, checkForUnclosedBraces, hasParticipations } from "../../../utils/CBX";
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";
import { moment } from '../../../containers/App';
import { toast } from 'react-toastify';
import { VOTE_VALUES } from "../../../constants";


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
			toast(
                <LiveToast
                    message={this.props.translate.revise_text}
                />, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: true,
                    className: "errorToast"
                }
            );
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
		const { agenda } = this.props;

		let positiveSC = 0;
		let negativeSC = 0;
		let abstentionSC = 0;
		let noVoteSC = 0;

		agenda.votings.forEach(vote => {
			switch(vote.vote){
				case VOTE_VALUES.ABSTENTION:
					abstentionSC += vote.author.socialCapital;
					break;
				case VOTE_VALUES.POSITIVE:
					positiveSC += vote.author.socialCapital;
					break;
				case VOTE_VALUES.NEGATIVE:
					negativeSC += vote.author.socialCapital;
					break;
				default:
					noVoteSC += vote.author.socialCapital;
			}
		});

		const totalSC = agenda.socialCapitalPresent + agenda.socialCapitalRemote;
		const totalPresent = totalSC - noVoteSC;


		const correctedText = changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: this.props.council,
			votings: {
				positive: agenda.positiveVotings + agenda.positiveManual,
				negative: agenda.negativeVotings + agenda.negativeManual,
				abstention: agenda.abstentionVotings + agenda.abstentionManual,
				noVoteTotal: agenda.noVoteVotings + agenda.noVoteManual,
				SCFavorTotal: ((positiveSC / totalSC) * 100).toFixed(3) + '%',
				SCAgainstTotal: ((negativeSC / totalSC) * 100).toFixed(3) + '%',
				SCAbstentionTotal: ((abstentionSC / totalSC) * 100).toFixed(3) + '%',
				SCFavorPresent: ((positiveSC / totalPresent) * 100).toFixed(3) + '%',
				SCAgainstTotal: ((negativeSC / totalPresent) * 100).toFixed(3) + '%',
				SCAbstentionTotal: ((abstentionSC / totalPresent) * 100).toFixed(3) + '%'
			}
		});
		this.editor.paste(correctedText);
		this.updateAgreement(correctedText);
		this.modal.close();
	};

	_section = () => {
		const { agenda, council, translate, company } = this.props;
		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		console.log(agenda);
		console.log(council);

		let positiveVotings = 0;
		let negativeVotings = 0;
		let abstentionVotings = 0;
		let noVotes = 0;

		const participations = hasParticipations(council);
		let positiveSC = 0;
		let negativeSC = 0;
		let abstentionSC = 0;
		let noVoteSC = 0;

		agenda.votings.forEach(vote => {
			switch(vote.vote){
				case VOTE_VALUES.ABSTENTION:
					abstentionVotings++;
					abstentionSC += vote.author.socialCapital;
					break;
				case VOTE_VALUES.POSITIVE:
					positiveVotings++;
					positiveSC += vote.author.socialCapital;
					break;
				case VOTE_VALUES.NEGATIVE:
					negativeVotings++;
					negativeSC += vote.author.socialCapital;
					break;
				case VOTE_VALUES.NO_VOTE:
					noVoteSC += vote.author.socialCapital;
				default:
					noVotes++;
			}
		});

		const totalSC = agenda.socialCapitalPresent + agenda.socialCapitalRemote + agenda.socialCapitalNoParticipate;
		const totalPresent =  agenda.socialCapitalPresent + agenda.socialCapitalRemote;
		let tags = [
			{
				value: moment(council.dateStart).format("LLL"),
				label: translate.date
			},
			{
				value: company.businessName,
				label: translate.business_name
			},
			{
				value: council.remoteCelebration === 1? translate.remote_celebration : council.street,
				label: translate.new_location_of_celebrate
			},
			{
				value: company.country,
				label: translate.company_new_country
			},
			{
				value: positiveVotings,
				label: translate.num_positive
			},
			{
				value: negativeVotings,
				label: translate.num_negative
			},
			{
				value: abstentionVotings,
				label: translate.num_abstention
			},
			{
				value: noVotes,
				label: translate.num_no_vote
			},
		]

		if(participations){
			tags.push({
				value: ((positiveSC / totalSC) * 100).toFixed(3) + '%',
				label: '% a favor / total capital social'
			},
			{
				value: ((negativeSC / totalSC) * 100).toFixed(3) + '%',
				label: '% en contra / total capital social'
			},
			{
				value: ((abstentionSC / totalSC) * 100).toFixed(3) + '%',
				label: '% abstención / total capital social'
			},
			{
				value: ((positiveSC / totalPresent) * 100).toFixed(3) + '%',
				label: '% a favor / capital social presente'
			},
			{
				value: ((negativeSC / totalPresent) * 100).toFixed(3) + '%',
				label: '% en contra / capital social presente'
			},
			{
				value: ((abstentionSC / totalPresent) * 100).toFixed(3) + '%',
				label: '% abstención / capital social presente'
			});
		} else {
			tags.push({
				value: `${agenda.positiveVotings} `,
				label: translate.positive_votings
			},
			{
				value: `${agenda.negativeVotings} `,
				label: translate.negative_votings
			});
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
					translate={translate}
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
					tags={tags}
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
					position: "relative"
				}}
			>
				{/* <CollapsibleSection
					trigger={this._button}
					collapse={this._section}
				/> */}
				{this._section()}
			</div>
		);
	}
}

export default compose(graphql(updateAgenda, { name: "updateAgenda" }))(
	withSharedProps()(ActAgreements)
);
