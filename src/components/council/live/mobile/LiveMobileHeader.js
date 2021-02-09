import React from 'react';
import { getPrimary } from '../../../../styles/colors';
import { bHistory } from '../../../../containers/App';
import { AlertConfirm, Icon } from '../../../../displayComponents';
import logo from '../../../../assets/img/logo.png';
import icon from '../../../../assets/img/logo-icono.png';
import withWindowSize from '../../../../HOCs/withWindowSize';
import { getCustomLogo, getCustomIcon } from '../../../../utils/subdomain';
import CouncilMenu from '../councilMenu/CouncilMenu';
import CouncilStateButton from '../menus/CouncilStateButton';

const LiveMobileHeader = React.memo(({ windowSize, translate, council, recount, participants, refetch }) => {
	const [showConfirm, setShowConfirm] = React.useState(false);
	const primary = getPrimary();
	const customLogo = getCustomLogo();
	const customIcon = getCustomIcon();

	const exitAction = () => {
		bHistory.push('/');
	};

	return (
		<React.Fragment>
			<div
				style={{
					background: 'white',
					color: primary,
					display: 'flex',
					borderBottom: '1px solid gainsboro',
					width: '100%',
					userSelect: 'none',
					position: 'absolute',
					zIndex: 1000,
					height: '3em',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<div style={{ display: 'flex' }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'flex-end',
							paddingLeft: '1em',
							alignItems: 'center',
							position: 'relative'
						}}
					>
						<Icon
							className="material-icons"
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
							left: '18px',
						}}>
						</div>
						<Icon
							className="material-icons"
							style={{
								fontSize: '2em',
								color: primary,
								cursor: 'pointer',
								position: 'absolute',
								left: '11px'
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
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<img
							src={windowSize !== 'xs' ? customLogo || logo : customIcon || icon}
							className="App-logo"
							style={{
								height: '1.5em',
								marginLeft: '1em'
							}}
							alt="logo"
						/>
					</div>
				</div>
				{/* <div style={{ display: "flex" }}>
					<div
						style={{
							width: "40%",
							fontWeight: '700',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							textAlign: 'center'
						}}
					>
						<span style={{ alignSelf: "center" }}>
							{councilName}
						</span>
					</div>
				</div> */}
				<div style={{ display: 'flex', paddingRight: '1em' }}>
					<div style={{ marginRight: '1em' }}>
						<CouncilMenu
							council={council}
							translate={translate}
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
			</div>
			<div
				style={{
					height: '3em',
					width: '100%'
				}}
			/>
		</React.Fragment>
	);
});

export default withWindowSize(LiveMobileHeader);
