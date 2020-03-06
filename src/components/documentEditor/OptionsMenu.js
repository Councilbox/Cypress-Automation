import React from 'react';
import CheckBox from '../../displayComponents/CheckBox';

const OptionsMenu = ({ setOptions, translate, options }) => {
    return (
        <div style={{ display: "flex", width: '100%', }} >
            <div style={{ width: "100%", background: "white", boxShadow: " 0 2px 4px 5px rgba(0, 0, 0, 0.11)", borderRadius: "4px", margin: "0.8em 0px", marginRight: "1.5em" }}>
                <div style={{ width: "100%", display: "flex", marginLeft: 'calc( 0.5em + 4px )', paddingTop: '0.3em', paddingBottom: '0.3em' }}>
                    <CheckBox
                        label={translate.include_stamp}
                        styleInLabel={{ fontWeight: 'bold', color: '#a09aa0' }}
                        colorCheckbox={"primary"}
                        value={options.stamp}
                        onChange={(event, isInputChecked) =>
                            setOptions({
                                ...options,
                                stamp: isInputChecked
                            })
                        }
                    />
                </div>
            </div>
            <div style={{ width: "100%", background: "white", boxShadow: " 0 2px 4px 5px rgba(0, 0, 0, 0.11)", borderRadius: "4px", margin: "0.8em 0px" }}>
                <div style={{ width: "100%", display: "flex", marginLeft: 'calc( 0.5em + 4px )', paddingTop: '0.3em', paddingBottom: '0.3em' }}>
                    <CheckBox
                        label={translate.two_columns}
                        styleInLabel={{ fontWeight: 'bold', color: '#a09aa0' }}
                        colorCheckbox={"primary"}
                        value={options.doubleColumn}
                        onChange={(event, isInputChecked) =>
                            setOptions({
                                ...options,
                                doubleColumn: isInputChecked
                            })
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default OptionsMenu;