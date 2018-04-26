import React, { Fragment, Component } from 'react';
import { store, bHistory } from '../../containers/App';
import { changeCompany } from '../../actions/companyActions';
import { Popover } from '../displayComponents';

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
        bHistory.push(`/company/${companies[ index ].id}`);
    };

    companyList = () => {
        const { companies } = this.props;
        return (

            <Fragment>
                {companies.map((company, index) => company.id !== this.props.company.id && <img
                    src={company.logo}
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '5em'
                    }}
                    onClick={() => this.changeCompany(index)}
                    alt={'logo'}
                />)}
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
        return (<Fragment>
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
            <Popover
                open={this.state.popover}
                anchorTo={this.state.anchorElement}
                requestClose={() => this.setState({ popover: false })}
                menu={this.companyList()}
            />
        </Fragment>);
    }
}


export default CompanySelector;

