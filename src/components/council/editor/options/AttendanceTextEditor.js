import React from 'react';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { AlertConfirm, BasicButton } from '../../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary } from '../../../../styles/colors';


const AttendanceTextEditor = ({ council, translate, client }) => {
    const [text, setText] = React.useState(council.statute.attendanceText || '');
    const [modal, setModal] = React.useState(false);

    const renderBody = () => {
        return (
            <RichTextInput
                translate={translate}
                value={text}
                onChange={value =>
                    setText(value)
                }
            /> 
        )
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

        setModal(false);
    }

    return (
        <>
            <BasicButton
                text={text? translate.edit_instructions : translate.add_instructions}
                onClick={() => setModal(true)}
                color="white"
                type="flat"
                textStyle={{
                    color: getSecondary()
                }}
            />
            <AlertConfirm
                open={modal}
                requestClose={() => setModal(false)}
                buttonAccept={translate.save}
                acceptAction={updateAttendanceText}
                buttonCancel={translate.cancel}
                title={translate.edit_instructions}
                bodyText={renderBody()}
            />
        </>
    )
}

export default withApollo(AttendanceTextEditor);