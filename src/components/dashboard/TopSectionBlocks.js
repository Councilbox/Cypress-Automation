import React from 'react';
import { getPrimary, getSecondary, darkGrey, lightGrey } from '../../styles/colors';
import { BasicButton, Icon, Grid, GridItem, DropDownMenu, Link } from '../../displayComponents';
import { MenuItem } from 'material-ui';

const Block = ({ children, button, link }) => (
    <React.Fragment>
        <Link to={link} >
            <BasicButton
                text={
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%'}}>
                        {children}
                    </div>
                }
                fullWidth={true}
                color={darkGrey}
                buttonStyle={{height: '10em'}}
                textStyle={{color: getSecondary(), fontWeight: '700', textTransform: 'none', fontSize: '0.9em'}}
                textPosition="after"
            />
        </Link>
        {button &&
            <div style={{display: 'flex', alignItems: 'center', fontWeight: '700'}}>
                {button}
            </div>
        }
    </React.Fragment>
);

const CompaniesManagerButton = ({ translate, company }) => (
    <DropDownMenu
        color="transparent"
        textStyle={{
            margin: 0,
            width: '100%',
            padding: 0
        }}
        text={
            <BasicButton
                text={translate.link_companies}
                fullWidth={true}
                color={getSecondary()}
                textStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
                textPosition="after"
                icon={<Icon className="material-icons" style={{color: 'white'}}>control_point</Icon>}
            />
        }
        type="flat"
        items={
            <React.Fragment>
                <MenuItem>
                    <Link to={`/company/${company.id}/create`}>
                        {translate.companies_add}
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link to={`/company/${company.id}/link`}>
                        {translate.companies_link}
                    </Link>
                </MenuItem>
            </React.Fragment>
        }
    />
);

const TopSectionBlocks = ({ translate, company }) => (
    <Grid style={{width: '90%', marginTop:'4vh'}} spacing={8}>
        <GridItem xs={12} md={6} lg={3}>
            <Block
                link={`/company/${company.id}/settings`}
                button={<CompaniesManagerButton translate={translate} company={company} />}
            >
                {translate.edit_company && translate.edit_company.toUpperCase()}
                <Icon className="material-icons" style={{fontSize: '1.8em', color: 'white'}}>work</Icon>
            </Block>
        </GridItem>

        <GridItem xs={12} md={6} lg={3}>
            <Block
                link={`/company/${company.id}/statutes`}
            >
                {translate.statutes && translate.statutes.toUpperCase()}
                <Icon className="material-icons" style={{fontSize: '1.8em', color: 'white'}}>gavel</Icon>
            </Block>
        </GridItem>

        <GridItem xs={12} md={6} lg={3}>   
            <Block
                link={`/company/${company.id}/censuses`}
            >
                {translate.censuses && translate.censuses.toUpperCase()}
                <Icon className="material-icons" style={{fontSize: '1.8em', color: 'white'}}>person</Icon>
            </Block>
        </GridItem>

        <GridItem xs={12} md={6} lg={3}>
            <Block
                link={`/company/${company.id}/drafts`}
            >
                {translate.drafts && translate.drafts.toUpperCase()}
                <Icon className="material-icons" style={{fontSize: '1.8em', color: 'white'}}>class</Icon>
            </Block>
        </GridItem>
    </Grid>
);

export default TopSectionBlocks;