import React from "react";
import { MenuItem } from "material-ui";
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from "material-ui/Dialog";
import {
	BasicButton,
	Checkbox,
	LoadingSection,
	SelectInput,
	TextInput
} from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";
import { withApollo } from "react-apollo";
import { provinces } from "../../../queries/masters";


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

			if (this.props.countries && this.props.council.country) {
				const country = this.props.countries.filter(
					country => country.deno === this.props.council.country
				)[0];
				if (country) {
					this.updateCountryStates(country.id);
				}
			}
		}
	}

	static getDerivedStateFromProps(nextProps){
		if(nextProps.council){
			return ({
				data: {
					council: nextProps.council
				}
			});
		}
		return null;
	}


	componentDidUpdate(prevProps, prevState){
		if(this.props.council.country !== prevProps.council.country){
			const country = this.props.countries.filter(
				country => country.deno === this.props.council.country
			)[0];
			if (country) {
				this.updateCountryStates(country.id);
			}
		}
	}

	handleCountryChange = event => {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				council: {
					...this.state.data.council,
					country: event.target.value
				}
			}
		});
		const selectedCountry = this.props.countries.find(
			country => country.deno === event.target.value
		);
		this.updateCountryStates(selectedCountry.id);
	};

	updateCountryStates = async countryID => {
		const response = await this.props.client.query({
			query: provinces,
			variables: {
				countryId: countryID
			}
		});
		this.setState({
			country_states: response.data.provinces
		});
	};

	handleProvinceChange = event => {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				council: {
					...this.state.data.council,
					countryState: event.target.value
				}
			}
		});
	};

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
		const { translate, countries } = this.props;

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
							{/* <SelectInput
								floatingText={translate.country}
								value={this.state.data.council.country}
								onChange={this.handleCountryChange}
								errorText={this.state.errors.country}
							>
								{countries.map(country => {
									return (
										<MenuItem
											key={country.deno}
											value={country.deno}
										>
											{country.deno}
										</MenuItem>
									);
								})}
							</SelectInput>
							<SelectInput
								floatingText={
									translate.company_new_country_state
								}
								value={this.state.data.council.countryState}
								errorText={this.state.errors.countryState}
								onChange={this.handleProvinceChange}
							>
								{this.state.country_states.map(
									country_state => {
										return (
											<MenuItem
												key={country_state.deno}
												value={country_state.deno}
											>
												{country_state.deno}
											</MenuItem>
										);
									}
								)}
							</SelectInput> */}
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

export default withApollo(PlaceModal);
