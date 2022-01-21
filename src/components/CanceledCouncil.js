import { Card, CardHeader } from 'material-ui';
import React from 'react';
import { NotLoggedLayout, Scrollbar } from '../displayComponents';
import { isMobile } from '../utils/screen';
import { moment } from '../containers/App';

const styles = {
	loginContainerMax: {
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	loginContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	splittedLoginContainer: {
		width: '100%',
		height: '100%',
		padding: '1em',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	councilInfoContainer: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '15px',
		textAlign: 'center'
	},
	loginFormContainer: {
		display: 'flex',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '15px'
	},
	enterButtonContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '35px'
	}
};


const CanceledCouncil = ({ council, translate }) => (
	<NotLoggedLayout
		translate={translate}
	>
		<Scrollbar>
			<div style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<Card style={{
					...styles.cardContainer,
					maxWidth: isMobile ? '100%' : '80%',
					minHeight: '70vh',
					minWidth: window.innerWidth > 450 ? '80%' : '100%',
					padding: '2em'
				}} elevation={6}>
					<div style={{
						...styles.loginContainerMax,
						height: '',
					}}>
						<div style={{
							...styles.loginContainerMax,
							...(council.securityType !== 0 ? {
								height: ''
							} : {}),
						}}>
							<React.Fragment>
								<React.Fragment>
									<div
										style={{
											backgroundColor: 'gainsboro',
											borderRadius: '4px'
										}}
									>
										<CardHeader
											title={
												<div style={{ marginBottom: '10px' }}>
													<b>{council.name}</b>
												</div>
											}
											subheader={moment(new Date(council.dateStart)).format(
												'LLL'
											)}
										/>
									</div>
								</React.Fragment>
								<p style={{
									marginBottom: '0px', fontSize: '2em', fontWeight: '700', marginTop: '1em'
								}}>
									{translate.council_not_celebrated}
								</p>
								{council.noCelebrateComment &&
									<div style={{ fontSize: '1.3em', marginTop: '1.2em' }}>
										<p style={{ marginBottom: '0px' }}>
											{translate.reason_not_held_council}:
										</p>
										<div dangerouslySetInnerHTML={{
											__html: council.noCelebrateComment
										}} />
									</div>
								}
							</React.Fragment>
						</div>
					</div>
				</Card>
			</div>
		</Scrollbar>
	</NotLoggedLayout>
);

export default CanceledCouncil;
