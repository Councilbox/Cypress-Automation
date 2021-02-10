import React from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { TableRow, TableCell, Typography } from 'material-ui';
import withSharedProps from '../../../HOCs/withSharedProps';
import {
	councilCertificates as councilCertificatesQuery,
	downloadCertificate as downloadCertificateMutation
} from '../../../queries';
import { getSecondary } from '../../../styles/colors';
import {
	LoadingSection, CardPageLayout, ButtonIcon, BasicButton, Table, DateWrapper
} from '../../../displayComponents';
import { downloadFile } from '../../../utils/CBX';
import CertificateEditor from './CertificateEditor';
import { useHoverRow } from '../../../hooks';

const CouncilCertificates = ({ data, translate, ...props }) => {
	const [editor, setEditor] = React.useState(false);
	const [downloading, setDownloading] = React.useState(false);
	const secondary = getSecondary();

	const downloadCertificate = async certificate => {
		setDownloading(certificate.id);

		const response = await props.downloadCertificate({
			variables: {
				id: certificate.id
			}
		});

		setDownloading(certificate.id);

		if (response) {
			if (!response.errors) {
				downloadFile(
					response.data.downloadCertificate,
					'application/pdf',
					`${certificate.title.replace(/\./, '')}`
				);
				setDownloading(false);
			}
		}
	};

	const closeEditor = () => {
		data.refetch();
		setEditor(false);
	};

	if (data.loading) {
		return <LoadingSection />;
	}

	const { councilCertificates } = data;

	if (editor) {
		return (
			<CertificateEditor
				council={data.council}
				translate={translate}
				requestClose={closeEditor}
			/>
		);
	}

	return (
		<CardPageLayout title={translate.certificates}>
			<div
				style={{
					padding: '1em',
					...(councilCertificates.length === 0 ? {
						display: 'flex',
						width: '100%',
						flexDirection: 'column',
						height: '15em',
						alignItems: 'center',
						justifyContent: 'center'
					} : {})
				}}
			>
				<BasicButton
					text={translate.certificates_new}
					textStyle={{ textTransform: 'none', fontWeight: '700', color: 'white' }}
					color={secondary}
					onClick={() => setEditor(true)}
					icon={<ButtonIcon type="add" color="white"/>}
				/>
				<div>
					{councilCertificates.length > 0 ?
						<Table
							headers={[
								{ name: translate.field_date },
								{ name: translate.certificate_title_of },
								{ name: '' }
							]}
						>
							{data.councilCertificates.map(certificate => (
								<HoverableRow
									key={`certificate_${certificate.id}`}
									certificate={certificate}
									downloading={certificate.id === downloading}
									downloadCertificate={downloadCertificate}
									translate={translate}
								/>
							))}
						</Table>
						: <Typography variant="subheading" style={{ fontWeight: '700', marginTop: '0.8em' }}>
							{translate.no_certificates}
						</Typography>
					}
				</div>
			</div>
		</CardPageLayout>
	);
};


const HoverableRow = ({
	certificate, downloading, translate, ...props
}) => {
	const [show, handlers] = useHoverRow();
	const secondary = getSecondary();

	return (
		<TableRow
			key={`certificate_${certificate.id}`}
			{...handlers}
		>
			<TableCell>
				<DateWrapper format="DD/MM/YYYY HH:mm" date={certificate.date} />
			</TableCell>
			<TableCell>
				{certificate.title}
			</TableCell>
			<TableCell>
				<div style={{ width: '10em' }}>
					{(show || downloading)
&& <BasicButton
	text={translate.download}
	color='white'
	loading={downloading}
	loadingColor={secondary}
	buttonStyle={{ border: `1px solid ${secondary}` }}
	textStyle={{ textTransform: 'none', color: secondary }}
	icon={<ButtonIcon type="get_app" color={secondary} />}
	onClick={() => props.downloadCertificate(certificate)}
/>
					}
				</div>
			</TableCell>
		</TableRow>
	);
};


export default compose(
	graphql(councilCertificatesQuery, {
		options: props => ({
			variables: {
				councilId: +props.match.params.council
			}
		})
	}),
	graphql(downloadCertificateMutation, {
		name: 'downloadCertificate'
	})
)(withSharedProps()(withRouter(CouncilCertificates)));
