import React from 'react';
import { BasicButton, AlertConfirm } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import LoadDraft from './LoadDraft';

const LoadDraftModal = ({
	translate, companyId, councilType, draftType, statutes, statute, defaultTags, ...props
}, ref) => {
// const modal = React.useRef();

	const [state, setState] = React.useState({
		loadDraft: false
	});

	const close = () => {
		setState({
			loadDraft: false
		});
	};

	React.useImperativeHandle(ref, () => ({
		close
	}));

	const _renderModalBody = () => (
		<div>
			<LoadDraft
				defaultTags={defaultTags}
				match={props.match}
				companyId={companyId}
				councilType={councilType}
				draftType={draftType}
				translate={translate}
				statutes={statutes}
				statute={statute}
				loadDraft={value => {
					props.loadDraft(value);
					setState({
						loadDraft: false
					});
				}}
			/>
		</div>
	);


	const secondary = getSecondary();

	return (
		<React.Fragment>
			<BasicButton
				text={translate.load_draft}
				color={secondary}
				textStyle={{
					color: 'white',
					fontWeight: '600',
					fontSize: '0.8em',
					textTransform: 'none',
					marginLeft: '0.4em',
					minHeight: 0,
					lineHeight: '1em'
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
				bodyStyle={{ width: '75vw', minWidth: '50vw', }}
			/>
		</React.Fragment>
	);
};

export default React.forwardRef(LoadDraftModal);
