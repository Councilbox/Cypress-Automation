import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { Grid, GridItem } from '../../../../../displayComponents';
import FeatureExceptionSelect from './FeatureExceptionSelect';

const editableFeatures = {
	hideAbstentionButton: 'Ocultar botón abstención a los participantes',
	hideNoVoteButton: 'Ocultar botón no vota a los participantes',
	hideRecount: 'Ocultar recuento a los participantes',
	hideVotingButtons: 'Mostrar botones de votación solo mientras el punto está abierto',
	participantsHeader: 'Cabecera de participantes en la sala',
	quickAccess: 'Acceso rápido con QR',
	attendanceComment: 'Mostrar editor de texto en el menú de intención de asistencia',
	roomAccessConvene: 'Incluir la convocatoria en el correo de acceso a sala'
};


const CompanyFeaturesEditor = ({ client, companyId }) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);


	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query Features($companyId: Int!) {
					features {
						id
						name
						active
						value
					}
					companyFeatureExceptions(companyId: $companyId) {
						id
						featureName
						companyId
						active
					}
				}
			`,
			variables: {
				companyId
			}
		});

		console.log(response);
		setData(response.data);
		setLoading(false);
	}, [companyId]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const findException = featureName => {
		if (data.companyFeatureExceptions.length === 0) {
			return null;
		}
		return data.companyFeatureExceptions.find(exception => exception.featureName === featureName);
	};

	const printExceptionMenu = featureName => {
		const exception = findException(featureName);

		return (
			<FeatureExceptionSelect
				exception={exception}
				companyId={companyId}
				refetch={getData}
				featureName={featureName}
			/>
		);
	};

	return (
		<Grid style={{ overflow: 'hidden' }}>
			<GridItem xs={12} md={7} lg={7}>
				Features {companyId}
			</GridItem>
			<Grid>
				<GridItem xs={4} md={4} lg={4}>
					Funcionalidad
				</GridItem>
				<GridItem xs={4} md={4} lg={4}>
					Valor Councilbox
				</GridItem>
				<GridItem xs={4} md={4} lg={4}>
					Valor entidad
				</GridItem>
				{!loading && data.features.filter(feature => editableFeatures[feature.name]).map(feature => (
					<Grid key={feature.id}>
						<GridItem xs={4} md={4} lg={4}>
							{feature.name}
						</GridItem>
						<GridItem xs={4} md={4} lg={4}>
							{feature.active ? 'Activada' : 'Desactivada'}
						</GridItem>
						<GridItem xs={4} md={4} lg={4}>
							{printExceptionMenu(feature.name)}
						</GridItem>
					</Grid>
				))}
			</Grid>
		</Grid>
	);
};

export default withApollo(CompanyFeaturesEditor);
