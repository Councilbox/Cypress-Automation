import React from 'react';
import { CardPageLayout, ButtonIcon, BasicButton, LoadingSection } from '../../../displayComponents';
import { languages } from '../../../queries/masters';
import { graphql, compose } from 'react-apollo';
import UserForm from '../../userSettings/UserForm';
import { getPrimary } from '../../../styles/colors';
import CompanyLinksManager from './CompanyLinksManager';
import gql from 'graphql-tag';
import { bHistory } from '../../../containers/App';

class NewUser extends React.PureComponent {
    state = {
        data: {
            preferred_language: 'es',
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
        }
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