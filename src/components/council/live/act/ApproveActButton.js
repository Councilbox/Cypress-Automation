import React from 'react';
import { BasicButton, Icon } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import FinishActModal from '../../writing/actEditor/FinishActModal';
import { ConfigContext } from '../../../../containers/AppControl';

const ApproveActButton = ({ translate, council, refetch }) => {
    const [modal, setModal] = React.useState(false);
    const primary = getPrimary();

    const showModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    return (
        <ConfigContext.Consumer>
            {config => (
                <React.Fragment>
                    <BasicButton
                        text={translate.finish_and_aprove_act}
                        color={primary}
                        textPosition="before"
                        onClick={showModal}
                        icon={
                            <Icon
                                className="material-icons"
                                style={{
                                    fontSize: "1.1em",
                                    color: "white"
                                }}
                            >
                                play_arrow
                            </Icon>
                        }
                        textStyle={{
                            color: "white",
                            fontSize: "0.7em",
                            fontWeight: "700",
                            textTransform: "none"
                        }}
                    />
                    <FinishActModal
                        finishInModal={true}
                        refetch={refetch}
                        council={council}
                        config={config}
                        liveMode={true}
                        translate={translate}
                        show={modal}
                        requestClose={closeModal}
                    />
                </React.Fragment>
            )}
        </ConfigContext.Consumer>
    )
}


export default ApproveActButton;