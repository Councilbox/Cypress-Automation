import React from 'react';
import { getSecondary } from '../../../styles/colors';
import { moment } from '../../../containers/App';
import FontAwesome from 'react-fontawesome';
import { Link, BasicButton } from '../../../displayComponents';
import FixedVideoURLModal from './FixedVideoURLModal';

const CouncilItem = ({ council, translate, hideFixedUrl, enRoot }) => {

    if (enRoot) {
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
                <div style={{ margin: "1em 0px", border: "1px solid gainsboro" }}>
                    <Link to={`/council/${council.id}`}>
                        <div style={{ display: 'flex', flexDirection: 'row', padding: '0.6em' }}>
                            <div style={{ width: '10%', color: getSecondary(), display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                                <FontAwesome
                                    name={'user'}
                                    style={{
                                        fontSize: "1.7em",
                                        color: getSecondary()
                                    }}
                                />
                                <span style={{ fontSize: '2rem' }}>{council.participants.length}</span>
                            </div>
                            <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center"}}>
                                {`ID: ${council.id}`}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', }}>
                                <span style={{ fontWeight: '700' }}>{council.company.businessName}</span>
                                <div>
                                    <FontAwesome
                                        name={'file-text'}
                                        style={{
                                            fontSize: "0.8em",
                                            color: getSecondary()
                                        }}
                                    />
                                    <span style={{ fontWeight: '700', fontSize: '0.8em', marginLeft: '0.2em' }}>{council.name}</span>
                                </div>
                                <span>{moment(council.dateStart).format('LLL')}</span>
                                {council.autoClose === 1 &&
                                    <span>Fecha de cierre automático: {moment(council.closeDate).format('LLL')}</span>
                                }
                                {council.dateEnd &&
                                    <span>Fecha de finalización: {moment(council.dateEnd).format('LLL')}</span>
                                }
                                <span>Estado: {getCouncilStateString(council.state, council.councilStarted)}</span>
                                {!hideFixedUrl &&
                                    <FixedVideoURLModal
                                        translate={translate}
                                        council={council}
                                    />
                                }
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    } else {
        return (
            <div style={{}}> {/**margin: '0.8em' */}
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
                <Link to={`/council/${council.id}`}>
                    <div style={{ display: 'flex', flexDirection: 'row', padding: '0.6em' }}>
                        <div style={{ width: '10%', color: getSecondary(), display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                            <FontAwesome
                                name={'user'}
                                style={{
                                    fontSize: "1.7em",
                                    color: getSecondary()
                                }}
                            />
                            <span style={{ fontSize: '2rem' }}>{council.participants.length}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em' }}>
                            {`ID: ${council.id}`}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <span style={{ fontWeight: '700' }}>{council.company.businessName}</span>
                            <div>
                                <FontAwesome
                                    name={'file-text'}
                                    style={{
                                        fontSize: "0.8em",
                                        color: getSecondary()
                                    }}
                                />
                                <span style={{ fontWeight: '700', fontSize: '0.8em', marginLeft: '0.2em' }}>{council.name}</span>
                            </div>
                            <span>{moment(council.dateStart).format('LLL')}</span>
                            {council.autoClose === 1 &&
                                <span>Fecha de cierre automático: {moment(council.closeDate).format('LLL')}</span>
                            }
                            {council.dateEnd &&
                                <span>Fecha de finalización: {moment(council.dateEnd).format('LLL')}</span>
                            }
                            <span>Estado: {getCouncilStateString(council.state, council.councilStarted)}</span>
                            {!hideFixedUrl &&
                                <FixedVideoURLModal
                                    translate={translate}
                                    council={council}
                                />
                            }
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
}

export default CouncilItem;

const getCouncilStateString = (state, councilStarted) => {
    const stateStrings = {
        '-1': 'Cancelada',
        '0': 'Borrador',
        '3': 'Preconvocada',
        '5': 'Convocada sin notificar',
        '10': 'Convocada y notificada',
        '20': councilStarted ? 'Reunión iniciada' : 'Sala abierta',
        '30': 'Aprobando acta en celebración',
        '40': 'Finalizada',
        '60': 'Acta aprobada',
        '70': 'Acta enviada',
        '80': 'No celebrada',
        '90': 'Finalizada sin acta',
        default: 'Estado no contemplado'
    }

    return stateStrings[state] ? stateStrings[state] : stateStrings.default
}