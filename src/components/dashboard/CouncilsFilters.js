import React from 'react';
import { TextInput, Grid, GridItem, Icon } from '../../displayComponents';


class CouncilsFilters extends React.Component {

    state = {
        filterText: ''
    }

	updateFilterText = text => {
		this.props.refetch({
			filters: [{field: 'name', text: text}]
        });

        this.setState({
            filterText: text
        });
	}


    render(){
        return(
            <Grid style={{paddingRight: '1.2em'}}>
                <GridItem xs={0} md={9} lg={9}>

                </GridItem>
                <GridItem xs={12} md={3} lg={3}>
                    <TextInput
                        adornment={<Icon>search</Icon>}
                        floatingText={" "}
                        type="text"
                        value={this.state.filterText}
                        onChange={event => {
                            this.updateFilterText(event.target.value);
                        }}
                    />
                </GridItem>
            </Grid>
        )
    }
}

export default CouncilsFilters;