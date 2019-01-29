import React from "react";
import {
	AlertConfirm,
	BasicButton,
	CollapsibleSection
} from "../../displayComponents";
import "react-big-calendar/lib/css/react-big-calendar.css";




class UltimasAcciones extends React.Component {

	state = {
		modalAcciones: false,
		showActions: false
	}

	onClickContinuarEditando = (event, id) => {
		//esto te llevara a la pagina en donde se edita la reunion - ya funciona el id y el event
		event.stopPropagation();
	}

	showModalAcciones = () => {
		this.setState({
			modalAcciones: true
		});
	}

	hideModalAcciones = () => {
		this.setState({
			modalAcciones: false
		});
	}

	render() {
		const { translate, reuniones } = this.props;

		//sacamos solo 3 reuniones
		let reunionesFiltradas = Object.keys(reuniones).filter(key => reuniones.length > 3).reduce((obj, key) => {
			if (key < 3) {
				obj[key] = reuniones[key];
			}
			return obj;
		}, {});
		if (reuniones.length) {
			return (
				<React.Fragment >
					<div style={{ height: "335px", textAlign: "left", overflow: "hidden" }}>
						{Object.keys(reunionesFiltradas).map(key => {
							return (
								<div key={key} style={{ border: "1px solid #ddd", boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 4px", marginBottom: "1em", padding: '1em' }}>
									<div style={{ display: "flex", justifyContent: "space-between" }}>
										<div style={{ marginBottom: "5px", width: "60%", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: "flex" }}>
											<div style={{ marginRight: "0.5em" }}>
												{reunionesFiltradas[key].state == 20 || reunionesFiltradas[key].state == 30 ? (
													<i className={"fa fa-users"}></i>
												) : reunionesFiltradas[key].state == 5 || reunionesFiltradas[key].state == 10 ? (
													<i className={"fa fa-calendar-o"}></i>
												) : ""}
											</div>
											{reunionesFiltradas[key].name}
										</div>
										<div style={{ marginBottom: "5px", width: "30%" }}>
											{(new Date(reunionesFiltradas[key].dateStart)).toLocaleDateString()}
										</div>
									</div>
									<div style={{ display: "flex", justifyContent: "flex-end", marginTop: "5px" }}>
										<div>
											<BasicButton
												claseHover={"classHover"}
												backgroundColor={{ background: "none", boxShadow: "none", border: "1px solid gainsboro" }}
												text={"Continuar editando"} //TRADUCCION
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
					<hr></hr>
					<div style={{ justifyContent: "flex-end", display: "inline" }}>
						<BasicButton
							text={"Más reuniones"} //TRADUCCION
							onClick={this.showModalAcciones}
						/>
					</div>
					<AlertConfirm
						requestClose={this.hideModalAcciones}
						open={this.state.modalAcciones}
						bodyText={
							Object.keys(reuniones).map(key => {
								return (
									<CollapsibleSection
										trigger={() => (
											<div style={{ border: "1px solid #ddd", boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 4px", marginTop: "1em", padding: '1em', cursor: "pointer" }} >
												<div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5em", marginLeft: "15px" }}>
													<div>
														{reuniones[key].state == 20 || reuniones[key].state == 30 ? (
															<i className={"fa fa-users"}></i>
														) : reuniones[key].state == 5 || reuniones[key].state == 10 ? (
															<i className={"fa fa-calendar-o"}></i>
														) : ""}

													</div>
													<div style={{ marginBottom: "5px", width: "60%", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
														{reuniones[key].name}
													</div>
													<div style={{ marginBottom: "5px", width: "30%", textAlign: "center" }}>
														{(new Date(reuniones[key].dateStart)).toLocaleDateString()}
													</div>
												</div>
												<div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", marginRight: "20px" }}>
													<div>
														<BasicButton
															claseHover={"classHover"}
															onClick={(event) => this.onClickContinuarEditando(event, reuniones[key].id)}
															backgroundColor={{ background: "none", boxShadow: "none", border: "1px solid gainsboro" }}
															text={"Continuar editando"} //TRADUCCION
														/>
													</div>
												</div>
											</div>
										)}
										collapse={() => (
											<div style={{ border: '2px solid gainsboro', borderTop: '0px', padding: '1em' }}>
												+ info de la reunion!
										</div>
										)}
										key={key}
									/>
								)
							})
						}
						title={"Últimas acciones de reuniones"} //TRADUCCION
						widthModal={{ width: "50%" }}
					/>
				</React.Fragment>

			);
		} else {
			return (
				<div style={{ display: 'inline-flex', alignItems: 'center', justifontent: 'center', height: '370px', }}>
					<div>Aun no hay reuniones</div>
				</div>
			)
		}
	}
}




export default UltimasAcciones;