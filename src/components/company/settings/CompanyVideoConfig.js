import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { MenuItem } from 'material-ui';
import { BasicButton, AlertConfirm, TextInput, SelectInput } from '../../../displayComponents';


const CompanyVideoConfig = ({ client, company, translate }) => {
	const [modal, setModal] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [data, setData] = React.useState({
		videoConfig: {
			rtmp: '',
			type: '',
			viewerURL: ''
		}
	});

	const updatePlatform = async () => {
		setSaving(true);
		await client.mutate({
			mutation: gql`
				mutation updateCompanyPlatform($companyPlatform: CompanyPlatformInput){
					updateCompanyPlatform(companyPlatform: $companyPlatform){
						success
					}
				}
			`,
			variables: {
				companyPlatform: {
					companyId: company.id,
					videoConfig: data.videoConfig,
					type: data.type === 'default' ? null : data.type
				}
			}
		});
		setSaving(false);
	};

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query CompanyPlatform($companyId: Int!){
					companyPlatform(companyId: $companyId){
						videoConfig
						type
					}
				}
			`,
			variables: {
				companyId: company.id
			}
		});

		const { companyPlatform } = response.data;
		setData({
			type: companyPlatform.type,
			videoConfig: {
				rtmp: (companyPlatform.videoConfig && companyPlatform.videoConfig.rtmp) ? companyPlatform.videoConfig.rtmp : '',
				fixedSlot: (companyPlatform.videoConfig && companyPlatform.videoConfig.fixedSlot) ? companyPlatform.videoConfig.fixedSlot : '',
				viewerURL: (companyPlatform.videoConfig && companyPlatform.videoConfig.viewerURL) ? companyPlatform.videoConfig.viewerURL : ''
			}
		});
	}, [company.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	return (
		<>
			<BasicButton
				text="Configuración video"
				onClick={() => setModal(true)}
			/>
			<AlertConfirm
				open={modal}
				buttonCancel={translate.cancel}
				buttonAccept={'Guardar'}
				loadingAction={saving}
				acceptAction={updatePlatform}
				title="Configuración video"
				requestClose={() => setModal(false)}
				bodyText={
					<>
						<TextInput
							floatingText={'rtmp'}
							value={data.videoConfig.rtmp}
							onChange={event => {
								setData({
									videoConfig: {
										...data.videoConfig,
										rtmp: event.target.value
									}
								});
							}}
						/>
						<TextInput
							floatingText={'Instancia CMP'}
							value={data.videoConfig.fixedSlot}
							onChange={event => {
								setData({
									videoConfig: {
										...data.videoConfig,
										fixedSlot: event.target.value
									}
								});
							}}
						/>
						<TextInput
							floatingText={'URL para participantes sin palabra'}
							value={data.videoConfig.viewerURL}
							onChange={event => {
								setData({
									videoConfig: {
										...data.videoConfig,
										viewerURL: event.target.value
									}
								});
							}}
						/>
						<SelectInput
							value={data.type || 'default'}
							floatingText={'Plataforma de video'}
							onChange={event => setData({
								...data,
								type: event.target.value
							})}
						>
							<MenuItem value={'default'}>Por defecto</MenuItem>
							<MenuItem value={'CMP'}>CMP</MenuItem>
							<MenuItem value={'SHUTTER'}>SHUTTER</MenuItem>
						</SelectInput>
					</>
				}
			/>
		</>
	);
};

export default withApollo(CompanyVideoConfig);
