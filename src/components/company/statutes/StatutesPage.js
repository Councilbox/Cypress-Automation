import React, { Component, Fragment } from 'react';
import withSharedProps from '../../../HOCs/withSharedProps';
import { graphql, compose } from 'react-apollo';
import {
    LoadingSection,
    CardPageLayout,
    SelectInput,
    TextInput,
    Grid,
    AlertConfirm,
    GridItem,
    BasicButton,
    ButtonIcon,
    DeleteIcon
} from '../../displayComponents/index';
import { MenuItem } from 'material-ui';
import { statutes, updateStatute, deleteStatute, createStatute } from '../../../queries';
import { getPrimary } from '../../../styles/colors';
import { withRouter } from 'react-router-dom';
import StatuteEditor from './StatuteEditor';
import VTabs from "../../displayComponents/VTabs";

class StatutesPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedStatute: 0,
            newStatute: false,
            newStatuteName: '',
            statute: {},
            success: false,
            requestError: false,
            requesting: false,
            unsavedChanges: false,
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data.loading && !nextProps.data.loading) {
            this.setState({
                statute: {
                    ...nextProps.data.companyStatutes[ this.state.selectedStatute ]
                }
            });
        }
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    resetButtonStates = () => {
        this.setState({
            error: false,
            loading: false,
            success: false
        });
    };

    updateStatute = async () => {
        if (!this.checkRequiredFields()) {
            this.setState({
                loading: true
            });
            const { __typename, ...data } = this.state.statute;

            const response = await this.props.updateStatute({
                variables: {
                    statute: data
                }
            });
            if (response.errors) {
                this.setState({
                    error: true,
                    loading: false,
                    success: false
                });
            } else {
                this.setState({
                    error: false,
                    loading: false,
                    success: true,
                    unsavedChanges: false
                });
            }
        }
    };

    deleteStatute = async () => {
        const { id } = this.state.statute;
        const response = await this.props.deleteStatute({
            variables: {
                statuteId: id
            }
        });
        if (response) {
            this.props.data.refetch();
            this.setState({
                statute: this.props.data.companyStatutes[ 0 ],
                selectedStatute: 0
            })
        }
    };

    checkRequiredFields() {
        return false;
    }

    createStatute = async () => {
        if (this.state.newStatuteName) {
            const statute = {
                title: this.state.newStatuteName,
                companyId: this.props.company.id
            };
            const response = await this.props.createStatute({
                variables: {
                    statute: statute
                }
            });
            if (!response.errors) {
                const updated = await this.props.data.refetch();
                if (updated) {
                    this.setState({
                        newStatute: false
                    });
                    this.handleStatuteChange(this.props.data.companyStatutes.length - 1);
                }
            }
        } else {
            this.setState({
                errors: {
                    ...this.state.errors,
                    newStatuteName: this.props.translate.required_field
                }
            })
        }
    };

    updateState = (object) => {
        this.setState({
            statute: {
                ...this.state.statute,
                ...object
            },
            unsavedChanges: true
        })
    };

    handleStatuteChange = (index) => {
        if (!this.state.unsavedChanges) {
            this.setState({
                statute: null
            }, () => this.setState({
                selectedStatute: index,
                statute: {
                    ...this.props.data.companyStatutes[ index ]
                }
            }));
        } else {
            alert('tienes cambios sin guardar');
        }
    };

    showNewStatute = () => this.setState({ newStatute: true });

    render() {
        const { loading, companyStatutes } = this.props.data;
        const { translate } = this.props;
        const { statute, success, requesting, requestError, errors } = this.state;

        if (loading) {
            return <LoadingSection/>
        }

        let tabs = [];
        for (let i = 0; i < companyStatutes.length; i++) {
            const companyStatute = companyStatutes[ i ];
            tabs.push({
                title: translate[ companyStatute.title ] || companyStatute.title,
                data: companyStatute,
                active: (i === this.state.selectedStatute)
            })
        }

        return (<CardPageLayout
            title={translate.statutes}>
                <VTabs tabs={tabs}
                       changeTab={this.handleStatuteChange}
                       additionalTab={{
                           title: translate.add_council_type,
                           action: this.showNewStatute
                       }}>
                    <div className="container-fluid">
                        {!!statute && <Fragment>
                                <Grid alignContent="flex-end">
                                    <GridItem xs={6} md={4} lg={4}>
                                        <BasicButton
                                            text={translate.save}
                                            color={getPrimary()}
                                            error={requestError}
                                            success={success}
                                            reset={this.resetButtonStates}
                                            loading={requesting}
                                            textStyle={{
                                                color: 'white',
                                                fontWeight: '700'
                                            }}
                                            onClick={this.updateStatute}
                                            icon={<ButtonIcon type="save" color='white'/>}
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={2} lg={2}>
                                        <DeleteIcon
                                            onClick={() => this.deleteStatute(statute.id)}
                                        />
                                    </GridItem>
                                </Grid>
                            <div style={{width: 'calc(100% - 8px)'}}>
                                <StatuteEditor
                                    statute={statute}
                                    translate={translate}
                                    updateState={this.updateState}
                                    errors={this.state.errors}
                                />
                            </div>


                            <AlertConfirm
                                requestClose={() => this.setState({ newStatute: false })}
                                open={this.state.newStatute}
                                acceptAction={this.createStatute}
                                buttonAccept={translate.accept}
                                buttonCancel={translate.cancel}
                                bodyText={
                                    <TextInput
                                        floatingText={translate.council_type}
                                        required
                                        type="text"
                                        errorText={errors.newStatuteName}
                                        value={statute.newStatuteName}
                                        onChange={(event) => this.setState({
                                            newStatuteName: event.target.value
                                        })}/>
                                }
                                title={translate.add_council_type}
                            />
                        </Fragment>}
                    </div>
                </VTabs>
            </CardPageLayout>)
    }
}


export default withSharedProps()(withRouter(compose(graphql(updateStatute, {
    name: 'updateStatute'
}), graphql(deleteStatute, {
    name: 'deleteStatute'
}), graphql(createStatute, {
    name: 'createStatute'
}), graphql(statutes, {
    options: (props) => ({
        variables: {
            companyId: props.match.params.company
        },
        notifyOnNetworkStatusChange: true
    })
}))(StatutesPage)));