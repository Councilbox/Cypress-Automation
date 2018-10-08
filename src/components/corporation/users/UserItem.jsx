import React from "react"; 
import FontAwesome from "react-fontawesome"; 
import { getSecondary } from "../../../styles/colors"; 
import { MenuItem } from 'material-ui';
import { DateWrapper, BasicButton } from '../../../displayComponents';
import { USER_ACTIVATIONS } from '../../../constants';
import CloseSessionButton from './CloseSessionButton';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

 
class UserItem extends React.Component {

    activatePremium = async event => {
        event.stopPropagation();
        const response = await this.props.activateUserPremium({
            variables: {
                userId: this.props.user.id
            }
        });

        console.log(response)
    }

    render(){
        const { user, translate, clickable, closeSession } = this.props; 
        const secondary = getSecondary(); 

        const body = () => (
            <React.Fragment>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div 
                        style={{
                            width: '5em',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <FontAwesome
                            name={'user'}
                            style={{fontSize: '1.7em', color: 'lightgrey'}}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            paddingLeft: '1.4em'
                        }}   
                    >
                        <div>
                            <FontAwesome 
                                name={'info'} 
                                style={{ 
                                    marginRight: "0.5em", 
                                    color: secondary, 
                                    fontSize: '0.7em'
                                }}
                            /> 
                            <span style={{fontSize: '0.8rem', fontWeight: '700'}}>{`${user.name} ${user.surname} ID: ${user.id}`}</span>
                        </div>
                        <div>
                            <FontAwesome 
                                name={'at'} 
                                style={{ 
                                    marginRight: "0.5em", 
                                    color: secondary, 
                                    fontSize: '0.7em'
                                }}
                            /> 
                            <span style={{fontSize: '0.7rem'}}>{`${user.email || '-'}`}</span>
                        </div>
                        <div>
                            <FontAwesome 
                                name={'sign-in'} 
                                style={{ 
                                    marginRight: "0.5em", 
                                    color: secondary, 
                                    fontSize: '0.7em'
                                }}
                            /> 
                            <span style={{fontSize: '0.7rem'}}>{`${translate.last_connection}: `}</span> 
                            {!!user.lastConnectionDate? 
                                <DateWrapper
                                    format="DD/MM/YYYY HH:mm"
                                    date={user.lastConnectionDate} 
                                    style={{fontSize: '0.7em'}}
                                />
                            :
                                '-'
                            }
                        </div>    
                    </div>
                </div>
                {closeSession &&
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10em'
                        }}
                    >
                        <CloseSessionButton
                            user={user}
                            translate={translate}
                        />
                    </div>

                }
                {this.props.activatePremium &&
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10em'
                        }}
                    >
                        {user.actived !== USER_ACTIVATIONS.PREMIUM?
                            <BasicButton
                                text="Activar Premium"
                                onClick={this.activatePremium}
                            />
                        :
                            <BasicButton
                                text="Cancelar Premium"
                            />
                        }
                        
                    </div>
                }
            </React.Fragment>
        )

        return (
            clickable?
                <MenuItem
                    style={{
                        border: '1px solid gainsboro',
                        height: '3.5em',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    {body()}
                </MenuItem>
            
            :
                <div
                    style={{
                        border: '1px solid gainsboro',
                        height: '3.5em',
                        width: '100%',
                        minHeight: '4.5em',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    {body()} 
                </div>    
        ) 
    }    
} 

 
const activateUserPremium = gql`
    mutation ActivateUserPremium($userId: Int!){
        activateUserPremium(userId: $userId){
            success
        }
    }
`;

export default graphql(activateUserPremium, {
    name: 'activateUserPremium'
})(UserItem);