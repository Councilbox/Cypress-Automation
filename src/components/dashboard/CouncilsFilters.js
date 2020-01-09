import React from 'react';
import { TextInput, Icon } from '../../displayComponents';


class CouncilsFilters extends React.Component {

    state = {
        filterText: ''
    }

    updateFilterText = text => {
        this.props.refetch({
            filters: [{ field: 'name', text: text }]
        });

        this.setState({
            filterText: text
        });
    }


    render() {
        return (
            <div style={{ width: '100%', float: 'right', paddingRight: '1.2em' }}>
                <TextInput
                    placeholder={this.props.translate.search}
                    adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
                    type="text"
                    value={this.state.filterText || ""}
                    styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                    disableUnderline={true}
                    stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                    onChange={event => {
                        this.updateFilterText(event.target.value);
                    }}
                />
                {/* <TextInput
                    adornment={<Icon>search</Icon>}
                    floatingText={" "}
                    type="text"
                    value={this.state.filterText}
                    onChange={event => {
                        this.updateFilterText(event.target.value);
                    }}
                /> */}
            </div>
        )
    }
}

export default CouncilsFilters;