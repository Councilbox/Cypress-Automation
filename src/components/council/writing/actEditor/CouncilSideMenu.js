import React from 'react';
import { graphql } from 'react-apollo';
import { Scrollbar } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import * as CBX from '../../../../utils/CBX';

class CouncilSideMenu extends React.Component {

    render(){
        const { council, translate } = this.props;
        console.log(council);

        //TRADUCCION
        if(!this.props.open){
            return <span />
        }

        return (
            <div style={{width: '100%', height: '100%', borderLeft: '1px solid gainsboro'}}>
                <Scrollbar>
                    <div style={{padding: '0.6em', fontSize: '14px'}}>
                        <h6 style={{fontWeight: '700'}}>DATOS BÁSICOS</h6>
                        <Row field={translate.name} value={council.name} />
                        <Row field={translate['1st_call_date']} value={`${moment(council.dateStart).format("LLL")}`} />
                        {CBX.hasSecondCall(council.statute) &&
                            <Row field={translate['2nd_call_date']} value={`${moment(council.dateStart2NdCall).format("LLL")}`} />
                        }
                    </div>
                </Scrollbar>
            </div>
        )
    }
}

const Row = ({ field, value })  => {

    return (
        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <div style={{fontWeight: '700', width: '30%'}}>{`${field}:`}</div>
            <div style={{width: '70%'}}>{value}</div>
        </div>
    )
}

export default CouncilSideMenu;