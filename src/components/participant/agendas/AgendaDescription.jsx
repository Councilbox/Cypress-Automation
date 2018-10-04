import React from 'react';
import { CollapsibleSection } from '../../../displayComponents';

class AgendaDescription extends React.Component {

    state = {
        open: false
    }

    toggle = () => {
        this.setState({
            open: !this.state.open
        });
    }

    render(){
        if(!this.props.agenda.description){
            return 'Sin descripción'; //TRADUCCION
        }

        return(
            <CollapsibleSection
                trigger={() =>
                    <span onClick={this.toggle} style={{fontSize: '14px'}} /**TRADUCCION*/>Ver descripcion</span>
                }
                open={this.state.open}
                onTriggerClick={() => {}}
                collapse={() =>
                    <div dangerouslySetInnerHTML={{__html: this.props.agenda.description}}></div>
                }
            />
        )
    }
}

export default AgendaDescription;
