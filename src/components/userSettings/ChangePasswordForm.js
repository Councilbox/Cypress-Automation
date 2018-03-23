import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { TextInput, BasicButton, ButtonIcon } from '../displayComponents';
import { Typography } from 'material-ui';
import { getPrimary } from '../../styles/colors';
import { updatePassword } from '../../queries';


class ChangePasswordForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            success: false,
            loading: false,
            error: false,
            data: {
                currentPassword: '',
                newPassword: '',
                newPasswordConfirm: ''
            },
            errors: {}
        }
    }

    updatePassword = async () => {
        const { data } = this.state;
        if(!this.checkChangePassword()){
            this.setState({
                loading: true
            });
            const response = await this.props.updatePassword({
                variables: {
                    oldPassword: data.currentPassword,
                    newPassword: data.newPassword
                }
            })
            if(response.errors){
                if(response.errors[0].code === 401){
                    this.setState({
                        error: true,
                        errors: {
                            ...this.state.errors,
                            currentPassword: this.props.translate.current_password_incorrect
                        }
                    })
                }
            }else{
                this.handleButtonSuccess();
            }
        }
    }

    checkChangePassword(){
        const { translate } = this.props;
        const { data } = this.state;

        let hasError = false;
        const errors = {
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: ''
        }

        //current_password_incorrect

        if(data.newPassword !== data.newPasswordConfirm){
            errors.newPasswordConfirm = translate.register_unmatch_pwds;
            hasError = true;
        }

        if(!data.newPassword){
            errors.newPassword = translate.no_empty_pwd;
            hasError = true;
        }

        if(!data.currentPassword){
            errors.currentPassword = translate.no_empty_pwd;
        }

        if(data.newPassword !== data.currentPassword){

        }

        this.setState({
            errors: errors
        });
        return hasError;
    }

    handleKeyUp = (event) => {
        if(event.nativeEvent.keyCode === 13){
            this.updatePassword();
        }
        this.setState({
            success: false,
            error: false
        });
    }

    updateState(newValues){
        this.setState({
            data: {
                ...this.state.data,
                ...newValues
            }
        });
    }

    handleButtonSuccess(){
        this.setState({
            success: true,
            loading: false
        });
    }

    render(){
        const { translate } = this.props;
        const { data, errors, success, loading, error } = this.state;

        return(
            <Fragment>
                <Typography variant="subheading" style={{marginTop: '2em'}}>
                    {translate.change_password}
                </Typography>
                <div className="row" style={{paddingRight: '3em'}}>
                    <div className="col-lg-3 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.current_password}
                            type="password"
                            onKeyUp={this.handleKeyUp}
                            value={data.currentPassword}
                            errorText={errors.currentPassword}
                            onChange={(event) => this.updateState({
                                currentPassword: event.nativeEvent.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-4 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.new_password}
                            type="password"
                            onKeyUp={this.handleKeyUp}                            
                            value={data.newPassword}
                            onChange={(event) => this.updateState({
                                newPassword: event.nativeEvent.target.value
                            })}
                            errorText={errors.newPassword}
                        />
                    </div>
                    <div className="col-lg-5 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.repeat_password}
                            type="password"
                            onKeyUp={this.handleKeyUp}
                            value={data.newPasswordConfirm}
                            onChange={(event) => this.updateState({
                                newPasswordConfirm: event.nativeEvent.target.value
                            })}
                            errorText={errors.newPasswordConfirm}
                        />
                    </div>
                </div>
                <BasicButton
                    text={translate.save}
                    color={success? 'green' : getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700'}}
                    onClick={this.updatePassword}
                    loading={loading}
                    error={error}
                    success={success}
                    icon={<ButtonIcon type={'save'} color='white' />}
                />
            </Fragment>
        );
    }
}

export default graphql(updatePassword,
    {name: 'updatePassword', options: { errorPolicy: 'all'}}
)(ChangePasswordForm);