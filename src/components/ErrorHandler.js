import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { CLIENT_VERSION } from '../config';
import icono from '../assets/img/logo-icono.png';
import logo from '../assets/img/logo.png';
import { lightGrey } from '../styles/colors';
import { Scrollbar } from '../displayComponents';
import withWindowSize from '../HOCs/withWindowSize';
import withSharedProps from '../HOCs/withSharedProps';
import { bHistory } from '../containers/App';
import withTranslations from '../HOCs/withTranslations';

class ErrorHandler extends React.Component {
	state = {
		error: false
	}

	redirect = () => {
		this.setState({
			error: false
		}, () => bHistory.push('/'));
	}

	async componentDidCatch(error, info) {
		console.log(error.message);
		console.log(error.name);
		console.log(error.toString());
		console.log(info);
		console.trace(error);
		console.log(error.stack);
		await this.props.sendRuntimeError({
			variables: {
				error: {
					error: error.stack,
					componentStack: JSON.stringify(info),
					additionalInfo: `Client version: ${
						CLIENT_VERSION}, userId: ${
							this.props.user ? this.props.user.id : null}, companyId: ${
								this.props.company?.id}`
				}
			}
		});

		this.setState({
			error: true
		});
	}

	render() {
		if (this.state.error) {
			return (
				<div
					style={{
						width: '100%',
						height: '100vh',
						overflow: 'hidden',
						backgroundColor: lightGrey,
					}}
				>
					<div
						style={{
							width: '100%',
							backgroundColor: 'white',
							height: '3em',
							overflow: 'hidden',
							display: 'flex',
							alignItems: 'center',
							...(this.props.windowSize === 'xs' ? {
								justifyContent: 'center'
							} : {
								paddingLeft: '3em',
							})
						}}
					>
						<img src={logo} style={{ height: '1.5em', cursor: 'pointer' }} alt="councibox-icon" onClick={this.redirect} />
					</div>
					<Scrollbar>
						<div
							style={{
								width: '100%',
								paddingTop: '6em',
								paddingBottom: '2em',
								display: 'flex',
								textAlign: 'center',
								marginTop: '3em',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column'
							}}
						>
							<img src={icono} style={{ width: '8em', height: '8em' }} alt="councibox-icon" />
							<p
								style={{
									fontSize: '1.2em',
									fontWeight: '700',
									justifyText: 'middle',
									minWidth: '60%',
									maxWidth: '95%',
									backgroundColor: lightGrey,
									padding: '1.2em',
									marginTop: '1.4em'
								}}
							>
								{this.props.translate.unexpected_error}
							</p>
						</div>
					</Scrollbar>
				</div>
			);
		}

		return this.props.children;
	}
}

const sendRuntimeError = gql`
	mutation sendRuntimeError($error: RuntimeErrorInput!){
		sendRuntimeError(runtimeError: $error){
			success
			message
		}
	}
`;

export default graphql(sendRuntimeError, {
	name: 'sendRuntimeError'
})(withWindowSize(withSharedProps()(withTranslations()((ErrorHandler)))));
