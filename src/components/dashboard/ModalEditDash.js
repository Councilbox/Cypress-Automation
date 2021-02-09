import React from 'react';
import { getSecondary } from '../../styles/colors';
import { BasicButton, AlertConfirm, GridItem, Grid } from '../../displayComponents';


class ModalEditDash extends React.Component {
	render() {
		const { itemStorage, requestClose, open, title, items } = this.props;
		const secondary = getSecondary();

		return (
			<AlertConfirm
				requestClose={requestClose}
				open={open}
				bodyText={ // TRADUCCION
					<Grid
						style={{
							width: '100%',
							// marginTop: "4vh"
						}}
					>
						<GridItem xs={12} md={4} lg={4} style={{ display: 'inline-block', textAlign: 'center', alignItems: 'center' }}>
							<b>Buttons</b>
							<div>
								Descripcion grid botones
							</div>
							<div>
								<BasicButton
									text={items[0].buttons ? 'Desactive' : 'Active'} // TRADUCCION
									onClick={() => itemStorage('buttons', !items[0].buttons)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={4} lg={4} style={{ display: 'inline-block', textAlign: 'center', alignItems: 'center' }}>
							<b>Reuniones</b>
							<div>
								Descripcion de la grafica
									</div>
							<div>
								<BasicButton
									text={items[0].reuniones ? 'Desactive' : 'Active'} // TRADUCCION
									onClick={() => itemStorage('reuniones', !items[0].reuniones)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={4} lg={4} style={{ display: 'inline-block', textAlign: 'center', alignItems: 'center' }}>
							<b>Calendar</b>
							<div>
								Descripcion del calendario
									</div>
							<div>
								<BasicButton
									text={items[0].calendar ? 'Desactive' : 'Active'} // TRADUCCION
									onClick={() => itemStorage('calendar', !items[0].calendar)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={4} lg={4} style={{ display: 'inline-block', textAlign: 'center', alignItems: 'center' }}>
							<b>Ultimas acciones</b>
							<div>
								Descripcion de ultimas acciones
									</div>
							<div>
								<BasicButton
									text={items[0].lastActions ? 'Desactive' : 'Active'} // TRADUCCION
									onClick={() => itemStorage('lastActions', !items[0].lastActions)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={4} lg={4} style={{ display: 'inline-block', textAlign: 'center', alignItems: 'center' }}>
							<b>Reuniones sin sesión</b>
							<div>
								Descripcion de reuniones sin sesion
									</div>
							<div>
								<BasicButton
									text={items[0].noSession ? 'Desactive' : 'Active'} // TRADUCCION
									onClick={() => itemStorage('noSession', !items[0].noSession)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={4} lg={4} style={{ display: 'inline-block', textAlign: 'center', alignItems: 'center' }}>
							<b>Sección para reuniones</b>
							<div>
								Descripcion de reuniones sin sesion
									</div>
							<div>
								<BasicButton
									text={items[0].sectionReuniones ? 'Desactive' : 'Active'} // TRADUCCION
									onClick={() => itemStorage('sectionReuniones', !items[0].sectionReuniones)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
					</Grid>

				}
				title={title}// TRADUCCION
				widthModal={{ width: '50%' }}
			/>
		);
	}
}


export default ModalEditDash;
