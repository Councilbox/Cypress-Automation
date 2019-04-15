import React from 'react';
import { getSecondary } from '../../../styles/colors';
import { moment } from '../../../containers/App';
import FontAwesome from 'react-fontawesome';
import { Link, BasicButton } from '../../../displayComponents';
import FixedVideoURLModal from './FixedVideoURLModal';
import { Card, CardHeader, CardContent } from 'material-ui';

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
                <div style={{ margin: "1em 0px", width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    {!hideFixedUrl &&
                        <FixedVideoURLModal
                            translate={translate}
                            council={council}

                        />
                    }
                </div>
                <div style={{ margin: "1em 0px", border: "1px solid gainsboro" }}>
                    <Link to={`/council/${council.id}`}>
                        <div style={{ display: 'flex', borderBottom: "1px solid gainsboro", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: '10%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Total
                            </div>
                            <div style={{ width: '10%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                ID
                            </div>
                            <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Titulo
                            </div>
                            <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Archivo
                            </div>
                            <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Fecha
                            </div>
                            <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Estado
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: '10%', color: getSecondary(), display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                                <FontAwesome
                                    name={'user'}
                                    style={{
                                        fontSize: "1.7em",
                                        color: getSecondary()
                                    }}
                                />
                                <span style={{ fontSize: '2rem', paddingLeft: "10px" }}>{council.participants.length}</span>
                            </div>
                            <div style={{ textAlign: "center", width: '10%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {` ${council.id}`}
                            </div>
                            <div style={{ textAlign: "center", width: '20%', textAlign: "center", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <span styel={{ fontWeight: '700', width: '20%' }}>{council.company.businessName}</span>
                            </div>
                            <div style={{ textAlign: "center", width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <FontAwesome
                                    name={'file-text'}
                                    style={{
                                        fontSize: "0.8em",
                                        color: getSecondary()
                                    }}
                                />
                                <span style={{ fontWeight: '700', fontSize: '0.8em', marginLeft: '0.2em' }}>{council.name}</span>
                            </div>
                            <div style={{ textAlign: "center", width: '20%' }}>
                                <span> {moment(council.dateStart).format('LLL')}</span>
                                {council.autoClose === 1 &&
                                    <React.Fragment><br></br> <span>Fecha de cierre automático: {moment(council.closeDate).format('LLL')}</span></React.Fragment>
                                }
                                {council.dateEnd &&
                                    <React.Fragment><br></br><span>Fecha de finalización: {moment(council.dateEnd).format('LLL')}</span></React.Fragment>
                                }
                            </div>
                            <span style={{ textAlign: "center", width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getCouncilStateString(council.state, council.councilStarted)}</span>

                        </div>
                    </Link>
                </div>
            </div >
        )
    } else {
        return (
            <div style={{ margin: '1.2em 0.8em' }}>
                <Link to={`/council/${council.id}`}>
                    <Card>
                        <CardHeader
                            title={moment(council.dateStart).format('LLL')}
                            subheader={council.company.businessName}
                        />
                        <CardContent>
                            <div style={{ border: "1px solid gainsboro" }}>

                                <div style={{ display: 'flex', borderBottom: "1px solid gainsboro", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ width: '10%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        Total
                            </div>
                                    <div style={{ width: '10%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        ID
                            </div>
                                    <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        Titulo
                            </div>
                                    <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        Archivo
                            </div>
                                    <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        Fecha
                            </div>
                                    <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        Estado
                            </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ width: '10%', color: getSecondary(), display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                                        <FontAwesome
                                            name={'user'}
                                            style={{
                                                fontSize: "1.7em",
                                                color: getSecondary()
                                            }}
                                        />
                                        <span style={{ fontSize: '2rem', paddingLeft: "10px" }}>{council.participants.length}</span>
                                    </div>
                                    <div style={{ textAlign: "center", width: '10%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {` ${council.id}`}
                                    </div>
                                    <div style={{ textAlign: "center", width: '20%', textAlign: "center", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <span styel={{ fontWeight: '700', width: '20%' }}>{council.company.businessName}</span>
                                    </div>
                                    <div style={{ textAlign: "center", width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <FontAwesome
                                            name={'file-text'}
                                            style={{
                                                fontSize: "0.8em",
                                                color: getSecondary()
                                            }}
                                        />
                                        <span style={{ fontWeight: '700', fontSize: '0.8em', marginLeft: '0.2em' }}>{council.name}</span>
                                    </div>
                                    <div style={{ textAlign: "center", width: '20%' }}>
                                        <span> {moment(council.dateStart).format('LLL')}</span>
                                        {council.autoClose === 1 &&
                                            <React.Fragment><br></br> <span>Fecha de cierre automático: {moment(council.closeDate).format('LLL')}</span></React.Fragment>
                                        }
                                        {council.dateEnd &&
                                            <React.Fragment><br></br><span>Fecha de finalización: {moment(council.dateEnd).format('LLL')}</span></React.Fragment>
                                        }
                                    </div>
                                    <span style={{ textAlign: "center", width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getCouncilStateString(council.state, council.councilStarted)}</span>

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                {/* <div
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
                <div style={{  border: "1px solid gainsboro" }}>
                    <Link to={`/council/${council.id}`}>
                        <div style={{ display: 'flex', borderBottom: "1px solid gainsboro", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: '10%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Total
                            </div>
                            <div style={{ width: '10%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                ID
                            </div>
                            <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Titulo
                            </div>
                            <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Archivo
                            </div>
                            <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Fecha
                            </div>
                            <div style={{ width: '20%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                Estado
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: '10%', color: getSecondary(), display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                                <FontAwesome
                                    name={'user'}
                                    style={{
                                        fontSize: "1.7em",
                                        color: getSecondary()
                                    }}
                                />
                                <span style={{ fontSize: '2rem', paddingLeft: "10px" }}>{council.participants.length}</span>
                            </div>
                            <div style={{ textAlign: "center", width: '10%', fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em', fontSize: '1em', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {` ${council.id}`}
                            </div>
                            <div style={{ textAlign: "center", width: '20%', textAlign: "center", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <span styel={{ fontWeight: '700', width: '20%' }}>{council.company.businessName}</span>
                            </div>
                            <div style={{ textAlign: "center", width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <FontAwesome
                                    name={'file-text'}
                                    style={{
                                        fontSize: "0.8em",
                                        color: getSecondary()
                                    }}
                                />
                                <span style={{ fontWeight: '700', fontSize: '0.8em', marginLeft: '0.2em' }}>{council.name}</span>
                            </div>
                            <div style={{ textAlign: "center", width: '20%' }}>
                                <span> {moment(council.dateStart).format('LLL')}</span>
                                {council.autoClose === 1 &&
                                    <React.Fragment><br></br> <span>Fecha de cierre automático: {moment(council.closeDate).format('LLL')}</span></React.Fragment>
                                }
                                {council.dateEnd &&
                                    <React.Fragment><br></br><span>Fecha de finalización: {moment(council.dateEnd).format('LLL')}</span></React.Fragment>
                                }
                            </div>
                            <span style={{ textAlign: "center", width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getCouncilStateString(council.state, council.councilStarted)}</span>

                        </div>
                    </Link>
                </div> */}
                {/* <Link to={`/council/${council.id}`}>
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
                </Link> */}
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