import React from "react";
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from "material-ui/Dialog";
import {
	BasicButton,
	Checkbox,
	LoadingSection,
	TextInput
} from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";


class PlaceModal extends React.Component {
	state = {
		data: {
			...this.props.council
		},
		countries: [],
		country_states: [],
		remote: false,
		errors: {
			address: "",
			city: "",
			country: "",
			zipcode: "",
			region: ""
		}
	};

	componentDidMount() {
		if (this.props.council) {
			this.setState({
				data: {
					council: this.props.council
				}
			});
		}
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.council && !prevState.data.council){
			return ({
				data: {
					council: nextProps.council
				}
			});
		}
		return null;
	}


	saveAndClose = () => {
		if (!this.checkRequiredFields()) {
			if (!this.state.remote) {
				this.props.saveAndClose(this.state.data.council);
			} else {
				this.props.saveAndClose({
					street: "remote_celebration",
					remoteCelebration: 1,
					country: "",
					countryState: "",
					state: "",
					city: "",
					zipcode: ""
				});
			}
		}
	};

	_renderActionButtons = () => {
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<BasicButton
					text={translate.close}
					id={'close-button'}
					type="flat"
					color={"white"}
					textStyle={{
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					textPosition="after"
					onClick={this.props.close}
				/>
				<BasicButton
					text={translate.accept}
					color={primary}
					textStyle={{
						color: "white",
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					buttonStyle={{ marginLeft: "1em" }}
					textPosition="after"
					onClick={this.saveAndClose}
				/>
			</React.Fragment>
		);
	};

	checkRequiredFields() {
		const { translate } = this.props;
		if (this.state.data.council.remoteCelebration) {
			return false;
		}

		let errors = {
			country: "",
			countryState: "",
			street: "",
			zipcode: "",
			city: ""
		};

		let hasError = false;

		if (!this.state.data.council.country) {
			hasError = true;
			errors.country = translate.field_required;
		}

		if (!this.state.data.council.street) {
			hasError = true;
			errors.street = translate.field_required;
		}

		if (!this.state.data.council.city) {
			hasError = true;
			errors.city = translate.field_required;
		}

		if (!this.state.data.council.zipcode) {
			hasError = true;
			errors.zipcode = translate.field_required;
		}

		if (!this.state.data.council.countryState) {
			hasError = true;
			errors.countryState = translate.field_required;
		}

		this.setState({
			...this.state,
			errors: errors
		});

		return hasError;
	}

	render() {
		const { translate } = this.props;

		if (!this.state.data.council) {
			return <LoadingSection />;
		}

		return (
			<Dialog disableBackdropClick={true} open={this.props.open}>
				<DialogTitle>{translate.new_location_of_celebrate}</DialogTitle>
				<DialogContent>
					<Checkbox
						label={translate.remote_celebration}
						value={this.state.data.council.remoteCelebration === 1}
						onChange={(event, isInputChecked) =>
							this.setState({
								data: {
									...this.state.data,
									council: {
										...this.state.data.council,
										remoteCelebration: isInputChecked
											? 1
											: 0,
										street: ""
									}
								}
							})
						}
					/>
					{!this.state.data.council.remoteCelebration && (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center"
							}}
						>
							<TextInput
								floatingText={translate.country}
								type="text"
								errorText={this.state.errors.country}
								value={this.state.data.council.country}
								onChange={event =>
									this.setState({
										...this.state,
										data: {
											...this.state.data,
											council: {
												...this.state.data.council,
												country: event.nativeEvent.target.value
											}
										}
									})
								}
							/>
							<TextInput
								floatingText={translate.company_new_country_state}
								type="text"
								errorText={this.state.errors.countryState}
								value={this.state.data.council.countryState}
								onChange={event =>
									this.setState({
										...this.state,
										data: {
											...this.state.data,
											council: {
												...this.state.data.council,
												countryState:
													event.nativeEvent.target
														.value
											}
										}
									})
								}
							/>
							<TextInput
								floatingText={translate.company_new_zipcode}
								type="text"
								errorText={this.state.errors.zipcode}
								value={this.state.data.council.zipcode}
								onChange={event =>
									this.setState({
										...this.state,
										data: {
											...this.state.data,
											council: {
												...this.state.data.council,
												zipcode:
													event.nativeEvent.target
														.value
											}
										}
									})
								}
							/>
							<TextInput
								floatingText={translate.company_new_locality}
								type="text"
								errorText={this.state.errors.city}
								value={this.state.data.council.city}
								onChange={event =>
									this.setState({
										...this.state,
										data: {
											...this.state.data,
											council: {
												...this.state.data.council,
												city:
													event.nativeEvent.target
														.value
											}
										}
									})
								}
							/>
							<TextInput
								floatingText={translate.company_new_address}
								type="text"
								errorText={this.state.errors.street}
								value={this.state.data.council.street}
								onChange={event =>
									this.setState({
										...this.state,
										data: {
											...this.state.data,
											council: {
												...this.state.data.council,
												street:
													event.nativeEvent.target
														.value
											}
										}
									})
								}
							/>
						</div>
					)}
				</DialogContent>
				<DialogActions>{this._renderActionButtons()}</DialogActions>
			</Dialog>
		);
	}
}

export default PlaceModal;
