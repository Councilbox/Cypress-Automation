import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
	InputAdornment,
	Card,
	CardActions,
	CardContent,
	CardHeader
} from 'material-ui';
import {
	Scrollbar,
	LoadingSection,
	TextInput,
	BasicButton
} from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import NewTranslationModal from './NewTranslationModal';
import { secondary } from '../../../styles/colors';
import EditTranslationsModal from './EditTranslationsModal';


class TranslationsPage extends React.Component {
	state = {
		filterText: '',
		newModal: false
	};

	scrollbar = null;

	handleScrollStop = () => {
		if (this.scrollbar.getValues().top > 0.9) {
			this.loadMore();
		}
	};

	updateFilterSearch = text => {
		this.setState({ filterText: text }, this.refresh);
	};

	showNewModal = () => {
		this.setState({
			newModal: true
		});
	};

	closeNewModal = () => {
		this.setState({
			newModal: false
		});
	};

	refresh = async () => {
		this.props.data.refetch({
			filters: [
				{
					text: this.state.filterText,
					field: 'label'
				}
			]
		});
	};

	loadMore = async () => {
		this.props.data.fetchMore({
			variables: {
				options: {
					offset: this.props.data.rootTranslations.length,
					limit: 10
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					rootTranslations: [
						...prev.rootTranslations,
						...fetchMoreResult.rootTranslations
					]
				};
			}
		});
	};

	render() {
		if (!this.props.data.rootTranslations) {
			return <LoadingSection />;
		}

		return (
			<div
				style={{
					width: '100%',
					height: 'calc(100% - 1em)',
					overflow: 'hidden'
				}}
			>
				<div
					style={{
						borderBottom: '1px solid gainsboro',
						paddingRight: '1em',
						paddingLeft: '1em',
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center'
					}}
				>
					<div>
						<TextInput
							value={this.state.filterText}
							onChange={event => this.updateFilterSearch(event.target.value)
							}
							startAdornment={
								<InputAdornment
									position="start"
									style={{ marginRight: '1em' }}
								>
									<i
										className="fa fa-search"
										aria-hidden="true"
									/>
								</InputAdornment>
							}
						/>
					</div>
				</div>
				<div
					style={{
						width: '100%',
						padding: '1em',
						alignItems: 'center'
					}}
				>
					{window.location.hostname.split('.')[0] === 'localhost' &&
						<BasicButton
							text={
								<div>
									Nueva traducción
									<i
										className="fa fa-plus"
										aria-hidden="true"
										style={{ paddingLeft: '0.5em' }}
									/>
								</div>
							}
							onClick={this.showNewModal}
							color={secondary}
							textStyle={{ color: 'white' }}
						/>
					}

					<NewTranslationModal
						open={this.state.newModal}
						requestClose={this.closeNewModal}
						translate={this.props.translate}
					/>
				</div>
				<Scrollbar
					onScrollStop={this.handleScrollStop}
					ref={ref => { this.scrollbar = ref; }}
				>
					<div style={{ width: '100%', padding: '1em' }}>
						{this.props.data.rootTranslations.map(translation => (
							<Card
								style={{
									padding: '1.5em',
									marginBottom: '1.5em'
								}}
								key={`translation_${translation.label}`}
							>
								<CardHeader
									title={<h5>{`${translation.label}:`}</h5>}
								/>
								<CardContent>
									<div>
										<TextInput
											floatingText="es"
											value={translation.es}
										/>
										<TextInput
											floatingText="en"
											value={translation.en}
										/>
										<TextInput
											floatingText="gal"
											value={translation.gal}
										/>
										<TextInput
											floatingText="cat"
											value={translation.cat}
										/>
										<TextInput
											floatingText="pt"
											value={translation.pt}
										/>
									</div>
								</CardContent>
								<CardActions>
									<div>
										{window.location.hostname.split('.')[0] === 'localhost' &&
											<EditTranslationsModal
												translation={translation}
												translate={this.props.translate}
												refresh={this.refresh}
											/>
										}
									</div>
								</CardActions>
							</Card>
						))}
					</div>
				</Scrollbar>
			</div>
		);
	}
}

const rootTranslations = gql`
	query RootTranslations($filters: [FilterInput], $options: OptionsInput) {
		rootTranslations(filters: $filters, options: $options) {
			label
			es
			gal
			pt
			cat
			en
		}
	}
`;

export default graphql(rootTranslations, {
	options: () => ({
		variables: {
			options: {
				limit: 10,
				offset: 0
			}
		}
	})
})(withTranslations()(TranslationsPage));
