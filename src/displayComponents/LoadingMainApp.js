import React, { useContext } from 'react';
import { ConfigContext } from '../containers/AppControl';
import { isMobile } from '../utils/screen';
import tips from '../assets/img/tips.png';
import title from '../assets/img/logo-xs.png';
import withTranslations from '../HOCs/withTranslations';

const LoadingMainApp = ({
	error, message, translate, company, displayAdvice
}) => {
	if (error) {
		window.location.reload();
	}

	const config = useContext(ConfigContext);

	if (displayAdvice) {
		return (
			<div
				style={{
					display: 'flex',
					height: '100vh',
					width: '100vw',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column'
				}}
			>
				<div style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column'
				}}>
					{config.notificationsBranding && <img src={company.logo} alt="councilbox logo" style={{ maxHeight: isMobile ? '80px' : '60px', paddingTop: isMobile ? '40px' : '0' }} /> }
					<div style={{
						display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', alignItems: 'center', paddingBottom: isMobile ? '40px' : null, textAlign: isMobile ? 'center' : null
					}}>
						<img src="/img/logo-icono.png" className="element-animation" alt="councilbox logo" style={{ width: '30px', maxHeight: '30px' }}/>
						<p style={{
							fontSize: isMobile ? '17px' : '22px', padding: isMobile ? '35px 35px 25px 40px' : '45px 25px 25px', color: '#7BA1B1'
						}}>{translate.opening_room_dont_close_navigator}</p>
					</div>
					<div>
						<div style={{
							backgroundColor: '#EFF8FA',
							flexDirection: 'row',
							width: '60%',
							margin: '0 auto',
							display: 'flex',
							justifyContent: 'spread-between',
						}}>
							{!isMobile && <img src={tips} alt="tips logo" style={{
								padding: '25px 25px 35px 20px', verticalAlign: 'top'
							}}/> }
							<div style={{ padding: isMobile ? '25px' : '20px 0' }}>
								<div style={{ display: 'flex', flexDirection: 'row' }}>
									<p style={{ fontSize: '20px', color: '#7BA1B1', marginBottom: '7px' }}>{translate.advices}</p>
									<span style={{ padding: isMobile ? '4px 10px' : '2px 10px' }}>
										<img src={title} style={{ width: isMobile ? '3.5rem' : '60%' }}/>
									</span>
								</div>
								<p style ={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: translate.loading_screen_marketing_text }} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				width: '100vw',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column'
			}}
		>
			<img src="/img/logo-icono.png" className="element-animation" alt="councilbox logo"></img>
			<div>
				{message}
			</div>
		</div>
	);
};


export default withTranslations()(LoadingMainApp);

