import React from 'react';
import { CardPageLayout, ButtonIcon, BasicButton, Grid, GridItem, TextField, SelectInput, LoadingSection } from '../../../displayComponents';
import { languages } from '../../../queries/masters';
import { graphql, compose } from 'react-apollo';
import UserForm from '../../userSettings/UserForm';
import { getPrimary } from '../../../styles/colors';
import CompanyLinksManager from './CompanyLinksManager';

class NewUser extends React.PureComponent {
    state = {
        data: {},
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
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <CompanyLinksManager
                            translate={translate}
                        />
                    </div>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <BasicButton
                            text={this.props.translate.save}
                            color={getPrimary()}
                            icon={<ButtonIcon type="save" color="white" />}
                            textStyle={{textTransform: 'none', color: 'white', fontWeight: '700'}}
                            onClick={() => {}}
                        />
                    </div>
                </CardPageLayout>
            </div>
        )
    }
}

export default compose(
    graphql(languages),
)(NewUser);