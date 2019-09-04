import React from 'react';
import { withApollo } from 'react-apollo';
import { councilActEmail } from '../../../../queries';
import { LoadingSection } from '../../../../displayComponents';
import { Paper } from 'material-ui';
import withWindowSize from '../../../../HOCs/withWindowSize';
import DownloadActPDF from './DownloadActPDF';
import { getSecondary } from '../../../../styles/colors';


const ActHTML = ({ translate, council, client, ...props }) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: councilActEmail,
			variables: {
				councilId: council.id
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
			{data.councilAct.type === 0 &&
				<DownloadActPDF
					translate={translate}
					council={council}
				/>
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
				{data.councilAct.type === 1?
					<React.Fragment>
						<div style={{fontSize: '1.1em', fontWeight: '700', color: secondary}}>
							Acta subida por el usuario. {/*TRADUCCION*/}
						</div>
						<DownloadActPDF
							translate={translate}
							council={council}
						/>
					</React.Fragment>
				:
					<Paper
						className={props.windowSize !== 'xs' ? 'htmlPreview' : ''}
					>
						<div
							dangerouslySetInnerHTML={{ __html: data.councilAct.emailAct }}
							style={{
								padding: "2em",
								margin: "0 auto"
							}}
						/>
					</Paper>
				}

			</div>
		</React.Fragment>
	);
}


export default withApollo(withWindowSize(ActHTML));