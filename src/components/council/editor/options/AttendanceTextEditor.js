import React from 'react';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { AlertConfirm, BasicButton, UnsavedChangesModal } from '../../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary } from '../../../../styles/colors';


const AttendanceTextEditor = ({ council, translate, client }) => {
    const [text, setText] = React.useState(council.statute.attendanceText || '');
    const [state, setState] = React.useState({
        modal: false,
        unsavedModal: false
    });

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
        if (text){
            setState({...state, modal: false, unsavedModal: true});
        } else{
            setState({...state, modal: false})
        }
    }
    const discardText = (ev) => {
        ev.preventDefault();
        setState({...state, modal: false, unsavedModal: false});
        setText(council.statute.attendanceText);        
    }

    const updateAttendanceText = async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation UpdateCouncilStatute($councilId: Int!, $statute: CouncilOptions!){
                    updateCouncilStatute(councilId: $councilId, statute: $statute){
                        attendanceText
                    }
                }
            `,
            variables: {
                councilId: council.id,
                statute: {
                    attendanceText: text
                }
            }
        });

        setState({...state, modal: false, unsavedModal: false});
    }

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
                acceptAction={updateAttendanceText}
                buttonCancel={translate.cancel}
                title={text? translate.edit_instructions : translate.add_instructions}
                bodyText={renderBody()}
            />
            <UnsavedChangesModal 
                translate={translate}  
                open={state.unsavedModal}
                requestClose={() => setState({...state, modal: true, unsavedModal: false})}
                acceptAction={updateAttendanceText}
                cancelAction={discardText}
                />
        </>
    )
}

export default withApollo(AttendanceTextEditor);