import React from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import withWindowSize from '../../HOCs/withWindowSize';
import { getPrimary, getSecondary, lightTurquoise } from '../../styles/colors';
import {
    Grid, GridItem
} from '../displayComponents';

const primary = getPrimary();
const secondary = getSecondary();


const Vtabs = ({ children, tabs, changeTab, additionalTab, windowSize }) => (

    <Grid style={{height: '100%'}}>
        <GridItem xs={12} md={3} lg={3}
                  className="nav-tabs-left">
            {tabs.map((tab, index) => {
                return <div style={{
                    width: '100%',
                    backgroundColor: tab.active ? 'white' : lightTurquoise,
                    padding: '0.8vh',
                    color: tab.active ? primary : secondary,
                    fontWeight: '700',
                    borderLeft: 'solid 3px ' + (tab.active ? primary : secondary),
                    marginBottom: '0.5vh',
                    cursor: tab.active ? '' : 'pointer',
                    boxShadow: tab.active ?'-2px 2px 6px -2px rgba(0, 0, 0, 0.2)' : ''
                }}
                onClick={() => changeTab(index)}>
                    {tab.title}
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
        <GridItem xs={12} md={9} lg={9} s>
            {/*<Scrollbar>*/}
                {/*{children}*/}
            {/*</Scrollbar>*/}
        </GridItem>
    </Grid>

);

export default withWindowSize(Vtabs);