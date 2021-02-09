import React from 'react';
import { graphql } from 'react-apollo';
import CompanyDraftForm from '../../company/drafts/CompanyDraftForm';
import { CardPageLayout, BasicButton, ButtonIcon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { checkRequiredFields } from '../../../utils/CBX';
import { createCorporationDraft } from '../../../queries';


export const company_types = [{
    company_type: 0, //'s_a'
    statutes: [{
        prototype: 1,
        title: 'ordinary_general_assembly',
    }, {
        prototype: 2,
        title: 'special_general_assembly'
    }, {
        prototype: 3,
        title: 'board_of_directors',
    }]
}, {
    company_type: 1, //'s_l'
    statutes: [{
        prototype: 4,
        title: 'ordinary_general_assembly',
    }, {
        prototype: 5,
        title: 'special_general_assembly',
    }, {
        prototype: 6,
        title: 'board_of_directors',
    }]
}, {
    company_type: 2, //'s_coop'
    statutes: [{
        prototype: 7,
        title: 'ordinary_general_assembly',
    }, {
        prototype: 8,
        title: 'special_general_assembly',
    }, {
        prototype: 9,
        title: 'board_of_directors',
    }]
}, {
    company_type: 3, //'professional_association'
    statutes: [{
        prototype: 10,
        title: 'ordinary_general_assembly_association',
    }, {
        prototype: 11,
        title: 'special_general_assembly_association',
    }, {
        prototype: 12,
        title: 'council_of_directors_association',
    }, {
        prototype: 13,
        title: 'executive_committee',
    }]
}, {
    company_type: 4, //'association'
    statutes: [{
        prototype: 14,
        title: 'ordinary_general_assembly_association',
    }, {
        prototype: 15,
        title: 'special_general_assembly_association',
    }, {
        prototype: 16,
        title: 'council_of_directors_association',
    }, {
        prototype: 17,
        title: 'executive_committee',
    }]
}, {
    company_type: 5, //'other'
    statutes: [{
        prototype: 18,
        title: 'default_census_name',
    }]
}];

export const getRootStatutes = companyType => {
    let rootStatutes = company_types[0].statutes;
    const filterStatutes = company_types.filter(list => list.company_type === companyType);

    if(filterStatutes && filterStatutes.length > 0){
        rootStatutes = filterStatutes[0].statutes;
    }

    return rootStatutes;
};


class NewCorporationDraft extends React.PureComponent {
    state = {
        data: {
            title: '',
            statuteId: -1,
            type: -1,
            description: '',
            text: '',
            companyType: 0,
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

    updateState = (object) => {
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
				title: '',
				statuteId: -1,
                type: -1,
                language: 'es',
                corporationId: 1,
				description: '',
				text: '',
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
					draft
				}
			});

			if (!response.errors) {
				this.setState({ success: true });
				this.timeout = setTimeout(() => this.resetAndClose(), 2000);
			}
		}
    };


    render(){
        const rootStatutes = getRootStatutes(this.state.data.companyId);

        return(
            <CardPageLayout title={this.props.translate.drafts_new}>
                <CompanyDraftForm
                    rootStatutes={rootStatutes}
                    draft={this.state.data}
                    errors={this.state.errors}
                    translate={this.props.translate}
                    updateState={this.updateState}
                    {...this.props.data}
                />
                <div style={{ marginTop: '0.8em' }}>
                    <BasicButton
                        floatRight
                        text={this.props.translate.save}
                        color={getPrimary()}
                        loading={this.state.loading}
                        success={this.state.success}
                        textStyle={{
                            color: 'white',
                            fontWeight: '700'
                        }}
                        onClick={() => this.createCorporationDraft()}
                        icon={<ButtonIcon type="save" color="white" />}
                    />
                </div>
            </CardPageLayout>
        );
    }
}

export default graphql(createCorporationDraft, {
    name: 'createCorporationDraft',
    options: {
        errorPolicy: 'all'
    }
})(NewCorporationDraft);
