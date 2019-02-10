import React from 'react';
import { Grid, GridItem, BlockButton, DateTimePicker } from '../../displayComponents';
import { moment } from '../../containers/App';

const CreateWithoutSession = ({ setOptions, translate, ...props }) => {

    const [dates, setDates] = React.useState({
        dateStart: new Date().toISOString(),
        closeDate: moment().add(30, 'minutes').toString()
    });

    const [errors, setErrors] = React.useState({
        dateStart: '',
        dateStart2NdCall: '',
        closeDate: ''
    });

    React.useEffect(() => {
        props.setTitle('Configurar reunión sin sesión');//TRADUCCION
        setOptions(dates);
    }, []);

    const setStartDate = date => {
        setDates({
            ...dates,
            dateStart: date,
            dateStart2NdCall: moment(date).add(5, 'minutes')
        });
        setOptions({
            ...dates,
            dateStart: date,
            dateStart2NdCall: moment(date).add(5, 'minutes')
        });
    }

    const setCloseDate = date => {
        setDates({
            ...dates,
            closeDate: date
        });
        setOptions({
            ...dates,
            closeDate: date
        });
    }

    return (
        <div>
            <div>
                <DateTimePicker
                    required
                    onChange={date => {
                        const newDate = new Date(date);
                        const dateString = newDate.toISOString();
                        setStartDate(dateString);
                    }}
                    minDateMessage={""}
                    errorText={errors.dateStart}
                    acceptText={translate.accept}
                    cancelText={translate.cancel}
                    minDate={Date.now()}
                    label={'Fecha de comienzo'}//TRADUCCION
                    value={dates.dateStart}
                />
            </div>
            <div style={{marginTop: '1em'}}>
                <DateTimePicker
                    required
                    onChange={date => {
                        const newDate = new Date(date);
                        const dateString = newDate.toISOString();
                        setCloseDate(dateString);
                    }}
                    minDateMessage={""}
                    errorText={errors.closeDate}
                    acceptText={translate.accept}
                    cancelText={translate.cancel}
                    minDate={moment().add(30, 'minutes')}
                    label={translate.date_end}//TRADUCCION
                    value={dates.closeDate}
                />
            </div>
        </div>
    )
}

export default CreateWithoutSession;