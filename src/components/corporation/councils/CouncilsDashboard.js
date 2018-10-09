import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, CollapsibleSection, BasicButton, Scrollbar } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { lightGrey, getSecondary } from '../../../styles/colors';
import FontAwesome from 'react-fontawesome';
import { Card } from 'material-ui';
import CouncilItem from './CouncilItem';
import CouncilsSectionTrigger from './CouncilsSectionTrigger';


class CouncilsDashboard extends React.PureComponent {

    _convenedTrigger = () => {
        return(
            <CouncilsSectionTrigger
                text={this.props.translate.companies_calendar}
                icon={'calendar-o'}
                description={this.props.translate.companies_calendar_desc}
            />
        )
    }

    _convenedSection = () => {
        return (
            <div style={{width: '100%'}}>
                {this.props.data.corporationCouncils.map(council => {
                    if(council.state === 10){
                        return (
                            <CouncilItem
                                key={`council_${council.id}`}
                                council={council}
                            />
                        )
                    }
                    return false;
                })}
            </div>
        )
    }

    _celebrationTrigger = () => {
        return(
            <CouncilsSectionTrigger
                text={this.props.translate.companies_live}
                icon={'users'}
                description={this.props.translate.companies_live_desc}
            />
        )
    }

    _celebrationSection = () => {
        return (
            <div style={{width: '100%'}}>
                {this.props.data.corporationCouncils.map(council => {
                    if(council.state === 20){
                        return (
                            <CouncilItem
                                key={`council_${council.id}`}
                                council={council}
                            />
                        )
                    }
                    return false;
                })}
            </div>
        )
    }

    render(){

        return(
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: lightGrey,
                }}
            >
                <Scrollbar>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '1.4em'
                        }}
                    >
                        <BasicButton
                            icon={
                                <FontAwesome
                                    name={'refresh'}
                                    style={{
                                        color: getSecondary()
                                    }}
                                />
                            }
                            onClick={() => this.props.data.refetch()}
                        />
                    </div>
                    {this.props.data.loading?
                        <LoadingSection />

                    :
                        <React.Fragment>
                            <Card style={{margin: '1.4em'}}>
                                <CollapsibleSection trigger={this._convenedTrigger} collapse={this._convenedSection} />
                            </Card>
                            {/*<Card style={{margin: '1.4em'}}>
                                <CollapsibleSection trigger={this._celebrationTrigger} collapse={this._celebrationSection} />
                            </Card> */}
                        </React.Fragment>
                    }
                </Scrollbar>
            </div>
        )
    }
}

const corporationCouncils = gql`
    query corporationCouncils{
        corporationCouncils{
            id
            name
            state
            dateStart
            councilType
            prototype
            participants {
                id
            }
            company{
                businessName
            }
        }
    }
`;

export default graphql(corporationCouncils)(withTranslations()(CouncilsDashboard));