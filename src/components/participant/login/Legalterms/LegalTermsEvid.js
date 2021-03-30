import React from 'react';
import { getPrimary } from '../../../../styles/colors';

const Title = ({ children }) => {
	const primary = getPrimary();

	return <h4 style={{ color: primary, marginTop: '1em' }}>{children}</h4>;
};

const LegalTermsEvid = ({ trigger }) => {
	return (
		<div>
			<Title>Consentimiento a la grabación</Title>
			<p>
				Autorizo al Ministerio de Justicia, como titular de los medios técnicos en la Administración de Justicia,
				a la captación de imágenes de mi persona, en fotografía o vídeo, con o sin voz, durante mi interacción
				para el trámite actual; asimismo, a utilizar el material que provea la grabación para las tareas necesarias
				específicamente como expresión de mi voluntad para llevar a cabo, por el órgano judicial, la actuación
				solicitada, pudiendo llevarse a cabo procesos de extracción del contenido mediante técnicas de textualización,
				y como evidencia electrónica de la interacción.
			</p>
			<Title>Consentimiento de tratamiento de datos de carácter personal</Title>
			<p>
				Los datos aportados por el interesado, a través del sistema de actos y servicios no presenciales provisto
				por el Ministerio de Justicia, se utilizarán, con carácter único y exclusivo, para los fines previstos en
				el procedimiento o actuación que se trate. En cumplimiento de lo dispuesto en el Reglamento General de
				Protección de Datos, (Reglamento UE 2016/679 del parlamento europeo y del consejo de 27 de abril de 2016) y
				de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos
				digitales, el cedente de los datos podrá, en cualquier momento, ejercitar los derechos de acceso, rectificación,
				olvido, cancelación, revocación del consentimiento, limitación del uso de datos, impugnación y oposición.
				No procede el derecho de portabilidad, de conformidad con el artículo 20.3 del Reglamento General de Protección de Datos.
			</p>
			<Title>Consentimiento para el inicio del trámite o actuación</Title>
			<p>
				Autorizo al órgano judicial a realizar esta actuación con los datos recabados en la presente videoconferencia.
			</p>
			{trigger}
		</div>
	);
};

export default LegalTermsEvid;
