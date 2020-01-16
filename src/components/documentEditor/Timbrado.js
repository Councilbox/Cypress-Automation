import React from 'react';
import imgIzq from "../../assets/img/TimbradoCBX.jpg";

const Timbrado = ({ colapse, edit }) => {
    const [imgIzqCbx, setImgIzqCbx] = React.useState(2)

    React.useEffect(() => {
        if (document.getElementsByClassName("actaLienzo")[0]) {
            //el if es para que minimo monte 2 paginas
            // if (Math.ceil(document.getElementsByClassName("actaLienzo")[0].scrollHeight / 995) >= 2) {
                setImgIzqCbx(Math.ceil(document.getElementsByClassName("actaLienzo")[0].scrollHeight / 995))
            // }
        }
    }, [document.getElementsByClassName("actaLienzo")[0], colapse, edit])

    return (
        new Array(imgIzqCbx).fill(0).map((option, index) =>
            <img style={{ width: "100%", }} src={imgIzq} key={index}></img>
        )
    )
}

export default Timbrado;