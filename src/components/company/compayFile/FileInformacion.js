import React from 'react';
import { withApollo } from 'react-apollo';
import ContentEditable from 'react-contenteditable';
import {
	Scrollbar, BasicButton, Grid, GridItem
} from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary } from '../../../styles/colors';


const FileInformacion = ({
	translate, data, updateCompanyData, updateCompanyFile, updateCompany, updateFileData, ...props
}) => {
	const primary = getPrimary();
	return (
		<div style={{ height: '100%' }}>
			<div style={{ padding: '0px 1em 1em', height: '100%' }}>
				<Scrollbar >
					<div style={{ height: '100%' }}>
						<div style={{
							padding: '1em'
						}}>
							<Grid style={{ marginTop: '0.6em' }}>
								<GridItem xs={12} md={8} lg={8} style={{ display: 'flex' }}>
									<div style={{
										color: primary,
										width: '125px',
										fontWeight: 'bold',
										marginRight: '1em'
									}}>
										{translate.denomination}
									</div>
									<div style={{
										color: 'black',
									}}>
										<ContentEditable
											html={data.businessName}
											onChange={event => {
												updateCompanyData({
													businessName: event.target.value
												});
											}}
										/>
									</div>
								</GridItem>
							</Grid>
						</div>
						<DividerContenido />
						<div style={{
							padding: '1em'
						}}>
							<Grid style={{ display: 'flex' }}>
								<GridItem xs={12} md={8} lg={8} style={{ display: 'flex' }}>
									<div style={{
										width: '125px',
										color: primary,
										fontWeight: 'bold',
										marginRight: '1em'
									}}>
										{translate.registered_office}
									</div>
									<ContentEditable
										style={{ color: 'black', borderBottom: !data.address ? '1px solid black' : 'none' }}
										html={data.address}
										onChange={event => {
											updateCompanyData({
												address: event.target.value
											});
										}}
									/>
								</GridItem>
								<GridItem xs={12} md={4} lg={4} style={{ display: 'flex' }}>
									<div style={{
										color: primary,
										width: '75px',
										fontWeight: 'bold'
									}}>
										{translate.cif}
									</div>
									<ContentEditable
										html={data.tin}
										style={{ borderBottom: !data.tin ? '1px solid black' : 'none' }}
										disabled={true}
									/>
								</GridItem>
							</Grid>
							<Grid style={{ marginTop: '0.6em' }}>
								<GridItem xs={12} md={8} lg={8} style={{ display: 'flex' }}>
									<div style={{
										color: primary,
										width: '125px',
										fontWeight: 'bold',
										marginRight: '1em'
									}}>
										{translate.social_capital_desc}
									</div>
									<ContentEditable
										style={{ color: 'black', minWidth: '10em', borderBottom: !data.file.socialCapital ? '1px solid black' : 'none' }}
										html={data.file.socialCapital || ''}
										onChange={event => {
											updateFileData({
												socialCapital: event.target.value
											});
										}}
									/>
								</GridItem>
								<GridItem xs={12} md={4} lg={4} style={{ display: 'flex' }}>
									<div style={{
										color: primary,
										width: '75px',
										fontWeight: 'bold'
									}}>
CNAE
									</div>
									<ContentEditable
										style={{ color: 'black', minWidth: '10em', borderBottom: !data.file.CNAE ? '1px solid black' : 'none' }}
										html={data.file.CNAE || ''}
										onChange={event => {
											updateFileData({
												CNAE: event.target.value
											});
										}}
									/>
								</GridItem>
							</Grid>
						</div>
						<DividerContenido />
						<div style={{
							padding: '1em'
						}}>
							<Grid style={{ marginTop: '0.6em' }}>
								<GridItem xs={12} md={8} lg={8} style={{ display: 'flex' }}>
									<div style={{
										color: primary,
										width: '125px',
										fontWeight: 'bold',
										marginRight: '1em'
									}}>
										{translate.constitution}
									</div>
									<ContentEditable
										style={{ color: 'black', minWidth: '10em', borderBottom: !data.file.constitution ? '1px solid black' : 'none' }}
										html={data.file.constitution || ''}
										onChange={event => {
											updateFileData({
												constitution: event.target.value
											});
										}}
									/>
								</GridItem>
							</Grid>
							<Grid style={{ marginTop: '0.6em' }}>
								<GridItem xs={12} md={8} lg={8} style={{ display: 'flex' }}>
									<div style={{
										color: primary,
										width: '125px',
										fontWeight: 'bold',
										marginRight: '1em'
									}}>
										{translate.adaptation}
									</div>
									<ContentEditable
										style={{ color: 'black', minWidth: '10em', borderBottom: !data.file.adaptation ? '1px solid black' : 'none' }}
										html={data.file.adaptation || ''}
										onChange={event => {
											updateFileData({
												adaptation: event.target.value
											});
										}}
									/>
								</GridItem>
							</Grid>
							<Grid style={{ marginTop: '0.6em' }}>
								<GridItem xs={12} md={8} lg={8} style={{ display: 'flex' }}>
									<div style={{
										color: primary,
										width: '125px',
										fontWeight: 'bold',
										marginRight: '1em'
									}}>
										{translate.transformation}
									</div>
									<ContentEditable
										style={{ color: 'black', minWidth: '10em', borderBottom: !data.file.transformation ? '1px solid black' : 'none' }}
										html={data.file.transformation || ''}
										onChange={event => {
											updateFileData({
												transformation: event.target.value
											});
										}}
									/>
								</GridItem>
							</Grid>
							<Grid style={{ marginTop: '0.6em' }}>
								<GridItem xs={12} md={8} lg={8} style={{ display: 'flex' }}>
									<div style={{
										color: primary,
										width: '125px',
										fontWeight: 'bold',
										marginRight: '1em'
									}}>
										{translate.transfer_registered_office}
									</div>
									<ContentEditable
										style={{ color: 'black', minWidth: '10em', borderBottom: !data.file.placeOfBusiness ? '1px solid black' : 'none' }}
										html={data.file.placeOfBusiness || ''}
										onChange={event => {
											updateFileData({
												placeOfBusiness: event.target.value
											});
										}}
									/>
								</GridItem>
							</Grid>
						</div>
						<DividerContenido />
						<div style={{
							padding: '1em'
						}}>
							<Grid style={{ marginTop: '0.6em' }}>
								<GridItem xs={12} md={8} lg={8} style={{ display: 'flex' }}>
									<div style={{
										color: primary,
										width: '125px',
										fontWeight: 'bold',
										marginRight: '1em'
									}}>
										{translate.fiscal_year}
									</div>
									<ContentEditable
										style={{ color: 'black', minWidth: '10em', borderBottom: !data.file.financialYear ? '1px solid black' : 'none' }}
										html={data.file.financialYear || ''}
										onChange={event => {
											updateFileData({
												financialYear: event.target.value
											});
										}}
									/>
								</GridItem>
							</Grid>
						</div>
						<BasicButton
							text={translate.save}
							color={primary}
							loading={props.updateState === 'LOADING'}
							success={props.updateState === 'SUCCESS'}
							textStyle={{
								color: 'white',
								fontWeight: '700'
							}}
							onClick={updateCompany}
							floatRight={true}
						/>
					</div>
				</Scrollbar>
			</div>
		</div>
	);
};

const DividerContenido = () => (
	<div style={{ borderBottom: `1px solid ${getPrimary()}` }}></div>
);

export default withTranslations()(withApollo(FileInformacion));
