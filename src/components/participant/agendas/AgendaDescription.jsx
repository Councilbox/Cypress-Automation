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
        return(
            <CollapsibleSection
                trigger={() =>
                    <span onClick={this.toggle} style={{fontSize: '14px'}}>Ver descripcion</span>
                }
                open={this.state.open}
                onTriggerClick={() => {}}
                collapse={() =>
                    <div dangerouslySetInnerHTML={{__html: 'df dgfsfdasdfvd fsddfadfcv sdfs sdfsdfs dfs dfs df sdfsfd s dfsdfsfsdfs dfs dfsf sdfsfdsdf  sdfsdf sd sdfsdf sdfs df   sdf  dfsdf sdfs sdfs fs fsdf df  sdf s sd sdf sdf sdf sdf sdfsdfs fsd fsdfsdfsdf s sd fsdf sdf sdfsdfsdfsdf sdf sdf sdfsdfs dfsdf dfweqrs dfwe fsdfwee'}}></div>
                }
            />
        )
    }
}

export default AgendaDescription;
