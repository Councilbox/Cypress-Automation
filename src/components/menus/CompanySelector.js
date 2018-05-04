import React, { Fragment, Component } from 'react';
import { store, bHistory } from '../../containers/App';
import { changeCompany } from '../../actions/companyActions';
import { Popover, DropDownMenu } from '../../displayComponents';
import { MenuItem } from 'material-ui';

class CompanySelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            popover: false,
        }
    }

    changeCompany = (index) => {
        const { companies } = this.props;
        store.dispatch(changeCompany(index));
        bHistory.push(`/company/${companies[index].id}`);
    };

    companyList = () => {
        const { companies } = this.props;
        return (

            <Fragment>
                {companies.map((company, index) => company.id !== this.props.company.id && 
                    <MenuItem>
                        <img
                            src={company.logo}
                            style={{
                                maxWidth: '5em'
                            }}
                            onClick={() => this.changeCompany(index)}
                            alt={'logo'}
                        />
                    </MenuItem>
                )}
            </Fragment>

        );
    };

    logoClick = (event) => {
        this.setState({
            popover: true,
            anchorElement: event.currentTarget
        });
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    };

    render() {
        const { company } = this.props;
        return (
            <Fragment>
                <DropDownMenu 
                    icon={
                        <img
                            src={company.logo}
                            style={{
                                width: 'auto',
                                height: '3em',
                                maxWidth: '5em'
                            }}
                            onClick={this.logoClick}
                            alt={'logo'}
                        />
                    }
                    color={'transparent'}
                    buttonStyle={{width: '3em', marginLeft: '0.3em', border: 'none'}}
                    items={this.companyList()} 
                />
            </Fragment>
        );
    }
}


export default CompanySelector;

