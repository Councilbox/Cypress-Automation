import { withApollo } from 'react-apollo';
import React, { useState, useEffect } from 'react';
import {
	AlertConfirm, TextInput, Icon, BasicButton,
	PaginationFooter, Scrollbar
} from '../../../../../displayComponents';
import participantIcon from '../../../../../assets/img/participant-icon.png';
import arrowDown from '../../../../../assets/img/arrow-down.svg';
import CheckBox from '../../../../../displayComponents/CheckBox';
import { secondary } from '../../../../../styles/colors';
import { isMobile } from '../../../../../utils/screen';

const mockTotalDelegations = {
	hasDelegations: [
		{
			id: 1234,
			name: 'Roberto',
			surname: 'Andrades Moreno',

		},
		{
			id: 1235,
			name: 'Nina',
			surname: 'Amina',

		},
		{
			id: 1236,
			name: 'Ricard',
			surname: 'Mayor',

		},
		{
			id: 1237,
			name: 'Nora',
			surname: 'Alami',

		},
		{
			id: 1238,
			name: 'Imagine',
			surname: 'People',

		},
		{
			id: 1239,
			name: 'Lucia',
			surname: 'Montarval',

		},
		{
			id: 1231,
			name: 'More',
			surname: 'Silviraya',

		},
		{
			id: 1232,
			name: 'Swami',
			surname: 'Turiyananda Warabananda',

		}
	]
};

const ManageDelegationsModal = ({
	translate, participant
}) => {
	const [data, setData] = useState([]);
	const [isChecked, setIsChecked] = useState([]);

	const [showDelegationModal, setShowDelegationsModal] = useState(false);


	useEffect(() => {
		setData(mockTotalDelegations.hasDelegations);
	}, []);

	useEffect(() => {
		setIsChecked(data.map(d => ({
			id: d.id,
			selected: false,
		})));
	}, [data]);


	const renderBody = () => (
		<div style={{
			display: 'flex', flexDirection: 'column', height: '100%'
		}}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div>
					<img src={participantIcon} />
				</div>
				<p style={{ fontSize: isMobile ? '17px' : '18px', paddingLeft: '1rem' }}>
					{`Votos delegados de: ${data[0]?.name} y ${data.length - 1} más `}
				</p>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingBottom: '1rem'
				}}>
				<div
					style={{
						paddingLeft: '0.5rem',
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center'
					}}>
					<div style={{ marginRight: '2px' }}>
						<img src={arrowDown}/>
					</div>
					<CheckBox value={true} />
				</div>
				<div style={{ width: isMobile ? '%' : '20%' }}>
					<TextInput
						placeholder='Buscar participante'
						adornment={<Icon>search</Icon>}
					/>
				</div>
			</div>
			<div style={{ height: 'calc( 100% - 5em )' }}>
				<Scrollbar>
					{data.map(d => (
						<div
							key={d.id}
							style={{
								display: 'flex',
								flexDirection: isMobile ? 'column' : 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								border: `1px solid ${secondary}`,
								padding: '1rem',
								margin: '5px',
								borderRadius: '4px',
								boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
								marginRight: isMobile ? '0' : '1.5rem',
							}}
						>
							<div style={{
								display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: isMobile ? '1rem' : '0'
							}}>
								<CheckBox
									onChange={event => setIsChecked(isChecked.map(i => {
										if (d.id === i.id) {
											i.selected = event.target.checked;
										}
										event.preventDefault();
										return i;
									}))}
									value={d.selected}

								/>
								<p style={{
									marginBottom: '0',
									overflow: 'hidden',
									width: isMobile ? '250px' : null,
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis',
									flexShrink: 1
								}}>
									{`Voto delegado de: ${d.name} ${d.surname}`}
								</p>
							</div>
							<div style={{ display: 'flex', flexDirection: 'row', justifyContent: isMobile ? 'space-between' : null }}>
								<BasicButton
									text='Quitar delegacion'
									color={'white'}
									textStyle={{
										color: '#EE2E6B',
										fontWeight: '400',
										fontSize: isMobile ? '12px' : '14px',
										textTransform: 'none'
									}}
									textPosition="after"
									buttonStyle={{
										marginRight: '1em',
									}}
								/>
								<BasicButton
									text='Reasignar voto'
									color={'white'}
									textStyle={{
										color: '#595959',
										fontWeight: '400',
										fontSize: isMobile ? '12px' : '14px',
										textTransform: 'none'
									}}
									textPosition="after"
									buttonStyle={{
										marginRight: '1em',
									}}
								/>
							</div>
						</div>))
					}
					<div style={{ margin: '1rem' }}>
						<PaginationFooter
							translate={translate}
						/>
					</div>

				</Scrollbar>
			</div>
		</div>
	);
	return (
		<div onClick={event => event.stopPropagation()}>
			<AlertConfirm
				requestClose={event => {
					event.stopPropagation();
					event.preventDefault();
					setShowDelegationsModal(false);
				}}
				open={showDelegationModal}
				bodyStyle={{
					minWidth: isMobile ? '90vw' : '60vw', maxWidth: isMobile ? '90vw' : '60vw', height: '100%', margin: '0 auto'
				}}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				title={`${participant.name} ${participant.surname}`}
				bodyText={renderBody()}
				widthModal={{ height: '100%', maxHeight: '550px' }}
			/>
			<BasicButton
				text={`${translate.delegations} (230)`}
				buttonStyle={{ border: `1px solid ${secondary}`, width: '100%' }}
				type="flat"
				textStyle={{ color: secondary, fontWeight: '700' }}
				color={'white'}
				onClick={event => {
					event.stopPropagation();
					event.preventDefault();
					setShowDelegationsModal(true);
				}}
			/>
		</div>

	);
};

export default withApollo(ManageDelegationsModal);
