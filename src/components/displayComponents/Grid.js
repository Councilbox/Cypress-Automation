import React from 'react';
import Grid from 'material-ui/Grid';

const GridWrapper = ({ children, alignItems, alignContent, style }) => (
    <Grid
        container
        alignItems={alignItems}
        alignContent={alignContent}
        style={style}
    >
        {children}
    </Grid>
)

export default GridWrapper;