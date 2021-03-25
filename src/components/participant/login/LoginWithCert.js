import React from 'react';
import { BasicButton, ButtonIcon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { useSubdomain } from '../../../utils/subdomain';

const LoginWithCert = ({
	participant, handleSuccess, translate, dispatch, status
}) => {
	const primary = getPrimary();
	const subdomain = useSubdomain();

	const getData = async () => {
		try {
			dispatch({ type: 'LOADING' });
			const response = await fetch(`${process.env.REACT_APP_CERT_API}participant/${participant.id}`);
			const json = await response.json();

			if (json.success) {
				dispatch({
					type: 'SUCCESS',
					payload: {
						message: translate.cert_success,
					}
				});
			} else {
				let message = json.error;
				if (+response.status === 403) {
					message = translate.cert_doesnt_match;
				}
				if (+response.status === 401) {
					message = translate.cert_missing;
				}
				dispatch({
					type: 'ERROR',
					payload: {
						message
					}
				});
			}
		} catch (error) {
			dispatch({ type: 'ERROR', payload: translate.cert_error });
		}
	};

	return (
		<>
			{status === 'ERROR'
				&& <BasicButton
					text={translate.retry}
					color={'red'}
					textStyle={{
						color: 'white',
						fontWeight: '700'
					}}
					loading={status === 'LOADING'}
					textPosition="before"
					fullWidth={true}
					onClick={getData}
				/>
			}
			{status === 'WAITING'
				&& <BasicButton
					text={translate.check_certificate}
					color={primary}
					textStyle={{
						color: 'white',
						fontWeight: '700',
						...subdomain?.styles?.roomLoginButton
					}}
					loading={status === 'LOADING'}
					disabled={status === 'ERROR'}
					textPosition="before"
					fullWidth={true}
					icon={
						<ButtonIcon
							color="white"
							type="directions_walk"
						/>
					}
					onClick={getData}
				/>
			}
			{status === 'SUCCESS'
				&& <BasicButton
					text={translate.enter_room}
					color={status === 'ERROR' ? 'grey' : primary}
					textStyle={{
						color: 'white',
						fontWeight: '700',
						...subdomain?.styles?.roomLoginButton
					}}
					loading={status === 'LOADING'}
					disabled={status === 'ERROR'}
					textPosition="before"
					fullWidth={true}
					icon={
						<ButtonIcon
							color="white"
							type="directions_walk"
						/>
					}
					onClick={status === 'SUCCESS' ? handleSuccess : () => { }}
				/>
			}
		</>
	);
};

export default LoginWithCert;
