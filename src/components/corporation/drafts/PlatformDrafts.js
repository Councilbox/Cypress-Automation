import React, { Component, Fragment } from 'react';
import {
    CardPageLayout, Checkbox, ErrorWrapper, EnhancedTable, AllSelector, BasicButton, ButtonIcon
} from '../../../displayComponents';
import { graphql, compose, withApollo } from 'react-apollo';
import { platformDrafts, cloneDrafts } from '../../../queries';
import { TableCell, TableRow } from "material-ui/Table";
import FontAwesome from 'react-fontawesome';
import { getPrimary, getSecondary } from '../../../styles/colors';
import withSharedProps from '../../../HOCs/withSharedProps';
import { withRouter } from 'react-router-dom';
import PlatformDraftDetails from './PlatformDraftDetails';
import { DRAFTS_LIMITS } from '../../../constants';
import TableStyles from "../../../styles/table";


class PlatformDrafts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1,
            selectedValues: [],
        }
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    alreadySaved = (id) => {
        const { companyDrafts } = this.props.data;
        const item = companyDrafts.list.find((draft) => draft.draftId === id);
        return !!item;
    };

    anySelected = () => {
        const { platformDrafts } = this.props.data;
        const { selectedValues } = this.state;
        for (let i = 0; i < selectedValues.length; i++) {
            const selectedValue = selectedValues[ i ];
            const item = platformDrafts.list.find((draft) => draft.id === selectedValue);
            if (item) {
                return true;
            }
        }
        return false;
    };

    allSelected = () => {
        const { platformDrafts } = this.props.data;
        const { selectedValues } = this.state;

        for (let i = 0; i < platformDrafts.list.length; i++) {
            const draft = platformDrafts.list[ i ];
            const item = selectedValues.find((selectedValue) => draft.id === selectedValue);
            if (!item) {
                return false;
            }
        }
        return true;
    }

    isChecked = (id) => {
        let item = this.state.selectedValues.find((selectedValue) => selectedValue === id)
        return !!item;
    }

    cloneDrafts = async () => {
        const { selectedValues } = this.state;

        if (selectedValues.length > 0) {
            const response = await this.props.cloneDrafts({
                variables: {
                    ids: selectedValues,
                    companyId: this.props.company.id
                }
            });
            if (response) {
                this.setState({
                    selectedValues: [],
                });
                this.props.data.refetch();
            }
        }
    };

    selectAll = () => {
        const { list } = this.props.data.platformDrafts;
        const { selectedValues } = this.state;
        let values = this.state.selectedValues;

        for (let i = 0; i < list.length; i++) {
            const id = list[ i ].id;
            const item = selectedValues.find((selectedValue) => id === selectedValue);
            if (!item) {
                values.push(id);
            }
        }

        this.setState({
            selectedValues: [ ...values ],
            data: { ...this.state.data }
        });
    }

    deselectAll = () => {
        const { list } = this.props.data.platformDrafts;
        let values = this.state.selectedValues;


        for (let i = 0; i < list.length; i++) {
            const id = list[ i ].id;
            values = values.filter(value => value !== id);
        }

        this.setState({
            selectedValues: [ ...values ],
            data: { ...this.state.data }
        });
    }

    updateSelectedValues = (id) => {
        let { selectedValues } = this.state;
        const item = selectedValues.find((selectedValue) => id === selectedValue);
        if (!item) {
            selectedValues.push(id);
        } else {
            selectedValues = selectedValues.filter(value => value !== id);
        }

        this.setState({
            selectedValues: [ ...selectedValues ]
        });
    };

    render() {
        const { translate } = this.props;
        const { loading, error, platformDrafts, draftTypes } = this.props.data;
        const { selectedIndex, selectedValues } = this.state;
        const primary = getPrimary();

        return (<CardPageLayout title={translate.general_drafts}>
            {selectedIndex >= 0 ? <PlatformDraftDetails
                close={() => this.setState({ selectedIndex: -1 })}
                draft={platformDrafts[ selectedIndex ]}
                translate={translate}
            /> : <Fragment>
                {error ? (<div>
                    {error.graphQLErrors.map(error => {
                        return (<ErrorWrapper
                            error={error}
                            translate={translate}
                        />);
                    })}
                </div>) : !!platformDrafts && <Fragment>
                    <div style={{ display: 'inline-block' }}>
                        <AllSelector
                            selectAll={this.selectAll}
                            deselectAll={this.deselectAll}
                            anySelected={this.anySelected()}
                            allSelected={this.allSelected()}
                            translate={translate}
                        />
                        {selectedValues.length > 0 && <BasicButton
                            text={`${translate.download} ${selectedValues.length} ${translate.drafts} ${translate.to} '${translate.my_drafts}'`}
                            color={'white'}
                            textStyle={{
                                color: primary,
                                fontWeight: '700',
                                fontSize: '1em',
                                textTransform: 'none'
                            }}
                            textPosition="after"
                            icon={<ButtonIcon type="add" color={primary}/>}
                            onClick={() => this.cloneDrafts()}
                            buttonStyle={{
                                marginRight: '1em',
                                border: `2px solid ${primary}`,
                                paddingTop: '14px',
                                paddingBottom: '13px'
                            }}
                        />}
                    </div>
                    <EnhancedTable
                        translate={translate}
                        defaultLimit={DRAFTS_LIMITS[ 0 ]}
                        defaultFilter={'title'}
                        defaultOrder={[ 'title', 'asc' ]}
                        limits={DRAFTS_LIMITS}
                        page={1}
                        loading={loading}
                        length={platformDrafts.list.length}
                        total={platformDrafts.total}
                        refetch={this.props.data.refetch}
                        headers={[ { name: '' }, { name: '' }, {
                            name: 'title',
                            text: translate.name,
                            canOrder: true
                        }, {
                            name: 'type',
                            text: translate.type,
                            canOrder: true
                        } ]}
                    >
                        {platformDrafts.list.map((draft, index) => {
                            let isChecked = this.isChecked(draft.id);
                            return (<TableRow key={`draft${draft.id}`}>
                                <TableCell style={TableStyles.TD}>
                                    <Checkbox
                                        value={isChecked}
                                        checked={isChecked}
                                        onChange={() => this.updateSelectedValues(draft.id)}
                                    />
                                </TableCell>
                                <TableCell style={TableStyles.TD}>
                                    {this.alreadySaved(draft.id) && <FontAwesome
                                        name={'save'}
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '2em',
                                            color: getSecondary()
                                        }}
                                    />}
                                </TableCell>
                                <TableCell style={TableStyles.TD}
                                           onClick={() => this.setState({ selectedIndex: index })}>
                                    {draft.title}
                                </TableCell>
                                <TableCell>
                                    {translate[ draftTypes[ draft.type ].label ]}
                                </TableCell>
                            </TableRow>);
                        })}
                    </EnhancedTable>
                </Fragment>}
            </Fragment>}
        </CardPageLayout>);
    }
}

export default withSharedProps()(compose(graphql(platformDrafts, {
    options: props => ({
        variables: {
            companyId: props.company.id,
            companyType: props.company.type,
            options: {
                limit: DRAFTS_LIMITS[ 0 ],
                offset: 0
            }
        },
        notifyOnNetworkStatusChange: true
    })
}), graphql(cloneDrafts, {
    name: 'cloneDrafts'
}))(withRouter(withApollo(PlatformDrafts))));