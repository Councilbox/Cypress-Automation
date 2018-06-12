import React from 'react';
import { TextInput, BasicButton, RichTextInput, CardPageLayout } from '../../../displayComponents';
import { Typography } from 'material-ui';
import AgendaCheckItem from './AgendaCheckItem';
import { graphql } from 'react-apollo';
import { createCertificate } from '../../../queries';
import { getSecondary } from '../../../styles/colors';
import { agendaTypes } from '../../../constants';

class CertificateForm extends React.PureComponent {

    state = {
        data: {
            title: '',
            header: '',
            footer: ''
        },

        points: [],

        errors: {
            title: '',
            header: '',
            footer: ''
        }
    }

    createCertificate = async () => {
        if(!this.checkRequiredFields()){
            const response = await this.props.createCertificate({
                variables: {
                    certificate: {
                        ...this.state.data,
                        councilId: this.props.council.id,
                        date:  new Date().toISOString()
                    },
                    points: this.state.points
                }
            })
    
            if(!response.errors){
                if(response.data.createCertificate.success){
                    this.props.requestClose();
                }
            }
        }
    }

    checkRequiredFields() {
        const { data } = this.state;
        const { translate } = this.props;

        let errors = {
            title: '',
            header: '',
            footer: ''
        };
        let hasError = false;

        if(!data.title){
            hasError = true;
            errors.title = translate.field_required;
        }

        if(!data.header){
            hasError = true;
            errors.header = translate.field_required;
        }

        if(!data.footer){
            hasError = true;
            errors.footer = translate.field_required;
        }

        this.setState({
            errors
        });

        return hasError;
    }

    updateCertificateDate = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    updatePoints = (agendaId, check) => {
        if(check){
            this.setState({
                points: [...this.state.points, agendaId]
            });
        }else{
            const index = this.state.points.findIndex((id) => agendaId === id);
            this.state.points.splice(index, 1);
            this.setState({
                points: [...this.state.points]
            })
        }
    }

    render() {
        const { translate } = this.props;
        const { data } = this.state;

        return(
            <CardPageLayout title={translate.certificate_generate}>
                <div style={{marginBottom: '1.2em'}}>
                    <TextInput
                        floatingText={translate.certificate_title_of}
                        value={data.title}
                        errorText={this.state.errors.title}
                        onChange={(event) => this.updateCertificateDate({
                            title: event.target.value
                        })}
                    />
                </div>
                <div style={{marginBottom: '1.2em'}}>                
                    <RichTextInput
                        floatingText={translate.certificate_header}
                        value={data.header}
                        errorText={this.state.errors.header}
                        onChange={value => this.updateCertificateDate({
                            header: value
                        })}
                    />
                </div>

                <Typography>
                    {translate.certificate_content}
                </Typography>
                <div style={{marginBottom: '1.2em'}}>
                    {this.props.council.agendas.map(agenda => (
                        <AgendaCheckItem
                            key={`agenda_${agenda.id}`}
                            agenda={agenda}
                            updatePoints={this.updatePoints}
                            checked={this.state.points}
                        />
                    ))}
                </div>
                <RichTextInput
                    floatingText={translate.certificate_footer}
                    value={data.footer}
                    errorText={this.state.errors.footer}
                    onChange={value => this.updateCertificateDate({
                        footer: value
                    })}
                />

                <BasicButton
                    text={translate.certificate_generate}
                    onClick={this.createCertificate}
                    textStyle={{textTransform: 'none', fontWeight: '700'}}
                    color={getSecondary()}
                />
            </CardPageLayout>
        )
    }
}

export default graphql(createCertificate, {
    name: 'createCertificate'
})(CertificateForm);