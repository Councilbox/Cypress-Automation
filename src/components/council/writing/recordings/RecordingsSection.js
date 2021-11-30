import React from 'react';
import { getSecondary } from '../../../../styles/colors';
import { ALPHA_RELEASE_DATE } from '../../../../constants';
import { moment } from '../../../../containers/App';

const rand = Math.random();

class RecordingsSection extends React.Component {
	render() {
		const now = moment();
		const releaseDate = moment(ALPHA_RELEASE_DATE);
		const legacyRecordings = !(now.isAfter(releaseDate));


		if (!this.props.data.recordingsIframe) {
			return (
				<div style={{
					width: '100%', height: '100%', paddingTop: '8em', fontSize: '20px', display: 'flex', fontWeight: '700', flexDirection: 'column', alignItems: 'center'
				}}>
					{legacyRecordings ?
						<div style={{
							width: '100%', padding: '1em', display: 'flex', justifyContent: 'center'
						}}>
							La visualización de este contenido no está disponible en estos momentos, estamos trabajando para que esté disponible lo antes posible. <br />
							En caso de necesitarlo, puede ponerse en contacto con el equipo de Councilbox.
						</div>
						: <React.Fragment>
							<i className="material-icons" style={{ color: getSecondary(), fontSize: '8em' }}>
								videocam_off
							</i>
							{this.props.translate.no_recordings}
						</React.Fragment>
					}
				</div>
			);
		}

		return (
			<div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
				<iframe
					title="meetingScreen"
					allow="geolocation; microphone; camera; display-capture"
					scrolling="yes"
					className="temp_video"
					src={`https://${this.props.data.recordingsIframe}?rand=${rand}`}
					allowFullScreen={true}
					style={{
						border: 'none !important',
					}}
				>
					Something wrong...
				</iframe>
			</div>
		);
	}
}

export default RecordingsSection;
