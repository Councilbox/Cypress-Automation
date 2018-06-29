import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const Scrollbar = ({ showX, children, style = {} }) => (
    <Scrollbars
        style={{
            width: '100%',
            height: '100%',
            ...style
        }}
        {...(!showX? {renderTrackHorizontal: () => <span />} : {})}
    >
        {children}
    </Scrollbars>
)
export default Scrollbar;