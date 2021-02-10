import React from 'react';
import {
	AlertConfirm,
	BasicButton,
	CollapsibleSection
} from '../../displayComponents';
import 'react-big-calendar/lib/css/react-big-calendar.css';


class UltimasAcciones extends React.Component {
	state = {
		modalAcciones: false,
		showActions: false
	}

	onClickContinuarEditando = event => {
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
		const { councils, states } = this.props;
		let reunionesFiltradasPorEstado;
		if (states) {
			reunionesFiltradasPorEstado = councils.filter(council => states.includes(council.state));
		} else {
			reunionesFiltradasPorEstado = councils;
		}

		const reunionesFiltradas = reunionesFiltradasPorEstado.splice(0, 3);
		if (councils.length) {
			return (
				<React.Fragment >
					<div style={{ height: '335px', textAlign: 'left', overflow: 'hidden' }}>
						{reunionesFiltradas.map(council => (
								<div
									key={`council_${council.id}`}
									style={{
										border: '1px solid #ddd',
										boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px',
										marginBottom: '1em',
										padding: '1em'
									}}
								>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<div
											style={{
												marginBottom: '5px',
												width: '60%',
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												display: 'flex'
											}}
										>
											<div style={{ marginRight: '0.5em' }}>
												{council.state === 20 || council.state === 30 ? (
													<i className={'fa fa-users'}></i>
												) : council.state === 5 || council.state === 10 ? (
													<i className={'fa fa-calendar-o'}></i>
												) : ''}
											</div>
											{council.name}
										</div>
										<div style={{ marginBottom: '5px', width: '30%' }}>
											{(new Date(council.dateStart)).toLocaleDateString()}
										</div>
									</div>
									<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
										<div>
											<BasicButton
												claseHover={'classHover'}
												backgroundColor={{ background: 'none', boxShadow: 'none', border: '1px solid gainsboro' }}
												text={'Continuar editando'} // TRADUCCION
											/>
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
							Object.keys(councils).map(key => (
									<CollapsibleSection
										trigger={() => (
											<div
												style={{
													border: '1px solid #ddd',
													boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px',
													marginTop: '1em',
													padding: '1em',
													cursor: 'pointer'
												}}
											>
												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														marginTop: '0.5em',
														marginLeft: '15px'
													}}
												>
													<div>
														{councils[key].state === 20 || councils[key].state === 30 ? (
															<i className={'fa fa-users'}></i>
														) : councils[key].state === 5 || councils[key].state === 10 ? (
															<i className={'fa fa-calendar-o'}></i>
														) : ''}

													</div>
													<div style={{
 marginBottom: '5px', width: '60%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
}}>
														{councils[key].name}
													</div>
													<div style={{ marginBottom: '5px', width: '30%', textAlign: 'center' }}>
														{(new Date(councils[key].dateStart)).toLocaleDateString()}
													</div>
												</div>
												<div style={{
 display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginRight: '20px'
}}>
													<div>
														<BasicButton
															claseHover={'classHover'}
															onClick={event => this.onClickContinuarEditando(event, councils[key].id)}
															backgroundColor={{ background: 'none', boxShadow: 'none', border: '1px solid gainsboro' }}
															text={'Continuar editando'} // TRADUCCION
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
								))
						}
						title={'Últimas acciones'} // TRADUCCION
						widthModal={{ width: '50%' }}
					/>
				</React.Fragment>

			);
		}
			return (
				<div style={{
 display: 'inline-flex', alignItems: 'center', justifontent: 'center', height: '370px',
}}>
					<div>Aun no hay councils</div>{/* TRADUCCION */}
				</div>
			);
	}
}


export default UltimasAcciones;
