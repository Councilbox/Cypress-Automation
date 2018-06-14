import React from "react"; 
import FontAwesome from "react-fontawesome"; 
import { getPrimary } from "../../../styles/colors"; 
 
 
const UserItem = ({ user, select }) => { 
    const primary = getPrimary(); 
    const iconsSize = 1.8; 
    return ( 
        <div style={{margin: '1em', cursor: 'pointer'}} > 
            <div style={{ display: 'flex' }}> 
            {user.id} 
                <FontAwesome 
                    name={'info'} 
                    style={{ 
                        margin: "0.5em", 
                        color: primary, 
                        fontSize: `${iconsSize}em` 
                    }} /> 
                    <div style={{ margin: '1em'}}> 
                        {user.name} {user.surname} 
                    </div> 
                <FontAwesome 
                    name={'user-o'} 
                    style={{ 
                        margin: "0.5em", 
                        color: primary, 
                        fontSize: `${iconsSize}em` 
                    }} /> 
                    <div style={{ margin: '1em'}}> 
                        {user.usr} 
                    </div> 
                <FontAwesome 
                    name={'phone'} 
                    style={{ 
                        margin: "0.5em", 
                        color: primary, 
                        fontSize: `${iconsSize}em` 
                    }} 
                /> 
                <div style={{ margin: '1em'}}> 
                    {user.phone}  
                </div> 
                <FontAwesome 
                    name={'envelope'} 
                    style={{ 
                        margin: "0.5em", 
                        color: primary, 
                        fontSize: `${iconsSize}em` 
                    }} 
                /> 
                <div style={{ margin: '1em'}}> 
                    {user.email}  
                </div> 
                 
            </div> 
        </div> 
    ) 
} 
 
export default UserItem;