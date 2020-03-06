import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, DateTimePicker, SelectInput, BasicButton } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { Collapse } from 'material-ui';
import ContentEditable from 'react-contenteditable';



const FileLibrosOfi = ({ translate, updateFileData, updateCompany, data, ...props }) => {
    const [state, setState] = React.useState({
        filterText: ""
    });
    const [modal, setModal] = React.useState(false);
    const [selecteOptionMenu, setSelecteOptionMenu] = React.useState('Informacion');
    const [expandedCard, setExpandedCard] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const primary = getPrimary();
    const books = (data.file && data.file.books)? data.file.books : []; 

    // necesito council
    console.log(props)

    // const deleteRow = index => {
    //     let newList = [...data.list];
    //     newList.splice(index, 1);
    //     setData({
    //         list: newList
    //     })
    // }

    const addRow = () => {
        const newBooks = [...books, { aqui: 'otro'}];
        updateFileData({
            books: newBooks
        })
    }

    const deleteRow = index => {
        let newBooks = [...books];
        newBooks.splice(index, 1);
        updateFileData({
            books: newBooks
        })
    }

    const updateBook = (newData, index) => {
        const list = [...books];
        list[index] = {
            ...list[index],
            ...newData
        }

        updateFileData({
            books: [...list]
        })
    }





    const clickMobilExpand = event => {
        setExpandedCard(!expandedCard)
        if (expanded) {
            setExpanded(!expanded)
        }
    }


    //TRADUCCION
    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: "0.5em", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    {/* <BasicButton
                        text={
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div><i className="fa fa-plus-circle" style={{ color: getPrimary(), paddingRight: "5px", fontSize: "16px" }}></i></div>
                                <div style={{ color: getPrimary(), fontWeight: "bold" }} >{translate.add}</div>
                            </div>
                        }
                        //onClick={this.toggle}
                        backgroundColor={{ background: "white", boxShadow: "none" }}
                    /> */}
                    {/* </BasicButton>
                    <div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
                        <i className="fa fa-filter"></i>
                    </div>
                    <TextInput
                        placeholder={translate.search}
                        adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
                        type="text"
                        value={state.filterText || ""}
                        styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                        disableUnderline={true}
                        stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                        onChange={event => {
                            setState({
                                ...state,
                                filterText: event.target.value
                            })
                        }}
                    /> */}
                </div>
            </div>
            <div style={{ padding: '0px 1em 1em', height: '100%', }}>
                <div style={{ height: "100%", }}>
                    <div style={{ padding: "0 1em", fontWeight: "bold", color: primary, display: "flex", justifyContent: "space-between", paddingLeft: '24px', paddingRight: '24px' }}>
                        <div style={{ width: '15%', display: "flex", cursor: 'pointer' }} onClick={addRow}>
                            <div style={{ border: "1px solid" + primary, padding: "0.6em 5px", display: 'flex' }}>
                                Libros de Actas
                                <div>
                                    <i className="fa fa-plus-circle" style={{ color: primary, paddingRight: "5px", marginLeft: '5px', fontSize: "16px" }}></i>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '12%', textAlign: 'center' }}>F. Apertura</div>
                        <div style={{ width: '12%', textAlign: 'center' }}>F. Cierre</div>
                        <div style={{ width: '12%', textAlign: 'center' }}>F. legalización</div>
                        <div style={{ width: '12%', textAlign: 'center' }}>F. Devolución</div>
                        <div style={{ width: '15%', textAlign: 'center' }}>Comentarios</div>
                    </div>
                    <Scrollbar>
                        <div style={{ width: "100%", height: "calc( 100% - 3em )", padding: "0 1em" }}>
                            {books.length > 0?
                                books.map((book, index) => (
                                    <div>
                                        <Card style={{ marginTop: "1em" }}>
                                            <div style={{ position: "relative" }}>
                                                <div style={{ color: 'black', display: "flex", justifyContent: "space-between", color: "black", fontSize: "15px", paddingLeft: '24px', paddingRight: '24px', paddingTop: "3em", paddingBottom: "3em" }}>
                                                    <div style={{ width: '15%' }}>
                                                        <ContentEditable
                                                            style={{ color: 'black', minWidth: '10em'}}
                                                            html={book.name || ''}
                                                            onChange={event => {
                                                                updateBook({
                                                                    name: event.target.value
                                                                }, index)
                                                            }}
                                                        />

                                                    </div>
                                                    <div style={{ width: '12%' }}>
                                                        <DateTimePicker
                                                            format="L"
                                                            onlyDate
                                                            onChange={date => {
                                                                let dateString = null;
                                                                if(date){
                                                                    const newDate = new Date(date);
                                                                    dateString = newDate.toISOString();
                                                                }
                                                                updateBook({
                                                                    openDate: dateString
                                                                }, index)
                                                            }}
                                                            
                                                            value={book.openDate? book.openDate : null}
                                                        />
                                                    </div>
                                                    <div style={{ width: '12%' }}>
                                                        <DateTimePicker
                                                            format="L"
                                                            onlyDate
                                                            onChange={date => {
                                                                let dateString = null;
                                                                if(date){
                                                                    const newDate = new Date(date);
                                                                    dateString = newDate.toISOString();
                                                                }
                                                                updateBook({
                                                                    closeDate: dateString
                                                                }, index)
                                                            }}
                                                            
                                                            value={book.closeDate? book.closeDate : null}
                                                        />
                                                    </div>
                                                    <div style={{ width: '12%' }}>
                                                        <DateTimePicker
                                                            format="L"
                                                            onlyDate
                                                            onChange={date => {
                                                                let dateString = null;
                                                                if(date){
                                                                    const newDate = new Date(date);
                                                                    dateString = newDate.toISOString();
                                                                }
                                                                updateBook({
                                                                    legalDate: dateString
                                                                }, index)
                                                            }}
                                                            
                                                            value={book.legalDate? book.legalDate : null}
                                                        />
                                                    </div>
                                                    <div style={{ width: '12%' }}>
                                                        <DateTimePicker
                                                            format="L"
                                                            onlyDate
                                                            onChange={date => {
                                                                let dateString = null;
                                                                if(date){
                                                                    const newDate = new Date(date);
                                                                    dateString = newDate.toISOString();
                                                                }
                                                                updateBook({
                                                                    devolutionDate: dateString
                                                                }, index)
                                                            }}
                                                            
                                                            value={book.devolutionDate? book.devolutionDate : null}
                                                        />
                                                    </div>
                                                    <div style={{ width: '12%', display: 'flex' }}>
                                                        <ContentEditable
                                                            style={{ color: 'black', minWidth: '90%'}}
                                                            html={book.comments || ''}
                                                            onChange={event => {
                                                                updateBook({
                                                                    comments: event.target.value
                                                                }, index)
                                                            }}
                                                        />
                                                        <IconButton
                                                            onClick={() => deleteRow(index)}
                                                            aria-expanded={expandedCard}
                                                            aria-label="Show more"
                                                            className={"expandButtonModal"}
                                                        >
                                                            <i
                                                                className={"fa fa-times-circle"}
                                                                style={{
                                                                    color: primary,
                                                                    transition: "all 0.3s"
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))
                            :
                                <div style={{marginTop: '1em'}}>
                                    No hay libros añadidos
                                </div>
                                
                            }
                            <BasicButton
                                text={translate.save}
                                onClick={updateCompany}
                                floatRight={true}

                            />
                        </div>

                    </Scrollbar>
                </div>
            </div>
        </div>
    )
}


/*
<div>
                                
                            </div>

*/

export default withTranslations()(withApollo(FileLibrosOfi));