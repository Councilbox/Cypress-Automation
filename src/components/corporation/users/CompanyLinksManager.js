import React from 'react';
import { BasicButton, AlertConfirm, ButtonIcon, LoadingSection, TextInput, Icon } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { Typography } from 'material-ui';
import CompanyItem from '../companies/CompanyItem';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const DEFAULT_OPTIONS = {
    limit: 10,
    offset: 0,
    orderBy: 'id',
    orderDirection: 'DESC'
}

class CompanyLinksManager extends React.PureComponent {

    state = {
        checked: this.props.linkedCompanies || [],
        modal: false,
        step: 1,
        filterText: '',
        limit: DEFAULT_OPTIONS.limit
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.linkedCompanies.length !== prevState.checked.length){
            return {
                checked: nextProps.linkedCompanies
            }
        }

        return null
    }

    checkCompany = (company, check) => {
        let checked = [...this.state.checked];
		if(check){
			checked = [...checked, company];
		}else{
			const index = checked.findIndex(item => item.id === company.id);
			checked.splice(index, 1);
		}
		this.setState({
			checked: checked
		});
    }

    addCheckedCompanies = () => {
        this.props.addCheckedCompanies(this.state.checked);
        this.setState({
            checked: [],
            step: 1,
            modal: false
        });
    }

    checkRow = (email, check) => {
		let checked = [...this.state.checked];
		if(check){
			checked = [...checked, email];
		}else{
			
			console.log(checked);
		}
		this.setState({
			checked: checked
		});
	};

	isChecked = id => {
		const item = this.state.checked.find(item => item.id === id);
		return !!item;
	}

	updateFilterText = (text) => {
        this.setState({
            filterText: text
        }, () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.refresh(), 450);
        });
    }

    refresh = () => {
        let variables = {
            options: DEFAULT_OPTIONS
        };
        variables.options.limit = this.state.limit;
        variables.filters = [{field: 'businessName', text: this.state.filterText}];
        this.props.data.refetch(variables);
    }


    _renderBody = () => {
        if(this.state.step === 1){
            return (
                <div style={{width: '650px'}}>
                    <TextInput
                        adornment={<Icon>search</Icon>}
                        floatingText={" "}
                        type="text"
                        value={this.state.filterText}
                        onChange={event => {
                            this.updateFilterText(event.target.value);
                        }}
                    />
                    {this.props.data.loading?
                        <LoadingSection />
                    :
                        this.props.data.corporationCompanies.list.map(company => (
                            <CompanyItem
                                key={`company_${company.id}`}
                                company={company}
                                checkable={true}
                                checked={this.isChecked(company.id)}
                                onCheck={this.checkCompany}
                            />
                        ))
                    }
                </div>
            )
        }

        if(this.state.step === 2){
            return (
                <div style={{width: '650px'}}>
                    {this.state.checked.map(company => (
                        <CompanyItem
                            key={`company_${company.id}`}
                            company={company}
                            checkable={true}
                            checked={this.isChecked(company.id)}
                            onCheck={this.checkCompany}
                        />
                    ))}
                </div>
            ) 
        }
        
    }



    render(){
        const { translate } = this.props;

        return(
            <React.Fragment>
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
                </div>
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', marginTop: '0.9em', marginBottom: '0.9em'}}>
                    {this.props.linkedCompanies.map(company => (
                        <CompanyItem
                            key={`company_${company.id}`}
                            company={company}
                        />
                    ))}
                </div>
                <AlertConfirm
                    requestClose={() => this.setState({ modal: false })}
                    open={this.state.modal}
                    acceptAction={this.state.step === 1? () => this.setState({step: 2}) : this.addCheckedCompanies}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderBody()}
                    title={translate.link_companies}
                />
            </React.Fragment>
        )
    }
}

const corporationCompanies = gql`
    query corporationCompanies($filters: [FilterInput], $options: OptionsInput){
        corporationCompanies(filters: $filters, options: $options){
            list{
                id
                businessName
                logo
            }
            total
        }
    }
`;

export default graphql(corporationCompanies, {
    options: props => ({
        variables: {
            options: DEFAULT_OPTIONS
        }
    })
})(CompanyLinksManager);
