import React, { Component, Fragment } from 'react';
import { AlertConfirm} from '../../displayComponents';

class TermsModal extends Component {

    _renderNewPointBody = () => {
        //style="font-size:14px; padding: 2vw; text-align: justify;text-justify: inter-word;"
        return(
                <div >
                    <p><b>1.- Objeto</b></p>
                    <p>El registro como Usuario y la utilización de los servicios de
                        Councilbox suponen la aceptación completa y sin reservas de
                        cada una de las cláusulas integrantes de las Condiciones
                        Generales de Contratación y Uso de Servicios en la versión
                        publicada en el momento mismo en que el Usuario contrate el servicio.
                        La contratación de los servicios prestados por Councilbox, de
                        acuerdo con estas Condiciones Generales de Contratación y Uso
                        de Servicios y con las características que se especifiquen en
                        la concreta oferta o modalidad a la que el Cliente se acoja, supone
                        el derecho del Cliente al uso de una cuenta personal en la plataforma
                        , u otros nuevos servicios que Councilbox ponga a disposición
                        del Cliente, todo ello en los términos recogidos en las
                        presentes Condiciones Generales de Contratación y Uso de
                        Servicios.</p>

                    <p><b>2.- Aceptación de la suscripción</b></p>

                    <p>Al suscribirte a cualquier plan de Councilbox estás aceptando los
                        términos de suscripción recogidos en <a href="http://www.councilbox.com/" target="_blank">
                            www.councilbox.com</a>.
                    </p>

                    <p>Councilbox es una aplicación B2B (Business to Business), por lo que
                        únicamente podrán solicitar inscripción, las
                        empresas registradas como tal.</p>

                    <p>Esta suscripción garantiza al Cliente (por ejemplo, la entidad
                        legal que solicita la suscripción) el derecho al uso de la
                        plataforma de celebración de juntas, consejos de
                        administración y reuniones de Councilbox (de ahora en adelante
                        “la Plataforma”).</p>

                    <p>La plataforma no puede ser utilizada por otras personas u organizaciones
                        que no sean el Cliente. Si las firmas de contabilidad, gestorías,
                        consultoras, abogados, etc. aceptan la suscripción en nombre
                        de un cliente, deberán informar al cliente de los términos
                        de suscripción.
                    </p>

                    <p><b>3.- Cuentas</b></p>

                    <p><u>Aptitud para tener una Cuenta</u></p>

                    <p>- Para estar facultado para contratar y utilizar nuestros Servicios,
                        el Usuario debe ser una persona física mayor de edad y
                        disponer de la capacidad jurídica suficiente para contratar
                        conforme a su legislación personal, o una persona jurídica
                        válidamente constituida conforme a la Ley para operar en el
                        mercado y disponer de la capacidad jurídica suficiente para
                        vincularse por las presentes Condiciones Generales
                    </p>
                    <p>- Completar correcta y verazmente nuestro proceso de registro para
                        abrir una Cuenta.</p>

                    <p><u>Apertura de Cuenta.</u></p>

                    <p>Para completar el proceso de registro y abrir una Cuenta, el Usuario debe:</p>
                    <p>1.- Rellenar los campos que en cada caso se le obliguen, siendo siempre
                        imprescindible un email válido. Que junto con la contraseña,
                        se denominan “ Councilbox ID” y permiten al Usuario
                        acceder a su Cuenta y utilizar los Servicios.</p>
                    <p>2.- Aceptar las presentes Condiciones Generales, así como las
                        técnicas y las particulares, si las hubiese.</p>
                    <p>3.- Hacer el pago correspondiente al producto seleccionado. Y en los
                        plazos seleccionados.</p>

                    <p><u>Cierre o restricción del uso de la Cuenta.</u></p>

                    <p>El Usuario puede cerrar su cuenta en cualquier momento escribiendo un
                        email a info@councilbox.com o haciendo uso de su área de
                        Cliente. Councilbox se reserva el derecho de cerrar una Cuenta o
                        restringir sus funcionalidades, sin necesidad de que medie preaviso
                        al Usuario y siempre que exista sospecha o constatación por
                        parte de Councilbox de que dicha Cuenta se utiliza para actividades ilegales o contrarias a
                        lo establecido en el contrato entre el Usuario y Councilbox.
                        Councilbox se reserva el derecho de cerrar una Cuenta o restringir sus
                        funcionalidades, si no se producen el abono de los cargos en los
                        plazos acordados. El cierre de la Cuenta implica la pérdida
                        del acceso del Usuario. Las cancelaciones de Cuentas creadas sobre
                        promociones se acogerán a las penalizaciones que cada
                        promoción describa.</p>

                    <p><b>4.- Autenticación</b></p>

                    <p>Para que el Usuario acceda a su Cuenta y utilice los Servicios puede
                        utilizar Métodos de autenticación que Councilbox
                        disponga o acuerde: Councilbox ID: requiere el email y contraseña
                        utilizados en el proceso de registro. Que deben ser validados a
                        través de respuesta en un e-mail válido.
                    </p>
                    <p>Usted
                        es responsable de la custodia de la contraseña, debiendo
                        ponerse en contacto con nosotros (escribiendo un email dirigido a
                        info@councilbox.com) en caso de sustracción, pérdida o
                        utilización inadecuada de la misma por terceras personas. En
                        caso contrario, Usted será responsable de las consecuencias o
                        daños que un uso fraudulento o inadecuado de las mismas
                        pudieran causar.</p>

                    <p><b>5.-
                        Tarifas y Crédito</b></p>

                    <p>Councilbox
                        cobrará al Cliente por la prestación de los Servicios
                        las tarifas vigentes en cada momento así como en su caso el
                        importe por alta a la aceptación del Contrato de los
                        servicios, conforme a lo especificado en la concreta oferta o
                        modalidad a la que el Cliente se acoja. Las tarifas pueden ser
                        incrementadas con los impuestos legalmente aplicables. Councilbox
                        podrá modificar las tarifas aplicables avisando de ello al
                        Cliente con una antelación no inferior a quince días
                        naturales; la continuación por el Cliente en el uso de los
                        Servicios prestados por Councilbox
                        tras la comunicación de las nuevas tarifas por Councilbox
                        supondrá la aceptación tácita por el Cliente de
                        tales nuevas tarifas.</p>

                    <p><b>6.- Forma de Pago</b></p>

                    <p>Councilbox facturará al cliente, con la periodicidad que se especifique
                        en las condiciones de la concreta oferta o modalidad a la que el
                        Cliente se acoja, detallando los distintos componentes de la tarifa
                        final, la cantidad que éste deba abonar por la prestación
                        de los Servicios. El Cliente deberá optar, para los pagos a
                        sus vencimientos, entre el pago por domiciliación bancaria en
                        una cuenta de su titularidad, o entregar un número de una
                        tarjeta de crédito o débito en la que cargar los
                        importes debidos en la fecha de pago señalada en la factura.
                        El Cliente autoriza a Councilbox para aplicar los importes que el
                        Cliente abone a Councilbox a la extinción de cualquier deuda
                        vencida, líquida, exigible y pendiente de pago que el Cliente
                        haya contraído previamente con Councilbox con independencia
                        de cuál sea el concreto servicio prestado por Councilbox al
                        Cliente a que correspondan uno y otra. Asimismo, el Cliente autoriza
                        a Councilbox para compensar automáticamente y en el importe
                        concurrente las deudas vencidas, líquidas y exigibles que
                        puedan existir de forma recíproca entre el Cliente y
                        Councilbox con independencia de cuál sea el concreto servicio
                        prestado por Councilbox al Cliente a que corresponda cada deuda. En
                        caso de Crédito insuficiente en el momento del pago, el
                        servicio podrá no activarse y se efectuará aviso al
                        Usuario al que correspondiese el pago.</p>

                    <p><b>7.- Protección de datos/ Seguridad</b></p>

                    <p>Councilbox
                        realiza el tratamiento de datos de carácter personal de sus
                        usuarios de conformidad con la Directiva 95/46/CE, del Parlamento
                        Europeo y del Consejo de 24 de octubre de 1995, relativa a la
                        protección de las personas físicas en lo que respecta
                        al tratamiento de datos personales y a la libre circulación de
                        estos datos, así como la Ley Orgánica 15/1999, de 13 de
                        diciembre, de Protección de Datos de carácter personal
                        y su normativa de desarrollo.</p>

                    <p>En
                        el proceso de registro como usuario, se solicitan los datos mínimos
                        para el alta y utilización del servicio ,información
                        que además es necesaria para el mantenimiento y gestión
                        de las relaciones con los usuarios, así como para poder
                        comunicarle las novedades o cambios existentes. Dicha información,
                        junto con la dirección IP de la máquina desde la que
                        accede y cookies de sesión (que se eliminan al poco tiempo una
                        vez se cierra el navegador), es guardada y gestionada por Councilbox
                        con la debida confidencialidad, aplicando las medidas de seguridad
                        informática establecidas en la legislación anterior
                        para impedir el acceso o uso indebido a sus datos, su manipulación,
                        deterioro o pérdida. Estos datos no serán cedidos a
                        terceros salvo en los casos legalmente previstos, sin perjuicio de
                        que los usuarios pueden, en cualquier momento, ejercer sus derechos
                        de acceso, cancelación o rectificación en relación
                        con dichos datos, solicitándolo a la dirección
                        info@councilbox.com. Councilbox únicamente tratará los
                        datos asociados al documento conforme a las instrucciones del Usuario
                        (responsable de los datos) y con la finalidad de garantizar su
                        almacenamiento y acceso por parte de éste o de las personas o
                        entidades expresamente autorizadas por su parte, incluyendo la
                        realización de copias de seguridad y la provisión de
                        sistemas o herramientas de recuperación de los datos.</p>
                    <p>El
                        Usuario podrá ejercer en cualquier momento sus derechos de
                        acceso, rectificación, cancelación y oposición
                        sobre sus datos particulares en los términos previstos en la
                        LO 15/1999 de Protección de Datos de Carácter Personal
                        y en el RD 1720/2007 por el que se aprueba el Reglamento de
                        desarrollo de la Ley Orgánica. Su ejercicio podrá
                        efectuarse en cualquier momento mediante el envío de un e-mail
                        a la dirección info@councilbox.com mediante solicitud firmada
                        acompañando copia de su DNI. Respecto a los datos de las
                        conversaciones, no pueden ser eliminadas de la BBDD en plazo previo
                        al automatizado por nuestros sistemas. El Usuario acepta esta
                        condición. Igualmente es preciso recordar que estos datos son
                        sólo visibles para el Usuario en su totalidad y al
                        Destinatario (si lo hubiese) sólo aquello que sea validado por
                        el Usuario.</p>
                    <p>Existe
                        la posibilidad de acceso a sus datos bajo demanda y con la aportación
                        de un código que sólo el Usuario conoce por un notario
                        requerido al efecto por Councilbox Technology S.L. Councilbox
                        implantará las medidas de seguridad, tanto técnicas
                        como organizativas, que garanticen la integridad de los datos,
                        evitando su alteración, pérdida, tratamiento o acceso
                        no autorizados, establecidos en el Real Decreto 1720/2007, de 21 de
                        diciembre, por el que se aprueba el Reglamento de desarrollo de la
                        Ley Orgánica 15/1999, de 13 de diciembre, de protección
                        de datos de carácter personal, o normativa que lo sustituya.
                        Para ello se tendrá en cuenta la tecnología existente,
                        la naturaleza de los datos almacenados y los riesgos a los que estén
                        expuestos, ya provengan dichos riesgos de la acción humana o
                        del medio físico o natural. Councilbox no asumirá
                        ninguna otra responsabilidad que no sea la expresamente señalada
                        en este documento en relación a esta información.</p>

                    <p>Councilbox
                        Technology S.L. se reserva el derecho a modificar las presentes
                        condiciones de su Política de Protección de Datos, de
                        conformidad con la legislación aplicable en cada momento.
                        Cualquier modificación será incluida en las presentes
                        condiciones y&nbsp; publicada en el Sitio Web a la que tendrán
                        acceso todos los Usuarios, de conformidad con las condiciones
                        establecidas en el Aviso Legal&nbsp; de la misma.</p>

                    <p><b>8.-
                        Propiedad Intelectual e Industrial</b></p>

                    <p>La
                        totalidad de las aplicaciones o programas informáticos que
                        hacen posible Councilbox, incluyendo el diseño del sitio web,
                        sus bases de datos (incluyendo la de plantillas o modelos de
                        documentos), estructura de navegación, textos, imágenes,
                        animaciones, logotipos o nombres, son titularidad de Councilbox
                        Technology S.L. o, cuando se indica, corresponden a terceros que
                        autorizan su uso e integración en la plataforma, y están
                        protegidos por las leyes y tratados sobre propiedad intelectual e
                        industrial.</p>

                    <p>En
                        ningún caso, se permitirá cualquier extracción,
                        reutilización y/o explotación de dichos contenidos,
                        fórmulas, métodos o sistemas que supongan actos
                        contrarios a una explotación normal de los mismos,
                        especialmente su utilización con fines comerciales o
                        promocionales, al margen del servicio Councilbox o que perjudiquen
                        los derechos morales o de explotación de Councilbox o sus
                        usuarios. En caso de que se considere que alguno de los contenidos de
                        Councilbox infringe derechos de propiedad intelectual propios o de
                        terceros, le rogamos nos lo comunique para que adoptemos las medidas
                        oportunas.</p>

                    <p><b>9.-Responsabilidad
                        y Garantías </b>
                    </p>

                    <p>Councilbox
                        Technology S.L., independientemente de que hubiese advertido de la
                        posibilidad de que se produjesen daños o no, nunca será
                        responsable:
                    </p>

                    <ol>
                        <li>
                            <p>De ningun daño o pérdida indirecta o consecuente</p>
                        </li>
                        <li>
                            <p>De ninguna pérdida de prestigio, reputación empresarial o
                                de datos.</p>
                        </li>
                        <li>
                            <p>De ninguna pérdida económica (incluida pérdida de
                                ingresos, ganancias, contratos, negocios, lucro cesante o emergente.</p>
                        </li>
                        <li>
                            <p>De las soluciones de terceros que estén disponibles o integradas
                                en la aplicación.</p>
                        </li>
                        <li>
                            <p>De la corrección, exactitud, actualidad e integridad de la
                                información o por los resultados que hayan sido obtenidos por
                                medio de soluciones de terceros.</p>
                        </li>
                        <li>
                            <p>Por la disponibilidad, seguridad y funcionalidad de tales soluciones de
                                terceros, incluyendo cualquier daño y/o pérdida que
                                sea causado por tales soluciones de terceros.</p>
                        </li>
                        <li>
                            <p>De las interrupciones del servicio, demoras, errores, mal
                                funcionamiento del mismo y, en general, demás inconvenientes
                                que tengan su origen en causas que escapan de su control, y/o
                                debida a una actuación dolosa o culposa del Usuario, o tengan
                                por origen causas de fuerza mayor.
                            </p>
                        </li>
                    </ol>

                    <p>Sin
                        perjuicio de lo establecido en el artículo 1.105 del Código
                        Civil, se entenderán incluidos en el concepto de fuerza mayor,
                        además, y a los efectos de las presentes condiciones
                        generales, todos aquellos acontecimientos acaecidos fuera del control
                        de Councilbox Technology S.L., tales como: fallo de terceros,
                        operadores o compañías de servicios, actos de Gobierno,
                        falta de acceso a redes de terceros, actos u omisiones de las
                        autoridades públicas, aquellos otros producidos como
                        consecuencia de fenómenos naturales, apagones, etc., y el
                        ataque de hackers o terceros especializados a la seguridad o
                        integridad del sistema informático, siempre que Councilbox
                        Technology S.L. haya adoptado todas las medidas de seguridad
                        existentes de acuerdo con el estado de la técnica.</p>

                    <p>En
                        todo caso, para el supuesto de que se declarase alguna
                        responsabilidad de Councilbox, se pacta expresamente que el total de
                        las indemnizaciones y/o suma global a su cargo no excederá del
                        importe del precio que haya pagado el licenciatario, por la licencia
                        de uso, durante los doce últimos meses.</p>

                    <p><b>10.- Estabilidad en el Funcionamiento </b>
                    </p>
                    <p>Councilbox Technology S.L.,
                        tiene como objetivo proporcionar la máxima estabilidad en el
                        funcionamiento, pero no es responsable de las averías
                        producidas por causa de fuerza mayor, por aquellas que no hubieran
                        podido preverse, o que, previstos, fueran inevitables.</p>
                    <p>Councilbox
                        Technology garantiza el funcionamiento de la plataforma en cuanto a
                        la ausencia de errores o defectos de programación, compilación
                        o de diseño graves, así como la custodia de la
                        información alojada en sus servidores. Councilbox Technology
                        S.L. responderá por los mismos, dentro de los límites
                        legales establecidos por la legislación española. En
                        todo caso quedan excluidos los daños y perjuicios derivados de
                        un accidente, uso o aplicación indebida, no permitida o
                        imprevista, así como por cualesquiera otros, directos o
                        indirectos, consiguientes, incidentales o especiales, incluyendo de
                        forma enunciativa pero no limitativa, cualquier daño emergente
                        o lucro cesante, interrupción del trabajo, avería,
                        fallo o pérdida, o por cualquier reclamación por parte
                        de terceros como consecuencia de lo anterior.</p>

                    <p>Councilbox
                        Technology S.L. se compromete a tomar las medidas razonables para que
                        la plataforma esté libre de virus, pero en el caso de que esto
                        ocurriese, Councilbox no será responsable.
                    </p>
                    <p>Es preciso tomar en
                        consideración que la calidad y rapidez del acceso al servicio
                        depende, en gran medida, del equipo informático que posee el
                        cliente (hardware y software), su proveedor de telecomunicaciones o
                        de su conexión a la red. Es por ello por lo que Councilbox
                        Technology S.L. no se hará responsable del funcionamiento
                        anormal, fallos, errores o daños directos o indirectos, que
                        puedan causarse al sistema informático del usuario o a los
                        ficheros o documentos almacenados en el mismo, que sean causado o se
                        deriven de:</p>
                    <ol>
                        <li>
                            <p>La capacidad o calidad de su sistema informático o la presencia
                                de un virus en el ordenador del Usuario que sea utilizado para el
                                acceso o utilización de los productos o servicios
                                contratados.</p>
                        </li>
                        <li>
                            <p>Su conexión o acceso a Internet.</p>
                        </li>
                        <li>
                            <p>Un mal funcionamiento de su navegador u otras aplicaciones instaladas
                                en su , o por el uso de versiones de las mismas que no estén
                                actualizadas o no se obtenga la correspondiente licencia de Usuario.</p>
                        </li>
                    </ol>

                    <p>En todo caso, Councilbox Technology procurará restablecer el
                        servicio, y restaurar el funcionamiento de la plataforma para sus
                        clientes lo antes posible.</p>

                    <p><b>11.- Mantenimiento y actualización del servicio</b></p>

                    <p>Councilbox
                        Technology S.L. se reserva la facultad de efectuar, en cualquier
                        momento, modificaciones y actualizaciones en la prestación del
                        servicio, sus contenidos, configuración, disponibilidad y
                        presentación de la información, así como de las
                        presentes condiciones de uso, sin perjuicio de los derechos
                        adquiridos, así como a suspender temporalmente el acceso para
                        realizar tareas de mantenimiento o mejoras. En algunas circunstancias
                        es posible, que sea necesario suspender el acceso a la plataforma
                        entre las 21:00 y las 06:00 horas. En aquellos casos, los clientes
                        serán advertidos con la antelación suficiente, sin que
                        corresponda reclamación alguna por este concepto por los daños
                        y perjuicios directos o indirectos que se deriven del mismo.</p>

                    <p><b>12.- Cambio en los Términos y Condiciones</b></p>

                    <p>Councilbox se reserva el derecho de modificar, en cualquier momento, la
                        presentación y configuración del sitio web, así
                        como las presentes condiciones generales. Por ello, Councilbox
                        technology recomienda al cliente leerlas atentamente cada vez que
                        acceda al sitio web. Clientes y usuarios siempre dispondrán de
                        éstas condiciones de uso en un sitio visibles, libremente
                        accesible para cuantas consultas quiera realizar. En cualquier caso,
                        la aceptación de las condiciones de uso será un paso
                        previo e indispensable a la adquisición de cualquier producto
                        disponible a través del sitio web.</p>

                    <p><b>13.- Jurisdicción y Competencia</b></p>

                    <p>Las presentes condiciones de uso deberán regirse e interpretarse
                        de acuerdo con las leyes españolas y en defecto de ésta,
                        por la de la Unión Europea. Para resolver cualquier
                        controversia o conflicto que se derive de las presentes condiciones
                        de uso, las partes se someten expresamente a la Jurisdicción
                        de los Tribunales de Vigo.</p>

                    <p><b>14.- Validez</b></p>
                    <p>Estos Términos y Condiciones serán efectivos el día 1
                        de junio de 2015 y sustituirán a todos los anteriores términos
                        y condiciones.</p>
                </div>
        );
    };

    render(){
        const { translate, children } = this.props;
 
        return(
            <Fragment>
                <AlertConfirm
                    requestClose={() => this.props.close()}
                    open={this.props.open}
                    buttonAccept={translate.close}
                    bodyText={this._renderNewPointBody()}
                    title={translate.login_read_terms2}
                />
            </Fragment>
        );
    }
}

export default TermsModal;