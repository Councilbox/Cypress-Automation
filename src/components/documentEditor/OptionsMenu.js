import React from 'react';
import CheckBox from '../../displayComponents/CheckBox';

const OptionsMenu = ({ setOptions, translate, options }) => {
    //TRADUCCION
    return (
        <div style={{ width: "100%", background: "white", boxShadow: " 0 2px 4px 5px rgba(0, 0, 0, 0.11)", borderRadius: "4px", margin: "0.8em 0px" }}>
            <div style={{ width: "100%", display: "flex", }}>
                <div style={{ paddingRight: "4px", background: 'red', borderRadius: "15px", }}></div>
                <div style={{ marginLeft: "0.5em", paddingTop: "0.8em", paddingBottom: "0.8em", width: "100%" }}>
                    <div style={{ width: "100%" }}>
                        <CheckBox
                            label={'Doble columna'}
                            value={options.doubleColumn}
                            onChange={(event, isInputChecked) =>
                                setOptions({
                                    ...options,
                                    doubleColumn: isInputChecked
                                })
                            }
                        />
                        <CheckBox
                            label={'Con sello certificado'}
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
            </div>
        </div>
    )
}

export default OptionsMenu;