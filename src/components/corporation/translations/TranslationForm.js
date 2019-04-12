import React from 'react';
import { TextInput, Grid, GridItem } from '../../../displayComponents';
import ButtonCopy from './ButtonCopy';
import FontAwesome from "react-fontawesome";
import { Tooltip } from 'antd';




const TranslationForm = ({ data, errors, translate, updateState, values }) => {
    const [state, setState] = React.useState({
        showCopyTooltip: false,
        showActions: false
    });

    const copy = (val) => {
        setState({
            showCopyTooltip: true
        });
        const el = document.createElement('span')

        el.textContent = 'Text to copy'

        // styles to prevent scrolling to the end of the page
        el.style.position = 'fixed'
        el.style.top = 0
        el.style.clip = 'rect(0, 0, 0, 0)'

        document.body.appendChild(el)
        console.log(el)
        document.execCommand('copy')
    }

    const startCloseTimeout = () => {
        let timeout = setTimeout(() => {
            setState({
                showCopyTooltip: false
            });
        }, 2000);
    }


    return (
        <Grid>
            <GridItem xs={12} md={12} lg={12} style={{ display: "flex" }}>
                <TextInput
                    value={data.label}
                    floatingText="Nombre"
                    errorText={errors.label}
                    onChange={event => updateState({ label: event.target.value })}
                />
                {state.showCopyTooltip &&
                    <Tooltip title="Copiado" open={state.showCopyTooltip}><div> </div></Tooltip>
                }
                <FontAwesome
                    name={"clone"}
                    style={{
                        cursor: "pointer",
                        marginTop: "18px",
                        marginLeft: "0.5em",
                    }}
                    onClick={() => copy(data.label)}
                />
                {/* {data.label &&
                    <ButtonCopy val={data.label} />
                } */}
            </GridItem>
            <GridItem xs={12} md={12} lg={12} style={{ display: "flex" }}>
                <TextInput
                    value={data.es}
                    errorText={errors.es}
                    floatingText="Español"
                    onChange={event => updateState({ es: event.target.value })}
                />
                <FontAwesome
                    name={"clone"}
                    style={{
                        cursor: "pointer",
                        marginTop: "18px",
                        marginLeft: "0.5em",
                    }}
                    onClick={() => copy(data.es)}
                />
                {/* {data.es &&
                    <ButtonCopy value={data.es} />
                } */}
            </GridItem>
            <GridItem xs={12} md={12} lg={12} style={{ display: "flex" }}>
                <TextInput
                    value={data.en}
                    errorText={errors.en}
                    floatingText="Inglés"
                    onChange={event => updateState({ en: event.target.value })}
                />
                {/* {data.en &&
                    <ButtonCopy value={data.en} />
                } */}
            </GridItem>
            <GridItem xs={12} md={12} lg={12} style={{ display: "flex" }}>
                <TextInput
                    value={data.gal}
                    errorText={errors.gal}
                    floatingText="Gallego"
                    onChange={event => updateState({ gal: event.target.value })}
                />
                {/* {data.gal &&
                    <ButtonCopy value={data.gal} />
                } */}
            </GridItem>
            <GridItem xs={12} md={12} lg={12} style={{ display: "flex" }}>
                <TextInput
                    value={data.pt}
                    errorText={errors.pt}
                    floatingText="Portugués"
                    onChange={event => updateState({ pt: event.target.value })}
                />
                {/* {data.pt &&
                    <ButtonCopy value={data.pt} />
                } */}
            </GridItem>
            <GridItem xs={12} md={12} lg={12} style={{ display: "flex" }}>
                <TextInput
                    value={data.cat}
                    errorText={errors.cat}
                    floatingText="Catalan"
                    onChange={event => updateState({ cat: event.target.value })}
                />
                {/* {data.cat &&
                    <ButtonCopy value={data.cat} />
                } */}
            </GridItem>
        </Grid>
    )
}

export default TranslationForm