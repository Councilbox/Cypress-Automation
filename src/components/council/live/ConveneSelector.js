import React from 'react';
import { DateWrapper } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import QuorumWrapper from '../quorum/QuorumWrapper';


const ConveneSelector = ({ translate, council }) => {
    console.log(council);
    return(
        <React.Fragment>
            <div
                style={{
                    width: '100%',
                    border: `1px solid ${getSecondary()}`,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.8em',
                    fontSize: '0.9rem'
                }}
            >
                <span style={{fontWeight: '700'}}>{translate.first_call}</span>
                <DateWrapper date={council.dateStart} format="DD/MM/YYYY HH:mm" />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <span style={{marginRight: '0.5em'}}>
                        {`${translate.quorum_type}: `}
                    </span>
                    <QuorumWrapper council={council} translate={translate} />
                </div>
            </div>
            {CBX.hasSecondCall(council.statute) &&
                <div
                    style={{
                        width: '100%',
                        border: `1px solid ${getSecondary()}`,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0.8em',
                        fontSize: '0.9rem'
                    }}
                >
                    <span style={{fontWeight: '700'}}>{translate.second_call}</span>
                    <DateWrapper date={council.dateStart2NdCall} format="DD/MM/YYYY HH:mm" />
                </div>
            }
        </React.Fragment>
    )
}

export default ConveneSelector;