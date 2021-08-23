import React from 'react';
import { Paper, Tooltip } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { bHistory } from '../../../containers/App';
import { AlertConfirm, Icon } from '../../../displayComponents';
import logo from '../../../assets/img/logo.png';
import icon from '../../../assets/img/logo-icono.png';
import withWindowSize from '../../../HOCs/withWindowSize';
import { getCustomLogo, getCustomIcon, useSubdomain } from '../../../utils/subdomain';
import withSharedProps from '../../../HOCs/withSharedProps';
import CouncilStateButton from './menus/CouncilStateButton';
import CouncilMenu from './councilMenu/CouncilMenu';
import { HEADER_HEIGHT } from '../../../styles/constants';

const LiveHeader = ({
	councilName, translate, windowSize, participants, user, council, recount, refetch
}) => {
	const [showConfirm, setShowConfirm] = React.useState(false);
	const subdomain = useSubdomain();
	const primary = getPrimary();
	const customLogo = getCustomLogo();
	const customIcon = getCustomIcon();

	const exitAction = () => {
		bHistory.back();
	};

	return (
		<React.Fragment>
			<Paper
				elevation={0}
				style={{
					background: 'white',
					borderBottom: '1px solid gainsboro',
					display: 'flex',
					width: '100%',
					userSelect: 'none',
					position: 'absolute',
					zIndex: 1000,
					height: HEADER_HEIGHT,
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<div style={{ display: 'flex', height: '30px' }}>
					{!user.accessLimitedTo ?
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'flex-end',
								paddingLeft: '2em',
								alignItems: 'center',
								position: 'relative'
							}}
						>
							<Icon
								className="material-icons"
								id="exit-live-room-button"
								style={{
									fontSize: '2em',
									color: primary,
									cursor: 'pointer',
									transform: 'rotate(-90deg)'
								}}
								onClick={() => setShowConfirm(true)
								}
							>
								save_alt
							</Icon>
							<div style={{
								background: 'white',
								width: '19px',
								position: 'absolute',
								height: '13px',
								top: '8px',
								left: '33px',
							}}>
							</div>
							<Icon
								className="material-icons"
								style={{
									fontSize: '2em',
									color: primary,
									cursor: 'pointer',
									position: 'absolute',
									left: '25px'
								}}
								onClick={() => setShowConfirm(true)
								}
							>
								keyboard_backspace
							</Icon>
							<AlertConfirm
								title={translate.exit}
								bodyText={translate.exit_desc}
								acceptAction={exitAction}
								buttonCancel={translate.cancel}
								buttonAccept={translate.accept}
								open={showConfirm}
								requestClose={() => setShowConfirm(false)
								}
							/>
						</div>
						: <div style={{}} />
					}
					<div style={{ display: 'flex', alignItems: 'center' }} >
						<img
							src={windowSize !== 'xs' ? customLogo || logo : customIcon || icon}
							className="App-logo"
							style={{
								height: '1.5em',
								marginLeft: '1em',
								userSelect: 'none',
								...(subdomain.styles ? {
									...subdomain.styles.liveLogo
								} : {})
							}}
							alt="logo"
						/>
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							maxWidth: '90%'
						}}
					>
						<Tooltip title={councilName}>
							<div
								style={{
									textAlign: 'center',
									color: primary,
									fontWeight: '300',
									fontSize: '1.4em',
									maxWidth: '57vw',
									fontFamily: 'Lato'
								}}
								className="truncate"
							>
								{councilName}
							</div>
						</Tooltip>
					</div>
				</div>
				{council
					&& <>
						<div style={{ display: 'flex', paddingRight: '2em' }}>
							<div style={{ marginRight: '1em' }}>
								<CouncilMenu
									council={council}
									translate={translate}
									refetch={refetch}
									logo={logo}
								/>
							</div>
							<div style={{}}>
								<CouncilStateButton
									council={council}
									translate={translate}
									participants={participants}
									recount={recount}
									// agendas={agendas}
									refetch={refetch}
								/>
							</div>
						</div>
					</>
				}
			</Paper>
			<div
				style={{
					height: '3em',
					width: '100%'
				}}
			/>
		</React.Fragment>
	);
};

export default withWindowSize(withSharedProps()(LiveHeader));
