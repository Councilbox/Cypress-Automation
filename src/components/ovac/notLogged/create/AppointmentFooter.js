import React from 'react';
import { CLIENT_VERSION } from '../../../../config';
import withTranslations from '../../../../HOCs/withTranslations';
import { isMobile } from '../../../../utils/screen';
import LegalModal from './LegalModal';

const date = new Date();

const year = date.getFullYear();

const AppointmentFooter = ({ translate, color = 'rgba(180, 198, 222, 0.16)' }) => {
	const [modal, setModal] = React.useState(false);

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center'
			}}
		>
			{isMobile ?
				<div
					style={{
						width: '100%',
						borderRadius: '6px',
						backgroundColor: color,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						marginTop: '2em ',
						marginBottom: '1em',
						padding: '12px 3em'
					}}
				>
					<LegalModal
						open={modal}
						translate={translate}
						requestClose={() => setModal(false)}
					/>
					<div
						onClick={() => setModal(true)}
						style={{
							color: '#154481',
							cursor: 'pointer',
							fontWeight: '600',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{translate.legal_warning}
					</div>
					<div style={{ display: 'flex', marginTop: '0.6em', justifyContent: 'center' }}>
						<div
							dangerouslySetInnerHTML={{ __html: `Copyright &copy ${year} v${CLIENT_VERSION}` }}
						/>
					</div>
					<div style={{ display: 'flex', marginTop: '0.6em', justifyContent: 'center' }}>
						<a href="https://www.councilbox.com" rel="noreferrer noopener" style={{ color: 'black' }}>
							Councilbox Technology S.L.
						</a>
					</div>
				</div>
				:
				<div
					style={{
						width: '100%',
						borderRadius: '6px',
						backgroundColor: color,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: '2em ',
						marginBottom: '1em',
						padding: '12px 3em'
					}}
				>
					<LegalModal
						open={modal}
						translate={translate}
						requestClose={() => setModal(false)}
					/>
					<div
						onClick={() => setModal(true)}
						style={{
							color: '#154481',
							cursor: 'pointer',
							fontWeight: '600'
						}}
					>
						{translate.legal_warning}
					</div>
					<div style={{ display: 'flex' }}>
						<div
							dangerouslySetInnerHTML={{ __html: `Copyright &copy ${year}` }}
						/>
						v<span id="client-version">{CLIENT_VERSION}</span>{' - '}
						<a href="https://www.councilbox.com" rel="noreferrer noopener" style={{ color: 'black' }}>
							Councilbox Technology S.L.
						</a>
					</div>
				</div>
			}
		</div>

	);
};

export default withTranslations()(AppointmentFooter);
