import React from 'react';
import { AlertConfirm } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';

const SubTitle = ({ children }) => (
	<h5>{children}</h5>
);

const Block = ({ children }) => (
	<p
		style={{
			fontSize: '14px',
			fontWeight: 'normal',
			fontStretch: 'normal',
			fontStyle: 'normal',
			maxWidth: '900px',
			lineHeight: 'normal',
			letterSpacing: 'normal',
			textAlign: 'justify',
			color: 'black'
		}}
	>{children}</p>
);

const LegalModal = ({ open, requestClose, action, translate }) => {
	const primary = getPrimary();

	return (
		<AlertConfirm
			open={open}
			buttonCancel={translate.close}
			hideAccept={!action}
			buttonAccept={translate.accept}
			acceptAction={action}
			bodyText={
				<>
					<h2 style={{
						marginTop: '1em',
						color: primary,
						fontWeight: 'normal',
						fontStretch: 'normal',
						fontStyle: 'normal',
						lineHeight: 'normal',
						letterSpacing: 'normal'
					}}>
						{translate.legal_warning}
					</h2>
					<div>
						<SubTitle>Titularidad y régimen de responsabilidad de la Sede Electrónica de Councilbox OVAC</SubTitle>
						<Block>
							El artículo 3. 2 del Real Decreto 1671/2009, de 6 de noviembre por el que se desarrolla parcialmente la Ley 11/2007, de 22 de junio de acceso electrónico de los ciudadanos a los servicios públicos, determina que la Orden de creación de la Sede deberá Identificar su titular, así como al órgano u órganos encargados de la gestión y de los servicios puestos a disposición de los ciudadanos en la misma.
						</Block>
						<Block>
							En cumplimiento de dicho precepto el artículo 4 a) de la Orden JUS/458/2010 de 25 de febrero, por la que se crea la Sede Electrónica de Councilbox OVAC establece que la titularidad de la Sede Electrónica del Councilbox OVAC (https://ovac.councilbox.admin) corresponde a la Subsecretaría del Departamento.
						</Block>

						<Block>
							En cuanto al régimen de responsabilidad de la Sede, dicho artículo recoge:
						</Block>

						<Block>
							La gestión tecnológica de la sede será competencia de la División de Tecnologías de la Información y las Comunicaciones.
							Serán responsables de la gestión, de los contenidos y de los servicios puestos a disposición de los ciudadanos en la sede electrónica los titulares de los centros directivos del Departamento, y en su caso de los Organismos que se incorporen a la Sede. La responsabilidad se corresponderá con las competencias que cada uno de los titulares tenga atribuidas por la legislación vigente.
							La gestión de los contenidos comunes de la sede y la coordinación con los centros directivos del Departamento y los Organismos incorporados, en su caso, a la sede corresponderá a la Subsecretaría del Departamento.
							De acuerdo con el Art. 10.2 de la Ley 11/2007, de 22 de junio de acceso electrónico de los ciudadanos a los Servicios Públicos, “el establecimiento de una sede electrónica conlleva la responsabilidad del titular respecto de la integridad, veracidad y actualización de la información y los servicios a los que pueda accederse a través de la misma”.
						</Block>

						<Block>
							El artículo 7.1 del Real Decreto por el que se desarrolla parcialmente dicha Ley añade que &quot;El titular de la sede electrónica que contenga un enlace o vínculo a otra cuya responsabilidad corresponda a distinto órgano o Administración Pública no será responsable de la integridad, veracidad ni actualización de esta última. La sede establecerá los medios necesarios para que el ciudadano conozca si la información o servicio al que accede corresponde a la propia sede o a un punto de acceso que no tiene el carácter de sede o a un tercero&quot;.
						</Block>
						<Block>
							En este sentido en la Sede Electrónica se indica a través de mensajes sobre los enlaces si accediendo a ellos se abandona la sede o por el contrario permanece en ella.
						</Block>
						<Block>
							Condiciones generales de uso de la Sede Electrónica del Councilbox OVAC
						</Block>
						<Block>
							Councilbox OVAC le informa de que el acceso y uso de la Sede Electrónica (<a href="https://ovac.councilbox.com">https://ovac.councilbox.com</a>) y todos los subdominios y directorios incluidos bajo la misma (en adelante, conjuntamente denominados como la Sede Electrónica), así como los servicios o contenidos que a través de ella se puedan obtener, están sujetos a los términos que se detallan en este Aviso Legal, sin perjuicio de que el acceso a alguno de dichos servicios o contenidos pudieran precisar de la aceptación de unas Condiciones Generales adicionales.
						</Block>

						<Block>
							Por ello, si las consideraciones detalladas en este Aviso Legal no son de su conformidad, rogamos no haga uso de la Sede Electrónica, ya que cualquier uso que haga de la misma o de los servicios y contenidos en ella incluidos implicará la aceptación de los términos legales recogidos en este texto.
						</Block>
						<Block>
							Councilbox OVAC se reserva el derecho a realizar cambios en la Sede sin previo aviso, con el objeto de actualizar, corregir, modificar, añadir o eliminar los contenidos de la Sede o de su diseño.
						</Block>
						<Block>
							Los contenidos y servicios que ofrece la Sede se actualizan periódicamente. Debido a que la actualización de la información no es inmediata, le sugerimos que compruebe siempre la vigencia y exactitud de la información, servicios y contenidos recogidos en la Sede.
						</Block>
						<Block>
							Las condiciones y términos que se recogen en el presente Aviso pueden variar, por lo que le invitamos a que revise estos términos cuando visite de nuevo la Sede.
						</Block>
						<Block>
							Councilbox OVAC prohíbe expresamente la realización de &quot;framings&quot; o la utilización por parte de terceros de cualesquiera otros mecanismos que alteren el diseño, configuración original o contenidos de su Portal.
						</Block>
						<Block>
							Propiedad intelectual e industrial<br/>
							Tanto el diseño de esta Sede y sus códigos fuente, como los logos, marcas, y demás signos distintivos que aparecen en la misma, pertenecen a Councilbox OVACy están protegidos por los correspondientes derechos de propiedad intelectual e industrial.
						</Block>
						<Block>
							Su uso, reproducción, distribución, comunicación pública, transformación o cualquier otra actividad similar o análoga, queda totalmente prohibida salvo que medie autorización expresa de Councilbox OVAC
						</Block>
						<Block>
							La licencia de uso de cualquier contenido de esta Sede, otorgada al usuario, se limita a la descarga de dicho contenido y el uso privado del mismo, siempre que los citados contenidos permanezcan íntegros y se cite la fuente de los mismos (Ley 37/2007, de 16 de noviembre, sobre reutilización de la información del sector público).
						</Block>
						<Block>
							Consulte la información reutilizable puesta a disposición por Councilbox OVAC y las condiciones de reutilización en la sección de datos abiertos de esta sede electrónica.
						</Block>
						<Block>
							Privacidad y Protección de Datos<br/>
							De acuerdo con el Reglamento general de protección de datos, la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales y la normativa concordante y de desarrollo,  Councilbox OVAC trata los datos personales de manera confidencial y exclusivamente para fines determinados, explícitos y legítimos.
						</Block>
						<Block>
							Siempre que concurran los requisitos necesarios, puede usted ejercer los derechos de acceso, rectificación, supresión, limitación y oposición de los datos, dirigiéndose al responsable del tratamiento, o bien a través de la red de oficinas de asistencia en materia de registros. No procede el derecho de portabilidad, de conformidad con el artículo 20.3 del Reglamento general de protección de datos.
						</Block>
						<Block>
							Councilbox OVAC se compromete al cumplimiento de su obligación de secreto con respecto a los datos de carácter personal y al deber de tratarlos con confidencialidad y seguridad. A estos efectos, adoptará las medidas necesarias para evitar su alteración, pérdida, tratamiento o acceso no autorizado.
						</Block>
						<Block>
							Councilbox OVAC mantiene los niveles de protección de sus datos personales y ha establecido todos los medios técnicos a su alcance para evitar la pérdida, mal uso, alteración, acceso no autorizado y robo de los datos que Usted facilite a Councilbox OVAC, sin perjuicio de que las medidas de seguridad en Internet no sean inexpugnables.
						</Block>
						<Block>
							Councilbox OVAC se reserva la facultad de modificar la presente Política de Privacidad para adaptarla a las novedades legislativas, jurisprudenciales o de interpretación de la Agencia Española de Protección de Datos. En este caso,  Councilbox OVAC anunciará dichos cambios, indicando claramente y con la debida antelación las modificaciones efectuadas.
						</Block>
					</div>
				</>
			}
			requestClose={requestClose}
		/>
	);
};

export default LegalModal;
