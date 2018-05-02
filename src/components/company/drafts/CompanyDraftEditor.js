import React, { Component } from 'react';
import { CardPageLayout, BasicButton, ButtonIcon } from '../../../displayComponents';
import CompanyDraftForm from './CompanyDraftForm';
import withTranslations from '../../../HOCs/withTranslations';
import { graphql } from 'react-apollo';
import { createCompanyDraft } from '../../../queries';
import gql from "graphql-tag";
import { compose } from "react-apollo/index";
import { checkRequiredFields } from "../../../utils/CBX";
import { withRouter } from "react-router-dom";
import { getPrimary } from "../../../styles/colors";

const getData = gql`
  query getData($companyId: Int!, $id: Int!){
    companyDraft(id: $id){
      id
      userId
      companyId
      title
      description
      text
      type
      votationType
      majorityType
      majority
      statuteId
      companyType
      language
      draftId
      creationDate
      lastModificationDate
      corporationId
      majorityDivider
    }
    companyStatutes(companyId: $companyId){
      id
      title
    }
    majorityTypes{
      label
      value
    }
    draftTypes {
      label
      value
    }
    votingTypes {
      label
      value
    }
  }
`;

class CompanyDraftEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            data: nextProps.data.companyDraft
        }
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data, ...object
            }
        })
    };

    updateCompanyDraft = async () => {
        const { translate } = this.props;
        const { draft } = this.state;

        if (!checkRequiredFields(translate, draft, this.setState)) {
            const { data } = this.state;
            this.setState({ loading: true });
            const response = await this.props.updateCompanyDraft({
                variables: {
                    draft: {
                        title: data.title,
                        statuteId: data.statuteId,
                        type: data.type,
                        description: data.description,
                        text: data.text,
                        votationType: data.votationType,
                        majorityType: data.majorityType,
                        majority: data.majority,
                        majorityDivider: data.majorityDivider,
                        companyId: this.props.company.id
                    }
                }
            });

            if (!response.errors) {
                this.setState({ success: true });
                this.props.requestClose();
            }
        }
    };

    checkRequiredFields() {
        return false;
    }

    saveDraft = async () => {
        console.log(this.state.data);
    };

    render() {
        const { translate } = this.props;

        return (

            <CardPageLayout title={translate.edit_draft}>
                {!this.props.data.loading && (

                    <div>
                        <div style={{ marginTop: '1.8em' }}>
                            <CompanyDraftForm
                                translate={translate}
                                errors={{}}
                                updateState={this.updateState}
                                draft={this.state.data}
                                companyStatutes={this.props.data.companyStatutes}
                                draftTypes={this.props.data.draftTypes}
                                votingTypes={this.props.data.votingTypes}
                                majorityTypes={this.props.data.majorityTypes}
                            />
                        </div>
                        <br/>
                        <BasicButton
                            text={translate.save}
                            color={getPrimary()}
                            loading={this.state.loading}
                            success={this.state.success}
                            textStyle={{
                                color: 'white',
                                fontWeight: '700'
                            }}
                            floatRight
                            onClick={() => this.createCompanyDraft()}
                            icon={<ButtonIcon type="save" color='white'/>}
                        />
                    </div>

                )}
            </CardPageLayout>);
    }
}

export default compose(graphql(getData, {
    name: "data",
    options: (props) => ({
        variables: {
            id: props.match.params.id,
            companyId: props.match.params.company
        },
        notifyOnNetworkStatusChange: true
    })
}), graphql(createCompanyDraft, { name: 'updateCompanyDraft' }))(withRouter(withTranslations(CompanyDraftEditor)));