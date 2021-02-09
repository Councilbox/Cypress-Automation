import React from 'react';
import {
	AlertConfirm,
	BasicButton,
	CollapsibleSection,
	Link
} from '../../displayComponents';
import 'react-big-calendar/lib/css/react-big-calendar.css';


class SinSesion extends React.Component {
	state = {
		modalAcciones: false,
		showActions: false
	}

	onClickContinuarEditando = (event, id) => {
		// esto te llevara a la pagina en donde se edita la reunion - ya funciona el id y el event
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
		const { translate, reuniones, estados, company } = this.props;
		// Filtramos primero por los estados 5,10,20,30
		let reunionesFiltradasPorEstado;
		if (estados) {
			reunionesFiltradasPorEstado = Object.keys(reuniones).filter(key => estados.includes(reuniones[key].state)).reduce((obj, key) => {
				obj[key] = reuniones[key];
				return obj;
			}, []);
		} else {
			reunionesFiltradasPorEstado = reuniones;
		}
		// sacamos solo 3 reuniones
		const reunionesFiltradas = Object.keys(reunionesFiltradasPorEstado).filter(key => reunionesFiltradasPorEstado.length > 3).reduce((obj, key) => {
			if (key < 3) {
				obj[key] = reunionesFiltradasPorEstado[key];
			}
			return obj;
		}, {});

		const textStates = { 5: 'Guardada', 10: 'Preparada', 20: 'Celebrándose', 30: 'Celebrándose', 40: 'Finalizada' };// TRADUCCIONES

		if (reuniones.length) {
			return (
				<React.Fragment >
					<div style={{ height: '335px', textAlign: 'left', overflow: 'hidden' }}>
						{Object.keys(reunionesFiltradas).map(key => (
								<div key={key} style={{ border: '1px solid #ddd', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px', marginBottom: '1em', padding: '1em' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<div style={{ marginBottom: '5px', width: '60%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex' }}>
											<div style={{ marginRight: '0.5em' }}>
												{reunionesFiltradas[key].state == 20 || reunionesFiltradas[key].state == 30 ? (
													<i className={'fa fa-users'}></i>
												) : reunionesFiltradas[key].state == 5 || reunionesFiltradas[key].state == 10 ? (
													<i className={'fa fa-calendar-o'}></i>
												) : ''}
											</div>
											{reunionesFiltradas[key].name}
										</div>
										<div style={{ marginBottom: '5px', width: '30%' }}>
											{(new Date(reunionesFiltradas[key].dateStart)).toLocaleDateString()}
										</div>
									</div>
									<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
										<div>
											<Link to={`/company/${company.id}/council/${reunionesFiltradas[key].id}`}>
												<BasicButton
													buttonStyle={{ minWidth: '155px' }}
													claseHover={'classHover'}
													backgroundColor={{ background: 'none', boxShadow: 'none', border: '1px solid gainsboro' }}
													text={textStates[reunionesFiltradas[key].state]} // TRADUCCION
												/>
											</Link>
										</div>
									</div>
								</div>
							))}
					</div>
					<hr></hr>
					<div style={{ justifyContent: 'flex-end', display: 'inline' }}>
						<BasicButton
							text={'Más reuniones'} // TRADUCCION
							onClick={this.showModalAcciones}
						/>
					</div>
					<AlertConfirm
						requestClose={this.hideModalAcciones}
						open={this.state.modalAcciones}
						bodyText={
							Object.keys(reuniones).map(key => (
									<CollapsibleSection
										trigger={() => (
											<div style={{ border: '1px solid #ddd', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px', marginTop: '1em', padding: '1em', cursor: 'pointer' }} >
												<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5em', marginLeft: '15px' }}>
													<div>
														{reuniones[key].state == 20 || reuniones[key].state == 30 ? (
															<i className={'fa fa-users'}></i>
														) : reuniones[key].state == 5 || reuniones[key].state == 10 ? (
															<i className={'fa fa-calendar-o'}></i>
														) : ''}

													</div>
													<div style={{ marginBottom: '5px', width: '60%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
														{reuniones[key].name}
													</div>
													<div style={{ marginBottom: '5px', width: '30%', textAlign: 'center' }}>
														{(new Date(reuniones[key].dateStart)).toLocaleDateString()}
													</div>
												</div>
												<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginRight: '20px' }}>
													<div>
														<Link to={`/company/${company.id}/council/${reuniones[key].id}`}>
															<BasicButton
																buttonStyle={{ minWidth: '155px' }}
																claseHover={'classHover'}
																backgroundColor={{ background: 'none', boxShadow: 'none', border: '1px solid gainsboro' }}
																text={textStates[reuniones[key].state]} // TRADUCCION
																onClick={event => this.onClickContinuarEditando(event, reuniones[key].id)}
															/>
														</Link>
														{/* <BasicButton
															buttonStyle={{ minWidth: '155px' }}
															claseHover={"classHover"}
															onClick={(event) => this.onClickContinuarEditando(event, reuniones[key].id)}
															backgroundColor={{ background: "none", boxShadow: "none", border: "1px solid gainsboro" }}
															text={"Celebrandose"} //TRADUCCION
														/> */}
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
								))
						}
						title={'Últimas acciones'} // TRADUCCION
						widthModal={{ width: '50%' }}
					/>
				</React.Fragment>

			);
		}
			return (
				<div style={{ display: 'inline-flex', alignItems: 'center', justifontent: 'center', height: '370px', }}>
					<div>Aun no hay reuniones</div>
				</div>
			);
	}
}


export default SinSesion;
