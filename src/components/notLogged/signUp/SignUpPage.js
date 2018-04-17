import React from 'react';
import * as mainActions from '../../../actions/mainActions';
import * as companyActions from '../../../actions/companyActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Welcome from '../../Welcome';
import SignUpEnterprise from './SignUpEnterprise';
import SignUpUser from './SignUpUser';
import SignUpPay from './SignUpPay';
import { Card, CardContent } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import image from '../../../assets/img/signup3.jpg';
import SignUpStepper from './SignUpStepper';
import withWindowSize from '../../../HOCs/withWindowSize';
import Scrollbar from 'react-perfect-scrollbar';

class SignUpPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            data: {
                businessName: '',
                type: 0,
                cif: '',
                name: '',
                surname: '',
                phone: '',
                email: '',
                pwd: '',
                address: '',
                city: '',
                country: 'España',
                countryState: '',
                zipcode: '',
                subscriptionType: '',
                iban: '',
                code: ''
            },
            errors: {}
        };
    }

    nextPage = () => {
        const index = this.state.page + 1;
        if (index <= 3) {
            this.setState({
                page: index
            })
        }
    };

    previousPage = () => {
        const index = this.state.page - 1;
        if (index <= 3) {
            this.setState({
                page: index
            })
        }
    };

    send = () => {
        if (true) {
            this.setState({
                success: true
            });
        }
    };

    updateState = (object) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                ...object
            }
        })
    };

    updateErrors = (object) => {
        this.setState({
            ...this.state,
            errors: {
                ...this.state.errors,
                ...object
            }
        })
    };

    render() {
        if (this.state.success) {
            return (<Welcome/>);
        }

        const { translate, windowSize } = this.props;
        const { page } = this.state;
        const primary = getPrimary();

        return (<div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 3em)',
                backgroundImage: `url(${image})`,
                overflow: 'auto',
                alignItems: 'center'
            }}>
            <div
                style={{
                    height: '13%',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                <h3 style={{ color: 'white' }}>{translate.registration_of_society}</h3>
            </div>
            <Card
                style={{
                    width: windowSize !== 'xs' ? '65%' : '100%',
                    height: windowSize !== 'xs' ? null : '100%',
                    padding: 0,
                    borderRadius: windowSize !== 'xs' ? '0.3em' : '0',
                    overflow: 'hidden'
                }}>
                <CardContent
                    style={{
                        padding: 0,
                        width: '100%'
                    }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: windowSize !== 'xs' ? 'row' : 'column',
                            height: windowSize !== 'xs' ? '72vh' : 'calc(100vh - 3em)',
                            width: '100%'
                        }}>
                        <div style={{
                            backgroundColor: 'WhiteSmoke',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            paddingTop: '1em',
                            height: windowSize !== 'xs' ? '100%' : '5em'
                        }}>
                            <SignUpStepper
                                translate={translate}
                                active={page - 1}
                                windowSize={windowSize}
                            />
                        </div>
                        <div style={{
                            backgroundColor: 'white',
                            width: '100%',
                            position: 'relative',
                            overflowY: 'hidden',
                            height: windowSize !== 'xs' ? '100%' : 'calc(100vh - 8em - 11.5%)'
                        }}>
                            <Scrollbar>
                                <div style={{ paddingBottom: '6.5em' }}>

                                    {page === 1 && <SignUpEnterprise
                                        nextPage={this.nextPage}
                                        translate={this.props.translate}
                                        formData={this.state.data}
                                        errors={this.state.errors}
                                        updateState={this.updateState}
                                        updateErrors={this.updateErrors}
                                    />}

                                    {page === 2 && <SignUpUser
                                        nextPage={this.nextPage}
                                        previousPage={this.previousPage}
                                        formData={this.state.data}
                                        errors={this.state.errors}
                                        updateState={this.updateState}
                                        updateErrors={this.updateErrors}
                                        translate={this.props.translate}
                                    />}

                                    {page === 3 && <SignUpPay
                                        nextPage={this.nextPage}
                                        previousPage={this.previousPage}
                                        formData={this.state.data}
                                        errors={this.state.errors}
                                        updateState={this.updateState}
                                        updateErrors={this.updateErrors}
                                        translate={this.props.translate}
                                        sendNewCompany={this.props.companyActions.sendNewCompany}
                                    />}

                                </div>
                            </Scrollbar>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>);
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch),
        companyActions: bindActionCreators(companyActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(withWindowSize(SignUpPage));