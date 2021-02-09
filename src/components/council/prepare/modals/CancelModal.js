import React from 'react';
import { Typography } from 'material-ui';
import { graphql } from 'react-apollo';
import { AlertConfirm, Icon, SuccessMessage, LoadingSection } from '../../../../displayComponents/index';
import { cancelCouncil } from '../../../../queries/council';
import { bHistory, moment } from '../../../../containers/App';

import RichTextInput from '../../../../displayComponents/RichTextInput';

class CancelModal extends React.Component {
	state = {
		success: false,
		sending: false,
		message: '',
		error: ''
	};

	close = () => {
		this.props.requestClose();
		bHistory.push('/');
	};

	hide = () => {
		this.props.requestClose();
	};

	cancelCouncil = async () => {
		this.setState({
			sending: true
		});
		const response = await this.props.cancelCouncil({
			variables: {
				councilId: this.props.council.id,
				timezone: moment().utcOffset().toString(),
				message: this.state.message
			}
		});
		if (response.data.cancelCouncil.success) {
			this.setState({
				sending: false,
				success: true
			});
		} else {
			this.setState({
				sending: false,
				error: true
			});
		}
	};

	_renderCancelBody() {
		const { translate } = this.props;

		if (this.state.sending) {
			return(
				<div>
					<LoadingSection size={50} />
				</div>
			);
		}

		if (this.state.success) {
			return <SuccessMessage message={translate.canceled_council} />;
		}

		return (
			<React.Fragment>
				{translate.cancel_council_desc}
				<RichTextInput
					translate={translate}
					floatingText={translate.message}
					value={this.state.message}
					onChange={value => this.setState({
							message: value
						})
					}
				/>
			</React.Fragment>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.hide}
				open={this.props.show}
				loadingAction={this.state.sending}
				acceptAction={
					this.state.success ? () => this.close() : this.cancelCouncil
				}
				buttonAccept={
					!this.state.sending
						? this.state.success
							? translate.accept
							: translate.cancel_council
						: ''
				}
				buttonCancel={translate.close}
				bodyText={this._renderCancelBody()}
				title={translate.cancel_council}
			/>
		);
	}
}

export default graphql(cancelCouncil, {
	name: 'cancelCouncil'
})(CancelModal);
