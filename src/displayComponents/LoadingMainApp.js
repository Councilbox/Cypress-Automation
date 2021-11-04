import React from 'react';
import tips from '../assets/img/tips.png';
import title from '../assets/img/logo-xs.png';
import withSharedProps from '../HOCs/withSharedProps';

const LoadingMainApp = ({
	error, message, translate, company, displayPopUp
}) => {
	if (error) {
		window.location.reload();
	}

	if (displayPopUp) {
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
					<img src={company.logo} alt="councilbox logo" style={{ maxHeight: '60px' }} />
					<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<img src="/img/logo-icono.png" className="element-animation" alt="councilbox logo" style={{ width: '30px', maxHeight: '30px' }}/>
						<p style={{
							fontSize: '22px', padding: '45px 25px 25px', color: '#7BA1B1'
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
							<img src={tips} alt="tips logo" style={{ padding: '25px 25px 35px 20px', verticalAlign: 'top' }}/>
							<div style={{ padding: '20px 0' }}>
								<div style={{ display: 'flex', flexDirection: 'row' }}>
									<p style={{ fontSize: '20px', color: '#7BA1B1', marginBottom: '7px' }}>{translate.advices}</p>
									<span style={{ padding: '2px 10px' }}>
										<img src={title} style={{ width: '60%' }}/>
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


export default withSharedProps()(LoadingMainApp);

