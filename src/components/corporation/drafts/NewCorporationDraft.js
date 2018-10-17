import React from 'react';
import CompanyDraftForm from '../../company/drafts/CompanyDraftForm';
import { CardPageLayout, BasicButton, ButtonIcon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { graphql } from 'react-apollo';
import { checkRequiredFields } from "../../../utils/CBX";
import { createCorporationDraft } from "../../../queries";


class NewCorporationDraft extends React.PureComponent {

    state = {
        data: {
            title: "",
            statuteId: -1,
            type: -1,
            description: "",
            text: "",
            language: 'es',
            corporationId: 1,
            votationType: -1,
            majorityType: -1,
            majority: null,
            majorityDivider: null,
        },
        errors: {},
        loading: false,
        success: false,
    }

    updateState = (object) =>  {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    updateErrors = errors => {
		this.setState({
			errors
		});
    };

    resetAndClose = () => {
		clearTimeout(this.timeout);
		this.setState({
			errors: {},
			draft: {
				title: "",
				statuteId: -1,
                type: -1,
                language: 'es',
                corporationId: 1,
				description: "",
				text: "",
				votationType: -1,
				majorityType: -1,
				majority: null,
				majorityDivider: null,
			},
			loading: false,
			success: false
		});
		this.props.requestClose();
	};

    createCorporationDraft = async () => {
		const { translate } = this.props;
		const draft = this.state.data;
		if (!checkRequiredFields(translate, draft, this.updateErrors, true)) {
			this.setState({ loading: true });
			const response = await this.props.createCorporationDraft({
				variables: {
					draft: draft
				}
			});

			if (!response.errors) {
				this.setState({ success: true });
				this.timeout = setTimeout(() => this.resetAndClose(), 2000);
			}
		}
    };


    render(){

        return(
            <CardPageLayout title={this.props.translate.drafts_new}>
                <CompanyDraftForm
                    draft={this.state.data}
                    errors={this.state.errors}
                    translate={this.props.translate}
                    updateState={this.updateState}
                    {...this.props.data}
                />
                <div style={{marginTop: '0.8em'}}>
                    <BasicButton
                        floatRight
                        text={this.props.translate.save}
                        color={getPrimary()}
                        loading={this.state.loading}
                        success={this.state.success}
                        textStyle={{
                            color: "white",
                            fontWeight: "700"
                        }}
                        onClick={() => this.createCorporationDraft()}
                        icon={<ButtonIcon type="save" color="white" />}
                    />
                </div>
            </CardPageLayout>
        )
    }
}

export default graphql(createCorporationDraft, {
    name: "createCorporationDraft",
    options: {
        errorPolicy: "all"
    }
})(NewCorporationDraft);