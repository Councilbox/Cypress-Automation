import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui';
import { withApollo } from 'react-apollo';
import logo from '../assets/img/logo.png';
import icono from '../assets/img/logo-icono.png';
import LanguageSelector from './menus/LanguageSelector';
import UserMenu from './menus/UserMenu';
import CommandLine from './dashboard/CommandLine';
import { DropDownMenu, BasicButton } from '../displayComponents';
import { bHistory } from '../containers/App';
import withWindowSize from '../HOCs/withWindowSize';
import { getPrimary, primary } from '../styles/colors';
import { isLandscape } from '../utils/screen';
import { CLIENT_VERSION } from '../config';
import { getCustomLogo, getCustomIcon, useSubdomain } from '../utils/subdomain';
import ContactModal from './participant/login/ContactModal';
import { HEADER_HEIGHT } from '../styles/constants';


const Header = ({
	actions,
	backButton,
	windowSize,
	languageSelector,
	drawerIcon,
	translate,
	councilIsFinished,
	setSelectHeadFinished,
	selectHeadFinished,
	contactAdmin,
	...props
}) => {
	const [modal, setModal] = React.useState(false);
	const language = translate && translate.selectedLanguage;
	const customIcon = getCustomIcon();
	const customLogo = getCustomLogo();
	const subdomain = useSubdomain();

	const showVerticalLayout = () => windowSize === 'xs' && !isLandscape();

	return (
		<Paper
			elevation={0}
			style={{
				height: HEADER_HEIGHT,
				zIndex: 1000,
				display: 'flex',
				flexDirection: 'row',
				borderBottom: '1px solid gainsboro',
				width: '100%',
				justifyContent: 'space-between',
				alignItems: 'center',
				backgroundColor: 'white',
				...subdomain?.styles?.roomHeader
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					height: '100%',
					alignItems: 'center'
				}}
			>
				<Link to="/">
					<div style={{ position: 'relative' }}>
						<img
							src={!showVerticalLayout() ? customLogo || logo : customIcon || icono}
							className="App-logo"
							style={{
								height: '1.5em',
								marginLeft: '1em',
								// marginLeft: "2em",
								userSelect: 'none',
								...(subdomain.styles ? {
									...subdomain.styles.logo
								} : {})
							}}
							alt="logo"
						/>
					</div>
				</Link>
			</div>

			{props.commandLine && false
				&& <CommandLine />
			}

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				{councilIsFinished
					&& <DropDownMenu
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						color="transparent"
						Component={() => <div style={{
							color: getPrimary(), marginRight: '1em', marginTop: '0.5em', cursor: 'pointer'
						}}>
							<div>
								<i className="material-icons" >
										dehaze
								</i>
							</div>
						</div>
						}
						textStyle={{ color: getPrimary() }}
						type="flat"
						items={
							<div style={{ color: getPrimary() }}>
								{selectHeadFinished !== 'participacion'
									&& <MenuItem onClick={() => setSelectHeadFinished('participacion')} >
										{translate.my_participation}
									</MenuItem>
								}
								{selectHeadFinished !== 'contactAdmin'
									&& <MenuItem onClick={() => setSelectHeadFinished('contactAdmin')} >
										{translate.mail_contact_admin}
									</MenuItem>
								}
								<MenuItem onClick={() => bHistory.push('/')}>
									{translate.exit}
								</MenuItem>
							</div>
						}
					/>
				}

				{contactAdmin === 1
					&& <BasicButton
						onClick={() => setModal(true)}
						textStyle={{
							color: ` ${primary}`,
						}}
						backgroundColor={{ background: 'white', justifyContent: 'inherit' }}
						text={
							<div>
								{!showVerticalLayout() && translate.mail_contact_admin}
								<i className={'fa fa-envelope-o'} style={{ marginLeft: showVerticalLayout() ? '0px' : '5px' }}></i>
							</div>}
						buttonStyle={{
							border: `1px solid ${getPrimary()}`,
							color: getPrimary(),
							boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
							padding: '4px 15px',
							margin: '5px 15px',
							cursor: 'pointer',
							fontSize: '12px',
							minWidth: '0',
							borderRadius: '0',
							minHeight: '0'
						}}>
					</BasicButton>
				}
				<ContactModal
					open={modal}
					requestClose={() => setModal(false)}
					participant={props.participant}
					translate={translate}
					council={props.council}
				/>
				{languageSelector
					&& <span style={{ fontSize: '0.85em' }}>
						v<span id="client-version">{CLIENT_VERSION}</span>
					</span>
				}
				{props.participantLanguageSelector && (
					<ParticipantLanguageSelector
						participant={props.participant}
						selectedLanguage={language}
					/>
				)}
				{languageSelector && (
					<LanguageSelector selectedLanguage={language} />
				)}
				{props.user && (
					<UserMenu
						user={props.user}
						translate={translate}
						company={props.company}
					/>
				)}
				{drawerIcon && 'DRAWER'}
			</div>
		</Paper>
	);
};

const ParticipantLanguageSelector = withApollo(({ selectedLanguage, client }) => {
	const updateParticipantLanguage = async language => {
		await client.mutate({
			mutation: gql`
				mutation updateParticipantLanguage($language: String!){
					updateParticipantLanguage(language: $language) {
						success
					}
				}
			`,
			variables: {
				language
			}
		});
	};

	return (
		<LanguageSelector
			selectedLanguage={selectedLanguage}
			onChange={updateParticipantLanguage}
		/>
	);
});


export default withWindowSize(Header);
