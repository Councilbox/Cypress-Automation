import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { census } from '../../../../queries';
import { LoadingSection, CardPageLayout, TextInput, SelectInput, Grid, GridItem } from '../../../../displayComponents';
import { MenuItem } from 'material-ui';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { withRouter } from 'react-router-dom';
import CensusParticipants from './CensusParticipants';


class CensusEditorPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                censusName: '',
                censusDescription: ''
            },
            errors: {},
            filterBy: ''
        }
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.data.loading){
            if(this.state.data.id !== nextProps.data.census.id){
                this.setState({
                    data: {
                        ...nextProps.data.census,
                        censusDescription: nextProps.data.census.censusDescription || ''
                    }
                });
            }
        }
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    render(){
        const { translate } = this.props;
        const { loading } = this.props.data;
        const census = this.state.data;
        const errors = this.state.errors;

        return(
            <CardPageLayout title={translate.census}>
                <Grid>
                    <GridItem lg={6} md={6} xs={12}>
                        <TextInput
                            floatingText={translate.name}
                            required
                            type="text"
                            errorText={errors.censusName}
                            value={census.censusName}
                            onChange={(event) => {
                                this.updateState({
                                    censusName: event.target.value
                                })
                            }}
                        />
                    </GridItem>
                    <GridItem lg={6} md={6} xs={12}>
                        <SelectInput
                            floatingText={translate.census_type}
                            value={census.quorumPrototype}
                            onChange={(event, child) => {
                                this.updateState({
                                    quorumPrototype: event.target.value
                                }) 
                            }}
                        >
                            <MenuItem value={0}>{translate.census_type_assistants}</MenuItem>
                            <MenuItem value={1}>{translate.social_capital}</MenuItem>    
                        </SelectInput>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <TextInput
                            floatingText={translate.description}
                            required
                            type="text"
                            errorText={errors.censusDescription}
                            value={census.censusDescription}
                            onChange={(event) => {
                                this.updateState({
                                    censusDescription: event.target.value
                                })
                            }}
                        />
                    </GridItem>
                </Grid>
                {loading?
                    <LoadingSection />
                :
                    <CensusParticipants
                        translate={translate}
                        census={census}
                        company={this.props.company}
                    />
                }
            </CardPageLayout>
        );
    }
}

export default withSharedProps()(withRouter(graphql(census, {
    options: (props) => ({
        variables: {
            id: props.match.params.id
        }
    })
})(CensusEditorPage)));