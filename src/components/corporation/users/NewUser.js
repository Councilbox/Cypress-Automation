import React from 'react';
import { CardPageLayout, ButtonIcon, BasicButton, LoadingSection } from '../../../displayComponents';
import { languages } from '../../../queries/masters';
import { graphql, compose } from 'react-apollo';
import UserForm from '../../userSettings/UserForm';
import { getPrimary } from '../../../styles/colors';
import CompanyLinksManager from './CompanyLinksManager';
import gql from 'graphql-tag';
import { bHistory } from '../../../containers/App';
import { checkValidEmail } from '../../../utils/validation';

class NewUser extends React.PureComponent {
    state = {
        data: {
            email: '',
            surname: '',
            name: '',
            preferredLanguage: 'es',
            roles: 'secretary'
        },
        companies: [],
        errors: {}
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        })
    }

    createUserWithoutPassword = async () => {
        if(!this.checkRequiredFields()){
            const response = await this.props.createUserWithoutPassword({
                variables: {
                    user: this.state.data,
                    companies: this.state.companies.map(company => company.id)
                }
            });
    
            if(!response.errors){
                if(response.data.createUserWithoutPassword.id){
                    bHistory.push(`/users/edit/${response.data.createUserWithoutPassword.id}`);
                }
            }else{
                if(response.errors[0].originalError.original.constraint === "users_email_key"){
                    this.setState({
                        errors: {
                            email: this.props.translate.register_exists_email
                        }
                    })
                }
            }
        }
    }

    checkRequiredFields() {
        let errors = {
            email: '',
            name: '',
            surname: '',
            phone: ''
        }

        let hasError = false;
        const { data } = this.state;

        if(data.email.trim().length === 0){
            hasError = true;
            errors.email = this.props.translate.required_field;
        }else{
            if(!checkValidEmail(data.email)){
                hasError = true;
                errors.email = this.props.translate.tooltip_invalid_email_address;
            }
        }

        if(data.name.trim().length === 0){
            hasError = true;
            errors.name = this.props.translate.required_field;
        }

        if(data.surname.trim().length === 0){
            hasError = true;
            errors.surname = this.props.translate.required_field;
        }

        this.setState({
            errors
        });

        return hasError;

    }

    render() {
        const { translate } = this.props;
        if(this.props.data.loading){
            return <LoadingSection />
        }

        return(
            <div style={{height: 'calc(100vh - 3m)'}}>
                <CardPageLayout title={translate.users_add}>
                    <UserForm
                        translate={translate}
                        data={this.state.data}
                        errors={this.state.errors}
                        updateState={this.updateState}
                        languages={this.props.data.languages}
                    />
                    <CompanyLinksManager
                        linkedCompanies={this.state.companies}
                        translate={translate}
                        addCheckedCompanies={(companies) => this.setState({
                            companies: companies
                        })}
                    />
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <BasicButton
                            text={this.props.translate.back}
                            textStyle={{textTransform: 'none', color: 'black', fontWeight: '700'}}
                            onClick={this.props.requestClose}
                            buttonStyle={{marginRight: '5em'}}
                        />
                        <BasicButton
                            text={this.props.translate.save}
                            color={getPrimary()}
                            icon={<ButtonIcon type="save" color="white" />}
                            textStyle={{textTransform: 'none', color: 'white', fontWeight: '700'}}
                            onClick={this.createUserWithoutPassword}
                        />
                    </div>
                </CardPageLayout>
            </div>
        )
    }
}

const createUserWithoutPassword = gql`
    mutation CreateUserWithoutPassword($user: UserInput!, $companies: [Int]){
        createUserWithoutPassword(user: $user, companies: $companies){
            id
        }
    }
`;



export default compose(
    graphql(languages),
    graphql(createUserWithoutPassword, {
        name: 'createUserWithoutPassword'
    })
)(NewUser);