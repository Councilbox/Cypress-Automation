import React from 'react';
import { COMMANDS } from '../../commands'; 
import Autosuggest from 'react-autosuggest';
import { bHistory } from '../../containers/App';
import withSharedProps from '../../HOCs/withSharedProps';
import '../../styles/autoSuggest.css';


const renderSuggestion = suggestion => (
    <div>
        {`${suggestion.section} - ${suggestion.command}`}
    </div>
);

const getSuggestionValue = suggestion => {
    console.log(suggestion)
    return suggestion.link;
}

class CommandLine extends React.Component {

    state = {
        command: '',
        suggestions: COMMANDS
    }

    updateCommand = (event) => {
        this.setState({
            command: event.target.value
        });
    }

    onSuggestionsFetchRequested = ({ value }) => {
        const filteredCommands = COMMANDS.filter(command => (
            command.section.toLowerCase().includes(value.toLowerCase()) || command.command.toLowerCase().includes(value.toLowerCase())
        ));

        this.setState({
            suggestions: filteredCommands
        });
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: COMMANDS
        })
    }

    onSuggestionSelected = (event, suggestion) => {
        console.log(suggestion);
        let link = suggestion.suggestionValue.replace('{{companyId}}', this.props.company.id);
        link = link.replace('{{userId}}', this.props.user.id);
        bHistory.push(`${link}`);
        this.setState({
            command: ``
        });
    }

    render(){
        const inputProps = {
            placeholder: 'Introduce un comando o acción', //TRADUCCION
            value: this.state.command,
            onChange: this.updateCommand
        };

        return(
            <div style={{maxWidth: '180px'}}>
                <Autosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        )
    }
}


export default withSharedProps()(CommandLine);