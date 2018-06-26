import React from 'react';
import { TextInput, DropDownMenu } from '../../displayComponents';
import { COMMANDS } from '../../commands'; 
import { MenuItem } from 'material-ui';

class CommandLine extends React.Component {

    state = {
        command: ''
    }

    updateCommand = (event) => {
        this.setState({
            command: event.target.value
        });
    }

    render(){

        return(
            <div style={{maxWidth: '180px'}}>
                <DropDownMenu
                    Component={ () =>
                        <TextInput
                            value={this.state.command}
                            onChange={this.updateCommand}
                        />
                    }
                    id="commandLine"
                    items={COMMANDS.map(command => (
                        <MenuItem>
                            {`${command.section} - ${command.command}`}
                        </MenuItem>
                    ))}
               />
            </div>
        )
    }
}


export default CommandLine;