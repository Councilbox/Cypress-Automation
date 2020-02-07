import React from "react";
import { lightGrey, getPrimary } from "../styles/colors";
//import Scrollbar from "react-perfect-scrollbar";
import Scrollbar from './Scrollbar';
import withWindowSize from "../HOCs/withWindowSize";
import { Paper } from "material-ui";
import CBXFooter from './CBXFooter';


const CardPageLayout = ({
	children,
	title,
	footer,
	windowSize,
	stylesNoScroll,
	disableScroll = false
}) => (
		<div
			style={{
				backgroundColor: lightGrey,
				height: "100%",
				overflow: 'hidden',
				width: "100%"
			}}
		>
			<div
				style={{
					margin: windowSize !== "xs" ? "1.2em 0 0 0" : "0.4em 0 0 0",
					overflow: 'hidden',
					height: windowSize !== "xs" ? "calc(100% - 2em)" : "calc(100% - 1.9rem)",
				}}
			>
				<div
					style={{
						background: `linear-gradient(60deg, ${'#8d4893'}, ${getPrimary()})`, //
						boxShadow:
							"0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)",
						color: "white",
						width: windowSize !== "xs" ? "15%" : "calc(100% - 2em)",
						// width: windowSize !== "xs" ? "30%" : "calc(100% - 2em)",
						maxWidth: "calc(100% - 6em)",
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis',
						verticalAlign: "middle",
						padding: windowSize !== "xs" ? "0.5em" : "0.2em",
						height: windowSize !== "xs" ? "2.8em" : "2em",
						// height: windowSize !== "xs" ? "2.6em" : "2em",
						zIndex: "20",
						marginLeft:
							windowSize !== "xs"
								? windowSize === "xl"
									? "8%"
									: "3em"
								: "1em",
						marginRight: windowSize !== "xs" && "1em",
						position: "relative",
						borderRadius: "3px",
						fontWeight: "800",
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					}}
					className="align-middle"
				>
					<div style={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
					>
						{title}
					</div>
				</div>
				<Paper
					style={{
						height:
							windowSize !== "xs"
								? "calc(100% - 2em)"
								: "calc(100% - 1.5em)",
						backgroundColor: "white",
						borderRadius: "3px",
						width:
							windowSize !== "xs"
								? windowSize === "xl"
									? "90%"
									: "96%"
								: "98%",
						margin: "0 auto",
						marginTop: "-4em"
					}}
				>
					<div
						style={{
							marginTop: "2.5em",
							marginBottom: "1.5em",
							position: "relative",
							overflow: "hidden",
							height: "100%"
						}}
					>
						{!disableScroll && (
							<Scrollbar>
								<div
									style={{
										paddingTop: "2.5em",
										paddingBottom: "0.5em",
										paddingLeft: windowSize === "xl" && "2vw",
										paddingRight: windowSize === "xl" && "2vw",
										...stylesNoScroll
									}}
								>
									<div className="container-fluid" style={{ height: "100%", overflow: "hidden" }}>
										{children}
									</div>
								</div>
							</Scrollbar>
						)}
						{disableScroll && (
							<div
								style={{
									paddingTop: "2.5em",
									paddingBottom: "0.5em",
									height: "100%"
								}}
							>
								{children}
							</div>
						)}
					</div>
					{!!footer &&
						<div
							style={{
								width: '100%',
								height: '2.5em',
								position: 'absolute',
								bottom: 0,
								right: 0,
							}}
						>
							{footer}
						</div>
					}
				</Paper>
			</div>
			<CBXFooter />
		</div >
	);

export default withWindowSize(CardPageLayout);
