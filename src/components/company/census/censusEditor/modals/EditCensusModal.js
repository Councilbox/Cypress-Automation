
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

    static getDerivedStateFromProps(nextProps, prevState){
        if(!nextProps.data.loading && !prevState.data.id){
            return {
                data: {
                    ...nextProps.data.census
                }
            }
        }

        return null;
    }

    updateCensus = async () => {
        if(!this.checkRequiredFields()){
            const { __typename, ...census } = this.state.data;
            const response = await this.props.updateCensus({
                variables: {
                    census
                }
            })

            if(!response.errors){
                const response = await this.props.refetch();
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
		return false;
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
