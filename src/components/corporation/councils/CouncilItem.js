import React from 'react';
import { getSecondary } from '../../../styles/colors';
import { moment } from '../../../containers/App';
import FontAwesome from 'react-fontawesome';
import { Link } from '../../../displayComponents';

const CouncilItem = ({ council, translate }) => (
    <div style={{margin: '0.8em'}}>
        <div
            style={{
                border: `2px solid ${getSecondary()}`,
                padding: '0.6em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <span date={council.dateStart} style={{color: getSecondary(), fontWeight: '700'}}>{moment(council.dateStart).format('LLL')}</span>
        </div>
        <Link to={`/council/${council.id}`}>
            <div style={{display: 'flex', flexDirection: 'row', padding: '0.6em'}}>
                <div style={{width: '15%', marginLeft: '5%', color: getSecondary(), display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome
                        name={'user'}
                        style={{
                            fontSize: "1.7em",
                            color: getSecondary()
                        }}
                    />
                    <span style={{fontSize: '2rem'}}>{council.participants.length}</span>
                </div>
                <div style={{fontSize: '0.75rem', paddingLeft: '1.2em', paddingRight: '1.2em'}}>
                    {`ID: ${council.id}`}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1em'}}>
                    <span style={{fontWeight: '700'}}>{council.company.businessName}</span>
                    <div>
                        <FontAwesome
                            name={'file-text'}
                            style={{
                                fontSize: "0.8em",
                                color: getSecondary()
                            }}
                        />
                        <span style={{fontWeight: '700', fontSize: '0.8em', marginLeft: '0.2em'}}>{council.name}</span>
                    </div>
                    <span date={council.dateStart}>{moment(council.dateStart).format('LLL')}</span>
                </div>
            </div>
        </Link>
    </div>
)

export default CouncilItem;