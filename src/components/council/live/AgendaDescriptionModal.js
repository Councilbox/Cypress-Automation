import React from 'react';
import { graphql } from 'react-apollo';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import { Tooltip } from 'material-ui';
import RichTextInput from "../../../displayComponents/RichTextInput";
import { getSecondary } from '../../../styles/colors';
import { changeVariablesToValues } from '../../../utils/CBX';
import withSharedProps from '../../../HOCs/withSharedProps';
import LoadDraft from "../../company/drafts/LoadDraft";
import { updateAgenda } from "../../../queries/agenda";

class AgendaDescriptionModal extends React.Component {

    state = {
        description: '',
        modal: false,
        loading: false,
        loadDraft: false
    }

    closeModal = () => {
        this.setState({
            modal: false
        });
    }

    showModal = () => {
        this.setState({
            modal: true
        });
    }

    updateDescription = value => {
        this.setState({
            description: value
        })
    }

    updateAgenda = async () => {
        this.setState({
            loading: true
        })
        await this.props.updateAgenda({
            variables: {
                agenda: {
                    id: this.props.agenda.id,
                    description: this.state.description,
                    councilId: this.props.council.id
                }
            }
        });

        this.props.refetch();
        this.setState({
            modal: false,
            loading: false
        })
    }

    loadDraft = draft => {
		const correctedText = changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: this.props.council
		});
		this.setState({
            description: correctedText,
            loadDraft: false
        });
		this.editor.setValue(correctedText);
	};

    _renderBody = () => {
        const { translate, council, agenda, company } = this.props;
        const width = window.innerWidth < 800? window.innerWidth : 800;
        return (
            <React.Fragment>
                {this.state.loadDraft &&
                    <LoadDraft
                        translate={this.props.translate}
                        companyId={this.props.company.id}
                        loadDraft={this.loadDraft}
                        statute={this.props.council.statute}
                        statutes={this.props.companyStatutes}
                        draftTypes={this.props.draftTypes}
                        draftType={1}
                    />
                }
                <div style={{width: width, display: this.state.loadDraft && 'none'}}>
                    <RichTextInput
                        ref={editor => (this.editor = editor)}
                        floatingText={translate.description}
                        type="text"
                        translate={translate}
                        loadDraft={
                            <BasicButton
                                text={translate.load_draft}
                                color={getSecondary()}
                                textStyle={{
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "0.8em",
                                    textTransform: "none",
                                    marginLeft: "0.4em",
                                    minHeight: 0,
                                    lineHeight: "1em"
                                }}
                                textPosition="after"
                                onClick={() =>
                                    this.setState({ loadDraft: true })
                                }
                            />
                        }
                        tags={[
                            {
                                value: `${council.street}, ${council.country}`,
                                label: translate.new_location_of_celebrate
                            },
                            {
                                value: company.countryState,
                                label: translate.company_new_country_state
                            },
                            {
                                value: company.city,
                                label: translate.company_new_locality
                            }
                        ]}
                        value={agenda.description}
                        onChange={this.updateDescription}
                    />
                </div>
            </React.Fragment>
        )
    }

    render() {
        return (
            <React.Fragment>
                <Tooltip title={this.props.translate.edit_description}>
                    <i
                        className="fa fa-pencil-square-o"
                        aria-hidden="true"
                        onClick={this.showModal}
                        style={{
                            color: getSecondary(),
                            fontSize: '1.3em',
                            cursor: 'pointer'
                        }}
                    ></i>
                </Tooltip>
                <AlertConfirm
                    requestClose={this.closeModal}
                    open={this.state.modal}
                    loadingAction={this.state.sending}
                    acceptAction={this.updateAgenda}
                    buttonAccept={this.props.translate.accept}
                    loadingAction={this.state.loading}
                    buttonCancel={this.props.translate.close}
                    bodyText={this._renderBody()}
                    title={this.props.translate.edit_description}
                />
            </React.Fragment>
        )
    }
}

export default graphql(updateAgenda, { name: "updateAgenda" })(withSharedProps()(AgendaDescriptionModal));