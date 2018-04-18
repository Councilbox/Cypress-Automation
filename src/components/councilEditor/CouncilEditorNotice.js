import React, { Component } from 'react';
import { MenuItem } from 'material-ui';
import {
    BasicButton, ButtonIcon, DateTimePicker, ErrorAlert, LoadingSection, RichTextInput, SelectInput, TextInput
} from "../displayComponents";
import { getPrimary } from '../../styles/colors';
import PlaceModal from './PlaceModal';
import LoadDraft from './LoadDraft';
import { compose, graphql } from 'react-apollo';
import { changeStatute, councilStepOne, updateCouncil } from '../../queries';
import * as CBX from '../../utils/CBX';
import moment from 'moment';

class CouncilEditorNotice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            placeModal: false,
            alert: false,
            data: {},
            errors: {
                name: '',
                dateStart: "",
                dateStart2NdCall: "",
                country: '',
                countryState: '',
                city: '',
                zipcode: '',
                conveneText: '',
                street: '',
            }
        }
    }

    componentDidMount() {
        this.props.data.loading = true;
        this.props.data.refetch();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data.loading && !nextProps.data.loading) {
            this.setState({
                data: nextProps.data.council
            })
        }
    }

    nextPage = () => {
        if (!this.checkRequiredFields()) {
            this.updateCouncil();
            this.props.nextStep();
        }
    };

    checkRequiredFields() {

        const { translate } = this.props;
        const { data } = this.state;

        let errors = {
            name: '',
            dateStart: "",
            dateStart2NdCall: "",
            conveneText: '',
        };

        let hasError = false;

        if (!data.name) {
            hasError = true;
            errors.name = translate.new_enter_title
        }

        if (!data.dateStart) {
            hasError = true;
            errors.dateStart = translate.field_required
        }

        if (!data.conveneText || data.conveneText.replace(/<\/?[^>]+(>|$)/g, "").length <= 0) {
            hasError = true;
            errors.conveneText = translate.field_required
        }

        this.setState({
            alert: true,
            errors: errors
        });

        return hasError;
    }

    updateCouncil = () => {
        const { __typename, statute, ...council } = this.state.data;
        console.log(council);
        this.props.updateCouncil({
            variables: {
                council: {
                    ...council,
                    step: this.props.actualStep > 1 ? this.props.actualStep : 1
                }
            }
        });
    };

    savePlaceAndClose = (council) => {
        this.setState({
            placeModal: false,
            data: {
                ...this.state.data, ...council
            }
        })
    };

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data, ...object
            }
        });
    };

    updateError = (object) => {
        this.setState({
            errors: {
                ...this.state.errors, ...object
            }
        });
    };

    changeStatute = async (statuteId) => {
        const response = await this.props.changeStatute({
            variables: {
                councilId: this.props.councilID,
                statuteId: statuteId
            }
        });

        if (response) {
            this.props.data.refetch();
            this.updateDate();
        }
    };

    updateDate = (firstDate = this.state.data.dateStart, secondDate = this.state.data.dateStart2NdCall) => {
        const { translate } = this.props;
        this.updateState({
            dateStart: firstDate,
            dateStart2NdCall: secondDate
        });
        if (!CBX.checkSecondDateAfterFirst(firstDate, secondDate)) {
            this.updateError({
                dateStart2NdCall: translate[ '2nd_call_date_changed' ]
            });
            this.updateState({
                dateStart: firstDate,
                dateStart2NdCall: CBX.addMinimunDistance(firstDate, this.props.data.council.statute)
            });
        } else {
            if (!CBX.checkMinimunDistanceBetweenCalls(firstDate, secondDate, this.props.data.council.statute)) {
                this.updateError({
                    dateStart2NdCall: translate.new_statutes_hours_warning.replace('{{hours}}', this.props.data.council.statute.minimumSeparationBetweenCall)
                });
            }
        }
    };

    loadDraft = (text) => {
        const correctedText = CBX.changeVariablesToValues(text, {
            company: this.props.company,
            council: this.state.data
        });
        this.refs.editor.setValue(correctedText);
    };

    render() {
        const { translate, company } = this.props;
        const { loading, companyStatutes, draftTypes } = this.props.data;
        const council = this.state.data;
        const { errors } = this.state;

        if (loading) {
            return (<div style={{
                    height: '300px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <LoadingSection/>
                </div>);
        }

        const { statute } = this.props.data.council;

        return (<div style={{
                width: '100%',
                height: '100%',
                padding: '2em'
            }}>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12" style={{
                        height: '4em',
                        verticalAlign: 'middle',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <BasicButton
                            text={translate.change_location}
                            color={getPrimary()}
                            textStyle={{
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '0.9em',
                                textTransform: 'none'
                            }}
                            textPosition="after"
                            onClick={() => this.setState({ placeModal: true })}
                            icon={<ButtonIcon type="location_on" color="white"/>}
                        />
                        <h6 style={{ marginLeft: '1.5em' }}>
                            <b>{`${translate.new_location_of_celebrate}: `}</b>{council.remoteCelebration === 1 ? translate.remote_celebration : `${council.street}, ${council.country}`}
                        </h6>
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <SelectInput
                            required
                            floatingText={translate.council_type}
                            value={this.props.data.council.statute.statuteId || ''}
                            onChange={(event) => this.changeStatute(+event.target.value)}
                        >
                            {companyStatutes.map((statute) => {
                                return <MenuItem value={+statute.id}
                                                 key={`statutes_${statute.id}`}>{translate[ statute.title ] || statute.title}</MenuItem>
                            })}
                        </SelectInput>
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <DateTimePicker
                            required
                            onChange={(date) => {
                                const newDate = new Date(date);
                                const dateString = newDate.toISOString();
                                this.updateDate(dateString);
                            }}
                            minDateMessage={''}
                            acceptText={translate.accept}
                            cancelText={translate.cancel}
                            label={translate[ "1st_call_date" ]}
                            value={council.dateStart}
                        />
                    </div>
                    {CBX.hasSecondCall(statute) && <div className="col-lg-6 col-md-6 col-xs-12">
                        <DateTimePicker
                            required
                            minDate={!!council.dateStart ? new Date(council.dateStart) : new Date()}
                            errorText={errors.dateStart2NdCall}
                            onChange={(date) => {
                                const newDate = new Date(date);
                                const dateString = newDate.toISOString();
                                this.updateDate(undefined, dateString);
                            }}
                            minDateMessage={''}
                            acceptText={translate.accept}
                            cancelText={translate.cancel}
                            label={translate[ "2nd_call_date" ]}
                            value={council.dateStart2NdCall}
                        />
                    </div>}
                    <div className="col-lg-5 col-md-6 col-xs-12" style={{ margin: '0.7em 0.7em 0 0' }}>
                        <TextInput
                            required
                            floatingText={translate.table_councils_name}
                            type="text"
                            errorText={errors.name}
                            value={council.name || ''}
                            onChange={(event) => this.updateState({
                                name: event.nativeEvent.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-12 col-md-12 col-xs-12" style={{ margin: '0.7em 0.7em 0 0' }}>
                        <RichTextInput
                            ref='editor'
                            errorText={errors.convene_header}
                            required
                            tags={[ {
                                value: moment(council.dateStart).format('LLL'),
                                label: translate.date
                            }, {
                                value: company.businessName,
                                label: translate.business_name
                            }, {
                                value: `${council.street}, ${council.country}`,
                                label: translate.new_location_of_celebrate
                            }, {
                                value: company.country,
                                label: translate.company_new_country
                            } ]}
                            floatingText={translate.convene_info}
                            value={council.conveneText || ''}
                            onChange={(value) => this.updateState({
                                conveneText: value
                            })}
                        />
                    </div>
                </div>

                <div style={{
                    marginTop: '2em',
                    width: '40%',
                    float: 'right',
                    height: '3em'
                }}>
                    <LoadDraft
                        translate={translate}
                        company={company}
                        loadDraft={this.loadDraft}
                        councilType={statute}
                        statutes={companyStatutes}
                        draftType={draftTypes.filter((draft => draft.label === 'convene_header'))[ 0 ].value}
                    />
                    <BasicButton
                        text={translate.save}
                        color={getPrimary()}
                        textStyle={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '0.9em',
                            textTransform: 'none',
                            marginRight: '0.6em'
                        }}
                        icon={<ButtonIcon type="save" color="white"/>}
                        textPosition="after"
                        onClick={this.updateCouncil}
                    />
                    <BasicButton
                        text={translate.next}
                        color={getPrimary()}
                        icon={<ButtonIcon type="arrow_forward" color="white"/>}
                        textStyle={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '0.9em',
                            textTransform: 'none'
                        }}
                        textPosition="after"
                        onClick={this.nextPage}
                    />
                </div>

                <PlaceModal
                    open={this.state.placeModal}
                    close={() => this.setState({ placeModal: false })}
                    place={this.state.place}
                    countries={this.props.data.countries}
                    translate={this.props.translate}
                    saveAndClose={this.savePlaceAndClose}
                    council={council}
                />
                <ErrorAlert
                    title={translate.error}
                    bodyText={translate.check_form}
                    buttonAccept={translate.accept}
                    open={this.state.alert}
                    requestClose={() => this.setState({ alert: false })}
                />
            </div>);
    }
}

export default compose(
    graphql(councilStepOne, {
        name: "data",
        options: (props) => ({
            variables: {
                id: props.councilID,
                companyId: props.company.id
            },
            notifyOnNetworkStatusChange: true
        })
    }),

    graphql(changeStatute, {
        name: 'changeStatute'
    }),

    graphql(updateCouncil, {
        name: "updateCouncil"
    })
)(CouncilEditorNotice);