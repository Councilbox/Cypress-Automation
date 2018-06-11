import React from 'react';
import { graphql } from 'react-apollo';
import { councilActEmail } from '../../../../queries';
import { LoadingSection } from '../../../../displayComponents';

class ActHTML extends React.Component {

    componentDidMount(){
        this.props.data.refetch();
    }

    render(){
        if(this.props.data.loading){
            return (
                <LoadingSection />
            );
        }
    
        return(
            <div style={{width: '100%'}}>
                <div dangerouslySetInnerHTML={{__html: this.props.data.councilAct.emailAct}} />
            </div>
        )	
    }
}

export default graphql(councilActEmail, {
    options: props => ({
        variables: {
            councilId: props.council.id
        },
        notifyOnNetworkStatusChange: true
    })
})(ActHTML);