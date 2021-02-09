import React from 'react';
import { MenuItem, TableBody, Table, TableHead, TableRow, TableCell } from 'material-ui';
import ContentEditable from 'react-contenteditable';
import { TextInput, GridItem, DropDownMenu } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { GOVERNING_BODY_TYPES } from '../../../constants';

import CheckBox from '../../../displayComponents/CheckBox';


const GoverningBodyForm = ({ translate, state, updateState }) => {
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
            1: <SingleAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
            2: <EntityAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
            3: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
            4: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
            5: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
        }

        return menus[state.governingBodyType] ? menus[state.governingBodyType] : menus[0];
    }


    const type = GOVERNING_BODY_TYPES[Object.keys(GOVERNING_BODY_TYPES).find(key => GOVERNING_BODY_TYPES[key].value === state.governingBodyType)]

    return (
        <div style={{ width: '100%' }}>
            <GridItem xs={12} md={7} lg={4}>
                <div style={{ display: "flex", marginBottom: "1em" }}>
                        <DropDownMenu
                            color="transparent"
                            styleComponent={{ width: "" }}
                            Component={() => <div
                                    style={{
                                        borderRadius: '1px',
                                        border: "1px solid" + primary,
                                        padding: "0.5em 1em",
                                        cursor: "pointer"
                                    }}
                                >
                                    <span style={{ color: primary, fontWeight: "bold" }}>{
                                        translate[type.label]
                                    }</span>
                                    <i className="fa fa-angle-down" style={{ color: primary, paddingLeft: "5px", fontSize: "20px" }}></i>
                                </div>
                            }
                            textStyle={{ color: primary }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            type="flat"
                            items={
                                <div style={{ color: 'black' }}>
                                    {Object.keys(GOVERNING_BODY_TYPES).map(key => (
                                        <MenuItem style={{ display: "flex", padding: "0.5em 1em" }} key={key}
                                            onClick={() => {
                                                updateState({
                                                    governingBodyType: GOVERNING_BODY_TYPES[key].value
                                                })
                                            }}
                                        >
                                            {translate[GOVERNING_BODY_TYPES[key].label] || GOVERNING_BODY_TYPES[key].label}
                                        </MenuItem>
                                    ))}
                                </div>
                            }
                        />
                    </div>
            </GridItem>
            {getGoverningTypeInput()}
        </div>
    )
}

