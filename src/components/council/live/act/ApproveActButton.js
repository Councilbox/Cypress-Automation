import React from 'react';
import { BasicButton, Icon } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import FinishActModal from '../../writing/actEditor/FinishActModal';

class ApproveActButton extends React.Component {

    state = {
        showModal: false
    }

    render(){
        const { translate, council, refetch } = this.props;
        const primary = getPrimary();

        return (
            <React.Fragment>
                <BasicButton
                    text={translate.finish_and_aprove_act}
                    color={primary}
                    textPosition="before"
                    onClick={() =>
                        this.setState({
                            showModal: true
                        })
                    }
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
                    refetch={refetch}
                    council={council}
                    translate={translate}
                    show={this.state.showModal}
                    requestClose={() => this.setState({ showModal: false })}
                />
            </React.Fragment>
        )  
    }

}

export default ApproveActButton;