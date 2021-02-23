import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { darkGrey, lightGrey } from '../../styles/colors';
import { Block, Grid, GridItem } from '../../displayComponents';
import { userCanCreateCompany } from '../../utils/CBX';
import DevAdminPanel from '../admin/DevAdminPanel';
import PremiumModal from './PremiumModal';
import withSharedProps from '../../HOCs/withSharedProps';


class NoCompanyDashboard extends React.Component {
state = {
	premiumModal: false
}

closePremiumModal = () => {
	this.setState({
		premiumModal: false
	});
}

stopFreeTrial = async () => {
	await this.props.stopFreeTrial({
		variables: {
			userId: this.props.user.id
		}
	});
}

render() {
	const { translate, user } = this.props;
	return (
		<div
			style={{
				overflowY: 'auto',
				width: '100%',
				backgroundColor: lightGrey,
				padding: 0,
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column'
			}}
			id={'mainContainer'}
		>
			{user.roles === 'devAdmin' ?
				<DevAdminPanel />
				:					<div className="row" style={{ width: '100%' }}>
					<div
						style={{
							width: '100%',
							height: 'calc(100vh - 3em)',
							backgroundColor: lightGrey,
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							paddingBottom: '5em'
						}}
					>
						<div
							style={{
								padding: '1em',
								paddingTop: '2em'
							}}
						>
							{translate.we_welcome}
						</div>
						<div
							style={{
								fontWeight: '700',
								color: darkGrey,
								padding: '2em',
								fontSize: '1em',
								paddingTop: '0.5em'
							}}
						>
							{translate.no_companies_desc}
						</div>
						<Grid
							style={{
								width: '90%',
								marginTop: '4vh'
							}}
							spacing={8}
						>
							<GridItem xs={12} md={6} lg={4}>
								{!userCanCreateCompany(user) ?
									<div onClick={() => this.setState({ premiumModal: true })}>
										<Block
											link={'/'}
											icon="add"
											text={translate.companies_add}
										/>
									</div>
									:										<Block
										link={'/company/create'}
										icon="add"
										text={translate.companies_add}
									/>
								}
							</GridItem>

							<GridItem xs={12} md={6} lg={4}>
								<Block
									link={'/company/link'}
									icon="link"
									text={translate.companies_link}
								/>
							</GridItem>

							<GridItem xs={12} md={6} lg={4}>
								<Block
									link={'/meeting/new'}
									icon="video_call"
									text={translate.start_conference}
								/>
							</GridItem>
						</Grid>
					</div>
				</div>
			}
			<PremiumModal
				translate={translate}
				user={user}
				open={this.state.premiumModal}
				requestClose={this.closePremiumModal}
			/>
		</div>
	);
}
}

const stopFreeTrial = gql`
	mutation StopFreeTrial($userId: Int!){
		stopFreeTrial(userId: $userId){
			success
		}
	}
`;

export default graphql(stopFreeTrial, {
	name: 'stopFreeTrial'
})(withSharedProps()(NoCompanyDashboard));
