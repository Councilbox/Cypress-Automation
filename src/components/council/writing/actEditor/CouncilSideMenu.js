import React from 'react';
import { Scrollbar } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import * as CBX from '../../../../utils/CBX';
import { Tooltip } from 'material-ui';

class CouncilSideMenu extends React.Component {

    state = {
        loaded: false
    }

    render(){
        const { council, translate, company, councilRecount } = this.props;

        console.log(this.props.councilRecount);
        console.log(council.statute);

        //TRADUCCION
        if(!this.props.open){
            return <span />
        }

        return (
            <div style={{width: '100%', height: '100%', borderLeft: '1px solid gainsboro'}}>
                <Scrollbar>
                    <div style={{padding: '0.6em', fontSize: '14px'}}>
                        <h6 style={{fontWeight: '700'}}>Reunión</h6>
                        <Row field={translate.name} value={council.name} />
                        <Row field={translate['1st_call_date']} value={`${moment(council.dateStart).format("LLL")}`} />
                        {CBX.hasSecondCall(council.statute) &&
                            <Row field={translate['2nd_call_date']} value={`${moment(council.dateStart2NdCall).format("LLL")}`} />
                        }
                        <Row field={translate.new_location_of_celebrate} value={`${
                                council.street
                            }, ${council.zipcode}, ${council.countryState}, (${
                                council.country
                            })`}
                        />
                        <Row field={translate.date_end} value={`${moment(council.dateEnd).format("LLL")}`} />

                        <h6 style={{fontWeight: '700', marginTop: '1.2em'}}>Entidad</h6>
                        <Row field={translate.name} value={company.businessName} />
                        <Row field={translate.address} value={company.address} />
                        <Row field={translate.company_new_locality} value={company.city} />
                        <Row field={translate.company_new_country} value={company.country} />
                        <Row field={translate.company_new_country_state} value={company.countryState} />
                        <Row field={translate.company_new_zipcode} value={company.zipcode} />

                        <h6 style={{fontWeight: '700', marginTop: '1.2em'}}>Asistencia</h6>
                        <Row field={translate.census_type_assistants} value={this.props.councilAttendants.total} />
                        <Row field={'Presentes'} value={councilRecount.numPresent} />
                        <Row field={'Remotos'} value={councilRecount.numRemote} />
                        <Row field={'Votos delegados'} value={this.props.participantsWithDelegatedVote.length} />

                        {CBX.hasParticipations(council.statute)?
                            <React.Fragment>
                                <h6 style={{fontWeight: '700', marginTop: '1.2em'}}>Capital social</h6>
                                <Row field={'Total'} value={councilRecount.socialCapitalTotal} />
                                <Row
                                    field={'Asistente a la reunión'}
                                    value={getPercentage(councilRecount.socialCapitalRightVoting, councilRecount.socialCapitalTotal)}
                                />
                                <Row
                                    field={'Presencial'}
                                    value={getPercentage(councilRecount.socialCapitalPresent, councilRecount.socialCapitalTotal)}
                                />
                                <Row
                                    field={'Remoto'}
                                    value={getPercentage(councilRecount.socialCapitalRemote, councilRecount.socialCapitalTotal)}
                                />
                                <Row
                                    field={'No participa'}
                                    value={getPercentage(councilRecount.socialCapitalNoParticipate, councilRecount.socialCapitalTotal)}
                                />
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <h6 style={{fontWeight: '700', marginTop: '1.2em'}}>Votos</h6>
                                <Row field={'Total'} value={councilRecount.partTotal} />
                                <Row
                                    field={'Asistente a la reunión'}
                                    value={getPercentage(councilRecount.partRightVoting, councilRecount.partTotal)}
                                />
                                <Row
                                    field={'Presencial'}
                                    value={getPercentage(councilRecount.partPresent, councilRecount.partTotal)}
                                />
                                <Row
                                    field={'Remoto'}
                                    value={getPercentage(councilRecount.partRemote, councilRecount.partTotal)}
                                />
                                <Row
                                    field={'No participa'}
                                    value={getPercentage(councilRecount.partNoParticipate, councilRecount.partTotal)}
                                />
                            </React.Fragment>
                        }
                    </div>
                </Scrollbar>
            </div>
        )
    }
}

const getPercentage = (value, total) => {
    return `${value} (${(value / total * 100).toFixed(3)}%)`
}

class Row extends React.Component {

    state = {
        showCopyTooltip: false
    }

    timeout = null;

    componentWillUnmount(){
        clearTimeout(this.timeout);
    }

    startCloseTimeout(){
        this.timeout = setTimeout(() => {
            this.setState({
                showCopyTooltip: false
            });
        }, 2000);
    }

    copy = () => {
        this.setState({
            showCopyTooltip: true
        });
        this.startCloseTimeout();
        CBX.copyStringToClipboard(this.props.value);
    }

    render(){
        //TRADUCCION
        return (
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <div style={{fontWeight: '700', width: '32%'}}>{`${this.props.field}:`}</div>
                {this.state.showCopyTooltip?
                    <div style={{width: '67%', marginLeft: '1%'}} onClick={this.copy}>
                        <Tooltip title="Copiado" open={this.state.showCopyTooltip} placement="top">
                            <span>{this.props.value}</span>
                        </Tooltip>
                    </div>
                :
                    <div style={{width: '67%', marginLeft: '1%'}} onClick={this.copy}>
                        {this.props.value}
                    </div>
                }

            </div>
        )
    }
}

export default CouncilSideMenu;