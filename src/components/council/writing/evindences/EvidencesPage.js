import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card } from 'material-ui';
import { LoadingSection, Scrollbar } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { getTranslateFieldFromType, ExplorerLink, ValidatorLink } from '../../../notLogged/validator/ValidatorPage';

const EvidencesPage = ({ data, translate, ...props }) => {

    if(data.loading){
        return <LoadingSection />
    }

    return (
        <div>
            {data.councilEvidences.map(evidence => {
                const parsedContent = JSON.parse(evidence.content);
                return(
                    <Card key={`${evidence.id}`} style={{padding: '0.6em', margin: '0.6em', userSelect: 'text'}}>
                        <div>
                            <span style={{fontWeight: '700'}}>{`${translate.type}: `}</span>{`${translate[getTranslateFieldFromType(evidence.type)] || getTranslateFieldFromType(evidence.type)}`}
                        </div>
                        <div>
                            <b>{`Fecha de registro: `}</b> {moment(evidence.date).format('LLL')}
                        </div>
                        <div>
                            <b>{`${translate.state}: `}</b> {
                                evidence.cbxEvidence?
                                    <span style={{color: 'green'}}>
                                        {'Registrada'/*TRADUCCION*/}
                                    </span>
                                :
                                    'Pendiente de registro'
                            }
                        </div>
                        <ValidatorLink prvHash={parsedContent.prvhash} translate={translate} />
                        {evidence.cbxEvidence &&
                            <ExplorerLink txHash={evidence.cbxEvidence.tx_hash} />
                        }
                    </Card>
                )
            })}
        </div>
    )
}

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