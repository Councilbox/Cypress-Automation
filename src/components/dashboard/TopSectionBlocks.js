import React from 'react';
import { getPrimary, getSecondary, darkGrey, lightGrey } from '../../styles/colors';
import { BasicButton, Icon } from '../displayComponents';
import { Link } from 'react-router-dom';

const Block = ({ children, button }) => (
    <React.Fragment>
        <div style={{paddingLeft: '1.5em', paddingRight: '1.5em', backgroundColor: darkGrey, height: '10em', color: getSecondary(), fontWeight: '700', border: `1px solid ${lightGrey}`, paddingTop: '3em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            {children}
        </div>
        {button &&
            <div style={{display: 'flex', alignItems: 'center', backgroundColor: getPrimary(), border: `1px solid ${lightGrey}`, color: 'white', fontWeight: '700'}}>
                {button()}
            </div>
        }
    </React.Fragment>
)

const estatutesButton = () => (
    <BasicButton
        text="Revisa tus estatutos"
        fullWidth={true}
        color={getPrimary()}
        textStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
        textPosition="after"
        icon={<Icon className="material-icons" style={{color: 'white'}}>edit</Icon>}
    />
)

const censusesButton = () => (
    <BasicButton
        text="Crear un censo"
        fullWidth={true}
        color={getSecondary()}
        textStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
        textPosition="after"
        icon={<Icon className="material-icons" style={{color: 'white'}}>control_point</Icon>}
    />
)

const TopSectionBlocks = ({ translate, company, user }) => (
    <div style={{width: '90%', flexDirection: 'row'}} className="row" >
        <div className="col-lg-3 col-md-6 col-xs-6" style={{margin: 0, padding: 0}}>
        
            <Link to={`/company/${company.id}/settings`}>
                <Block>
                    {translate.edit_company && translate.edit_company.toUpperCase()}
                    <Icon className="material-icons" style={{fontSize: '2em', color: 'white'}}>work</Icon>          
                </Block>
            </Link>
        </div>

        <div className="col-lg-3 col-md-6 col-xs-6" style={{margin: 0, padding: 0}}>
            <Link to={`/company/${company.id}/statutes`}> 
                <Block button={estatutesButton}>
                    {translate.statutes && translate.statutes.toUpperCase()}
                    <Icon className="material-icons" style={{fontSize: '2em', color: 'white'}}>gavel</Icon>
                </Block>
            </Link>
        </div>

        <div className="col-lg-3 col-md-6 col-xs-6" style={{margin: 0, padding: 0}}>     
            <Link to={`/company/${company.id}/censuses`}> 
                <Block button={censusesButton}>
                    {translate.censuses && translate.censuses.toUpperCase()}
                    <Icon className="material-icons" style={{fontSize: '2em', color: 'white'}}>person</Icon>
                </Block>
            </Link>
        </div>

        <div className="col-lg-3 col-md-6 col-xs-6" style={{margin: 0, padding: 0}}>
            <Link to={`/company/${company.id}/drafts`}>
                <Block>
                    {translate.drafts && translate.drafts.toUpperCase()}
                    <Icon className="material-icons" style={{fontSize: '2em', color: 'white'}}>class</Icon>
                </Block>
            </Link>
        </div>
        
    </div>
)

export default TopSectionBlocks;