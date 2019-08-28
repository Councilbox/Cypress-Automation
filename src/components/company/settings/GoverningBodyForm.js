import React from 'react';
import { SectionTitle, SelectInput, TextInput, BasicButton, GridItem, ButtonIcon } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { MenuItem, TableBody } from 'material-ui';
import { GOVERNING_BODY_TYPES } from '../../../constants';
import { Table, TableHead, TableRow, TableCell } from 'material-ui';


const GoverningBodyForm = ({ translate, state, updateState, ...props}) => {
    const primary = getPrimary();

    const updateGoverningData = object => {
        updateState({
            governingBodyData: {
                ...state.governingBodyData,
                ...object
            }
        });
    }

    const getGoverningTypeInput = () => {
        const menus = {
            0: <span />,
            1: <SingleAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData} />,
            2: <EntityAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData} />,
            3: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData} />,
            4: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData} />,
            5: <CouncilAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData} />,
        }

        return menus[state.governingBodyType]? menus[state.governingBodyType] : menus[0];
    }

    const changeGoverningType = event => {
        updateState({
            governingBodyType: event.target.value,
            governingBodyData: {}
        });
    }

    return (
        <div style={{width: '100%'}}>
            <SectionTitle
                text={'Órgano de gobierno'}
                color={primary}
                style={{
                    marginTop: '2em'
                }}
            />
            <GridItem xs={12} md={7} lg={4}>
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
            </GridItem>
            {getGoverningTypeInput()}
        </div>
    )
}

const SingleAdminForm = ({ translate, setData, data = {} }) => {

    return (
        <GridItem xs={12} md={8} lg={6}>
            <TextInput
                floatingText={translate.name}
                value={data? data.name : ''}
                onChange={event => setData({ name: event.target.value })}
            />
            <TextInput
                floatingText={translate.surname}
                value={data? data.surname : ''}
                onChange={event => setData({ surname: event.target.value })}
            />
            <TextInput
                floatingText={translate.dni}
                value={data? data.dni : ''}
                onChange={event => setData({ dni: event.target.value })}
            />
            <TextInput
                floatingText={translate.email}
                value={data? data.email : ''}
                onChange={event => setData({ email: event.target.value })}
            />
            <TextInput
                floatingText={translate.phone}
                value={data? data.phone : ''}
                onChange={event => setData({ phone: event.target.value })}
            />
        </GridItem>
    )
}

const EntityAdminForm = ({ translate, setData, data = {} }) => {
    return (
        <GridItem xs={12} md={8} lg={6}>
            <TextInput
                floatingText={'Nombre de la entidad'}
                value={data? data.entityName : ''}
                onChange={event => setData({ entityName: event.target.value })}
            />
            Representante:
            <TextInput
                floatingText={translate.name}
                value={data? data.name : ''}
                onChange={event => setData({ name: event.target.value })}
            />
            <TextInput
                floatingText={translate.surname}
                value={data? data.surname : ''}
                onChange={event => setData({ surname: event.target.value })}
            />
            <TextInput
                floatingText={translate.dni}
                value={data? data.dni : ''}
                onChange={event => setData({ dni: event.target.value })}
            />
            <TextInput
                floatingText={translate.email}
                value={data? data.email : ''}
                onChange={event => setData({ email: event.target.value })}
            />
            <TextInput
                floatingText={translate.phone}
                value={data? data.phone : ''}
                onChange={event => setData({ phone: event.target.value })}
            />
        </GridItem>
    )
}

