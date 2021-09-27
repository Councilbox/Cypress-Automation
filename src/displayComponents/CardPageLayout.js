import React from 'react';
import { Paper, Avatar } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { lightGrey, getPrimary } from '../styles/colors';
import Scrollbar from './Scrollbar';
import withWindowSize from '../HOCs/withWindowSize';
import CBXFooter from './CBXFooter';
import { bHistory } from '../containers/App';


const CardPageLayout = ({
	children, title, footer, windowSize, stylesNoScroll, avatar, disableScroll = false, inMenuExact, goTo
}) => {
	const goBack = () => {
		if (inMenuExact) {
			bHistory.push('/company/569/drafts/plantillas');
		} else {
			bHistory.back();
		}
	};

	return (
		<div
			style={{
				backgroundColor: lightGrey,
				height: '100%',
				overflow: 'hidden',
				width: '100%'
			}}
		>
			<div
				style={{
					// margin: windowSize !== "xs" ? "1.2em 0 0 0" : "0.4em 0 0 0",
					overflow: 'hidden',
					height: windowSize !== 'xs' ? 'calc(100% - 1em)' : 'calc(100% - 1.9rem)',
					position: 'relative'
				}}
			>
				<div style={{
					color: getPrimary(),
					// width: windowSize !== "xs" ? "15%" : "calc(100% - 2em)",
					maxWidth: 'calc(100% - 2em)',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis',
					verticalAlign: 'middle',
					// padding: windowSize !== "xs" ? "0.5em" : "0.2em",
					// height: windowSize !== "xs" ? "2.8em" : "2em",
					zIndex: title ? '20' : -1,
					marginLeft:
						windowSize !== 'xs' ?
							windowSize === 'xl' ?
								'8%'
								: '2em'
							: '1em',
					marginRight: windowSize !== 'xs' && '1em',
					position: 'relative',
					fontWeight: '300',
					display: 'flex',
					fontStyle: 'italic',
					fontFamily: 'Lato',
					fontSize: windowSize === 'xs' ? '20px' : '28px',
					top: isMobile ? '30px' : '45px'
					// justifyContent: "center",
					// alignItems: "center"
				}}>
					<div style={{ cursor: 'pointer', visibility: title ? 'visible' : 'hidden' }} onClick={goTo || goBack}>
						<i className="fa fa-angle-left" ></i>
						<span style={{ fontStyle: 'normal', marginRight: '8px', marginLeft: '5px' }}>
							|
						</span>
					</div>
					{(title && avatar)
						&& <div style={{
							display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.6em'
						}}>
							<Avatar src={avatar} alt="Foto" style={{ border: `1px solid${getPrimary()}` }} />
						</div>
					}
					<div>
						{title || ''}
					</div>
				</div>
				<Paper
					style={{
						height:
							windowSize !== 'xs' ?
								'calc(100% - 2em)'
								: 'calc(100% - 1.5em)',
						backgroundColor: 'white',
						borderRadius: '3px',
						width:
							windowSize !== 'xs' ?
								windowSize === 'xl' ?
									'90%'
									: '96%'
								: '98%',
						margin: '0 auto',
						marginTop: '-4em'
					}}
				>
					<div
						style={{
							marginTop: '2.5em',
							marginBottom: '1.5em',
							position: 'relative',
							overflow: 'hidden',
							height: '100%',
							paddingTop: title ? isMobile ? '4em' : '6em' : '0.6em'
						}}
					>
						{!disableScroll && (
							<Scrollbar horizontalScroll>
								<div
									style={{
										// paddingTop: "2.5em",
										paddingBottom: '0.5em',
										paddingLeft: '2vw',
										paddingRight: '2vw',
										...stylesNoScroll
									}}
								>
									{children}
								</div>
							</Scrollbar>
						)}
						{disableScroll && (
							<div
								style={{
									// paddingTop: "2.5em",
									paddingBottom: '0.5em',
									height: '100%'
								}}
							>
								{children}
							</div>
						)}
					</div>
					{!!footer
						&& <div
							style={{
								width: '100%',
								height: '2.5em',
								position: 'absolute',
								bottom: 0,
								right: 0,
							}}
						>
							{footer}
						</div>
					}
				</Paper>
			</div>
			<CBXFooter />
		</div>
	);
};

export default withWindowSize(CardPageLayout);
