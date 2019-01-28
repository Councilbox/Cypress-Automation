import React from "react";
import withSharedProps from '../../HOCs/withSharedProps';
import LateralOptions from "./LateralOptions";
import { darkGrey } from "../../styles/styles";
import logo from '../../assets/img/logo-icono.png';




class LateralMenuOptions extends React.Component {



	render() {
		const { translate, company } = this.props;

		return (
			<div className={"dropdown-container"}  style={{
				background: 'transparent',
				width: "130px",
				// height: "500px",
				// height: "100%",
				// paddingTop: "20px",
				position: "fixed",
				// top: "0",
				top: "45px",
				left: "75px",
				// left: "75px",
				zIndex: "1",
				border: "none",
				boxShadow: "none",
			}
			}>
				<div style={{ background: darkGrey, height: "100%", width: '117px', left: '12px', position: 'relative', boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)" }}>
					<div style={{
						width: "100%",
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						<LateralOptions
							icon={'gavel'}
							text={translate.council_types}
							link={`/company/${company.id}/statutes`}
							style={{ marginTop: "10px" }}
						/>

						<LateralOptions
							icon={'contacts'}
							text={translate.book}
							link={`/company/${company.id}/book`}
						/>
						<LateralOptions
							link={`/company/${company.id}/censuses`}
							icon={'person'}
							text={translate.censuses}
						/>
						<LateralOptions
							link={`/company/${company.id}/drafts`}
							icon={'class'}
							text={translate.drafts}
						/>
						<LateralOptions
							link={`/company/${company.id}/council/new`}
							icon={'Nueva reunion'}
							customIcon={<img src={logo} style={{ height: '100%', width: '100%' }} alt="councilbox-logo" />}
							text={translate.dashboard_new}
						/>
						<LateralOptions
							link={`/company/${company.id}/meeting/new`}
							icon={'video_call'}
							text={translate.start_conference}
							style={{ marginBottom: "10px" }}
						/>
					</div>
				</div>
			</div >
		);
	}
}


export default withSharedProps()(LateralMenuOptions);
