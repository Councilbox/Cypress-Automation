import React from 'react';
import { DropDownMenu, Icon } from '../../../../displayComponents';
import { MenuItem, Divider } from 'material-ui';
import { getSecondary } from '../../../../styles/colors';
import { downloadFile } from '../../../../utils/CBX';
import { downloadAct } from '../../../../queries';
import { withApollo } from 'react-apollo';


const word = `<h3>\r\n    <b>Pruebis de votos de participante</b>\r\n</h3>\r\n<p><p>En el domicilio social de tiene lugar la celebración, en &nbsp;primera convocatoria, la Junta General Ordinaria de la sociedad, la cual fue debidamenteonvocada, en tiempo</p>\n<p>forma por el procedimiento de comunicación individual y escrita previsto en los Estatutos sociales,Celebración en remoto a través de la plataforma&nbsp;</p>\n<p>Celebración en remoto a través de la plataforma Councilbox</p>\n<p><br>\n<br>\n</p></p>\r\n<b>Para tratar el siguiente Orden del Día:</b>\r\n<br>\r\n    1 - kmlkmlkmk k\r\n    <br>\r\n    2 - kjlk\r\n    <br>\r\n    3 - Lectura y aprobación del acta\r\n    <br>\r\n<br>\r\n<p><p>El 11 de Septiembre de 2018 11:25 horas da comienzo la Junta General Ordinaria de PruebasVideoApp . Conforme a las disposiciones legales y estatutarias, y con la conformidad de todos los asistentes, actúan como Presidente y Secretario de la Junta, respectivamente Alberto Doval y Alberto Doval . Por el presidente se declara la válida constitución de la Junta con la concurrencia de 2 participaciones que representan el NaN% de las participaciones en las que se divide capital social, todas ellas con derecho a voto, presentes o conectados en remoto a través de la plataforma Councilbox así como representados.</p>\n<p><strong><br>\n</strong>Sobre las citadas manifestaciones del Presidente ningún asistente presenta protesta o reserva alguna.<br>\n<br>\nPor indicación del Presidente, el Secretario da lectura al orden del día establecido en la convocatoria. No deseando los asistentes iniciar debate sobre los mencionados puntos, ni solicitar constancia en acta de intervención u oposición alguna.<br>\n<br>\n</p></p>\r\n<br>\r\n<b>A continuación se entra a debatir el primer punto del Orden del día.</b>\r\n<br>\r\n\r\n    <div class=\"comment\">\r\n        <h4>1 - kmlkmlkmk k</h4>\r\n        <p>\r\n            <p>kmlkmlkmlkm</p>\r\n        </p>\r\n            <p>040.000%2 estoy escribiendo aquí y parece que no me pierde el foco por lo que puedo escribir tranquilo de forma continua ou yeah</p>\r\n\r\n        <!--Recuento-->\r\n            <div style=\"padding: 10px;border: solid 1px #BFBFBF;font-size: 11px\">\r\n                <b>Votaciones: </b>\r\n                <br> A FAVOR: 6 (100.000%) | EN CONTRA: 0 (0.000%) | ABSTENCIONES:\r\n                0 (0.000%) | NO VOTAN: 121 (2016.667%)\r\n                <br>\r\n            </div>\r\n\r\n\r\n            <h4>Votos:</h4>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Oscar Fuentes IO\r\n                        <b>\r\n                                NO VOTA\r\n                        </b>\r\n                    </div>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Gonzalo dedeed PO\r\n                        <b>\r\n                                NO VOTA\r\n                        </b>\r\n                    </div>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Aaron Fuentes Reactron\r\n                                voto delegado en\r\n                            Oscar Fuentes IO\r\n                        <b>\r\n                                NO VOTA\r\n                        </b>\r\n                    </div>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Miguel Ro cargo\r\n                        <b>\r\n                                A FAVOR\r\n                        </b>\r\n                    </div>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Jose Manuel Sanchez CBXMaster\r\n                                representado por\r\n                            Alberto Doval Boss\r\n                        <b>\r\n                                A FAVOR\r\n                        </b>\r\n                    </div>\r\n\r\n        <!--Comentarios-->\r\n    </div>\r\n    <div class=\"comment\">\r\n        <h4>2 - kjlk</h4>\r\n        <p>\r\n            <p>jl kj lkj&nbsp;</p>\r\n        </p>\r\n            \r\n\r\n        <!--Recuento-->\r\n            <div style=\"padding: 10px;border: solid 1px #BFBFBF;font-size: 11px\">\r\n                <b>Votaciones: </b>\r\n                <br> A FAVOR: 0 (0.000%) | EN CONTRA: 0 (0.000%) | ABSTENCIONES:\r\n                0 (0.000%) | NO VOTAN: 127 (2116.667%)\r\n                <br>\r\n            </div>\r\n\r\n\r\n            <h4>Votos:</h4>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Miguel Ro cargo\r\n                        <b>\r\n                                NO VOTA\r\n                        </b>\r\n                    </div>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Oscar Fuentes IO\r\n                        <b>\r\n                                NO VOTA\r\n                        </b>\r\n                    </div>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Gonzalo dedeed PO\r\n                        <b>\r\n                                NO VOTA\r\n                        </b>\r\n                    </div>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Jose Manuel Sanchez CBXMaster\r\n                                representado por\r\n                            Alberto Doval Boss\r\n                        <b>\r\n                                NO VOTA\r\n                        </b>\r\n                    </div>\r\n                    <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 8px 10px;margin-bottom: 3px;\">\r\n                        Aaron Fuentes Reactron\r\n                                voto delegado en\r\n                            Oscar Fuentes IO\r\n                        <b>\r\n                                NO VOTA\r\n                        </b>\r\n                    </div>\r\n\r\n        <!--Comentarios-->\r\n    </div>\r\n    <div class=\"comment\">\r\n        <h4>3 - Lectura y aprobación del acta</h4>\r\n        <p>\r\n            \r\n        </p>\r\n            \r\n\r\n        <!--Recuento-->\r\n\r\n\r\n\r\n        <!--Comentarios-->\r\n    </div>\r\n\r\n    <br>\r\n    <p><p>El&nbsp; 12 de Septiembre de 2018 17:06&nbsp; horas, y&nbsp;no habiendo más asuntos que tratar, el Sr Presidente levanta la sesión, de la que se extiende la presente acta.</p></p>\r\n\r\n    <div>\r\n
<h3>AAA Lista de asistentes</h3>\r\n
<div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 6px 10px 2px 10px;margin-bottom: 10px;\">\r\nJose Manuel Sanchez con\r\n DNI\r\n 13212312312\r\n\r\n representado por Alberto Doval con DNI 12312312\r\n .\r\n\r\n <br/>Firma: d8c268fe-6012-4d0a-b725-d7f8a6c195b5\r\n</div>\r\n <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 6px 10px 2px 10px;margin-bottom: 10px;\">\r\nMiguel Ro con\r\n                    DNI\r\n 12312312\r\<br/>Firma: 6adbae76-175f-40dc-bb80-3422d0a77d3c\r\n </div>\r\n            <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 6px 10px 2px 10px;margin-bottom: 3px;\">\r\n                <p>Oscar Fuentes con\r\n                    DNI\r\n 12312312\r\n\r\n.\r\n                </p>\r\n                        <img style=\"height: 50px; width: auto;\"\r\n                            src=\"http://localhost:5000/api/getSignatureUrl/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTkyNTIsImlhdCI6MTU0ODg0MDg0M30.KivXjcLBqh7vlSgQM8GrJkuwiV4k8scVOJFqaY3sp-E\" />\r\n            </div>\r\n            <h3 style=\"margin-top: 10px\">Delegaciones</h3>\r\n                <div style=\"border: solid 2px rgb(217, 237, 247);border-radius: 3px; padding: 6px 10px 2px 10px;margin-bottom: 3px; margin-top: 10px; \">\r\n                    <p>Aaron Fuentes con\r\n                        DNI\r\n 1231231231\r\n\r\n.\r\n                    </p>\r\n                    Voto delegado en: Oscar Fuentes\r\n                </div>\r\n    </div>\r\n`;

