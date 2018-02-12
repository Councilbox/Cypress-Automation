import React from 'react';
import { primary, secondary, darkGrey, lightGrey } from '../../styles/colors';
import FontIcon from 'material-ui/FontIcon';
import { BasicButton } from '../displayComponents';

const Block = ({ children, button }) => (
    <div className="col-lg-3 col-md-6 col-xs-6" style={{margin: 0, padding: 0}}>
        <div style={{paddingLeft: '1.5em', paddingRight: '1.5em', backgroundColor: darkGrey, height: '10em', color: secondary, fontWeight: '700', border: `1px solid ${lightGrey}`, paddingTop: '3em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            {children}
        </div>
        {button &&
            <div style={{display: 'flex', alignItems: 'center', backgroundColor: 'purple', border: `1px solid ${lightGrey}`, color: 'white', fontWeight: '700'}}>
                {button()}
            </div>
        }
    </div>
)

const estatutesButton = () => (
    <BasicButton
        text="Revisa tus estatutos"
        fullWidth={true}
        color={primary}
        buttonStyle={{width: '90%'}}
        textStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
        textPosition="after"
        icon={<FontIcon className="material-icons">edit</FontIcon>}
    />
)

const censusesButton = () => (
    <BasicButton
        text="Crear un censo"
        fullWidth={true}
        color={secondary}
        buttonStyle={{width: '90%'}}
        textStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
        textPosition="after"
        icon={<FontIcon className="material-icons">control_point</FontIcon>}
    />
)

const TopSectionBlocks = ({ translate }) => (
    <div style={{width: '90%', flexDirection: 'row'}} className="row" >
        <Block>
            {translate.edit_company && translate.edit_company.toUpperCase()}
            <FontIcon className="material-icons" color={'grey'} style={{fontSize: '2em', color: 'white'}}>work</FontIcon>            
        </Block>
        <Block button={estatutesButton}>
            {translate.statutes && translate.statutes.toUpperCase()}
            <FontIcon className="material-icons" color={'grey'} style={{fontSize: '2em', color: 'white'}}>gavel</FontIcon>
        </Block>
        <Block button={censusesButton}>
            {translate.censuses && translate.censuses.toUpperCase()}
            <FontIcon className="material-icons" color={'grey'} style={{fontSize: '2em', color: 'white'}}>person</FontIcon>
        </Block>
        <Block>
            {translate.drafts && translate.drafts.toUpperCase()}
            <FontIcon className="material-icons" color={'grey'} style={{fontSize: '2em', color: 'white'}}>class</FontIcon>
        </Block>
        
    </div>
)

export default TopSectionBlocks;