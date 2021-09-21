import React from 'react';
import { Icon } from 'material-ui';
import withSharedProps from '../../HOCs/withSharedProps';
import LateralOption from './LateralOption';
import { darkGrey } from '../../styles/styles';
import logo from '../../assets/img/logo-icono.png';
import { isMobile } from '../../utils/screen';
import { ConfigContext } from '../../containers/AppControl';


const LateralMenuOptions = ({
	translate, company, stylesMenu, clase, menuType
}) => {
	const config = React.useContext(ConfigContext);

	const renderMenuOptions = type => {
		const menuOptions = {
			council: (
				<React.Fragment>
					<LateralOption
						customIcon={<i className="fa fa-pencil-square-o"></i>}
						text={translate.companies_draft}
						id={'side-menu-drafts'}
						link={`/company/${company.id}/councils/drafts`}
						style={{ marginTop: '10px', color: '#ffffffcc' }}
					/>

					<LateralOption
						customIcon={<i className="fa fa-calendar-o"></i>}
						text={translate.companies_calendar}
						id={'side-menu-calendar'}
						link={`/company/${company.id}/councils/calendar`}
						style={{ color: '#ffffffcc' }}
					/>
					<LateralOption
						link={`/company/${company.id}/councils/live`}
						customIcon={<i className="fa  fa-users"></i>}
						id={'side-menu-live'}
						text={translate.companies_live}
						style={{ color: '#ffffffcc' }}
					/>
					<LateralOption
						link={`/company/${company.id}/councils/act`}
						customIcon={<i className="fa fa-clipboard"></i>}
						id={'side-menu-act'}
						text={translate.companies_writing}
						style={{ color: '#ffffffcc' }}
					/>
					<LateralOption
						link={`/company/${company.id}/councils/confirmed`}
						customIcon={<i className="fa fa-clipboard"></i>}
						text={translate.act_book}
						id={'side-menu-book'}
						style={{ color: '#ffffffcc' }}
					/>
					<LateralOption
						link={`/company/${company.id}/councils/history`}
						customIcon={<i className="fa fa-history"></i>}
						text={translate.dashboard_historical}
						id={'side-menu-history'}
						style={{ color: '#ffffffcc' }}
					/>
					<LateralOption
						customIcon={
							<Icon>
								import_contacts
							</Icon>
						}
						text={translate.all_plural_fem}
						link={`/company/${company.id}/councils/all`}
						id={'side-menu-all'}
						style={{ color: '#ffffffcc' }}
					/>
				</React.Fragment>
			),
			dashboard: (
				<React.Fragment>
					<LateralOption
						icon={'gavel'}
						text={translate.council_types}
						link={`/company/${company.id}/statutes`}
						id={'side-menu-statutes'}
						style={{ marginTop: '10px' }}
					/>
					{(config.partnerBook && company.type !== 10)
						&& <LateralOption
							icon={'contacts'}
							text={translate.book}
							id={'side-menu-book'}
							link={`/company/${company.id}/book`}
						/>
					}
					<LateralOption
						link={`/company/${company.id}/censuses`}
						icon={'person'}
						id={'side-menu-censuses'}
						text={translate.censuses}
					/>
					<LateralOption
						link={`/company/${company.id}/drafts/documentation`}
						icon={'class'}
						id={'side-menu-documentation'}
						text={translate.tooltip_knowledge_base}
					/>
					<LateralOption
						link={`/company/${company.id}/council/new`}
						icon={'Nueva reunion'}
						id={'side-menu-new-council'}
						customIcon={<img src={logo} style={{ height: '100%', width: '100%' }} alt="councilbox-logo" />}
						text={translate.dashboard_new}
					/>
					<LateralOption
						link={`/company/${company.id}/meeting/new`}
						icon={'video_call'}
						id={'side-menu-meeting'}
						text={translate.start_conference}
						style={{ marginBottom: '10px' }}
					/>
				</React.Fragment>
			)
		};

		return menuOptions[type] ? menuOptions[type] : menuOptions.dashboard;
	};

	return (
		!isMobile
		&& <div className={clase} style={{
			background: 'transparent',
			width: '130px',
			position: 'fixed',
			top: '45px',
			left: '75px',
			zIndex: '1',
			border: 'none',
			boxShadow: 'none',
			...stylesMenu
		}
		}>
			<div style={{
				background: darkGrey,
				height: '100%',
				width: '117px',
				left: '12px',
				position: 'relative',
				boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)'
			}}>
				<div style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '6px'
				}}>

					{renderMenuOptions(menuType)}

				</div>
			</div>
		</div>
	);
};


export default withSharedProps()(LateralMenuOptions);
