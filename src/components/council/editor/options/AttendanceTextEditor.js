import React from 'react';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { AlertConfirm, BasicButton, UnsavedChangesModal } from '../../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary } from '../../../../styles/colors';


const AttendanceTextEditor = ({ council,translate, text, setText, updateAttendanceText,textPreview, setTextPreview, isModal, setIsmodal, client }) => {
    
        const renderBody = () => {
        return (
            <RichTextInput
                translate={translate}
                value={text}
                onChange={value => setText(value)}
            /> 
        )
    }

    const handleClose = (ev) => {
        ev.preventDefault();
        if (text !== textPreview){
            setIsmodal({...isModal, modal: false, unsavedModal: true});
        } else{
            setIsmodal({...isModal, modal: false, unsavedModal: false});
            setTextPreview(text)
        }
    }
    const discardText = (ev) => {
        ev.preventDefault();
        if (text !== textPreview){
            setIsmodal({...isModal, modal: false, unsavedModal: false})
            setText(textPreview);
        }
    }


    return (
        <>
            <BasicButton
                text={text? translate.edit_instructions : translate.add_instructions}
                onClick={() => setIsmodal({...isModal, modal: true})}
                color="white"
                type="flat"
                textStyle={{
                    color: getSecondary()
                }}
            />
            <AlertConfirm
                open={isModal.modal}
                requestClose={handleClose}
                buttonAccept={translate.save}
                acceptAction={updateAttendanceText}
                buttonCancel={translate.cancel}
                title={text? translate.edit_instructions : translate.add_instructions}
                bodyText={renderBody()}
            />
            <UnsavedChangesModal 
                translate={translate}  
                open={isModal.unsavedModal}
                requestClose={() => {
                    setIsmodal({...isModal, modal: true, unsavedModal: false})
                }}
                acceptAction={updateAttendanceText}
                cancelAction={discardText}
                />
        </>
    )
}

export default withApollo(AttendanceTextEditor);