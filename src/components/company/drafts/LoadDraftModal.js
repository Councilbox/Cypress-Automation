import React from "react";
import { BasicButton, AlertConfirm } from "../../../displayComponents";
import { getSecondary } from "../../../styles/colors";
import LoadDraft from "./LoadDraft";

class LoadDraftModal extends React.Component {

	state = {
		loadDraft: false
	};

	close = () => {
		this.setState({
			loadDraft: false
		});
	};

	_renderModalBody = () => {
		const {
			companyId,
			councilType,
			draftType,
			statutes,
			statute
		} = this.props;

		return(
			<div style={{width: '800px'}}>
				<LoadDraft
					companyId={companyId}
					councilType={councilType}
					draftType={draftType}
					translate={this.props.translate}
					statutes={statutes}
					statute={statute}
					loadDraft={(value) => {
						this.props.loadDraft(value);
						this.setState({
							loadDraft: false
						})
					}}
				/>
			</div>
		)
	}

	render() {
		const translate = this.props.translate;
		const secondary = getSecondary();

		return (
			<React.Fragment>
				<BasicButton
					text={translate.load_draft}
					color={secondary}
					textStyle={{
						color: "white",
						fontWeight: "600",
						fontSize: "0.8em",
						textTransform: "none",
						marginLeft: "0.4em",
						minHeight: 0,
						lineHeight: "1em"
					}}
					textPosition="after"
					onClick={() => this.setState({ loadDraft: true })}
				/>
				<AlertConfirm
					requestClose={this.close}
					open={this.state.loadDraft}
					buttonCancel={translate.close}
					bodyText={this._renderModalBody()}
					title={translate.load_draft}
				/>
			</React.Fragment>
		);
	}
}

export default LoadDraftModal;
