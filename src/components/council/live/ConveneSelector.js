import React from 'react';
import { DateWrapper } from '../../../displayComponents';
import * as CBX from '../../../utils/CBX';
import QuorumWrapper from '../quorum/QuorumWrapper';
import { Card } from 'material-ui';


const ConveneSelector = ({ translate, council, recount, convene, changeConvene }) => {
    const renderParticipationsText = () => {
        return `${recount.socialCapitalRightVoting} (${((recount.socialCapitalRightVoting / recount.socialCapitalTotal) * 100).toFixed(3)}%) ${translate.social_capital.toLowerCase()}`
    }

    return (
        <React.Fragment>
            <Card style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '0.8em',
                cursor: 'pointer',
                fontSize: '0.9rem',
                backgroundColor: convene === 1 && 'gainsboro',
                outline: 'none'
            }}
                elevation={convene === 1 ? 0 : 1}
                tabIndex="0"
                onClick={() => changeConvene(1)}
            >
                <span style={{ fontWeight: '700' }}>{`${translate.first_call} ${' '}`}</span>
                <DateWrapper date={council.dateStart} format="DD/MM/YYYY HH:mm" />
                <QuorumWrapper council={council} translate={translate} recount={recount} />
            </Card>
            {CBX.hasSecondCall(council.statute) &&
                <Card
                    style={{
                        width: '100%',
                        display: 'flex',
                        cursor: 'pointer',
                        flexDirection: 'column',
                        padding: '0.8em',
                        fontSize: '0.9rem',
                        marginTop: '0.5em',
                        outline: 'none',
                        backgroundColor: convene !== 1 && 'gainsboro'
                    }}
                    elevation={convene === 1 ? 1 : 0}
                    tabIndex="0"
                    onClick={() => changeConvene(2)}
                >
                    <span style={{ fontWeight: '700' }}>{`${translate.second_call} ${' '}`}</span>
                    <DateWrapper date={council.dateStart2NdCall} format="DD/MM/YYYY HH:mm" />
                    <QuorumWrapper council={council} translate={translate} recount={recount} secondCall={true} />
                </Card>
            }
            <div style={{ fontSize: '0.85em', marginTop: '0.8em' }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem'}}>
                    {`${translate.current_quorum}: ${
                        council.quorumPrototype === 1 ?
                            renderParticipationsText()
                            :
                            `${recount.numRightVoting} ${translate.participants}`
                        }`}
                </div>
                <div>
                    {`${translate.council_will_be_started} `}
                    <DateWrapper date={Date.now()} format="LLL" />
                    <div>
                        {council.existsSecondCall === 1 ?
                            convene === 1 ?
                                `${translate['1st_call']} ${
                                council.statute.firstCallQuorumType !== -1 ?
                                    `${translate.with_current_quorum} ${
                                    council.quorumPrototype === 1 ?
                                        renderParticipationsText()
                                        :
                                        `${recount.numRightVoting} ${translate.participants.toLowerCase()}`
                                    }`
                                    :
                                    ''
                                }`

                                :
                                `${translate['2nd_call']} ${
                                council.secondCallQuorumType !== -1 ?
                                    `${translate.with_current_quorum} ${
                                    council.quorumPrototype === 1 ?
                                        renderParticipationsText()
                                        :
                                        `${recount.numRightVoting} ${translate.participants.toLowerCase()}`
                                    }`
                                    :
                                    ''
                                }`
                            :
                            `${translate.with_current_quorum} ${
                            council.quorumPrototype === 1 ?
                                renderParticipationsText()
                                :
                                `${recount.numRightVoting} ${translate.participants.toLowerCase()}`
                            }`
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ConveneSelector;