const SingleAdminForm = ({ translate, setData, data = {} }) => {
    const primary = getPrimary();
    return (
        <div style={{ width: "100%", display: "flex", }}>
            <div style={{ height: "100%", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: '1em' }}>
                    <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>{translate.name}</div>
                    <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>{translate.dni}</div>
                    <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>{translate.email}</div>
                    <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>{translate.phone}</div>
                </div>
                <div style={{ color: "black", display: "flex", justifyContent: "space-between", width: "100%", padding: '1em' }}>
                    <div style={{ width: "25%", paddingRight: '1.2em' }}>
                        <ContentEditable
                            html={data.name || ''}
                            style={{ borderBottom: '1px solid grey' }}
                            onChange={event => {
                                setData({
                                    name: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div style={{ width: "25%", paddingRight: '1.2em' }}>
                        <ContentEditable
                            html={data.dni || ''}
                            style={{ borderBottom: '1px solid grey' }}
                            onChange={event => {
                                setData({
                                    dni: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div style={{ width: "25%", paddingRight: '1.2em' }}>
                        <ContentEditable
                            html={data.email || ''}
                            style={{ borderBottom: '1px solid grey' }}
                            onChange={event => {
                                setData({
                                    email: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div style={{ width: "25%", paddingRight: '1.2em' }}>
                        <ContentEditable
                            html={data.phone || ''}
                            style={{ borderBottom: '1px solid grey' }}
                            onChange={event => {
                                setData({
                                    phone: event.target.value
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const EntityAdminForm = ({ translate, setData, data = {} }) => {
const primary = getPrimary();
    return (
        <div style={{ width: "100%", display: "flex", }}>
            <div style={{ height: "100%", width: "100%" }}>
                <div style={{ marginTop: '1em', color: 'black', fontWeight: '700' }}>{translate.entity}</div>
                <div>
                    <ContentEditable
                        html={data.entityName || ''}
                        style={{ borderBottom: '1px solid grey', width: '20em' }}
                        onChange={event => {
                            setData({
                                entityName: event.target.value
                            })
                        }}
                    />
                </div>
                <div style={{ marginTop: '1em', color: 'black', fontWeight: '700' }}>{translate.representative}</div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: '1em' }}>
                    <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>{translate.name}</div>
                    <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>{translate.dni}</div>
                    <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>{translate.email}</div>
                    <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>{translate.phone}</div>
                </div>
                <div style={{ color: "black", display: "flex", justifyContent: "space-between", width: "100%", padding: '1em' }}>
                    <div style={{ width: "25%", paddingRight: '1.2em' }}>
                        <ContentEditable
                            html={data.name || ''}
                            style={{ borderBottom: '1px solid grey' }}
                            onChange={event => {
                                setData({
                                    name: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div style={{ width: "25%", paddingRight: '1.2em' }}>
                        <ContentEditable
                            html={data.dni || ''}
                            style={{ borderBottom: '1px solid grey' }}
                            onChange={event => {
                                setData({
                                    dni: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div style={{ width: "25%", paddingRight: '1.2em' }}>
                        <ContentEditable
                            html={data.email || ''}
                            style={{ borderBottom: '1px solid grey' }}
                            onChange={event => {
                                setData({
                                    email: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div style={{ width: "25%", paddingRight: '1.2em' }}>
                        <ContentEditable
                            html={data.phone || ''}
                            style={{ borderBottom: '1px solid grey' }}
                            onChange={event => {
                                setData({
                                    phone: event.target.value
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const ListAdminForm = ({ translate, setData, data }) => {
    const primary = getPrimary();
    React.useEffect(() => {
        if(!data.list){
            setData({
                list: []
            });
        }
    }, [data.list]);


    const setAdminData = (newData, index) => {
        const list = [...data.list] || [];
        list[index] = {
            ...list[index],
            ...newData
        }

        setData({
            list: [...list]
        })
    }

    const deleteRow = index => {
        const newList = [...data.list];
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
        <>
            <div style={{ fontWeight: "bold", color: primary, paddingBottom: "1em" }}>
                {translate.admins}
                <i
                    className={'fa fa-plus-circle'}
                    style={{ color: primary, marginLeft: '4px', fontSize: '22px', cursor: "pointer" }}
                    onClick={addRow}
                ></i>
            </div>
            <div
                style={{
                    height: "calc( 100% - 10em )",
                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                    padding: "1em",
                    width: "100%",
                    //maxHeight: expandAdministradores ? "100%" : "20em",
                    //overflow: "hidden",
                    overflowX: 'auto',
                    position: "relative",
                    paddingBottom: "2.5em",
                    transition: 'max-height 0.5s'
                }}
            >
                <div>
                    <div style={{ height: "100%" }}>
                        <Table>
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
                                    {translate.position}
                                </TableCell>
                                <TableCell>
                                    {translate.appointment}
                                </TableCell>
                                <TableCell>
                                    {translate.table_councils_duration}
                                </TableCell>
                                <TableCell style={{ minWidth: '5em' }}>
                                    {translate.votes}
                                </TableCell>
                                <TableCell>
                                    {translate.social_capital}
                                </TableCell>
                                <TableCell>
                                    {translate.new_delete}
                                </TableCell>
                            </TableHead>
                            <TableBody>
                            {data.list && data.list.map((item, index) => (
                                <TableRow key={`data_keys_${index}`} style={{ color: "black", width: "100%", padding: '1em' }}>
                                    <TableCell>
                                        <ContentEditable
                                            html={item.name || ''}
                                            style={{ borderBottom: '1px solid grey' }}
                                            onChange={event => {
                                                setAdminData({
                                                    name: event.target.value
                                                }, index)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ContentEditable
                                            html={item.surname || ''}
                                            style={{ borderBottom: '1px solid grey' }}
                                            onChange={event => {
                                                setAdminData({
                                                    surname: event.target.value
                                                }, index)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ContentEditable
                                            html={item.dni || ''}
                                            style={{ borderBottom: '1px solid grey' }}
                                            onChange={event => {
                                                setAdminData({
                                                    dni: event.target.value
                                                }, index)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ContentEditable
                                            html={item.email || ''}
                                            style={{ borderBottom: '1px solid grey' }}
                                            onChange={event => {
                                                setAdminData({
                                                    email: event.target.value
                                                }, index)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ContentEditable
                                            html={item.position || ''}
                                            style={{ borderBottom: '1px solid grey' }}
                                            onChange={event => {
                                                setAdminData({
                                                    position: event.target.value
                                                }, index)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ContentEditable
                                            html={item.apointmentDate || ''}
                                            style={{ borderBottom: '1px solid grey' }}
                                            onChange={event => {
                                                setAdminData({
                                                    apointmentDate: event.target.value
                                                }, index)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ContentEditable
                                            html={item.apointmentLength || ''}
                                            style={{ borderBottom: '1px solid grey', width: 'calc(100% - 2em)' }}
                                            onChange={event => {
                                                setAdminData({
                                                    apointmentLength: event.target.value
                                                }, index)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ContentEditable
                                            html={(item.numParticipations && item.numParticipations !== 0) ? item.numParticipations + '' : 0}
                                            style={{ borderBottom: item.numParticipations && item.numParticipations !== 0 ? '1px solid grey' : '' }}
                                            onChange={event => {
                                                setAdminData({
                                                    numParticipations: +event.target.value
                                                }, index)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ContentEditable
                                            html={(item.socialCapital && item.socialCapital !== 0) ? item.socialCapital + '' : 0}
                                            style={{ borderBottom: (item.socialCapital && item.socialCapital !== 0) ? '1px solid grey' : '' }}
                                            onChange={event => {
                                                setAdminData({
                                                    socialCapital: +event.target.value
                                                }, index)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            onClick={() => deleteRow(index)}
                                            style={{
                                                color: 'white',
                                                display: 'flex',
                                                cursor: 'pointer',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: primary,
                                                borderRadius: '50%',
                                                height: '1.2em',
                                                width: '1.2em'
                                            }}
                                        >X</div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
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
        1: translate.vice_president,
        2: translate.secretary,
        3: translate.vice_secretary
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
        const list = [...data.list];
        list[index] = {
            ...list[index],
            ...newData
        }

        setData({
            list: [...list]
        })
    }





    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <Table style={{ maxWidth: "100%", tableLayout: 'auto' }}>
                <TableHead>
                    <TableCell>
                        {translate.new_signature}
                    </TableCell>
                    <TableCell>
                        {translate.position}
                    </TableCell>
                    <TableCell>
                        {translate.name}
                    </TableCell>
                    <TableCell>
                        {translate.surname || ''}
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
                        <TableRow key={`item_${item.id}`} style={{ marginTop: '1em', ...(index > 0 ? { borderTop: '1px solid gainsboro' } : {}) }}>
                            <TableCell>
                                <CheckBox
                                    value={item ? item.sign : false}
                                    onChange={(event, checked) => setAdminData({ sign: checked }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                {getCouncilAdminPosition(index, translate)}
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item ? item.name : ''}
                                    onChange={event => setAdminData({ name: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item ? item.surname : ''}
                                    onChange={event => setAdminData({ surname: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item ? item.dni : ''}
                                    onChange={event => setAdminData({ dni: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item ? item.email : ''}
                                    onChange={event => setAdminData({ email: event.target.value }, index)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item ? item.phone : ''}
                                    style={{ maxWidth: '10em' }}
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
