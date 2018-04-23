import React from 'react';
import { lightGrey } from '../../styles/colors';
import RegularCard from '../displayComponents/RegularCard';
import Scrollbar from 'react-perfect-scrollbar';
import withWindowSize from '../../HOCs/withWindowSize';


const CardPageLayout = ({ children, title, windowSize, isFullHeight = true }) => (<div style={{
    backgroundColor: lightGrey,
    height: '100%',
    width: '100%'
}}>
    <div style={{
        margin: '1.2em 0 0 0',
        height: 'calc(100% - 2em)'

    }}>
        <div style={{
            background: 'linear-gradient(60deg, #ab47bc, #8e24aa)',
            boxShadow: '0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)',
            color: 'white',
            width: windowSize !== 'xs' ? '30%' : '60%',
            verticalAlign: 'middle',
            padding: '0.5em',
            height: '2.6em',
            zIndex: '1000',
            marginLeft: windowSize !== 'xs' ? '3em' : '1em',
            position: 'relative',
            borderRadius: '3px',
            fontWeight: '800'
        }}
             className="align-middle">
            {title}
        </div>
        <div style={{
            height: isFullHeight ? 'calc(100% - 2em)' : 'auto',
            backgroundColor: 'white',
            borderRadius: '3px',
            width: windowSize !== 'xs' ? '95%' : '99%',
            margin: '0 auto',
            marginTop: '-4em',
        }}>
            <div style={{
                margin: '2.5em 1em 1.5em 1em',
                paddingTop: '2.5em',
                paddingBottom: '1em',
                height: '100%',
                width: 'calc(100% - 2em)',
            }}>
                {children}
            </div>
        </div>
    </div>
</div>);


export default withWindowSize(CardPageLayout);