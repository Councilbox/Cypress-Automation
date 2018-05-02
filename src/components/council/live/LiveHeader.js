import React, { Component } from 'react';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { bHistory } from '../../../containers/App';
import { AlertConfirm, Icon } from '../../../displayComponents';


class LiveHeader extends Component  {
    
    constructor(props){
        super(props);
        this.state = {
            showConfirm: false
        }
    }
    
    exitAction = () => {
        bHistory.push('/');
    }
    
    render(){
        const { primaryColor, companyName, councilName, logo, translate } = this.props;
        const primary = getPrimary();

        return(
            <div 
                style={{
                    background: primaryColor || `linear-gradient(to right, ${getSecondary()}, ${primary})`,
                    color: 'white',
                    display: 'flex',
                    width: '100%',
                    minHeight: '3em',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <div style={{width: '20%'}}>
                    <img src={logo} style={{height: '2em', width: 'auto', marginLeft: '1em', marginRight: '1em'}} alt="councilbox logo" />
                    <span style={{fontWeight: '700'}}>{companyName}</span>
                </div>
                <div style={{width: '50%', display: 'flex', justifyContent: 'center', marginRight: '10%'}}>
                    <span style={{alignSelf: 'center'}}>{councilName}</span>
                </div>
                <div style={{width: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingRight: '2em'}}>
                    <Icon 
                        className="material-icons"
                        style={{fontSize: '1.5em', color: 'white'}}
                    >
                        help
                    </Icon>
                    <Icon 
                        className="material-icons"
                        style={{fontSize: '1.5em', color: 'white'}}
                        onClick={() => this.setState({
                            showConfirm: true
                        })}
                    >
                        exit_to_app
                    </Icon>
                    <AlertConfirm
                        title={translate.exit}
                        bodyText={translate.exit_desc}
                        acceptAction={this.exitAction}
                        buttonCancel={translate.cancel}
                        buttonAccept={translate.accept}
                        open={this.state.showConfirm}
                        requestClose={() => this.setState({
                            showConfirm: false
                        })}
                    />
                </div>
            </div>
        )
    }
}

export default LiveHeader;