class ExportActToMenu extends React.Component {

    state = {
        loading: false
    }

    downloadPDF = async () => {
		this.setState({
			loading: true
		})
		const response = await this.props.client.query({
			query: downloadAct,
			variables: {
				councilId: this.props.council.id
			}
        });

		if (response) {
			if (response.data.downloadAct) {
				this.setState({
					loading: false
				});
				downloadFile(
					response.data.downloadAct,
					"application/pdf",
					`${this.props.translate.act.replace(/ /g, '_')}-${
				    this.props.council.name.replace(/ /g, '_').replace(/\./g, '_')
					}`
				);
			}
		}
    };

    export2Doc = (element, filename = `${this.props.translate.act} - ${this.props.council.name}`) => {
        const preHtml = "<!DOCTYPE html type=\"text/html\"><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body style='font-family: Arial;'>";
        const postHtml = "</body></html>";
        const body = this.props.html.replace(/[\u0080-\u024F]/g,
            function(a) {
              return '&#'+a.charCodeAt(0)+';';
        }).replace(/<!--[\s\S]*?-->/g, '').replace(/style="page-break-before: always"/g, '').replace(/solid 1px rgb(217, 237, 247)/g, 'solid 2px rgb(217, 237, 247)').replace(/font-size: 11px/g, 'font-size: 12.5px');
        const html = preHtml+body+postHtml;
        const css = (`\
            <style>\
            body {font-family: Arial; font-size: 12pt;}\
            html {font-family: Arial; font-size: 12pt;}
            div {font-family: Arial; font-size: 12pt;}
            h3 {font-family: Arial; font-size: 12pt;}
            h4 {font-family: Arial; font-size: 12pt;}
            b {font-family: Arial; font-size: 12pt;}
            </style>\
       `);

       const value = css + html;
        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURI(value);
        filename = filename?filename+'.doc':'document.doc';
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        if(navigator.msSaveOrOpenBlob ){
            const blob = new Blob(['\ufeff', css+html], {
                type: 'application/msword'
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        }else{
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.click();
        }
        document.body.removeChild(downloadLink);
    }


    render(){
        const secondary = getSecondary();
        return (
            <DropDownMenu
                color="transparent"
                id={'user-menu-trigger'}
                loading={this.state.loading}
                text={this.props.translate.export_act_to}
                textStyle={{ color: secondary }}
                type="flat"
                buttonStyle={{border: `1px solid ${secondary}`}}
                icon={
                    <i className="fa fa-download" style={{
                            fontSize: "1em",
                            color: secondary,
                            marginLeft: "0.3em"
                        }}
                    />
                }
                items={
                    <React.Fragment>
                        <MenuItem onClick={this.downloadPDF}>
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <i className="fa fa-file-pdf-o" style={{
                                        fontSize: "1em",
                                        color: secondary,
                                        marginLeft: "0.3em"
                                    }}
                                />
                                <span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
                                    PDF
                                </span>
                            </div>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={this.export2Doc}>
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <i className="fa fa-file-word-o" style={{
                                        fontSize: "1em",
                                        color: secondary,
                                        marginLeft: "0.3em"
                                    }}
                                />
                                <span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
                                    Word
                                </span>
                            </div>
                        </MenuItem>
                    </React.Fragment>
                }
            />
        )
    }
}

export default withApollo(ExportActToMenu);