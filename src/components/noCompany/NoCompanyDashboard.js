import React from "react";
import { darkGrey, lightGrey } from "../../styles/colors";
import { Block, Grid, GridItem } from '../../displayComponents';


const NoCompanyDashboard = ({ translate, company, user }) => {
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
                        {/*TRADUCCION*/}
						Le damos la bienvenida.
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
                        {/*TRADUCCION*/}
						No tiene ninguna entidad asociada a su usuario, puede crear o vincular una, o probar a realizar una conferencia.
					</div>
                    <Grid
                        style={{
                            width: "90%",
                            marginTop: "4vh"
                        }}
                        spacing={8}
                    >
                        <GridItem xs={12} md={6} lg={4}>
                            <Block
                                link={`/company/create`}
                                icon="add"
                                text="Crear entidad"/*TRADUCCION*/
                            />
                        </GridItem>

                        <GridItem xs={12} md={6} lg={4}>
                            <Block
                                link={`/company/link`}
                                icon="link"
                                text="Vincular entidad"/*TRADUCCION*/
                            />
                        </GridItem>

                        <GridItem xs={12} md={6} lg={4}>
                            <Block
                                link={`/meeting/new`}
                                icon="video_call"
                                text={'Iniciar conferencia'}/*TRADUCCION*/
                            />
                        </GridItem>
                    </Grid>
				</div>
			</div>
		</div>
	);
}

export default NoCompanyDashboard;
