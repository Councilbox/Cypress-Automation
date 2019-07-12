import React from 'react';
import { SectionTitle, SelectInput, TextInput } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { MenuItem } from 'material-ui';
import { GOVERNING_BODY_TYPES } from '../../../constants';


const GoverningBodyForm = ({ translate, state, updateState, ...props}) => {
    const primary = getPrimary();

    const updateGoverningData = object => {
        updateState({
            governingBodyData: object
        });
    }

    const getGoverningTypeInput = () => {
        const menus = {
            0: <span />,
            1: <SingleAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData} />
        }

        return menus[state.governingBodyType]? menus[state.governingBodyType] : menus[0];
    }

    const changeGoverningType = event => {
        updateState({
            governingBodyType: event.target.value,
        });
    }

    return (
        <div>
            <SectionTitle
                text={'Órgano de gobierno'}
                color={primary}
                style={{
                    marginTop: '2em'
                }}
            />
            <SelectInput
                value={state.governingBodyType}
                onChange={changeGoverningType}
            >
                {Object.keys(GOVERNING_BODY_TYPES).map(key => (
                    <MenuItem
                        value={GOVERNING_BODY_TYPES[key].value}
                        key={GOVERNING_BODY_TYPES[key].value}
                    >
                        {translate[GOVERNING_BODY_TYPES[key].label] || GOVERNING_BODY_TYPES[key].label}
                    </MenuItem>
                ))}
            </SelectInput>
            {getGoverningTypeInput()}
        </div>
    )
}

const SingleAdminForm = ({ translate, setData, data = {} }) => {

    const updateData = object => {
        setData({
            ...data,
            ...object
        })
    }


    return (
        <div>
            <TextInput
                floatingText={translate.name}
                value={data? data.name : ''}
                onChange={event => updateData({ name: event.target.value })}
            />
            <TextInput
                floatingText={translate.surname}
                value={data? data.surname : ''}
                onChange={event => updateData({ surname: event.target.value })}
            />
            <TextInput
                floatingText={translate.dni}
                value={data? data.dni : ''}
                onChange={event => updateData({ dni: event.target.value })}
            />
            <TextInput
                floatingText={translate.email}
                value={data? data.email : ''}
                onChange={event => updateData({ email: event.target.value })}
            />
            <TextInput
                floatingText={translate.phone}
                value={data? data.phone : ''}
                onChange={event => updateData({ phone: event.target.value })}
            />
        </div>
    )
}

export default GoverningBodyForm;