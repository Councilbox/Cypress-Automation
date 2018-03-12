import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { getPrimary, getSecondary } from '../../styles/colors';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

const primary = getPrimary();
const secondary = getSecondary();
const theme = createMuiTheme({
    palette: {
        primary: {
            main: getPrimary(),
        },
        secondary: {
            main: getSecondary()
        }
    },

    overrides: {
        MuiTable: {
            root: {
                maxWidth: '90%',
            }
        },
        MuiTableRow: {
            root: {
                width: '50%'
            }
        }
    }

});

export default ({ children }) => (
    <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
            {children}
        </MuiPickersUtilsProvider>
    </MuiThemeProvider>
);


