import React from 'react';
import { Badge } from 'material-ui';
import { getPrimary } from '../styles/colors';


const CBXBadge = ({ children, hide, dot, styleDot, ...props }) => {
    const primary = getPrimary();

    if(hide){
        return children;
    }

    if(dot){
        return (
            <div style={{ position: 'relative' }}>
                {children}

                <div
                    style={{
                        backgroundColor: primary,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 0,
                        borderRadius: '50%',
                        right: 0
                    }}
                >
                    <i className="fa fa-circle-thin" aria-hidden="true"
                        style={{
                            color: '#ffffffcc',
                            fontSize: '12px',
                            ...styleDot
                    }}></i>
                </div>
            </div>
        );
    }

    return (
        <Badge {...props}>
            {children}
        </Badge>
    );
};

export default CBXBadge;
