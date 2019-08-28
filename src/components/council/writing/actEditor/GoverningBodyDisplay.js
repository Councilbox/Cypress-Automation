import React from 'react';
import { GOVERNING_BODY_TYPES } from '../../../../constants';
import * as CBX from '../../../../utils/CBX';
import { Tooltip } from 'material-ui';
import { useHoverRow } from '../../../../hooks';
import { getCouncilAdminPosition } from '../../../company/settings/GoverningBodyForm';


const GoverningBodyDisplay = ({ translate, company, open, ...props }) => {
    const type = GOVERNING_BODY_TYPES[Object.keys(GOVERNING_BODY_TYPES).filter(key => GOVERNING_BODY_TYPES[key].value === company.governingBodyType)[0]];
    return (
        <div style={{ width: '100%', height: '100%', padding: '1em' }}>
            {open &&
                <React.Fragment>
                    <h6>{type.label}</h6>
                    {company.governingBodyType > 2?
                        company.governingBodyData.list.map((admin, index) => {
                            return(
                                <div>
                                    <Row
                                        field={company.governingBodyType === 5? getCouncilAdminPosition(index, translate) : null}
                                        value={`${admin.name} ${admin.surname}`}
                                    />
                                </div>
                            )
                        })
                    :
                        company.governingBodyType !== 0 &&
                            <div>
                                {company.governingBodyType === 2 &&
                                    <Row
                                        field={translate.entity}
                                        value={`${company.governingBodyData.entityName}`}
                                    />
                                }
                                <Row
                                    field={company.governingBodyType === 2? translate.representative : null}
                                    value={`${company.governingBodyData.name} ${company.governingBodyData.surname}`}
                                />
                            </div>
                    }

                </React.Fragment>
            }
        </div>

    )
}

const Row = ({ value, field }) => {
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
            {field &&
                <div style={{ fontWeight: '700', width: '32%' }}>{`${field}:`}</div>
            }
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