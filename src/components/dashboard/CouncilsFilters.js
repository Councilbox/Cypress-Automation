import React from 'react';
import { TextInput, Icon } from '../../displayComponents';


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
            <div style={{width: '100%', float: 'right', paddingRight: '1.2em'}}>
                <TextInput
                    adornment={<Icon>search</Icon>}
                    floatingText={" "}
                    type="text"
                    value={this.state.filterText}
                    onChange={event => {
                        this.updateFilterText(event.target.value);
                    }}
                />
            </div>
        )
    }
}

export default CouncilsFilters;