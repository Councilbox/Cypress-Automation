import React from "react";
import { BasicButton, AlertConfirm } from "../../../displayComponents";
import { getSecondary } from "../../../styles/colors";
import LoadDraft from "./LoadDraft";
import { withRouter } from "react-router-dom";


const LoadDraftModal = ({ translate, companyId, councilType, draftType, statutes, statute, ...props }) => {
	const [state, setState] = React.useState({
		loadDraft: false
	});

	const close = () => {
		setState({
			loadDraft: false
		});
	};
	
	const _renderModalBody = () => {
		return (
			<div style={{ width: '800px' }}>
				<LoadDraft
					match={props.match}
					companyId={companyId}
					councilType={councilType}
					draftType={draftType}
					translate={translate}
					statutes={statutes}
					statute={statute}
					loadDraft={(value) => {
						props.loadDraft(value);
						setState({
							loadDraft: false
						})
					}}
				/>
			</div>
		)
	}


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
				onClick={() => setState({ loadDraft: true })}
			/>
			<AlertConfirm
				requestClose={close}
				open={state.loadDraft}
				buttonCancel={translate.close}
				bodyText={_renderModalBody()}
				title={translate.load_draft}
			/>
		</React.Fragment>
	);

}

export default withRouter(LoadDraftModal);
