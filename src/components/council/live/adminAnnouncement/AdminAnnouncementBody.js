import React from 'react';
import { Paper } from 'material-ui';
import { BasicButton, Checkbox } from '../../../../displayComponents';
import aviso from '../../../../assets/img/aviso.svg';
import { getPrimary } from '../../../../styles/colors';


const AdminAnnouncementBody = ({ announcement, updateAnnouncement, admin, blockUser }) => {
    const primary = getPrimary()

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", color: "black" }}>
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
            <div
                style={{
                    paddingTop: '0.5em'
                }}
            >
                <div style={{
                    color: primary
                }}>
                    {/* TRADUCCION */}
                    {admin &&
                        <Checkbox
                            label={"Bloquear funciones a los participantes hasta cerrar el aviso"}
                            styleInLabel={{ color: primary, fontSize: "12px" }}
                            colorCheckbox={"primary"}
                            value={blockUser}
                            onChange={() => updateAnnouncement({ blockUser: !blockUser })}
                        />
                    }
                </div>
                <div style={{ marginTop: "5px" }} >
                    <div style={{ width: "100%", border: "1px solid" + primary, minHeight: "80px", margin: "0 auto", padding: "5px", fontSize: "13px", color: "black" }}>
                        <div dangerouslySetInnerHTML={{ __html: announcement.text }} />
                    </div>
                </div>
            </div>
        </>
    )

}

export default AdminAnnouncementBody;