import React from 'react';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { AlertConfirm, BasicButton, UnsavedChangesModal } from '../../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary } from '../../../../styles/colors';


const AttendanceTextEditor = ({ council, translate, text, setText, updateAttendanceText, client }) => {
    
    const [state, setState] = React.useState({
        modal: false,
        unsavedModal: false
    });
    const [previewText, setPreviewText] = React.useState( text || '');

        const renderBody = () => {
        return (
            <RichTextInput
                translate={translate}
                value={text}
                onChange={value => setPreviewText(value)}
            /> 
        )
    }

    const handleClose = (ev) => {
        ev.preventDefault();
        if (text !== previewText){
            setState({...state, modal: false, unsavedModal: true});
        } else{
            setState({...state, modal: false, unsavedModal: false});
            setText(previewText);
        }
    }
    const discardText = (ev) => {
        ev.preventDefault();
        if (text !== previewText){
            setState({...state, modal: false, unsavedModal: false});
            setPreviewText(text);
        } 
    }

    const saveText = (ev) => {
        ev.preventDefault();
        setText(previewText);
        setState({...state, modal: false, unsavedModal: false});
    }

    React.useEffect(() => {
            updateAttendanceText()
    }, [text])


    return (
        <>
            <BasicButton
                text={text? translate.edit_instructions : translate.add_instructions}
                onClick={() => setState({...state, modal: true})}
                color="white"
                type="flat"
                textStyle={{
                    color: getSecondary()
                }}
            />
            <AlertConfirm
                open={state.modal}
                requestClose={handleClose}
                buttonAccept={translate.save}
                acceptAction={saveText}
                buttonCancel={translate.cancel}
                title={text? translate.edit_instructions : translate.add_instructions}
                bodyText={renderBody()}
            />
            <UnsavedChangesModal 
                translate={translate}  
                open={state.unsavedModal}
                requestClose={() => {
                    setState({...state, modal: true, unsavedModal: false})
                    setText(previewText);
                }}
                acceptAction={saveText}
                cancelAction={discardText}
                />
        </>
    )
}

export default withApollo(AttendanceTextEditor);