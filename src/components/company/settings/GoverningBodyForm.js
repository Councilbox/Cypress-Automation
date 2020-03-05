import React from 'react';
import { SectionTitle, SelectInput, TextInput, BasicButton, GridItem, ButtonIcon, DropDownMenu } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { MenuItem, TableBody } from 'material-ui';
import { GOVERNING_BODY_TYPES } from '../../../constants';
import { Table, TableHead, TableRow, TableCell } from 'material-ui';
import CheckBox from '../../../displayComponents/CheckBox';
import ContentEditable from 'react-contenteditable';


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
            1: <SingleAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
            2: <EntityAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
            3: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
            4: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
            5: <CouncilAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
        }

        return menus[state.governingBodyType]? menus[state.governingBodyType] : menus[0];
    }

    const changeGoverningType = event => {
        updateState({
            governingBodyType: event.target.value,
            governingBodyData: {}
        });
    }

    const type = GOVERNING_BODY_TYPES[Object.keys(GOVERNING_BODY_TYPES).find(key => GOVERNING_BODY_TYPES[key].value === state.governingBodyType)]

    return (
        <div style={{width: '100%'}}>
            <GridItem xs={12} md={7} lg={4}>
                <div style={{ display: "flex", marginBottom: "1em" }}>
                        <DropDownMenu
                            color="transparent"
                            styleComponent={{ width: "" }}
                            Component={() =>
                                <div
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
                                    <i class="fa fa-angle-down" style={{ color: primary, paddingLeft: "5px", fontSize: "20px" }}></i>
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
                            style={{borderBottom: '1px solid grey'}}
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
                            style={{borderBottom: '1px solid grey'}}
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
                            style={{borderBottom: '1px solid grey'}}
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
                            style={{borderBottom: '1px solid grey'}}
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
                <div style={{marginTop: '1em', color: 'black', fontWeight: '700'}}>{translate.entity}</div>
                <div>
                    <ContentEditable
                        html={data.entityName || ''}
                        style={{borderBottom: '1px solid grey', width: '20em'}}
                        onChange={event => {
                            setData({
                                entityName: event.target.value
                            })
                        }}
                    />
                </div>
                <div style={{marginTop: '1em', color: 'black', fontWeight: '700'}}>{translate.representative}</div>
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
                            style={{borderBottom: '1px solid grey'}}
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
                            style={{borderBottom: '1px solid grey'}}
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
                            style={{borderBottom: '1px solid grey'}}
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
                            style={{borderBottom: '1px solid grey'}}
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
    const primary = getPrimary();
    React.useEffect(() => {
        if(!data.list){
            setData({
                list: data.list? data.list : []
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

    //TRADUCCION
    return (
        <>
            <div style={{ fontWeight: "bold", color: primary, paddingBottom: "1em" }}>
                Administradores
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "8em" }}>
                    <i className={'fa fa-plus-circle'} style={{ color: primary, fontSize: '35px', cursor: "pointer" }}></i>
                </div>
            </div>
            <div
                style={{
                    height: "calc( 100% - 10em )",
                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                    padding: "1em",
                    width: "100%",
                    //maxHeight: expandAdministradores ? "100%" : "20em",
                    overflow: "hidden",
                    position: "relative",
                    paddingBottom: "2.5em",
                    transition: 'max-height 0.5s'
                }}
            >
                <div style={{ width: "100%", display: "flex", }}>
                    <div style={{ height: "100%", width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: '1em' }}>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "20%" }}>{translate.name}</div>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "10%" }}>{translate.dni}</div>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "20%" }}>{translate.email}</div>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "10%" }}>{translate.position}</div>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "20%" }}>Fecha nomb.</div>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "20%" }}>Duración</div>
                        </div>
                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", width: "100%", padding: '1em' }}>
                            <div style={{ width: "20%", paddingRight: '1.2em' }}>
                                <ContentEditable
                                    html={data.name || ''}
                                    style={{borderBottom: '1px solid grey'}}
                                    onChange={event => {
                                        setData({
                                            name: event.target.value
                                        })
                                    }}
                                />
                            </div>
                            <div style={{ width: "10%", paddingRight: '1.2em' }}>
                                <ContentEditable
                                    html={data.dni || ''}
                                    style={{borderBottom: '1px solid grey'}}
                                    onChange={event => {
                                        setData({
                                            dni: event.target.value
                                        })
                                    }}
                                />
                            </div>
                            <div style={{ width: "20%", paddingRight: '1.2em' }}>
                                <ContentEditable
                                    html={data.email || ''}
                                    style={{borderBottom: '1px solid grey'}}
                                    onChange={event => {
                                        setData({
                                            email: event.target.value
                                        })
                                    }}
                                />
                            </div>
                            <div style={{ width: "10%", paddingRight: '1.2em' }}>
                                <ContentEditable
                                    html={data.position || ''}
                                    style={{borderBottom: '1px solid grey'}}
                                    onChange={event => {
                                        setData({
                                            position: event.target.value
                                        })
                                    }}
                                />
                            </div>
                            <div style={{ width: "20%", paddingRight: '1.2em' }}>
                                <ContentEditable
                                    html={data.apointmentDate || ''}
                                    style={{borderBottom: '1px solid grey'}}
                                    onChange={event => {
                                        setData({
                                            apointmentDate: event.target.value
                                        })
                                    }}
                                />
                            </div>
                            <div style={{ width: "20%", paddingRight: '1.2em' }}>
                                <ContentEditable
                                    html={data.apointmentLength || ''}
                                    style={{borderBottom: '1px solid grey'}}
                                    onChange={event => {
                                        setData({
                                            apointmentLength: event.target.value
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div style={{ height: "calc( 100% - 2em )", width: "100%", display: "flex", }}>
                    <div style={{ height: "100%", width: "100%" }}>
                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>Nombre</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                        </div>
                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>Nif</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                        </div>
                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>CARGO</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                        </div>
                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>DOMICILIO</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                        </div>
                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                            <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>FECHA NOMBRAMIENTO</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                            <div style={{ width: "25%" }}>Aaron</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "8em" }}>
                        <i className={'fa fa-plus-circle'} style={{ color: primary, fontSize: '35px', cursor: "pointer" }}></i>
                    </div>
                </div>
                {/* <div style={{ left: "0", background: "white", width: "100%", color: primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", position: "absolute", bottom: "0" }}>
                    <i className={expandAdministradores ? "fa fa-angle-up" : "fa fa-angle-down"} onClick={() => setExpandAdministradores(!expandAdministradores)} style={{ cursor: "pointer" }}></i>
                </div> */}
            </div>
        </>
    )

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
                        {'Firma'}
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
                    <TableCell>
                    </TableCell>
                </TableHead>
                <TableBody>
                    {data.list && data.list.map((item, index) => (
                        <TableRow key={`item_${item.id}`} style={{ marginTop: '1em', ...(index > 0? { borderTop: '1px solid gainsboro'} : {})}}>
                            <TableCell>
                                <CheckBox
                                    value={item? item.sign : false}
                                    onChange={(event, checked) => setAdminData({ sign: checked }, index)}
                                />
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
        <div style={{width: '100%', overflowX: 'auto'}}>
            <Table style={{maxWidth: "100%", tableLayout: 'auto'}}>
                <TableHead>
                    <TableCell>
                        Firma
                    </TableCell>
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
                                <CheckBox
                                    value={item? item.sign : false}
                                    onChange={(event, checked) => setAdminData({ sign: checked }, index)}
                                />
                            </TableCell>
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