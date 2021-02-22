import React from 'react';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import { connect } from 'react-redux';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import { getPrimary, getSecondary } from '../styles/colors';
import { moment } from '../containers/App';

const ThemeProvider = ({ children }) => {
	const primary = getPrimary();
	const secondary = getSecondary();
	const theme = createMuiTheme({
		palette: {
			primary: {
				main: primary
			},
			secondary: {
				main: secondary
			}
		},

		typography: {
			fontFamily: ['Lato', 'Roboto', 'Helvetica'],
		},

		overrides: {
			MuiDialog: {
				root: {
					zIndex: 1001,
				}
			},
			MuiDialogTitle: {
				root: {
					fontSize: '0.8em'
				}
			},
			MuiDrawer: {
				paper: {
					zIndex: 999
				},
				modal: {
					zIndex: 999
				}
			},
			MuiIconButton: {
				root: {
					height: '34px !important'
				}
			},
			MuiInput: {
				underline: {
					'&:hover:not($disabled):before': {
						// underline color when hovered
						backgroundColor: secondary
					},
					'&:after': {
						backgroundColor: secondary
					}
				}
			},
			MuiInputLabel: {
				root: {
					color: secondary
				}
			},
			MuiMenu: {
				paper: {
					zIndex: 998
				}
			},
			MuiMenuItem: {
				root: {
					fontSize: '14px !important'
				}
			},
			MuiSelect: {
				select: {
					fontSize: '15px !important'
				}
			},
			MuiStepper: {
				root: {
					backgroundColor: 'transparent',
				},
				horizontal: {
					height: '6em',
					overflow: 'hidden',
				}
			},
			MuiTab: {
				root: {
					outline: 'none !important',
					userSelect: 'none !important',
					textTransform: 'none',
					fontWeight: '700',
				},
				disabled: {
					fontWeight: '400'
				},
				label: {
					fontSize: '14px !important',
				},
				selected: {
					fontWeight: '700'
				}
			},
			MuiTabIndicator: {
				root: {
					height: '3px'
				}
			},
			MuiTable: {
				root: {
					maxWidth: '90%',
					fontSize: '0.8rem'
				}
			},
			MuiTableRow: {
				root: {
					width: '50%'
				}
			},
			MuiTooltip: {
				tooltip: {
					fontSize: '0.7rem'
				}
			},
			MuiTypography: {
				title: {
					fontSize: '1.25rem'
				}
			}
		}
	});


	return (
		<MuiThemeProvider theme={theme}>
			<MuiPickersUtilsProvider
				utils={MomentUtils}
				moment={moment}
			>
				{children}
			</MuiPickersUtilsProvider>
		</MuiThemeProvider>
	);
};

const mapStateToProps = state => ({
	subdomain: state.subdomain
});

export default connect(mapStateToProps)(ThemeProvider);
