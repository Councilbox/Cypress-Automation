import React from 'react';
import { BasicButton } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';

const SignatureButton = ({ participant, translate, open }) => {
    const primary = getPrimary();
    const secondary = getSecondary();

    return (
        <BasicButton
            text={participant.signed ? translate.user_signed : translate.to_sign}
            fullWidth
            buttonStyle={{ marginRight: "10px", width: "150px", border: `1px solid ${participant.signed ? primary : secondary}` }}
            type="flat"
            color={"white"}
            onClick={open}
            textStyle={{ color: participant.signed ? primary : secondary, fontWeight: '700' }}
        />
    )
}

export default SignatureButton;