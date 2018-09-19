import React from 'react';
import { CardPageLayout } from '../../../../displayComponents';
import { Card } from 'material-ui';
import CouncilHeader from '../CouncilHeader';

const CanceledCouncil = ({ council, translate }) => {
    return(
        <CardPageLayout title={translate.not_held_council}>
            <CouncilHeader
                council={council}
                translate={translate}
            />
            {!!council.noCelebrateComment &&
                <Card 
                    elevation={0}
                    style={{
                        marginTop: '1em',
                        padding: '0.8em'
                    }}
                >
                    <div dangerouslySetInnerHTML={{__html: council.noCelebrateComment}} />
                </Card>
            }
        </CardPageLayout>
    )
}

export default CanceledCouncil;