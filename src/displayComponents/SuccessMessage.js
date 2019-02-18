import React from 'react';
import { Icon } from './';
import { Typography, CircularProgress } from 'material-ui';
import FontAwesome from 'react-fontawesome';


class SuccessMessage extends React.Component {

	state = {
		mounted: false
	};

	componentWillUnmount() {
		this.mounted = false;
	}

	componentDidMount() {
		const max = 3;
		setTimeout(() => {
			this.setState({ mounted: true });
		}, 2000);
	}

	render() {
		const { message, changeImage, } = this.props
		return (
			<div
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					alignContent: "center",
					flexDirection: "column",
					position: "relative"
				}}
			>
				{this.state.mounted ? (
					<React.Fragment>
						{/* <Icon
							className="material-icons scale-up-center"
							style={{
								fontSize: "6em",
								color: "limegreen",
							}}
						>
							check_circle
						</Icon> */}
						<div className="scale-up-center" style={{marginBottom: '15px'}}>
							< FontAwesome
								name={"envelope-o"}
								style={{
									fontSize: "7em",
								}}
							/>
							< FontAwesome
								name={"check"}
								style={{
									fontSize: "3em",
									color: "limegreen",
									position: "absolute",
									top: "0",
									left: "65%",
								}}
							/>
						</div>
						<Typography variant="subheading">{message}</Typography>
					</React.Fragment>
				) : (
						<CircularProgress
							size={60}
							color={"primary"}
							style={{ marginRight: "0.8em" }}
						/>
					)
				}
			</div>
		);
	}
};

export default SuccessMessage;