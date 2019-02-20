import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card } from 'material-ui';
import { LoadingSection, Scrollbar } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { getTranslateFieldFromType, ExplorerLink } from '../../../notLogged/validator/ValidatorPage';

const EvidencesPage = ({ data, translate, ...props }) => {

    console.log(data);

    if(data.loading){
        return <LoadingSection />
    }

    return (
        <div>
            {data.councilEvidences.map(evidence => {
                const parsedContent = JSON.parse(evidence.content);
                console.log(parsedContent);
                return(
                    <Card key={`${evidence.id}`} style={{padding: '0.6em', margin: '0.6em', userSelect: 'text'}}>
                        <div>
                            <span style={{fontWeight: '700'}}>{`${translate.type}: `}</span>{`${translate[getTranslateFieldFromType(evidence.type)] || getTranslateFieldFromType(evidence.type)}`}
                        </div>
                        <div>
                            <b>{`Fecha de registro: `}</b> {moment(evidence.date).format('LLL')}
                        </div>
                        <div>
                            <span style={{fontWeight: '700'}}>{`Identificador: `}</span>{`${parsedContent.prvhash}`}
                        </div>
                        {evidence.cbxEvidence?
                            <ExplorerLink txHash={evidence.cbxEvidence.tx_hash} />
                        :
                            'Pendiente de ser registrada en blockchain'
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