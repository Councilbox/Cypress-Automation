import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, ButtonIcon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';


class ConfirmCompanyButton extends React.Component {

    state = {
        loading: false,
        success: false
    }



    confirmCompany = async () => {
        this.setState({
            loading: true
        });
        const response = await this.props.confirmCompany({
            variables: {
                companyId: this.props.company.id
            }
        })

        if(!response.errors){
            this.setState({
                success: true,
                loading: false
            })
            this.props.refetch();
        }
    }

    cancelCompanySubscription = async () => {
        this.setState({
            loading: true
        });
        const response = await this.props.cancelCompanySubscription({
            variables: {
                companyId: this.props.company.id
            }
        })

        if(!response.errors){
            this.setState({
                success: true,
                loading: false
            });
            this.props.refetch();
        }
    }

    render(){
        return (
            this.props.company.demo === 0?
                <BasicButton
                    text={'Cancelar subscripción'}
                    color={getPrimary()}
                    floatRight
                    textStyle={{
                        color: "white",
                        fontWeight: "700"
                    }}
                    onClick={this.cancelCompanySubscription}
                    buttonStyle={{ marginRight: "1.2em" }}
                    icon={<ButtonIcon type="check_circle_outline" color="white" />}
                />
            :
                <BasicButton
                    text={'Confimar entidad'}
                    color={getPrimary()}
                    floatRight
                    textStyle={{
                        color: "white",
                        fontWeight: "700"
                    }}
                    onClick={this.confirmCompany}
                    buttonStyle={{ marginRight: "1.2em" }}
                    icon={<ButtonIcon type="check_circle_outline" color="white" />}
                />
        )
    }
}

const confirmCompany = gql`
    mutation ConfirmCompany($companyId: Int!){
        confirmCompany(companyId: $companyId){
            success
            message
        }
    }
`;

const cancelCompanySubscription = gql`
    mutation CancelCompanySubscription($companyId: Int!){
        cancelCompanySubscription(companyId: $companyId){
            success
            message
        }
    }
`;

export default compose(
    graphql(confirmCompany, {
        name: 'confirmCompany'
    }),
    graphql(cancelCompanySubscription, {
        name: 'cancelCompanySubscription'
    })
)(ConfirmCompanyButton);