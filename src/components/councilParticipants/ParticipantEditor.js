import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { TextInput, SelectField, Grid, GridItem } from '../displayComponents';

class ParticipantEditor extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {

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
        return(
            <Grid>

            </Grid>
        )
    }
}

export default ParticipantEditor;