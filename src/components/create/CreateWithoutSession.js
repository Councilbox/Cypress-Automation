import React from 'react';
import { DateTimePicker } from '../../displayComponents';
import { moment } from '../../containers/App';

const CreateWithoutSession = ({ setOptions, translate, hybrid, errors, ...props }) => {
    const [dates, setDates] = React.useState({
        dateStart: null,
        closeDate: null
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
                    label={translate.start_beginning}//TRADUCCION
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
                    label={hybrid? 'Cierre de votación remota' : translate.date_end}//TRADUCCION
                    value={dates.closeDate}
                />
            </div>
            {errors.errorMessage &&
                <span style={{color: 'red', marginTop: '1em'}}>{errors.errorMessage}</span>
            }
        </div>
    )
}

export default CreateWithoutSession;