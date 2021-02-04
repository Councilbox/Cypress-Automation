import React from 'react';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import ParticipantCouncilAttachments from './ParticipantCouncilAttachments';



const CouncilAttachmentsModal = ({ translate, council, participant }) => {
    const [modal, setModal] = React.useState(false);
    const primary = getPrimary();

    return (
        <>
            <BasicButton
                color="white"
                textStyle={{
                    color: primary
                }}
                buttonStyle={{
                    marginLeft: '1em',
                    border: `1px solid ${primary}`,
                    marginBottom: '1em'
                }}
                text='Administrar documentación'
                onClick={() => setModal(true)}
            />
            <AlertConfirm
                open={modal}
                widthModal={{
                    minWidth: '60%'
                }}
                title={'Documentación'}
                requestClose={() => setModal(false)}
                buttonCancel={translate.close}
                bodyText={
                    <ParticipantCouncilAttachments
                        translate={translate}
                        council={council}
                        participant={participant}
                    />
                }
            />
        </>
    )
}

export default CouncilAttachmentsModal;
