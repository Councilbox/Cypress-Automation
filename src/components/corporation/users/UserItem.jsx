import React from "react"; 
import FontAwesome from "react-fontawesome"; 
import { getPrimary, getSecondary } from "../../../styles/colors"; 
import { Link } from 'react-router-dom';
import { MenuItem } from 'material-ui';
import { DateWrapper } from '../../../displayComponents';
 
 
const UserItem = ({ user, translate }) => { 
    const secondary = getSecondary(); 
    return ( 
        <Link to={`/users/edit/${user.id}`} >
            <MenuItem
                style={{
                    border: '1px solid gainsboro',
                    height: '3.5em',
                    width: '100%',
                    height: '3em',
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
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
            </MenuItem>
        </Link>
    ) 
} 

 
export default UserItem;