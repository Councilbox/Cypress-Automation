import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { TextInput, BasicButton } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import UserSettingsPage from '../../userSettings/UserSettingsPage';
import { Card } from 'material-ui';

class RootUserSettings extends React.Component {

    state = {
        locked: true,
        settingsPassword: ''
    }

    sendPass = async () => {
        if(this.state.settingsPassword){
            const response = await this.props.sendPass({
                variables: {
                    pass: this.state.settingsPassword
                }
            })

            if(response.data.checkRootSettingsKey.success){
                this.setState({
                    locked: false
                });
            } else {
                this.setState({
                    locked: true,
                    passError: 'Clave incorrecta'
                })
            }
        } else {
            this.setState({
                passError: 'Campo requerido'
            })
        }

    }

    handleKeyUp = event => {
        if (event.nativeEvent.keyCode === 13) {
			this.sendPass();
		}
    }

    render(){
        return (
            <div style={{height: 'calc(100% - 3em)'}}>
                {this.state.locked?
                    <div style={{width: '100%', height: '100%', padding: '1em', display: 'flex', justifyContent: 'center'}}>
                        <Card style={{width: '100%', padding: '1em'}}>
                            <TextInput
                                floatingText="Settings password"
                                type="password"
                                value={this.state.settingsPassword}
                                onKeyUp={event => this.handleKeyUp}
                                errorText={this.state.passError}
                                onChange={event => this.setState({
                                    settingsPassword: event.target.value
                                })}
                            />
                            <BasicButton
                                color={getPrimary()}
                                text="Enviar"
                                onClick={this.sendPass}
                                textStyle={{fontWeight: '700', color: 'white'}}
                            />
                        </Card>
                    </div>
                :
                    <UserSettingsPage />
                }
            </div>
        )
    }
}

const sendPass = gql`
    mutation SendPass($pass: String!){
        checkRootSettingsKey(key: $pass){
            success
            message
        }
    }
`;

export default graphql(sendPass, {
    name: 'sendPass'
})(RootUserSettings);