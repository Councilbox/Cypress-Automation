import React from "react";
import TopSectionBlocks from "./TopSectionBlocks";
import { darkGrey, lightGrey } from "../../styles/colors";
import withSharedProps from '../../HOCs/withSharedProps';

const Dashboard = ({ translate, company, user }) => {
	return (
		<div
			style={{
				overflowY: "auto",
				width: "100%",
				backgroundColor: "white",
				padding: 0,
				height: "100%",
				display: "flex",
				alignItems: "center",
				flexDirection: "column"
			}}
			className="container-fluid"
		>
			<div className="row" style={{ width: "100%" }}>
				<div
					style={{
						width: "100%",
						height: "calc(100vh - 3em)",
						backgroundColor: lightGrey,
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
						paddingBottom: "5em"
					}}
				>
					<div
						style={{
							padding: "1em",
							paddingTop: "2em"
						}}
					>
						{translate.we_welcome}
					</div>
					<div
						style={{
							fontWeight: "700",
							color: darkGrey,
							padding: "2em",
							fontSize: "1em",
							paddingTop: "0.5em"
						}}
					>
						{translate.we_recommend_review_configuration}
					</div>
					<TopSectionBlocks
						translate={translate}
						company={company}
						user={user}
					/>
				</div>
			</div>
		</div>
	);
}


export default withSharedProps()(Dashboard);
