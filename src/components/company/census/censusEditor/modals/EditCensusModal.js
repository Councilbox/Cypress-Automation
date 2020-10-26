
import React from "react";
import {
    AlertConfirm, UnsavedChangesModal
} from "../../../../../displayComponents";
import { graphql, compose, withApollo } from "react-apollo";
import { census, updateCensus } from "../../../../../queries/census";
import CensusInfoForm from '../../CensusInfoForm';
import { isMobile } from "../../../../../utils/screen";
import { INPUT_REGEX } from "../../../../../constants";

const EditCensusButton = ({ translate, client, ...props }) => {

    const [initInfo, setInitInfo] = React.useState({})
    const [state, setState] = React.useState({
        data: {},
        errors: {},
        unsavedAlert: false,
    })

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: census,
            variables: {
                id: props.censusId
            }
        });
        console.log(response)
        setState({ ...state, data: response.data.census })
        setInitInfo(response.data.census)
    }, []);

    React.useEffect(() => {
        getData();
    }, [getData])

    const updateCensusFunction = async () => {
        if (!checkRequiredFields()) {
            const { __typename, ...census } = state.data;
            const response = await client.mutate({
                mutation: updateCensus,
                variables: {
                    census
                }
            });
            if (!response.errors) {
                await props.refetch();
                props.requestClose();
            }
        }
    }

    const updateState = object => {
        setState({
            ...state,
            data: {
                ...state.data,
                ...object
            }
        });
    };

    const _renderBody = () => {
        return (
            <div style={{ minWidth: "800px" }}>
                <CensusInfoForm
                    translate={translate}
                    errors={state.errors}
                    updateState={updateState}
                    census={state.data}
                />
            </div>
        );
    };

    const checkRequiredFields = () => {
        let hasError = false;

        if (state.data.censusName) {
            if (!(INPUT_REGEX.test(state.data.censusName)) || !state.data.censusName.trim()) {
                hasError = true;
                setState({
                    ...state,
                    errors: {
                        ...state.errors,
                        censusName: translate.invalid_field
                    }
                })
            }
        }
        if (state.data.censusDescription) {
            if (!(INPUT_REGEX.test(state.data.censusDescription)) || !state.data.censusDescription.trim()) {
                hasError = true;
                setState({
                    ...state,
                    errors: {
                        ...state.errors,
                        censusDescription: translate.invalid_field
                    }
                })
            }
        }

        if (!state.data.censusName) {
            hasError = true;
            setState({
                ...state,
                errors: {
                    ...state.errors,
                    censusName: translate.required_field
                }
            });
        }
        if (hasError) {
            return true;
        } else {
            return false;
        }
    }

    const comprobateChanges = () => {
        let unsavedAlert = JSON.stringify(initInfo) !== JSON.stringify(state.data)
        setState({
            ...state,
            unsavedAlert: unsavedAlert
        })
        return unsavedAlert
    };

    const closeModal = () => {
        let equals = comprobateChanges();
        if (!equals) {
            props.requestClose()
        }
    }



    return (
        <div>
            <AlertConfirm
                requestClose={closeModal}
                // requestClose={props.requestClose}
                open={props.open}
                acceptAction={updateCensusFunction}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={_renderBody()}
                title={translate.census}
            />
            <UnsavedChangesModal
                requestClose={() => setState({ ...state, unsavedAlert: false })}
                open={state.unsavedAlert}
            />
        </div>
    );
}

// class EditCensusButton extends React.Component {
//     state = {
//         data: {},
//         errors: {}
//     }

//     static getDerivedStateFromProps(nextProps, prevState) {
//         if (!nextProps.data.loading && !prevState.data.id) {
//             return {
//                 data: {
//                     ...nextProps.data.census
//                 }
//             }
//         }

//         return null;
//     }

//     updateCensus = async () => {
//         if (!this.checkRequiredFields()) {
//             const { __typename, ...census } = this.state.data;
//             const response = await this.props.updateCensus({
//                 variables: {
//                     census
//                 }
//             })

//             if (!response.errors) {
//                 await this.props.refetch();
//                 this.props.requestClose();
//             }
//         }
//     }

//     updateState = object => {
//         this.setState({
//             data: {
//                 ...this.state.data,
//                 ...object
//             }
//         });
//     };

//     _renderBody = () => {
//         return (
//             <div style={{ minWidth: "800px" }}>
//                 sdfdsfsdff
//                 <CensusInfoForm
//                     translate={this.props.translate}
//                     errors={this.state.errors}
//                     updateState={this.updateState}
//                     census={this.state.data}
//                 />
//             </div>
//         );
//     };

//     checkRequiredFields() {
//         let hasError = false;
//         const { translate } = this.props;

//         if (this.state.data.censusName) {
//             if (!(INPUT_REGEX.test(this.state.data.censusName)) || !this.state.data.censusName.trim()) {
//                 hasError = true;
//                 this.setState({
//                     errors: {
//                         ...this.state.errors,
//                         censusName: translate.invalid_field
//                     }
//                 })
//             }
//         }
//         if (this.state.data.censusDescription) {
//             if (!(INPUT_REGEX.test(this.state.data.censusDescription)) || !this.state.data.censusDescription.trim()) {
//                 hasError = true;
//                 this.setState({
//                     errors: {
//                         ...this.state.errors,
//                         censusDescription: translate.invalid_field
//                     }
//                 })
//             }
//         }

//         if (!this.state.data.censusName) {
//             hasError = true;
//             this.setState({
//                 errors: {
//                     ...this.state.errors,
//                     censusName: this.props.translate.required_field
//                 }
//             });
//         }
//         if (hasError) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     render() {
//         const { translate } = this.props;

//         return (
//             <AlertConfirm
//                 requestClose={this.props.requestClose}
//                 open={this.props.open}
//                 acceptAction={this.updateCensus}
//                 buttonAccept={translate.accept}
//                 buttonCancel={translate.cancel}
//                 bodyText={this._renderBody()}
//                 title={translate.census}
//             />
//         );
//     }
// }

// export default compose(
//     graphql(census, {
//         options: props => ({
//             variables: {
//                 id: props.censusId
//             }
//         })
//     }),
//     graphql(updateCensus, {
//         name: 'updateCensus'
//     })
// )(EditCensusButton);

export default withApollo(EditCensusButton);
