import React from 'react';
import { graphql } from 'react-apollo';
import { MenuItem, Typography } from 'material-ui';
import { checkValidEmail } from '../../utils';
import { BasicButton, ButtonIcon, SelectInput, TextInput } from '../displayComponents';
import { updateUser } from '../../queries';
import { store } from '../../containers/App';
import { setUserData } from '../../actions/mainActions';
import { getPrimary } from '../../styles/colors';


class UpdateUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.user,
            error: false,
            loading: false,
            success: false,
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.user
        });
    }

    updateState(newValues) {
        this.setState({
            data: {
                ...this.state.data, ...newValues
            }
        });
    }

    saveUser = async () => {
        if (!this.checkRequiredFields()) {
            this.setState({
                loading: true
            });
            const { __typename, ...data } = this.state.data;

            const response = await this.props.updateUser({
                variables: {
                    user: data
                }
            });
            if (response.errors) {
                this.setState({
                    error: true,
                    loading: false,
                    success: false
                });
            } else {
                this.setState({
                    success: true,
                    error: false,
                    loading: false
                });
                store.dispatch(setUserData(response.data.updateUser))
            }
        }

    };

    checkRequiredFields() {
        const { translate } = this.props;

        let errors = {
            name: '',
            surname: '',
            phone: '',
            email: '',
            pwd: '',
            confirmPWD: ''
        };

        const data = this.state.data;
        let hasError = false;

        if (!data.name.length > 0) {
            hasError = true;
            errors.name = translate.field_required;
        }

        if (!checkValidEmail(data.email.toLowerCase())) {
            hasError = true;
            errors.email = 'Por favor introduce un email válido';
        }

        if (!data.surname.length > 0) {
            hasError = true;
            errors.surname = translate.field_required;
        }

        if (!data.phone.length > 0) {
            hasError = true;
            errors.phone = translate.field_required;
        }

        if (!data.email.length > 0) {
            hasError = true;
            errors.email = translate.field_required;
        }

        this.setState({
            errors: errors
        });
        return hasError;
    }

    resetButtonStates = () => {
        this.setState({
            error: false,
            loading: false,
            success: false
        });
    };

    render() {
        const { translate } = this.props;
        const { data, errors, error, success, loading } = this.state;

        return (<React.Fragment>
                <Typography variant="subheading" style={{ marginTop: '2em' }}>
                    {translate.user_data}
                </Typography>
                <div className="row" style={{ paddingRight: '3em' }}>
                    <div className="col-lg-3 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.name}
                            type="text"
                            required
                            value={data.name}
                            errorText={errors.name}
                            onChange={(event) => this.updateState({
                                name: event.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-4 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.surname}
                            type="text"
                            value={data.surname}
                            onChange={(event) => this.updateState({
                                surname: event.target.value
                            })}
                            errorText={errors.surname}
                        />
                    </div>
                    <div className="col-lg-5 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.email}
                            type="text"
                            value={data.email}
                            onChange={(event) => this.updateState({
                                email: event.target.value
                            })}
                            errorText={errors.email}
                        />
                    </div>
                    <div className="col-lg-3 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.phone}
                            type="text"
                            value={data.phone}
                            errorText={errors.phone}
                            onChange={(event) => this.updateState({
                                phone: event.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-3 col-md-6 col-xs-12">
                        <SelectInput
                            floatingText={translate.language}
                            value={data.preferred_language}
                            onChange={(event) => this.updateState({
                                preferred_language: event.target.value
                            })}
                            errorText={errors.preferred_language}
                        >
                            {this.props.languages.map((language) => <MenuItem key={`language_${language.columnName}`}
                                                                              value={language.columnName}>
                                {language.desc}
                            </MenuItem>)}
                        </SelectInput>
                    </div>
                </div>
                <BasicButton
                    text={translate.save}
                    color={getPrimary()}
                    error={error}
                    reset={this.resetButtonStates}
                    success={success}
                    loading={loading}
                    textStyle={{
                        color: 'white',
                        fontWeight: '700'
                    }}
                    onClick={this.saveUser}
                    icon={<ButtonIcon type="save" color='white'/>}
                />
            </React.Fragment>);
    }
}

export default graphql(updateUser, {
    name: 'updateUser'
})(UpdateUserForm);