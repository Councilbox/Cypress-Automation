import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, AlertConfirm, LoadingSection } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import { downloadAct } from '../../../../queries';
import { bHistory } from '../../../../containers/App';


const SendToSignButton = ({
	styles, council, translate, client
}) => {
	const [loading, setLoading] = React.useState(false);
	const [signatureId, setSignatureId] = React.useState(null);
	const secondary = getSecondary();

	const createSignature = async () => {
		setLoading(1);
		const response = await client.mutate({
			mutation: gql`
				mutation CreateSignature($companyId: Int!, $signature: SignatureInput){
					createSignature(companyId: $companyId, signature: $signature){
						id
						title
					}
				}
			`,
			variables: {
				companyId: council.companyId,
				signature: {
					title: `${translate.act} ${council.name}`
				}
			}
		});

		if (response.data.createSignature.id) {
			setSignatureId(response.data.createSignature.id);
			setLoading(2);
			const actQuery = await client.query({
				query: downloadAct,
				variables: {
					councilId: council.id,
					clean: false
				}
			});

			await client.mutate({
				mutation: gql`
					mutation SaveSignatureDocument($document: SignatureDocumentInput){
						saveSignatureDocument(document: $document){
							id
							signatureId
							title
							description
							filename
							base64
							filesize
							filetype
						}
					}
				`,
				variables: {
					document: {
						filename: `${translate.act} ${council.name}.pdf`,
						filetype: 'application/pdf',
						filesize: (actQuery.data.downloadAct.length * (3 / 4)).toString(),
						base64: actQuery.data.downloadAct,
						signatureId: response.data.createSignature.id
					}
				}
			});

			setLoading(3);
		}
	};

	return (
		<>
			<AlertConfirm
				title={translate.uploading}
				open={loading}
				buttonAccept={translate.go_to_signature_editor}
				acceptAction={() => bHistory.push(`/company/${council.companyId}/signature/${signatureId}`)}
				requestClose={() => setLoading(false)}
				bodyText={
					<>
						{loading >= 1
&& <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }}>
	<div>
		{translate.creant_signatura}
	</div>
	<div>
		{loading > 1 ?
			<i className="fa fa-check" style={{ color: 'green' }}></i>
			: <LoadingSection size={14} />

		}
	</div>
</div>
						}
						{loading >= 2
&& <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }}>
	<div>
		{translate.uploading_act_to_sign}
	</div>
	<div>
		{loading > 2 ?
			<i className="fa fa-check" style={{ color: 'green' }}></i>
			: <LoadingSection size={14} />

		}
	</div>
</div>
						}
					</>
				}
			/>
			<BasicButton
				text={translate.new_send_to_sign}
				color={'white'}
				// loading={downloading}
				onClick={createSignature}
				type="flat"
				loadingColor={secondary}
				buttonStyle={{ marginTop: '0.5em', border: `1px solid ${secondary}` }}
				textStyle={{
					color: secondary,
					fontWeight: '700',
					fontSize: '0.9em',
					textTransform: 'none',
					...styles
				}}
			/>
		</>
	);
};

export default withApollo(SendToSignButton);
