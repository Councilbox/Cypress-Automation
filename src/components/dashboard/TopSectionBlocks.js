import React from 'react';
import { getPrimary, getSecondary, darkGrey, lightGrey } from '../../styles/colors';
import { BasicButton, Icon, Grid, GridItem } from '../displayComponents';
import { Link } from 'react-router-dom';

const Block = ({ children, button }) => (
    <React.Fragment>
        <BasicButton
            text={children}
            fullWidth={true}
            color={darkGrey}
            buttonStyle={{height: '10em'}}
            textStyle={{color: getSecondary(), fontWeight: '700', textTransform: 'none', fontSize: '0.9em'}}
            textPosition="after"
        />
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
    <Grid style={{width: '90%'}} spacing={8}>
        <GridItem xs={12} md={6} lg={3}>
            <Link to={`/company/${company.id}/settings`} style={{padding: '0.2em'}}>
                <Block>
                    {translate.edit_company && translate.edit_company.toUpperCase()}
                    <Icon className="material-icons" style={{fontSize: '2em', marginLeft: '1.5em', color: 'white'}}>work</Icon>          
                </Block>
            </Link>
        </GridItem>

        <GridItem xs={12} md={6} lg={3}>
            <Link to={`/company/${company.id}/statutes`}> 
                <Block button={estatutesButton}>
                    {translate.statutes && translate.statutes.toUpperCase()}
                    <Icon className="material-icons" style={{fontSize: '2em', marginLeft: '1.5em', color: 'white'}}>gavel</Icon>
                </Block>
            </Link>
        </GridItem>

        <GridItem xs={12} md={6} lg={3}>   
            <Link to={`/company/${company.id}/censuses`}> 
                <Block button={censusesButton}>
                    {translate.censuses && translate.censuses.toUpperCase()}
                    <Icon className="material-icons" style={{fontSize: '2em', marginLeft: '1.5em', color: 'white'}}>person</Icon>
                </Block>
            </Link>
        </GridItem>

        <GridItem xs={12} md={6} lg={3}>
            <Link to={`/company/${company.id}/drafts`}>
                <Block>
                    {translate.drafts && translate.drafts.toUpperCase()}
                    <Icon className="material-icons" style={{fontSize: '2em', marginLeft: '1.5em', color: 'white'}}>class</Icon>
                </Block>
            </Link>
        </GridItem>
    </Grid>
)

export default TopSectionBlocks;