const ListAdminForm = ({ translate, setData, data }) => {
    const secondary = getSecondary();
    React.useEffect(() => {
        if(!data.list){
            setData({
                list: data.list? data.list : []
            });
        }
    }, [data.list]);


    const setAdminData = (newData, index) => {
        const list = data.list || [];
        list[index] = {
            ...list[index],
            ...newData
        }

        setData({
            list: [...list]
        })
    }

    const deleteRow = index => {
        let newList = [...data.list];
        newList.splice(index, 1);
        setData({
            list: newList
        })
    }

    const addRow = () => {
        const list = data.list || [];

        const newList = [...list, {
            name: '',
            surname: '',
            dni: '',
            phone: '',
            email: '',
            id: new Date()
        }];

        setData({
            list: newList
        })
    }

    return (
        <div>
            <BasicButton
                onClick={addRow}
                text={translate.add}
                color="white"
                textStyle={{ color: secondary }}
                icon={<ButtonIcon type="add" color={secondary} />}
                buttonStyle={{ border: `1px solid ${secondary}`, marginBottom: '0.9em' }}
            />
            <Table style={{width: '100%'}}>
                <TableHead>
                    <TableCell>
                        {translate.name}
                    </TableCell>
                    <TableCell>
                        {translate.surname}
                    </TableCell>
                    <TableCell>
                        {translate.dni}
                    </TableCell>
                    <TableCell>
                        {translate.email}
                    </TableCell>
                    <TableCell>
                        {translate.phone}
                    </TableCell>
                    <TableCell>
                    </TableCell>
                </TableHead>
                <TableBody>
                    {data.list && data.list.map((item, index) => (
                        <TableRow key={`item_${item.id}`} style={{ marginTop: '1em', ...(index > 0? { borderTop: '1px solid gainsboro'} : {})}}>
                            <TableCell>
                                <TextInput
                                    value={item? item.name : ''}
                                    onChange={event => setAdminData({ name: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item? item.surname : ''}
                                    onChange={event => setAdminData({ surname: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item? item.dni : ''}
                                    onChange={event => setAdminData({ dni: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item? item.email : ''}
                                    onChange={event => setAdminData({ email: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item? item.phone : ''}
                                    onChange={event => setAdminData({ phone: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <div onClick={() => deleteRow(index)} style={{cursor: 'pointer'}}>X</div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

const baseUser = {
    name: '',
    surname: '',
    dni: '',
    phone: '',
    email: '',
    id: new Date()
}

export const getCouncilAdminPosition = (index, translate) => {
    const positions = {
        0: translate.president,
        1: 'Vicepresidente',
        2: translate.secretary,
        3: 'Vicesecretario'
    }

    return positions[index];
}

const CouncilAdminForm = ({ translate, setData, data }) => {

    React.useEffect(() => {
        if(!data.list || data.list.length !== 4){
            setData({
                list: [baseUser, baseUser, baseUser, baseUser]
            });
        }
    }, [data.list]);

    const setAdminData = (newData, index) => {
        const list = data.list
        list[index] = {
            ...list[index],
            ...newData
        }

        setData({
            list: [...list]
        })
    }





    return (
        <div style={{width: '100%', overflowX: 'auto'}}>
            <Table style={{maxWidth: "100%", tableLayout: 'auto'}}>
                <TableHead>
                    <TableCell>
                        {translate.position}
                    </TableCell>
                    <TableCell>
                        {translate.name}
                    </TableCell>
                    <TableCell>
                        {translate.surname}
                    </TableCell>
                    <TableCell>
                        {translate.dni}
                    </TableCell>
                    <TableCell>
                        {translate.email}
                    </TableCell>
                    <TableCell>
                        {translate.phone}
                    </TableCell>
                </TableHead>
                <TableBody>
                    {data.list && data.list.map((item, index) => (
                        <TableRow key={`item_${item.id}`} style={{ marginTop: '1em', ...(index > 0? { borderTop: '1px solid gainsboro'} : {})}}>
                            <TableCell>
                                {getCouncilAdminPosition(index, translate)}
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item? item.name : ''}
                                    onChange={event => setAdminData({ name: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item? item.surname : ''}
                                    onChange={event => setAdminData({ surname: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item? item.dni : ''}
                                    onChange={event => setAdminData({ dni: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item? item.email : ''}
                                    onChange={event => setAdminData({ email: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item? item.phone : ''}
                                    style={{maxWidth: '10em'}}
                                    onChange={event => setAdminData({ phone: event.target.value }, index)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}


export default GoverningBodyForm;