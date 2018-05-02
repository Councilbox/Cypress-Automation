import React, { Fragment } from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import withWindowSize from '../HOCs/withWindowSize';
import { getPrimary, getSecondary, lightTurquoise } from '../styles/colors';
import {
    Grid, GridItem, SelectInput, MenuItem
} from './index';
import { CloseIcon } from './index';

const primary = getPrimary();
const secondary = getSecondary();




const Vtabs = ({ children, tabs, changeTab, additionalTab, windowSize, deleteAction }) => (

    <Fragment>
        {windowSize !== 'xs' &&

        <Grid style={{ height: '100%' }}>
            <GridItem xs={12} md={3} lg={3}
                      className="nav-tabs-left">
                {tabs.map((tab, index) => {
                    return <div
                        key={`vtab${index}`}
                        style={{
                            width: '100%',
                            backgroundColor: tab.active ? 'white' : lightTurquoise,
                            padding: '0.8vh',
                            color: tab.active ? primary : secondary,
                            fontWeight: '700',
                            borderLeft: 'solid 3px ' + (tab.active ? primary : secondary),
                            marginBottom: '0.6vh',
                            cursor: tab.active ? '' : 'pointer',
                            boxShadow: tab.active ? '-2px 2px 6px -2px rgba(0, 0, 0, 0.2)' : ''
                        }}
                        onClick={() => changeTab(index)}>
                        <Grid>
                            <GridItem xs={10}>
                                {tab.title}
                            </GridItem>
                            <GridItem xs={2}>
                                <CloseIcon
                                    style={{ float: 'right' }}
                                    onClick={(event) => {
                                        deleteAction(tab.data.id);
                                        event.stopPropagation();
                                    }}
                                />
                            </GridItem>
                        </Grid>
                    </div>
                })}
                {additionalTab && <div
                    style={{
                        width: '100%',
                        backgroundColor: secondary,
                        padding: '0.8vh',
                        color: 'white',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                    onClick={additionalTab.action}>
                    <i className="fa fa-plus"/>
                    {additionalTab.title}
                </div>}
            </GridItem>
            <GridItem xs={12} md={9} lg={9} style={{ height: '100%' }}>
                <Scrollbar>
                    {children}
                </Scrollbar>
            </GridItem>
        </Grid>

        }

        {windowSize === 'xs' && <Grid style={{ height: '100%' }}>
            <GridItem xs={6}>
                <SelectInput
                    onChange={(event, child) => changeTab(event.target.value)}>
                    {tabs.map((tab, index) => {
                        return <MenuItem value={index}
                                         key={`statute_${index}`}>{tab.title}</MenuItem>
                    })}
                </SelectInput>
            </GridItem>
            <GridItem xs={6}>
                {additionalTab && <button
                    style={{
                        width: '20%',
                        backgroundColor: secondary,
                        color: 'white',
                        fontWeight: '700',
                        cursor: 'pointer',
                        float: 'right'
                    }}
                    onClick={additionalTab.action}>
                    <i className="fa fa-plus"/>
                    {/*{additionalTab.title}*/}
                </button>}
                {deleteAction &&

                <CloseIcon style={{ float: 'right' }}
                           onClick={() => {
                               for (let i = 0; i < tabs.length; i++) {
                                   const tab = tabs[ i ];
                                   if (tab.active) {
                                       return deleteAction(tab.data.id);
                                   }
                               }
                           }}
                />}

            </GridItem>
            <GridItem xs={12} style={{ height: 'calc(100% - 6em)' }}>
                <Scrollbar>
                    {children}
                </Scrollbar>
            </GridItem>
        </Grid>}
    </Fragment>

);

export default withWindowSize(Vtabs);