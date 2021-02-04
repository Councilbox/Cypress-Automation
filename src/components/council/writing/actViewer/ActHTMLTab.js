import React from 'react';
import { withApollo } from 'react-apollo';
import { councilActEmail } from '../../../../queries';
import { LoadingSection } from '../../../../displayComponents';
import CBXDocumentLayout from '../../../documentEditor/CBXDocumentLayout';
import withWindowSize from '../../../../HOCs/withWindowSize';
import DownloadActPDF from './DownloadActPDF';
import { getSecondary } from '../../../../styles/colors';
import SendToSignButton from './SendToSignButton';
import { ConfigContext } from '../../../../containers/AppControl';


const ActHTML = ({ translate, company, council, client, toolbar }) => {
	const [data, setData] = React.useState(null);
	const config = React.useContext(ConfigContext);
	const [loading, setLoading] = React.useState(true);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: councilActEmail,
			variables: {
				councilId: +council.id
			}
		});

		setData(response.data);
		setLoading(false);
	}, [council.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	if (loading) {
		return (
			<LoadingSection />
		);
	}

	const secondary = getSecondary();

	return (
		<React.Fragment>
			{toolbar ?
				toolbar()
			:
				data.councilAct.type === 0 &&
					<>
						<DownloadActPDF
							translate={translate}
							council={council}
						/>
						{config.sendActToSign &&
							<SendToSignButton
								council={council}
								company={company}
								translate={translate}
								styles={{ marginLeft: '1em' }}
							/>
						}
					</>
			}


			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: '0.8em'
				}}
			>
				{data.councilAct.type === 1 ?
					<React.Fragment>
						<div style={{ fontSize: '1.1em', fontWeight: '700', color: secondary }}>
							{translate.user_upload_minutes}
						</div>
						<DownloadActPDF
							translate={translate}
							council={council}
						/>
						{config.sendActToSign &&
							<SendToSignButton
								council={council}
								company={company}
								translate={translate}
								styles={{ marginLeft: '1em' }}
							/>
						}
					</React.Fragment>
				:
					<div style={{ border: '1px solid gainsboro' }}>
						<CBXDocumentLayout
							preview={data.councilAct.emailAct}
							loading={false}
							company={company}
							options={data.councilAct.document ? data.councilAct.document.options : { stamp: true }}
						/>
					</div>
				}
			</div>
		</React.Fragment>
	);
}


export default withApollo(withWindowSize(ActHTML));
