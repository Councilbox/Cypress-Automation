import React from 'react';
import { AlertConfirm, BasicButton, TextInput } from '../../../displayComponents';
import { primary, secondary } from '../../../styles/colors';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

let interval = null;

class FixedVideoURLModal extends React.Component {

    state = {
        url: '',
        modal: false,
        loading: false,
        success: false
    }

    initialState = this.state;

    openURLModal = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            modal: true
        });
    }

    closeURLModal = () => {
        this.setState({
            modal: false
        });
    }

    updateCouncilRoomLink = async () => {
        clearInterval(interval);
        this.setState({
            loading: true,
            success: false
        })
        const response = await this.props.updateCouncilRoomLink({
            variables: {
                councilId: this.props.council.id,
                link: this.state.url
            }
        });

        this.setState({
            loading: false,
            success: true
        });
        interval = setInterval(this.refreshButtons, 3000);
    }

    refreshButtons = () => {
        this.setState({
            success: false,
            loading: false,
            error: false
        });
    }

    componentWillUnmount(){
        this.setState(this.initialState);
        clearInterval(interval);
    }

    handleEnter = event => {
        this.refreshButtons();
		if (event.nativeEvent.keyCode === 13) {
			this.updateCouncilRoomLink();
		}
	};

    _renderBody = () => {
        return (
            <TextInput
                value={this.state.url}
                onKeyUp={this.handleEnter}
                floatingText="Video URL"
                onChange={this.setValue}
            />
        )
    }



    setValue = event => {
        this.setState({
            url: event.target.value
        });
    }

    render(){
        const { translate } = this.props;

        return (
            <React.Fragment>
                <BasicButton
                    text="Fijar URL video"
                    type="flat"
                    color="white"
                    textStyle={{color: primary, fontWeight: '700'}}
                    onClick={this.openURLModal}
                    buttonStyle={{border: "1px solid "}}
                />
                <AlertConfirm
					requestClose={this.closeURLModal}
					open={this.state.modal}
                    loadingAction={this.state.loading}
                    successAction={this.state.success}
					acceptAction={this.updateCouncilRoomLink}
					buttonAccept={'Aceptar'}
					buttonCancel={'Cancelar'}
					bodyText={this._renderBody()}
					title={"Fijar video URL"}
				/>
            </React.Fragment>
        );
    }

}

const updateCouncilRoomLink = gql`
    mutation UpdateCouncilRoomLink($link: String!, $councilId: Int!){
        updateCouncilRoomLink(link: $link, councilId: $councilId){
            success
            message
        }
    }
`;

export default graphql(updateCouncilRoomLink, {
    name: "updateCouncilRoomLink"
})(FixedVideoURLModal);