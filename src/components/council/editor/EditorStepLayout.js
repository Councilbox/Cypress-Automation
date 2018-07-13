import React from 'react';
import { Scrollbar } from '../../../displayComponents';


const EditorStepLayout = ({ body, buttons }) => (
    <div
        style={{
            width: "100%",
            height: "calc(100% - 4em)"
        }}
    >
        <div style={{height: '100%', overflow: 'hidden', position: 'relative', borderTop: '1px solid gainsboro', }}>
            <Scrollbar>
                <div style={{padding: '1.2em'}}>
                    {body}
                </div>
            </Scrollbar>
        </div>
        <div style={{height: '3.5em', borderTop: '1px solid gainsboro', paddingRight: '0.8em', width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
            {buttons}
        </div>
    </div>
)

export default EditorStepLayout;