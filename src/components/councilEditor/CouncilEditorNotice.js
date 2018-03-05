import React, { Component } from 'react';
import { FontIcon, MenuItem} from 'material-ui';
import { BasicButton, TextInput, SelectInput, DateTimePicker, RichTextInput, LoadingSection, ErrorAlert } from "../displayComponents";
import { getPrimary } from '../../styles/colors';
import PlaceModal from './PlaceModal';
import { graphql, compose } from 'react-apollo';
import { councilStepOne, saveCouncilData } from '../../queries';
import { urlParser } from '../../utils';

class CouncilEditorNotice extends Component {

    constructor(props){
        super(props);
        this.state = {
            placeModal: false,
            alert: false,
            data: {},
            errors: {
                name : '',
                dateStart : "",
                dateStart2NdCall : "",
                country : '',
                countryState : '',
                city : '',
                zipcode : '',
                conveneText : '',
                street : '',
            }
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    nextPage = () => {
        if(!this.checkRequiredFields()){
            this.saveCouncil();
            this.props.nextStep();
        }
    }

    checkRequiredFields() {

        const { translate } = this.props;

        let errors = {
            name : '',
            dateStart : "",
            dateStart2NdCall : "",
            conveneText : '',
        };

        let hasError = false;

        if(!this.state.data.name){
            hasError = true;
            errors.name = translate.new_enter_title
        }

        if(!this.state.data.date_start){
            hasError = true;
            errors.dateStart = 'Este campo es obligatorio'
        }

        if(!this.state.data.convene_text){
            hasError = true;
            errors.conveneText = 'Este campo es obligatorio'
        }
        


        this.setState({
            alert: true,
            errors: errors
        });
        
        return hasError;
    }

    saveCouncil = () => {
        this.props.saveCouncil({
            variables: {
                data: urlParser({
                    data: {
                        council: {
                            ...this.state.data,
                            step: this.props.actualStep > 1? this.props.actualStep : 1
                        }
                    }
                })
            }
        });
    }

    savePlaceAndClose = (council) => {
        this.setState({
            placeModal: false,
            data: {
                ...this.state.data,
                ...council
            }
        })
    }

    componentWillReceiveProps(nextProps){
       if(this.props.data.loading && !nextProps.data.loading){
            this.setState({
                data: nextProps.data.council
            })
        }
    }

    render(){
        const { translate } = this.props;
        const { loading } = this.props.data;
        const council = this.state.data;

        if(loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <h4>{translate.date_time_place}</h4>
                <h5>{`${translate.new_location_of_celebrate}: `}{
                    this.state.data.remote_celebration === 1 ? 
                        translate.remote_celebration 
                    : 
                        `${council.street}, ${council.country}` }</h5>
                <BasicButton
                    text={translate.change_location}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={() => this.setState({placeModal: true})}
                    icon={<FontIcon className="material-icons">location_on</FontIcon>}
                />
                <BasicButton
                    text={translate.save}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">save</FontIcon>}
                    textPosition="after"
                    onClick={this.saveCouncil} 
                />
                <BasicButton
                    text={translate.next}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.nextPage}
                />
                <PlaceModal
                    open={this.state.placeModal}
                    close={() => this.setState({placeModal: false})}
                    place={this.state.place}
                    translate={this.props.translate}
                    saveAndClose={this.savePlaceAndClose}
                    council={this.state.data}
                />
                <br/>
                <SelectInput
                    floatingText={translate.council_type}
                    value={council.councilType || ''}
                    onChange={(event, index) => {
                        console.log(event.nativeEvent)
                        this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                councilType: index
                            }
                        })}
                    }
                >   
                    <MenuItem value={0} primaryText={translate.ordinary_general_assembly} />
                    <MenuItem value={1} primaryText={translate.special_general_assembly} />
                    <MenuItem value={2} primaryText={translate.board_of_directors} />
                </SelectInput>
                <DateTimePicker 
                    onChange={(date) => {
                        const newDate = new Date(date);
                        this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                dateStart: newDate.toISOString()
                            }
                        })}
                    }
                    floatingText = {translate["1st_call_date"]}
                    format='DD/MM/YYYY hh:mm'
                    value={council.dateStart}
                />
                <TextInput
                    floatingText={translate.convene_header}
                    type="text"
                    errorText={this.state.errors.name}
                    value={council.name || ''}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            name: event.nativeEvent.target.value
                        }
                    })}
                /><br />
                <RichTextInput
                    errorText=''
                    floatingText={translate.convene_info}
                    value={council.conveneText || ''}
                    onChange={(value) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            conveneText: value
                        }
                    })}
                />
                <ErrorAlert
                    title={translate.error}
                    bodyText={translate.check_form}
                    buttonAccept={translate.accept}
                    open={this.state.alert}
                    requestClose={() => this.setState({alert: false})}
                />
            </div>
        );
    }
}

export default compose(
    graphql(councilStepOne, {
        name: "data",
        options: (props) => ({
            variables: {
                id: props.councilID,
            }
        })
    }),

    graphql(saveCouncilData, {
        name: "saveCouncil"
    })
)(CouncilEditorNotice);
 