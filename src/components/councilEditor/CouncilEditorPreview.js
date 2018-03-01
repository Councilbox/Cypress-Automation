import React, { Component } from 'react';
import { BasicButton, LoadingSection } from "../displayComponents";
import { getPrimary, getSecondary } from '../../styles/colors';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { urlParser } from '../../utils';
import { getCouncilDataStepSix, sendConvene } from '../../queries';

class CouncilEditorPreview extends Component {

    componentDidMount(){
        this.props.data.refetch();
    }

    send = async () => {
        this.props.data.loading = true;
        const response = await this.props.mutate({
            variables: {
                data: urlParser({data: {
                    council: this.props.data.council.council
                }})
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
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.send}
                />
                <div
                    dangerouslySetInnerHTML={{__html: this.props.data.council.previewHtml}}
                    style={{border: `1px solid ${getSecondary()}`, padding: '2em'}} 
                />
            </div>
        );
    }
}

export default compose(
    graphql(sendConvene), 
    
    graphql(getCouncilDataStepSix, {
        name: "data",
        options: (props) => ({
            variables: {
                councilInfo: {
                    companyID: props.companyID,
                    councilID: props.councilID,
                    step: 6
                }
            }
        })
    })
)(withRouter(CouncilEditorPreview));