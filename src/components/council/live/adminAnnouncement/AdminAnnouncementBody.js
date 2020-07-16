import React from 'react';
import { Paper } from 'material-ui';
import { BasicButton, Checkbox, Scrollbar } from '../../../../displayComponents';
import aviso from '../../../../assets/img/aviso.svg';
import { getPrimary } from '../../../../styles/colors';


const AdminAnnouncementBody = ({ announcement, updateAnnouncement, admin, blockUser }) => {
    const primary = getPrimary()

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", color: "black", marginBottom: '0.5em' }}>
                {/* TRADUCCION */}
                <div style={{ paddingRight: "0.5em" }}><img src={aviso}></img></div>
                <div style={{ fontSize: "18px", color: "black" }}>Aviso del administrador</div>
                <div style={{ paddingLeft: "0.5em", width: announcement.blockUser && "230px", display: "flex" }} >
                    <i
                        className="material-icons"
                        style={{ color: primary, fontSize: '14px', paddingRight: "0.3em", cursor: "pointer" }}
                        //onClick={() => setMostrarInfo(!mostrarInfo)}
                    >
                        help
                    </i>
                    {announcement.blockUser &&
                        <div style={{ color: "rgba(0, 0, 0, 0.37)", fontSize: "10px" }}>
                            Este aviso bloquea todas las funciones de los participantes hasta que haya sido cerrado
                        </div>}
                </div>
            </div>
            {admin &&
                <div style={{
                    color: primary,
                    marginTop: '0.5'
                }}>
                    {/* TRADUCCION */}
                    <Checkbox
                        label={"Bloquear funciones a los participantes hasta cerrar el aviso"}
                        styleInLabel={{ color: primary, fontSize: "12px" }}
                        colorCheckbox={"primary"}
                        value={blockUser}
                        onChange={() => updateAnnouncement({ blockUser: !blockUser })}
                    />
                </div>
            }
            <div
                style={{
                    paddingTop: '0.5em',
                    height: '100px',
                    width: '100%',
                    overflow: 'hidden',
                    padding: '.5em',
                    border: "1px solid" + primary,
                }}
            >
                <Scrollbar>
                    <div style={{ height: 'calc(100% - 0.6em)' }} >
                        <div style={{
                            width: "calc(100% - 3px)",
                            fontSize: "13px",
                            color: "black",
                        }}>
                            <div dangerouslySetInnerHTML={{ __html: announcement.text }} />
                        </div>
                    </div>
                </Scrollbar>
            </div>
        </>
    )

}

export default AdminAnnouncementBody;