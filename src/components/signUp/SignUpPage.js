import React from 'react';
import * as mainActions from '../../actions/mainActions';
import * as companyActions from '../../actions/companyActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Welcome from '../Welcome';
import SignUpEnterprise from './SignUpEnterprise';
import SignUpUser from './SignUpUser';
import SignUpPay from './SignUpPay';
import { Card, CardContent } from 'material-ui';
import { getPrimary } from '../../styles/colors';

class SignUpPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            page: 1,
            data: {

            }
        };
    }

    nextPage = (state) => {
        const index = this.state.page + 1;
        if(index <= 3){
            this.setState({
                page: index,
                data: {
                    ...state
                }
            })
        } 
    }

    send = () => {
        if(true){
            this.setState({
                success: true
            });
        }
    }

    render(){
        if(this.state.success){
            return(<Welcome />);
        }

        const primary = getPrimary();

        return(
            <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex'}} >
                <h3 style={{color: 'white'}}>Alta de empresa</h3>
                <Card style={{width: '65%', padding: 0, borderRadius: '0.3em', overflow: 'hidden'}} containerStyle={{padding: 0}}>
                    <CardContent style={{padding: 0}}>
                        <div style={{display: 'flex', flexDirection: 'row', height:'75vh'}}>
                            <div style={{backgroundColor: 'lightgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1em', width: '5em', height: '100%'}}>
                                <div style={{backgroundColor: primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', width: '2em', height: '2em', borderRadius: '1em'}} onClick={() => this.setState({page: 1})}>
                                    1
                                </div>
                                <div style={{backgroundColor: primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', width: '2em', height: '2em', borderRadius: '1em'}} onClick={() => this.setState({page: 2})}>
                                    2
                                </div>
                                <div style={{backgroundColor: primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', width: '2em', height: '2em', borderRadius: '1em'}} onClick={() => this.setState({page: 3})}>
                                    3
                                </div>
                            </div>
                            <div style={{backgroundColor: 'white', width: '3em', height: '100%'}}>
                                {this.state.page === 1 &&
                                    <SignUpEnterprise
                                        nextPage={this.nextPage}
                                        translate={this.props.translate}
                                        data={this.state.data} />
                                }
                                {this.state.page === 2 &&
                                    <SignUpUser
                                        nextPage={this.nextPage}
                                        data={this.state.data}
                                        translate={this.props.translate}
                                    />
                                }
                                {this.state.page === 3 &&
                                    <SignUpPay
                                        nextPage={this.nextPage}
                                        data={this.state.data}
                                        translate={this.props.translate}
                                        sendNewCompany={this.props.companyActions.sendNewCompany}
                                    />
                               }
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch),
        companyActions: bindActionCreators(companyActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(SignUpPage);