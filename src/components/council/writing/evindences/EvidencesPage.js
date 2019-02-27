import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, CardHeader, Avatar, CardActions, Button } from 'material-ui';
import { LoadingSection, Scrollbar } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { getTranslateFieldFromType, ExplorerLink, ValidatorLink } from '../../../notLogged/validator/ValidatorPage';
import { getSecondary } from '../../../../styles/colors';
import { isMobile } from 'react-device-detect';


const EvidencesPage = ({ data, translate, ...props }) => {

    console.log(data);

    if (data.loading) {
        return <LoadingSection />
    }

    return (
        <div>
            {data.councilEvidences.map((evidence, index) => {
                const parsedContent = JSON.parse(evidence.content);
                const primerasLetras = `${translate[getTranslateFieldFromType(evidence.type)] || getTranslateFieldFromType(evidence.type)}`.split(' ').map(palabra => palabra.toUpperCase().substr(0, 1))
                const secondary = getSecondary();
                return (

                    <Card key={`${evidence.id}`} style={{ padding: '0.6em', userSelect: 'text', width: isMobile? '90%' : '50%', margin: '0 auto', marginBottom: '1.5em', marginTop: index === 0 ? '1.6em' : '0' }}>
                        <CardHeader
                            avatar={
                                <div style={{ position: 'relative' }}>
                                    <Avatar aria-label="Recipe" /*style={{background:secondary}}*/>
                                        {primerasLetras}
                                    </Avatar>

                                    <i className="material-icons" style={{ position: 'absolute', top: '60%', left: '60%', fontSize: '20px', color: evidence.cbxEvidence ? 'green' : 'red' }}>
                                        {evidence.cbxEvidence ?
                                            'verified_user'
                                            :
                                            'query_builder'
                                        }
                                    </i>
                                </div>
                            }
                            title={`${translate[getTranslateFieldFromType(evidence.type)] || getTranslateFieldFromType(evidence.type)}`}
                            subheader={moment(evidence.date).format('LLL')}
                        />
                        <hr></hr>
                        <CardActions>
                            <ValidatorLink prvHash={parsedContent.prvhash} translate={translate} />
                            {evidence.cbxEvidence &&
                                <ExplorerLink txHash={evidence.cbxEvidence.tx_hash} />
                            }
                        </CardActions>
                    </Card>
                    // {<Card key={`${evidence.id}`} style={{ padding: '0.6em', margin: '0.6em', userSelect: 'text' }}>
                    //     <div>
                    //         <span style={{ fontWeight: '700' }}>{`${translate.type}: `}</span>{`${translate[getTranslateFieldFromType(evidence.type)] || getTranslateFieldFromType(evidence.type)}`}
                    //     </div>
                    //     <div>
                    //         <b>{`Fecha de registro: `}</b> {moment(evidence.date).format('LLL')}
                    //     </div>
                    //     <div>
                    //         <b>{`${translate.state}: `}</b> {
                    //             evidence.cbxEvidence ?
                    //                 <span style={{ color: 'green' }}>
                    //                     {'Registrada'/*TRADUCCION*/}
                    //                 </span>
                    //                 :
                    //                 'Pendiente de registro'
                    //         }
                    //     </div>
                    //     <ValidatorLink prvHash={parsedContent.prvhash} translate={translate} />
                    //     {evidence.cbxEvidence &&
                    //         <ExplorerLink txHash={evidence.cbxEvidence.tx_hash} />
                    //     }
                    // </Card>}
                )
            })}
        </div>
    )
}

// {<Card key={`${evidence.id}`} style={{ padding: '0.6em', margin: '0.6em', userSelect: 'text' }}>
//     <div>
//         <span style={{ fontWeight: '700' }}>{`${translate.type}: `}</span>{`${translate[getTranslateFieldFromType(evidence.type)] || getTranslateFieldFromType(evidence.type)}`}
//     </div>
//     <div>
//         <b>{`Fecha de registro: `}</b> {moment(evidence.date).format('LLL')}
//     </div>
//     <div>
//         <b>{`${translate.state}: `}</b> {
//             evidence.cbxEvidence ?
//                 <span style={{ color: 'green' }}>
//                     {'Registrada'/*TRADUCCION*/}
//                 </span>
//                 :
//                 'Pendiente de registro'
//         }
//     </div>
//     <ValidatorLink prvHash={parsedContent.prvhash} translate={translate} />
//     {evidence.cbxEvidence &&
//         <ExplorerLink txHash={evidence.cbxEvidence.tx_hash} />
//     }
// </Card>}


const councilEvidences = gql`
    query CouncilEvidences($councilId: Int!){
        councilEvidences(councilId: $councilId){
            id
            userId
            date
            participantId
            type
            uuid
            content
            validated
            cbxEvidence {
                evhash
                tx_hash
                prvhash
                uuid
                data
            }
        }
    }
`;

export default graphql(councilEvidences, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(EvidencesPage);