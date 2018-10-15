import React from 'react';
import { TextInput, BasicButton, CardPageLayout, Scrollbar, SectionTitle, LiveToast } from '../../../displayComponents';
import RichTextInput from "../../../displayComponents/RichTextInput";
import AgendaCheckItem from './AgendaCheckItem';
import { graphql } from 'react-apollo';
import { createCertificate } from '../../../queries';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { toast } from 'react-toastify';
import { checkForUnclosedBraces } from '../../../utils/CBX';

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
            this.setState({
                loading: true
            })
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
                    this.setState({
                        loading: false
                    });
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
        let notify = false;

        if(!data.title){
            hasError = true;
            errors.title = translate.field_required;
        }

        if(!data.header){
            hasError = true;
            errors.header = translate.field_required;
        } else {
            if(checkForUnclosedBraces(data.header)){
                errors.header = true;
                hasError = true;
                notify = true;
            }
        }

        if(!data.footer){
            hasError = true;
            errors.footer = translate.field_required;
        } else {
            if(checkForUnclosedBraces(data.footer)){
                errors.footer = true;
                hasError = true;
                notify = true;
            }
        }

        if(notify){
            toast(
                <LiveToast
                    message={translate.revise_text}
                />, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: true,			
                    className: "errorToast"
                }
            );
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
        const primary = getPrimary();

        return(
            <CardPageLayout title={translate.certificate_generate} disableScroll={true}>
                <div style={{height: 'calc(100% -  3.5em)'}}>
                    <Scrollbar>
                        <div style={{padding: '2em', paddingTop: '1em', paddingBottom: '1em'}}>
                            <SectionTitle text={translate.edit_company} color={primary} style={{marginTop: '1.6em'}}/>
                            <div style={{marginBottom: '1.2em', maxWidth: '50em'}}>
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

                            <SectionTitle text={`${translate.include_agenda_points}:`} color={primary} style={{marginTop: '1.6em'}}/>
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

                            <SectionTitle text={translate.certificate_footer} color={primary} style={{marginTop: '1.6em'}}/>
                            <RichTextInput
                                value={data.footer}
                                errorText={this.state.errors.footer}
                                onChange={value => this.updateCertificateDate({
                                    footer: value
                                })}
                            />
                        </div>
                    </Scrollbar>
                </div>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        paddingRight: '1.2em',
                        borderTop: '1px solid gainsboro',
                        justifyContent: 'flex-end',
                        height: '3.5em'
                    }}
                >
                    <BasicButton
                        text={translate.certificate_generate}
                        onClick={this.createCertificate}
                        loading={this.state.loading}
                        textStyle={{textTransform: 'none', fontWeight: '700', color: 'white'}}
                        color={getSecondary()}
                        buttonStyle={{marginTop: '0.8em'}}
                    />
                </div>
            </CardPageLayout>
        )
    }
}

export default graphql(createCertificate, {
    name: 'createCertificate'
})(CertificateForm);