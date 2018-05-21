import React from 'react';
import { getPrimary, getSecondary, darkGrey, lightGrey } from '../../styles/colors';
import { BasicButton, Icon, Grid, GridItem } from '../../displayComponents';
import { Link } from 'react-router-dom';

const Block = ({ children, button, link }) => (
    <React.Fragment>
        <Link to={link} >
            <BasicButton
                text={children}
                fullWidth={true}
                color={darkGrey}
                buttonStyle={{height: '10em'}}
                textStyle={{color: getSecondary(), fontWeight: '700', textTransform: 'none', fontSize: '0.9em'}}
                textPosition="after"
            />
        </Link>
        {button &&
            <div style={{display: 'flex', alignItems: 'center', backgroundColor: getPrimary(), border: `1px solid ${lightGrey}`, color: 'white', fontWeight: '700'}}>
                {button}
            </div>
        }
    </React.Fragment>
);

/*
const statutesButton = () => (
    <BasicButton
        text="Revisa tus estatutos"
        fullWidth={true}
        color={getPrimary()}
        textStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
        textPosition="after"
        icon={<Icon className="material-icons" style={{color: 'white'}}>edit</Icon>}
    />
);

const censusesButton = () => (
    <BasicButton
        text="Crear un censo"
        fullWidth={true}
        color={getSecondary()}
        textStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
        textPosition="after"
        icon={<Icon className="material-icons" style={{color: 'white'}}>control_point</Icon>}
    />
);*/

const CompaniesManagerButton = ({ translate }) => (
    <BasicButton
        text={translate.link_companies}
        fullWidth={true}
        color={getSecondary()}
        textStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
        textPosition="after"
        onClick={(event) => {
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
            alert('jibiri');
        }}
        icon={<Icon className="material-icons" style={{color: 'white'}}>control_point</Icon>}
    />
);

const TopSectionBlocks = ({ translate, company }) => (
    <Grid style={{width: '90%', marginTop:'4vh'}} spacing={8}>
        <GridItem xs={12} md={6} lg={3}>
            <Block
                link={`/company/${company.id}/settings`}
                button={<CompaniesManagerButton translate={translate} />}
            >
                {translate.edit_company && translate.edit_company.toUpperCase()}
                <Icon className="material-icons" style={{fontSize: '2em', color: 'white'}}>work</Icon>
            </Block>
        </GridItem>

        <GridItem xs={12} md={6} lg={3}>
            <Block
                link={`/company/${company.id}/statutes`}
            >
                {translate.statutes && translate.statutes.toUpperCase()}
                <Icon className="material-icons" style={{fontSize: '2em', color: 'white'}}>gavel</Icon>
            </Block>
        </GridItem>

        <GridItem xs={12} md={6} lg={3}>   
            <Block
                link={`/company/${company.id}/censuses`}
            >
                {translate.censuses && translate.censuses.toUpperCase()}
                <Icon className="material-icons" style={{fontSize: '2em', color: 'white'}}>person</Icon>
            </Block>
        </GridItem>

        <GridItem xs={12} md={6} lg={3}>
            <Block
                link={`/company/${company.id}/drafts`}
            >
                {translate.drafts && translate.drafts.toUpperCase()}
                <Icon className="material-icons" style={{fontSize: '2em', color: 'white'}}>class</Icon>
            </Block>
        </GridItem>
    </Grid>
);

export default TopSectionBlocks;