import React from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { corporationDraft, updateCorporationDraft } from '../../../queries';
import { LoadingSection, CardPageLayout, BasicButton, ButtonIcon } from '../../../displayComponents';
import { checkRequiredFields } from '../../../utils/CBX';
import { getPrimary } from '../../../styles/colors';
import withTranslations from '../../../HOCs/withTranslations';
import CompanyDraftForm from '../../company/drafts/CompanyDraftForm';
import { bHistory } from '../../../containers/App';
import { getRootStatutes } from './NewCorporationDraft';

class DraftEditPage extends React.PureComponent {
    state = {
        data: {},
        errors: {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.data.loading) {
            if (prevState.data.id !== nextProps.data.corporationDraft.id) {
                return {
                    data: {
                        ...nextProps.data.corporationDraft
                    }
                };
            }
        }

        return null;
    }

    updateState = object => {
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
    }

    updateCorporationDraft = async () => {
        const { __typename, ...draft } = this.state.data;
        if (!checkRequiredFields(this.props.translate, draft, this.updateErrors, true)) {
            this.setState({ loading: true });
			const response = await this.props.updateCorporationDraft({
				variables: {
					draft
				}
			});

			if (!response.errors) {
				this.setState({ success: true });
				this.timeout = setTimeout(() => this.reset(), 2000);
			}
		}
    }

    reset = () => {
        this.setState({
            loading: false,
            success: false,
            error: false
        });
    }

    render() {
        if (this.props.data.loading) {
            return <LoadingSection />;
        }

        const rootStatutes = getRootStatutes(this.state.data.companyType);
        return (
            <div style={{ height: 'calc(100vh - 3em)' }}>
                <CardPageLayout title={this.props.translate.drafts_new}>
                    <CompanyDraftForm
                        rootStatutes={rootStatutes}
                        draft={this.state.data}
                        errors={this.state.errors}
                        translate={this.props.translate}
                        updateState={this.updateState}
                        {...this.props.data}
                    />
                    <div style={{ width: '100%', marginTop: '0.9em', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <div>
                            <BasicButton
                                text={this.props.translate.back}
                                color={'white'}
                                textStyle={{
                                    color: 'black',
                                    fontWeight: '700'
                                }}
                                onClick={() => bHistory.push('/drafts')}
                            />
                        </div>
                        <div style={{ marginLeft: '1.2em' }}>
                            <BasicButton
                                text={this.props.translate.save}
                                color={getPrimary()}
                                loading={this.state.loading}
                                success={this.state.success}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: '700'
                                }}
                                onClick={() => this.updateCorporationDraft()}
                                icon={<ButtonIcon type="save" color="white" />}
                            />
                        </div>
                    </div>
                </CardPageLayout>
            </div>
        );
    }
}

export default compose(
    graphql(corporationDraft, {
        options: props => ({
            variables: {
                id: +props.match.params.id
            }
        })
    }),
    graphql(updateCorporationDraft, {
        name: 'updateCorporationDraft'
    })
)(withRouter(withTranslations()(DraftEditPage)));
