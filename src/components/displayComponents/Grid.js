import React from 'react';
import Grid from 'material-ui/Grid';

const GridWrapper = ({ children, alignItems, alignContent }) => (
    <Grid
        container
        alignItems={alignItems}
        alignContent={alignContent}
    >
        {children}
    </Grid>
)

export default GridWrapper;