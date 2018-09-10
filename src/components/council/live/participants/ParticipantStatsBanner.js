import React from "react";
import { graphql } from "react-apollo";
import { Tooltip } from "material-ui";
import FontAwesome from "react-fontawesome";
import { Grid, GridItem, Icon } from "../../../../displayComponents";
import { getSecondary } from "../../../../styles/colors";
import { councilRecount } from "../../../../queries/council";

class ParticipantStatsBanner extends React.Component {
	render() {
		const { translate } = this.props;
		const secondary = getSecondary();

		return (
			<Grid spacing={0} style={{
				backgroundColor: "whiteSmoke",
				width: '100%',
				height: '3em',
				borderBottom: '1px solid gainsboro',
				borderTop: '1px solid gainsboro',
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				paddingLeft: "1.5em",
				paddingRight: "2.5em",
				textAlign: 'center'
			}}>
				<GridItem
					xs={4}
					lg={2}
					md={2}
				>
					<Tooltip title={translate.all_plural}>
						<div>
							<FontAwesome
								name={"users"}
								style={{
									margin: "0.5em",
									color: secondary,
									fontSize: "1.4em"
								}}
							/>
							{/* {this.getStateCount("all")} */}
						</div>
					</Tooltip>
				</GridItem>
				<GridItem
					xs={4}
					lg={2}
					md={2}
				>
					<Tooltip title={translate.customer_initial}>
						<div>
							<FontAwesome
								name={"globe"}
								style={{
									margin: "0.5em",
									color: secondary,
									fontSize: "1.4em"
								}}
							/>
							{/* {this.getStateCount(0)} */}
						</div>
					</Tooltip>
				</GridItem>
				<GridItem
					xs={4}
					lg={2}
					md={2}
				>
					<Tooltip title={translate.customer_present}>
						<div>
							<Icon
								className="material-icons"
								style={{
									color: secondary,
									fontSize: "1.6em",
									marginRight: "0.5em"
								}}
							>
								face
							</Icon>
							{/* {this.getStateCount(5)} */}
						</div>
					</Tooltip>
				</GridItem>
				<GridItem
					xs={4}
					lg={2}
					md={2}
				>
					<Tooltip title={translate.customer_delegated}>
						<div>
							<FontAwesome
								name={"user"}
								style={{
									margin: "0.5em",
									color: secondary,
									fontSize: "1.2em"
								}}
							/>
							<FontAwesome
								name={"user"}
								style={{
									marginLeft: "-1em",
									marginRight: "0.5em",
									color: secondary,
									fontSize: "0.85em"
								}}
							/>
							{/* {this.getStateCount(4)} */}
						</div>
					</Tooltip>
				</GridItem>
				<GridItem
					xs={4}
					lg={2}
					md={2}
				>
					<Tooltip title={translate.customer_representated}>
						<div>
							<FontAwesome
								name={"user-o"}
								style={{
									margin: "0.5em",
									color: secondary,
									fontSize: "1.2em"
								}}
							/>
							<FontAwesome
								name={"user"}
								style={{
									marginLeft: "-1em",
									marginRight: "0.5em",
									color: secondary,
									fontSize: "0.85em"
								}}
							/>
							{/* {this.getStateCount(2)} */}
						</div>
					</Tooltip>
				</GridItem>
				<GridItem
					xs={4}
					lg={2}
					md={2}
				>
					<Tooltip title={translate.guest}>
						<div>
							<FontAwesome
								name={"user-o"}
								style={{
									margin: "0.5em",
									color: secondary,
									fontSize: "1.2em"
								}}
							/>
							{/* {this.getTypeCount(1)} */}
						</div>
					</Tooltip>
				</GridItem>
			</Grid>
		);
	}
}

export default graphql(councilRecount, {
	options: props => ({
		variables: {
			councilId: props.council.id
		}
	})
})(ParticipantStatsBanner);
