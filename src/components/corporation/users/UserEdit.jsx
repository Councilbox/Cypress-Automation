import React from 'react';
import { CardPageLayout, ButtonIcon, BasicButton, Grid, GridItem, TextField, SelectInput, LoadingSection } from '../../../displayComponents';
import { languages } from '../../../queries/masters';
import { graphql, compose } from 'react-apollo';
import UserForm from '../../userSettings/UserForm';
import { getPrimary } from '../../../styles/colors';
import CompanyLinksManager from './CompanyLinksManager';
import UserSendsList from './UserSendsList';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import withTranslations from '../../../HOCs/withTranslations';
import UserItem from './UserItem';


class UserEdit extends React.PureComponent {
    state = {
        data: {
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

    linkCompanies = async (companies) => {
        const response = await this.props.linkCompanies({
            variables: {
                userId: this.props.data.user.id,
                companies: companies.map(company => company.id)
            }
        })

        console.log(response);

        if(!response.errors){
            if(response.data.linkCompanies.success){
                this.props.data.refetch();
            }
        }
    }

    render() {
        const { translate } = this.props;
        if(this.props.data.loading){
            return <LoadingSection />
        }

        return(
            <div style={{height: 'calc(100vh - 3m)', padding: '1.2em'}}>
                <UserItem
                    key={`user_${this.props.data.user.id}`}
                    user={this.props.data.user}
                    closeSession={true}
                    translate={this.props.translate}
                />
                <CompanyLinksManager
                    linkedCompanies={this.props.data.user.companies}
                    translate={translate}
                    addCheckedCompanies={this.linkCompanies}
                />
                <UserSendsList
                    user={this.props.data.user}
                    translate={this.props.translate}
                    refetch={this.props.data.refetch}
                />
            </div>
        )
    }
}


const linkCompanies = gql`
    mutation LinkCompanies($userId: Int!, $companies: [Int]){
        linkCompanies(userId: $userId, companies: $companies){
            success
            message
        }
    }
`;

const user = gql`
    query user($id: Int!){
        user(id: $id){
            id
            name
            surname
            email
            lastConnectionDate
            companies{
                id
                businessName
                logo
            }
            sends{
                id
                userId
                sendDate
                refreshDate
                reqCode
                sendType
                email
            }
        }
    }
`;

export default compose(
    graphql(languages),
    graphql(user, {
        options: props => ({
           variables: {
               id: props.match.params.id
           } 
        })
    }),
    graphql(linkCompanies, {
        name: 'linkCompanies'
    })
)(withRouter(withTranslations()(UserEdit)));