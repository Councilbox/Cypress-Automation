import React from 'react';
import { Typography } from 'material-ui';

const SectionTitle = ({ text, color, style }) => (
    <Typography variant="title" style={{ color: color, fontSize: '18px', fontWeight: '700', marginBottom: '0.6em', ...style }}>
        {text}
    </Typography>
)

export default SectionTitle;