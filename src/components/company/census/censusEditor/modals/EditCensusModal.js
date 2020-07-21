
import React from "react";
import {
    AlertConfirm
} from "../../../../../displayComponents";
import { graphql, compose } from "react-apollo";
import { census, updateCensus } from "../../../../../queries/census";
import CensusInfoForm from '../../CensusInfoForm';

class EditCensusButton extends React.Component {
    state = {
        data: {},
        errors: {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.data.loading && !prevState.data.id) {
            return {
                data: {
                    ...nextProps.data.census
                }
            }
        }

        return null;
    }

    updateCensus = async () => {
        if (!this.checkRequiredFields()) {
            const { __typename, ...census } = this.state.data;
            const response = await this.props.updateCensus({
                variables: {
                    census
                }
            })

            if (!response.errors) {
                await this.props.refetch();
                this.props.requestClose();
            }
        }
    }

    updateState = object => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    };

    _renderBody = () => {
        return (
            <div style={{ minWidth: "800px" }}>
                <CensusInfoForm
                    translate={this.props.translate}
                    errors={this.state.errors}
                    updateState={this.updateState}
                    census={this.state.data}
                />
            </div>
        );
    };

    checkRequiredFields() {
        let hasError = false;
        const { translate } = this.props;
        var regex = new RegExp("[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-]+");

        if (this.state.data.censusName) {
            if (!(regex.test(this.state.data.censusName)) || !this.state.data.censusName.trim()) {
                hasError = true;
                this.setState({
                    errors: {
                        ...this.state.errors,
                        censusName: translate.invalid_field
                    }
                })
            }
        }
        if (this.state.data.censusDescription) {
            if (!(regex.test(this.state.data.censusDescription)) || !this.state.data.censusDescription.trim()) {
                hasError = true;
                this.setState({
                    errors: {
                        ...this.state.errors,
                        censusDescription: translate.invalid_field
                    }
                })
            }
        }

        if (!this.state.data.censusName) {
            hasError = true;
            this.setState({
                errors: {
                    ...this.state.errors,
                    censusName: this.props.translate.required_field
                }
            });
        }
        if (hasError) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const { translate } = this.props;

        return (
            <AlertConfirm
                requestClose={this.props.requestClose}
                open={this.props.open}
                acceptAction={this.updateCensus}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={this._renderBody()}
                title={translate.census}
            />
        );
    }
}

export default compose(
    graphql(census, {
        options: props => ({
            variables: {
                id: props.censusId
            }
        })
    }),
    graphql(updateCensus, {
        name: 'updateCensus'
    })
)(EditCensusButton);
