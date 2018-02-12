import React, { Component } from 'react';
import { FontIcon, MenuItem} from 'material-ui';
import { BasicButton, TextInput, SelectInput, DateTimePicker, RichTextInput, LoadingSection } from "../displayComponents";
import { primary, secondary } from '../../styles/colors';
import PlaceModal from './../PlaceModal';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { getCouncilDataStepSix } from '../../queries';

class CouncilEditorPreview extends Component {

    componentDidMount(){
        this.props.data.refetch();
    }

    send = () => {
        if(true){
            this.props.nextStep();
        }
    }

    render(){
        const { translate } = this.props;

        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <BasicButton
                    text={translate.save}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">save</FontIcon>}
                    textPosition="after"
                    onClick={this.saveAgendas} 
                />

                <BasicButton
                    text={translate.previous}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.props.previousStep}
                />
                <BasicButton
                    text={translate.next}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.nextPage}
                />
                <div
                    dangerouslySetInnerHTML={{__html: this.props.data.council.previewHtml}}
                    style={{border: `1px solid ${secondary}`, padding: '2em'}} 
                />
            </div>
        );
    }
}

export default graphql(getCouncilDataStepSix, {
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
})(withRouter(CouncilEditorPreview));