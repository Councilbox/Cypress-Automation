import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, Checkbox } from '../../../displayComponents';
import { isMobile } from '../../../utils/screen';
import { ReactComponent as VideoCamera } from '../../../assets/img/video-camera.svg';
import { ReactComponent as Folder } from '../../../assets/img/folder-1.svg';
import { getPrimary, getSecondary } from '../../../styles/colors';

const width = window.innerWidth > 450 ? '850px' : '100%';

const styles = {
	viewContainer: {
		width: '100vw',
		height: '100vh',
		position: 'relative'
	},
	mainContainer: {
		width: '100%',
		display: 'flex',
		height: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		padding: isMobile ? '' : '10px'
	},
	cardContainer: {
		margin: isMobile ? '20%' : '20px',
		marginBottom: '5px',
		minWidth: width,
		maxWidth: '100%',
		// height: '50vh',
		// minHeight: isMobile? '70vh' : '50vh',
	}
};


const DataAuthorization = ({ client, refetch, translate }) => {
	const [checked, setChecked] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const secondary = getSecondary();

	const sendConfirmation = async () => {
		setLoading(true);
		await client.mutate({
			mutation: gql`
				mutation liveAcceptLegalTermsAndConditions{
					liveAcceptLegalTermsAndConditions{
						success
					}
				}
			`
		});
		await refetch();
		setLoading(false);
	};

	return (
		<div style={styles.loginContainerMax}>
			<div style={{
				width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'
			}}>
				<div style={{
					width: '100%',
					paddingLeft: '4px',
					color: '#154481',
				}}>
					<div style={{ textAlign: 'center', padding: '1em', paddingTop: '2em' }} >
						<h3 style={{ color: '#154481', fontSize: '14px' }}>{translate.room_legal_modal_intro}</h3>
					</div>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div style={{ textAlign: 'center', padding: '1em', paddingRight: '3em' }}>
							<VideoCamera style={{ marginRight: '0.6em', marginBottom: '0.5em' }} fill={secondary} />
							<div>{translate.room_legal_modal_voice_video_recording}</div>
						</div>
						<div style={{ textAlign: 'center', padding: '1em', paddingBottom: '2em' }}>
							<Folder style={{ marginRight: '0.6em', marginBottom: '0.5em' }} fill={secondary} />
							<div>{translate.room_legal_modal_data_storage}</div>
						</div>
					</div>
					<div style={{
						display: 'flex', justifyContent: 'center', color: 'black', maxWidth: '600px', marginBottom: '1em'
					}}>
						<div>
							<Checkbox
								value={checked}
								onChange={(event, isInputChecked) => {
									setChecked(isInputChecked);
								}}
								styleLabel={{ alignItems: 'unset' }}
								label={translate.room_legal_modal_consent_details}
							/>
						</div>
					</div>
					<div style={{
						textAlign: 'center', padding: '1em', paddingBottom: '2em', display: 'flex', justifyContent: 'center'
					}}>
						<BasicButton
							text={translate.room_legal_secure_access}
							disabled={!checked}
							loading={loading}
							loadingColor="white"
							onClick={sendConfirmation}
							color={checked ? getPrimary() : 'grey'}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								borderRadius: '4px',
								boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
								width: '300px'
							}}
							textPosition="before"
							fullWidth={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withApollo(DataAuthorization);
