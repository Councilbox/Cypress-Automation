import React, { Component } from 'react';
import { Checkbox, AlertConfirm, Icon } from "../../../displayComponents";
import { Typography, TextField } from 'material-ui';
import { graphql } from 'react-apollo';
import gql from "graphql-tag";


class NeedHelpModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            success: '',
            error: '',
            email: '',
            message: ''
        };
    }

    close = () => {
        this.props.requestClose();
        this.setState({
            success: false,
            sending: false,
            error: false,
            email: '',
            message: ''
        });
    };

    sendHelp = async () => {
        this.setState({
            sending: true
        });
        const response = await this.props.sendHelp({
            variables: {
                email: this.state.email,
                message: this.state.message
            }
        });
        if(response.data.sendHelp.success){
            this.setState({
                sending: false,
                success: true
            });
        }else{
            this.setState({
                sending: false,
                error: true
            });
        }
    };

    _renderHelpBody(){
        const { translate } = this.props;

        if(this.state.sending){
            return(
                <div>
                    {translate.sending_mail}
                </div>
            )
        }

        if(this.state.success){
            return(
                <SuccessMessage message={translate.sent} />
            )
        }

        return(
            <div>
                <form style={{display: 'flex', flexWrap: 'wrap'}} noValidate autoComplete="off">
                    <TextField
                        id="email"
                        label={translate.email}
                        value={this.state.email}
                        onChange={(event) => this.setState({email: event.target.value})}
                        margin="normal"
                        fullWidth={true}
                    />
                    <TextField
                        id="message"
                        label={translate.message}
                        value={this.state.message}
                        onChange={(event) => this.setState({message: event.target.value})}
                        margin="normal"
                        fullWidth={true}
                        multiline={true}
                    />
                </form>
            </div>
        )
    }

    render() {
        const { translate } = this.props;

        return(
            <AlertConfirm
                requestClose={this.close}
                open={this.props.show}
                acceptAction={this.state.success? () => this.close() : this.sendHelp}
                buttonAccept={this.state.success? translate.accept : translate.send}
                buttonCancel={translate.close}
                bodyText={this._renderHelpBody()}
                title={translate.ask_for_help}
            />
        );
    }
}

const sendHelp = gql`
    mutation sendHelp($company: CompanyInput){
      updateCompany(company: $company){
        alias
        tin
        logo
        id
        businessName
        address
        city
        zipcode
        country
        countryState
        linkKey
        creatorId
        domain
        demo
        type
        language
        creationDate
        corporationId
      }
    }
`;

export default graphql(
    sendHelp, {
        name: 'sendHelp'
    }
)(NeedHelpModal);

const SuccessMessage = ({ message }) => (
    <div style={{width: '500px', display: 'flex', alignItems: 'center', alignContent: 'center', flexDirection: 'column'}}>
        <Icon className="material-icons" style={{fontSize: '6em', color: 'green'}}>
            check_circle
        </Icon>
        <Typography variant="subheading">
            {message}
        </Typography>
    </div>
);