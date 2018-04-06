import React from 'react';
import Grid from 'material-ui/Grid';

const GridWrapper = ({ children, alignItems, alignContent, style, spacing }) => (
    <Grid
        container
        alignItems={alignItems}
        alignContent={alignContent}
        style={style}
        spacing={spacing}
    >
        {children}
    </Grid>
)

export default GridWrapper;