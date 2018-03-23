import React from 'react';
import { Button } from 'material-ui';
import { ButtonIcon } from './';
import { CircularProgress } from 'material-ui/Progress';


const BasicButton = ({ color, error, text, textStyle, buttonStyle, icon, type, textPosition, onClick, fullWidth, loading, success }) => (
    <Button
        style={{...buttonStyle, ...textStyle, backgroundColor: success? 'green' : error? 'red' : color}}
        variant={type}
        onClick={onClick}
        fullWidth={fullWidth}
    >
        {text}
        {success?
            <ButtonIcon type="checkIcon" color="white" /> 
        :
            error?
                <ButtonIcon type="clear" color="white" /> 
            :
                loading?
                    <div style={{color: 'white', marginLeft: '0.3em'}}>
                        <CircularProgress size={12} color={'inherit'} />
                    </div>
                :
                    icon
        }
    </Button>
);

export default BasicButton;