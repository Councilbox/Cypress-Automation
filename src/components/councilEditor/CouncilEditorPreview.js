import React, { Component } from 'react';
import { BasicButton, LoadingSection } from "../displayComponents";
import { getPrimary } from '../../styles/colors';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { councilStepSix, conveneCouncil } from '../../queries';

class CouncilEditorPreview extends Component {

    componentDidMount(){
        this.props.data.refetch();
    }

    send = async () => {
        const { __typename, ...council } = this.props.data.council;
        this.props.data.loading = true;
        const response = await this.props.mutate({
            variables: {
                council: council
            }
        });

        if(response){
            
        }

    }

    render(){
        const { translate } = this.props;
        const primary = getPrimary();

        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <div style={{float: 'right'}}>
                    <BasicButton
                        text={translate.previous}
                        color={primary}
                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                        textPosition="after"
                        onClick={this.props.previousStep}
                    />
                    <BasicButton
                        text={translate.new_save_and_send}
                        color={primary}
                        textStyle={{color: 'white', fontWeight: '700', marginLeft: '0.3em', fontSize: '0.9em', textTransform: 'none'}}
                        textPosition="after"
                        onClick={this.send}
                    />
                </div>
                {<div
                    dangerouslySetInnerHTML={{__html: this.props.data.councilPreviewHTML}}
                    style={{padding: '2em'}} 
                />}
            </div>
        );
    }
}

export default compose(
    graphql(conveneCouncil), 
    
    graphql(councilStepSix, {
        name: "data",
        options: (props) => ({
            variables: {
                id: props.councilID,
                companyId: props.companyID
            }
        })
    })
)(withRouter(CouncilEditorPreview));
