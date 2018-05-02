import React from 'react';
import { lightGrey } from '../styles/colors';
import Scrollbar from 'react-perfect-scrollbar';
import withWindowSize from '../HOCs/withWindowSize';
import { Paper } from 'material-ui';


const CardPageLayout = ({ children, title, windowSize, disableScroll = false }) => (<div style={{
        backgroundColor: lightGrey,
        height: '100%',
        width: '100%'
    }}>
        <div style={{
            margin: windowSize !== 'xs' ? '1.2em 0 0 0': '0.4em 0 0 0',
            height: windowSize !== 'xs' ? 'calc(100% - 2em)': 'calc(100%)'
        }}>
            <div style={{
                background: 'linear-gradient(60deg, #ab47bc, #8e24aa)',
                boxShadow: '0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)',
                color: 'white',
                width: windowSize !== 'xs' ? '30%' : 'calc(100% - 2em)',
                verticalAlign: 'middle',
                padding: windowSize !== 'xs' ? '0.5em' : '0.2em',
                height: windowSize !== 'xs' ? '2.6em' : '2em',
                zIndex: '1000',
                marginLeft: windowSize !== 'xs' ? (windowSize === 'xl' ? '8%': '3em') : '1em',
                marginRight: windowSize !== 'xs' && '1em',
                position: 'relative',
                borderRadius: '3px',
                fontWeight: '800'
            }}
                 className="align-middle">
                {title}
            </div>
            <Paper style={{
                height: windowSize !== 'xs' ? 'calc(100% - 2em)': 'calc(100% - 1.5em)',
                backgroundColor: 'white',
                borderRadius: '3px',
                width: windowSize !== 'xs' ? (windowSize === 'xl' ? '90%': '96%') : '98%',
                margin: '0 auto',
                marginTop: '-4em',
            }}>
                <div style={{
                    marginTop: '2.5em',
                    marginBottom: '1.5em',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                }}>
                    {!disableScroll && <Scrollbar>
                        <div style={{
                            paddingTop: '2.5em',
                            paddingBottom: '1em',
                            paddingLeft: windowSize === 'xl' && '2vw',
                            paddingRight: windowSize === 'xl' && '2vw',
                        }}>
                            <div className="container-fluid">
                                {children}
                            </div>
                        </div>
                    </Scrollbar>}
                    {disableScroll && <div style={{
                        paddingTop: '2.5em',
                        paddingBottom: '0.5em',
                        paddingLeft: windowSize === 'xl' && '2vw',
                        paddingRight: windowSize === 'xl' && '2vw',
                        height: '100%'
                    }}>
                        {children}
                    </div>}
                </div>
            </Paper>
        </div>
    </div>);


export default withWindowSize(CardPageLayout);