import React from 'react';
import { lightGrey } from '../../styles/colors';
import RegularCard from '../displayComponents/RegularCard';
import Scrollbar from 'react-perfect-scrollbar';
import withWindowSize from '../../HOCs/withWindowSize';


const CardPageLayout = ({ children, title, windowSize }) => (
    <div style = {{paddingBottom: windowSize !== 'xs'? '4em' : 0, overflow: 'hidden', position: 'relative', paddingTop: '0.6em', backgroundColor: lightGrey, height: '100vh', width: '100%'}} >
        <Scrollbar>
            <div style={{width: windowSize !== 'xs'? '95%' : '100%', margin: 'auto'}}>
                <RegularCard
                    cardTitle={title}
                    cardSubtitle={''}
                    content={
                        children
                    }
                />
            </div>
        </Scrollbar>        
    </div>
)

export default withWindowSize(CardPageLayout);