import React from 'react';
import { withApollo } from 'react-apollo';
import ContentEditable from 'react-contenteditable';
import { Scrollbar, BasicButton } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary } from '../../../styles/colors';


const FileEstatutos = ({
	translate, data, updateFileData, updateCompany, ...props
}) => {
	const defaultStatutes = [
		{
			label: 'Denominación',
			value: ''
		},
		{
			label: 'Domicilio social',
			value: ''
		},
		{
			label: translate.social_capital_desc,
			value: ''
		},
		{
			label: 'Ejercicio social',
			value: ''
		}
	];

	const primary = getPrimary();

	const statutes = data.file.statutes ? data.file.statutes : defaultStatutes;

	const addRow = () => {
		const newStatutes = [...statutes, {
			label: '',
			value: ''
		}];
		updateFileData({
			statutes: newStatutes
		});
	};

	const deleteRow = index => {
		const newStatutes = [...statutes];
		newStatutes.splice(index, 1);
		updateFileData({
			statutes: newStatutes
		});
	};

	const updateStatute = (newData, index) => {
		const list = [...statutes];
		list[index] = {
			...list[index],
			...newData
		};

		updateFileData({
			statutes: [...list]
		});
	};


	return (
		<div style={{ height: '100%' }}>
			<div style={{ padding: '0px 1em 1em', height: '100%', }}>
				<div style={{ height: '100%', }}>
					<div style={{
						fontWeight: 'bold', color: primary, paddingBottom: '1em', display: 'flex', alignItems: 'center'
					}}>
						{translate.add}
						<i
							className={'fa fa-plus-circle'}
							onClick={addRow}
							style={{
								color: primary, cursor: 'pointer', fontSize: '25px', paddingLeft: '5px'
							}}
						/>
					</div>
					<Scrollbar>
						<div>
							{statutes.map((statute, index) => (
								<div key={index} style={{ borderBottom: `1px solid${primary}`, display: 'flex' }}>
									<div style={{ display: 'flex', padding: '1em', width: '100%' }} >
										<div style={{
											marginRight: '1em', width: '15%', color: primary, fontWeight: 'bold'
										}}>
											<ContentEditable
												style={{ color: primary, minWidth: '10em', borderBottom: !statute.label && '1px solid black' }}
												html={statute.label || ''}
												onChange={event => {
													updateStatute({
														label: event.target.value
													}, index);
												}}
											/>
										</div>
										<div style={{
											marginRight: '1em', width: '85%', display: 'flex', flexGrow: 1, justifyContent: 'space-between'
										}}>
											<ContentEditable
												style={{ color: 'black', minWidth: '10em', borderBottom: !statute.value && '1px solid black' }}
												html={statute.value || ''}
												onChange={event => {
													updateStatute({
														value: event.target.value
													}, index);
												}}
											/>
											<div style={{
												background: 'white', width: '10%', color: primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '25px'
											}}>
												<i className={'fa fa-times-circle'} onClick={() => deleteRow(index)} style={{ cursor: 'pointer', }} ></i>
											</div>
										</div>
									</div>
								</div>
							))}
							<BasicButton
								text={translate.save}
								color={primary}
								loading={props.updateState === 'LOADING'}
								success={props.updateState === 'SUCCESS'}
								textStyle={{
									color: 'white',
									fontWeight: '700',
									marginTop: '1em'
								}}
								onClick={updateCompany}
								floatRight={true}
							/>
						</div>
					</Scrollbar>
				</div>
			</div>
		</div>
	);
};


export default withTranslations()(withApollo(FileEstatutos));
