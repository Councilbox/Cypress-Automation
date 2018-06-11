import React from 'react';
import { TextInput, BasicButton, RichTextInput, CardPageLayout } from '../../../displayComponents';
import { Typography } from 'material-ui';

class CertificateForm extends React.PureComponent {

    state = {
        data: {
            title: '',
            header: '',
            content: [],
            footer: ''
        }
    }

    updateCertificateDate = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    render() {
        const { translate, agendas } = this.props;
        const { data } = this.state;

        console.log(this.state);

        return(
            <CardPageLayout title={translate.certificate_generate}>
                <TextInput
                    floatingText={translate.certificate_title_of}
                    value={data.title}
                    onChange={(event) => this.updateCertificateDate({
                        title: event.target.value
                    })}
                />
                <RichTextInput
                    floatingText={translate.certificate_header}
                    value={data.header}
                    onChange={value => this.updateCertificateDate({
                        header: value
                    })}
                />

                <Typography>
                    {translate.certificate_content}
                </Typography>
                <div>
                    {this.props.council.agendas.map(agenda => (
                        <div style={{width: '100%', border: '2px solid red'}}>
                            {agenda.agendaSubject}
                        </div>
                    ))}
                </div>
                <RichTextInput
                    floatingText={translate.certificate_footer}
                    value={data.footer}
                    onChange={value => this.updateCertificateDate({
                        footer: value
                    })}
                />
            </CardPageLayout>
        )
    }
}

export default CertificateForm;