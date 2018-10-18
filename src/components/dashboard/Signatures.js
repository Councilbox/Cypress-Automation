import React from "react";
import { deleteSignature, signatures } from "../../queries/signature";
import { compose, graphql } from "react-apollo";
import {
	AlertConfirm,
	CloseIcon,
	ErrorWrapper,
	LoadingSection,
	MainTitle,
	Table
} from "../../displayComponents/index";
import { getPrimary } from "../../styles/colors";
import { TableCell, TableRow } from "material-ui/Table";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { bHistory } from "../../containers/App";
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";

class Signatures extends React.Component {
	state = {
		deleteID: "",
		deleteModal: false,
		cantAccessModal: false
	};

    openCantAccessModal = () => {
        this.setState({
            cantAccessModal: true
        });
    }

    closeCantAccessModal = () => {
        this.setState({
            cantAccessModal: false
        })
    }

	componentDidMount() {
		this.props.data.refetch();
	}

	openDeleteModal = ID => {
		this.setState({
			deleteModal: true,
			deleteID: ID
		});
	};

	delete = async () => {
		this.props.data.loading = true;
		const response = await this.props.mutate({
			variables: {
				id: this.state.deleteID
			}
		});
		if (response) {
			this.setState({
				deleteModal: false
			});
			this.props.data.refetch();
		}
	};

	_renderDeleteIcon(signatureID) {
		const primary = getPrimary();

		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={event => {
					this.openDeleteModal(signatureID);
					event.stopPropagation();
				}}
			/>
		);
	}

	render() {
		const { translate } = this.props;
		const { loading, signatures = [], error } = this.props.data;
		return (
			<div
				style={{
					height: '100%',
					width: '100%',
					overflow: "hidden",
					position: "relative"
				}}
			>
				<div style={{ width: '100%', height: '100%', padding: '1em' }}>
					<MainTitle
						icon={this.props.icon}
						title={this.props.title}
						subtitle={this.props.desc}
					/>
					{loading ? (
						<div style={{
							width: '100%',
							marginTop: '8em',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}>
							<LoadingSection />
						</div>
					) : (
						<div style={{height: 'calc(100% - 10.5em)', overflow: 'hidden'}}>
							<Scrollbar>
								<div style={{padding: "1em", paddingTop: '2em'}}>
									{false ? (
										<div>
											{error.graphQLErrors.map((error, index) => {
												return (
													<ErrorWrapper
														key={`error_${index}`}
														error={error}
														translate={translate}
													/>
												);
											})}
										</div>
									) : signatures.length > 0 ? (
										<Table
											headers={[
												{ name: translate.name },
												{ name: '' }
											]}
											action={this._renderDeleteIcon}
											companyID={this.props.company.id}
										>
											{signatures.map(signature => {
												return (
													<HoverableRow
														signature={signature}
														disabled={this.props.disabled}
														company={this.props.company}
														key={`signature_${signature.id}`}
														translate={translate}
														showModal={this.openCantAccessModal}
														openDeleteModal={this.openDeleteModal}
													/>
												);
											})}
										</Table>
									) : (
										<span>{translate.no_results}</span>
									)}
									<AlertConfirm
										title={translate.send_to_trash}
										bodyText={translate.send_to_trash_desc}
										open={this.state.deleteModal}
										buttonAccept={translate.send_to_trash}
										buttonCancel={translate.cancel}
										modal={true}
										acceptAction={this.delete}
										requestClose={() =>
											this.setState({ deleteModal: false })
										}
									/>
								</div>
							</Scrollbar>
						</div>
					)}
				</div>
				<CantCreateCouncilsModal
                    translate={translate}
                    open={this.state.cantAccessModal}
                    requestClose={this.closeCantAccessModal}
                />
			</div>
		);
	}
}

export default compose(
	graphql(deleteSignature),
	graphql(signatures, {
		options: props => ({
			variables: {
				state: props.state,
				companyId: props.company.id,
			},
			notifyOnNetworkChange: true
		})
	})
)(Signatures);

class HoverableRow extends React.PureComponent {

    state = {
        showActions: false
    }

    mouseEnterHandler = () => {
        this.setState({
            showActions: true
        })
    }

    mouseLeaveHandler = () => {
        this.setState({
            showActions: false
        })
    }

    deleteIcon = (signatureId) => {
        const primary = getPrimary();

        return (
            <CloseIcon
                style={{ color: primary }}
                onClick={event => {
                    this.props.openDeleteModal(signatureId);
                    event.stopPropagation();
                }}
            />
        );
    }


    render() {
        const { signature, translate, disabled } = this.props;


        return (
            <TableRow
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				style={{
					cursor: "pointer",
					backgroundColor: disabled? 'whiteSmoke' : 'inherit'
				}}
				onClick={() => {
					disabled?
                        this.props.showModal()
					:
						bHistory.push(`/company/${this.props.company.id}/signature/${signature.id}`
					);
				}}
				key={`signature${
					signature.id
				}`}
			>
				<TableCell>
					{signature.title || translate.dashboard_new_signature}
				</TableCell>
				<TableCell>
					{this.state.showActions?
						this.deleteIcon(signature.id)
					:
						<div style={{width: '5em'}} />
					}
				</TableCell>
			</TableRow>
        )
    }
}