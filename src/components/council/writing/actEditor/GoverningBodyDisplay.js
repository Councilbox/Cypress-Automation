import React from 'react';
import { GOVERNING_BODY_TYPES } from '../../../../constants';
import * as CBX from '../../../../utils/CBX';
import { Tooltip } from 'material-ui';
import { useHoverRow } from '../../../../hooks';

const GoverningBodyDisplay = ({ translate, company, ...props }) => {
    console.log(company);

    const type = GOVERNING_BODY_TYPES[Object.keys(GOVERNING_BODY_TYPES).filter(key => GOVERNING_BODY_TYPES[key].value === company.governingBodyType)[0]];

    return (
        <div style={{ width: '100%', height: '100%', padding: '1em' }}>
            <h6>{type.label}</h6>
            {company.governingBodyData.list.map(admin => {
                return(
                    <div>
                        <Row
                            value={`${admin.name} ${admin.surname}`}
                        />
                    </div>
                )
            })}
        </div>

    )
}

const Row = ({ value }) => {
    const [tooltip, setTooltip] = React.useState(false);
    const [showActions, handlers] = useHoverRow();

    React.useEffect(() => {
        let timeout;

        if(tooltip){
            timeout = setTimeout(() => setTooltip(false), 2000);
        }
        return () => clearTimeout(timeout);
    }, [tooltip]);


    const copy = () => {
        setTooltip(true);
        CBX.copyStringToClipboard(value);
    }

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', background: showActions ? "gainsboro" : "", paddingRight: "0.25em", paddingLeft: "0.25em", paddingBottom: "0.25em", paddingTop: "0.25em", }}
            {...handlers}
        >
            {tooltip ?
                <div style={{ width: '64%', marginLeft: '1%' }} onClick={copy}>
                    <Tooltip title="Copiado" open={tooltip} placement="top">
                        <span>{value}</span>
                    </Tooltip>
                </div>
                :
                <div style={{ width: '64%', marginLeft: '1%', cursor: 'pointer' }} onClick={copy}>
                    {value}
                </div>
            }
            <div onClick={this.copy} style={{ overflow: "hidden", width: '3%' }}>
                {showActions && (
                    <i className="fa fas-copy"
                        style={{
                            textAlign: "right",
                            fontSize: "0.9em",
                            cursor: 'pointer'
                        }}
                    />
                )}
            </div>

        </div>
    )
}

export default GoverningBodyDisplay;