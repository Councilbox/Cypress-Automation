import React from 'react';
import Header from '../components/Header';
import bg from '../assets/img/background8-3.jpg';
import { getCustomBackground, getCustomRoomBackground } from '../utils/subdomain';
import LoadingMainApp from './LoadingMainApp';
import { HEADER_HEIGHT } from '../styles/constants';
import { Scrollbar } from '.';


const NotLoggedLayout = ({
	children, translate, helpIcon, languageSelector, councilIsFinished, setSelectHeadFinished, selectHeadFinished, ...props
}) => {
	const [loadingImg, setLoadingImg] = React.useState(true);
	const customBackground = getCustomBackground();
	const customRoomBackground = getCustomRoomBackground();
	const imgUrl = window.location.pathname.includes('participant') ?
		customRoomBackground || (customBackground || bg)
		: customBackground || bg;

	React.useEffect(() => {
		const img = new Image();
		img.src = imgUrl;
		img.onload = () => setLoadingImg(false);
	}, [customBackground, customRoomBackground]);

	if (loadingImg) {
		return <LoadingMainApp />;
	}

	return (
		<div
			style={{
				display: 'flex',
				flex: 1,
				flexDirection: 'column',
				height: '100%',
				overflow: 'hidden',
				background: `linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(255,255,255,1)), url(${imgUrl})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				...((customBackground || customRoomBackground) ? {} : {
					backgroundPosition: 'center center',
				}),
				padding: 0,
				margin: 0,
				width: '100%'
			}}
		>
			<Header
				translate={translate}
				helpIcon={helpIcon}
				participantLanguageSelector={props.participantLanguageSelector}
				languageSelector={languageSelector}
				councilIsFinished={councilIsFinished}
				setSelectHeadFinished={setSelectHeadFinished}
				selectHeadFinished={selectHeadFinished}
				contactAdmin={window.location.pathname.search('attendance')}
				council={props.council}
				participant={props.participant}
			/>
			<div
				style={{
					width: '100%',
					overflow: 'hidden',
					margin: 0,
					backgroundColor: 'rgba(0, 0, 0, 0.05)',
					fontSize: '0.85em',
					height: `calc(100% - ${HEADER_HEIGHT})`,
					minHeight: `calc(100% - ${HEADER_HEIGHT})`,
					position: 'relative'
				}}
			>
				<Scrollbar
					style={{
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
					}}
					classFix={'scrollflex'}
				>
					{children}
				</Scrollbar>
			</div>
		</div>
	);
};

export default NotLoggedLayout;
