import React from 'react';
import { BasicButton, AlertConfirm, ButtonIcon } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { Typography } from 'material-ui';
import CompaniesDashboard from '../companies/CompaniesDashboard';

class CompanyLinksManager extends React.PureComponent {

    state = {
        checked: this.props.linkedCompanies,
        modal: false
    }



    render(){
        const { translate } = this.props;

        return(
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', marginTop: '0.8em', alignItems: 'center'}}>
                <Typography variant="subheading" style={{color: getPrimary(), marginRight: '0.6em'}}>
                    {translate.linked_companies}
                </Typography>
                <BasicButton
                    text={this.props.translate.link_companies}
                    color={getSecondary()}
                    icon={<ButtonIcon type="save" color="white" />}
                    textStyle={{textTransform: 'none', color: 'white', fontWeight: '700'}}
                    onClick={() => { this.setState({
                        modal: true
                    })}}
                />
                <AlertConfirm
					requestClose={() => this.setState({ modal: false })}
					open={this.state.modal}
					acceptAction={this.addCheckedCompanies}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={() => <CompaniesDashboard />}
					title={translate.link_companies}
				/>
            </div>
        )
    }
}

export default CompanyLinksManager;