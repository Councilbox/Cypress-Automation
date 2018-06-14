import React from 'react';
import { lightGrey, getSecondary, getPrimary } from '../../../styles/colors';
import { DateWrapper } from '../../../displayComponents';
import FontAwesome from 'react-fontawesome';

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
            <DateWrapper format="dddd, DD/MM/YYYY" date={council.dateStart} style={{color: getSecondary(), fontWeight: '700', textTransform: 'capitalize'}} />
        </div>
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
                <DateWrapper format="DD/MM/YYY HH:mm" date={council.dateStart} style={{fontSize: '0.7em'}} />
            </div>
        </div>
    </div>
)

export default CouncilItem;