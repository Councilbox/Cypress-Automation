import React from 'react';
import { Tooltip } from 'material-ui';
import { TextInput, Grid, GridItem } from '../../../displayComponents';
import * as CBX from '../../../utils/CBX';

const TranslationForm = ({ data, errors, updateState, flagEdit }) => (
    <Grid>
        <GridItem xs={12} md={12} lg={12} style={{ display: 'flex' }}>
            <Row
                value={data.label}
                disabled={flagEdit}
                floatingText="Nombre"
                errorText={errors.label}
                onChange={event => updateState({ label: event.target.value })}
                flagEdit={flagEdit}>
            </Row>
        </GridItem>
        <GridItem xs={12} md={12} lg={12} style={{ display: 'flex' }}>
            <TextInput
                value={data.es}
                errorText={errors.es}
                floatingText="Español"
                onChange={event => updateState({ es: event.target.value })}
            />
        </GridItem>
        <GridItem xs={12} md={12} lg={12} style={{ display: 'flex' }}>
            <TextInput
                value={data.en}
                errorText={errors.en}
                floatingText="Inglés"
                onChange={event => updateState({ en: event.target.value })}
            />
        </GridItem>
        <GridItem xs={12} md={12} lg={12} style={{ display: 'flex' }}>
            <TextInput
                value={data.gal}
                errorText={errors.gal}
                floatingText="Gallego"
                onChange={event => updateState({ gal: event.target.value })}
            />
        </GridItem>
        <GridItem xs={12} md={12} lg={12} style={{ display: 'flex' }}>
            <TextInput
                value={data.pt}
                errorText={errors.pt}
                floatingText="Portugués"
                onChange={event => updateState({ pt: event.target.value })}
            />
        </GridItem>
        <GridItem xs={12} md={12} lg={12} style={{ display: 'flex' }}>
            <TextInput
                value={data.cat}
                errorText={errors.cat}
                floatingText="Catalan"
                onChange={event => updateState({ cat: event.target.value })}
            />
        </GridItem>
    </Grid>
);

class Row extends React.Component {
    state = {
        showCopyTooltip: false,
        showActions: false
    }

    timeout = null;

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    startCloseTimeout() {
        this.timeout = setTimeout(() => {
            this.setState({
                showCopyTooltip: false
            });
        }, 2000);
    }

    copy = () => {
        this.setState({
            showCopyTooltip: true
        });
        this.startCloseTimeout();
        CBX.copyStringToClipboard(this.props.value);
    }

    mouseEnterHandler = () => {
        this.setState({
            showActions: true
        });
    }

    mouseLeaveHandler = () => {
        this.setState({
            showActions: false
        });
    }

    render() {
        // TRADUCCION
        const { value, disabled, floatingText, errorText, onChange, flagEdit } = this.props;
        return (
            <div onClick={flagEdit && this.copy} style={{ overflow: 'hidden', width: '100%', display: 'flex', }}>
                <Tooltip title={'copiado'} open={this.state.showCopyTooltip}>
                    <TextInput
                        pointerInput={true}
                        value={value}
                        disabled={disabled}
                        floatingText={floatingText}
                        errorText={errorText}
                        onChange={onChange}
                    />
                </Tooltip>


            </div>
        );
    }
}

export default TranslationForm;
