import React from 'react';
import FontAwesome from 'react-fontawesome';
import { TableRow, TableCell } from 'material-ui';
import { getSecondary } from '../../../styles/colors';
import { bHistory, moment } from '../../../containers/App';
import { Link } from '../../../displayComponents';
import FixedVideoURLModal from './FixedVideoURLModal';
import { councilTypesInfo } from '../../../constants';
import CloneCouncil from './council/CloneCouncil';

const getCouncilStateString = (state, councilStarted) => {
	const stateStrings = {
		'-1': 'Cancelada',
		0: 'Borrador',
		3: 'Preconvocada',
		5: 'Convocada sin notificar',
		10: 'Convocada y notificada',
		20: councilStarted ? 'Reunión iniciada' : 'Sala abierta',
		30: 'Aprobando acta en celebración',
		40: 'Finalizada',
		60: 'Acta aprobada',
		70: 'Acta enviada',
		80: 'No celebrada',
		90: 'Finalizada sin acta',
		default: 'Estado no contemplado'
	};

	return stateStrings[state] ? stateStrings[state] : stateStrings.default;
};


const CouncilItem = ({
	council, translate, hideFixedUrl, enCouncilRoot, index
}) => {
	const clickInRow = () => {
		bHistory.push(`/council/${council.id}`);
	};

	if (enCouncilRoot) {
		return (
			<div >
				<div
					style={{
						border: `2px solid ${getSecondary()}`,
						padding: '0.6em',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<span date={council.dateStart} style={{ color: getSecondary(), fontWeight: '700' }}>{moment(council.dateStart).format('LLL')}</span>
				</div>
				<div style={{
					margin: '1em 0px', width: '100%', display: 'flex', justifyContent: 'flex-end'
				}}>
					<CloneCouncil
						council={council}
						translate={translate}
					/>
					{!hideFixedUrl
						&& <FixedVideoURLModal
							translate={translate}
							council={council}

						/>
					}
				</div>
				<div style={{ margin: '1em 0px', border: '1px solid gainsboro' }}>
					<Link to={`/council/${council.id}`}>
						<div style={{
							display: 'flex', borderBottom: '1px solid gainsboro', alignItems: 'center', justifyContent: 'center'
						}}>
							<div style={{
								width: '10%', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center'
							}}>
								Total
							</div>
							<div style={{
								width: '10%', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center'
							}}>
								ID
							</div>
							<div style={{
								width: '20%', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center'
							}}>
								Entidad
							</div>
							<div style={{
								width: '20%', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center'
							}}>
								Nombre
							</div>
							<div style={{
								width: '20%', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center'
							}}>
								Fechas
							</div>
							<div style={{
								width: '20%', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center'
							}}>
								Estado
							</div>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<div style={{
								width: '10%', color: getSecondary(), display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
							}}>
								<FontAwesome
									name={'user'}
									style={{
										fontSize: '1.7em',
										color: getSecondary()
									}}
								/>
								<span style={{ fontSize: '2rem', paddingLeft: '10px' }}>{council.participants.length}</span>
							</div>
							<div style={{
								textAlign: 'center', width: '10%', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center'
							}}>
								{` ${council.id}`}
							</div>
							<div style={{
								width: '20%', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
							}}>
								<span styel={{ fontWeight: '700', width: '20%' }}>{council.company.businessName}</span>
							</div>
							<div style={{
								textAlign: 'center', width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
							}}>
								<span style={{ fontWeight: '700', fontSize: '0.8em', marginLeft: '0.2em' }}>{council.name}</span>
								<div>
									{translate[councilTypesInfo[council.councilType].name]}
								</div>
							</div>
							<div style={{ textAlign: 'center', width: '20%' }}>
								<span> {moment(council.dateStart).format('LLL')}</span>
								{council.autoClose === 1
									&& <React.Fragment><br></br> <span>Fecha de cierre automático: {moment(council.closeDate).format('LLL')}</span></React.Fragment>
								}
								{council.dateEnd
									&& <React.Fragment><br></br><span>Fecha de finalización: {moment(council.dateEnd).format('LLL')}</span></React.Fragment>
								}
							</div>
							<span style={{
								textAlign: 'center', width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
							}}>{getCouncilStateString(council.state, council.councilStarted)}</span>

						</div>
					</Link>
				</div>
			</div >
		);
	}
	return (
		<TableRow onClick={clickInRow} style={{ cursor: 'pointer', color: 'black', background: index % 2 && 'gainsboro' }}>
			<TableCell style={{ color: 'black' }}>
				<i
					className={'fa fa-user'}
					style={{
						fontSize: '1.7em',
						color: getSecondary()
					}}
				/>
				<span style={{ fontSize: '2rem', paddingLeft: '10px' }}>{council.participants.length}</span>
			</TableCell>
			<TableCell style={{ color: 'black' }}>
				{` ${council.id}`}
			</TableCell>
			<TableCell style={{ color: 'black' }}>
				<span styel={{ fontWeight: '700', width: '20%' }}>{council.company.businessName}</span>
			</TableCell>
			<TableCell style={{ color: 'black' }}>
				<span style={{ fontWeight: '700', fontSize: '0.8em', marginLeft: '0.2em' }}>{council.name}</span>
				<div>
					{translate[councilTypesInfo[council.councilType].name]}
				</div>
			</TableCell>
			<TableCell style={{ color: 'black' }}>
				<span> {moment(council.dateStart).format('LLL')}</span>
				{council.autoClose === 1
					&& <React.Fragment><br></br> <span>Fecha de cierre automático: {moment(council.closeDate).format('LLL')}</span></React.Fragment>
				}
				{council.dateEnd
					&& <React.Fragment><br></br><span>Fecha de finalización: {moment(council.dateEnd).format('LLL')}</span></React.Fragment>
				}
			</TableCell>
			<TableCell style={{ color: 'black' }}>
				<span style={{
					textAlign: 'center', width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
				}}>{getCouncilStateString(council.state, council.councilStarted)}</span>
			</TableCell>
		</TableRow>
	);
};

export default CouncilItem;


