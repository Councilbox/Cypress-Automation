import React from 'react';
import { Tooltip } from 'material-ui';
import { GOVERNING_BODY_TYPES } from '../../../../constants';
import * as CBX from '../../../../utils/CBX';
import { useHoverRow } from '../../../../hooks';
import { BasicButton } from '../../../../displayComponents';
import { getCouncilAdminPosition } from '../../../company/settings/GoverningBodyForm';
import { getSecondary } from '../../../../styles/colors';


const GoverningBodyDisplay = ({ translate, company, open }) => {
    const copyAll = () => (company.governingBodyType > 2 ?
            CBX.copyStringToClipboard(company.governingBodyData.list.reduce((acc, curr) => `${acc}${curr.name} ${curr.surname || ''} \n`, ''))
        : CBX.copyStringToClipboard(`${company.governingBodyData.name} ${company.governingBodyData.surname || ''}`));


    const type = GOVERNING_BODY_TYPES[Object.keys(GOVERNING_BODY_TYPES).filter(key => GOVERNING_BODY_TYPES[key].value === company.governingBodyType)[0]];
    return (
        <div style={{ width: '100%', height: '100%', padding: '1em' }}>
            {open
                && <React.Fragment>
                    <div>{translate[type.label] || type.label} {company.governingBodyType > 2
                        && <BasicButton
                            type="flat"
                            color="transparent"
                            onClick={copyAll}
                            textStyle={{
                                fontSize: '0.8em',
                                color: 'darkgrey'
                            }}
                            text="Copiar todos"
                        />}
                    </div>
                    {company.governingBodyType > 2 ?
                        company.governingBodyData.list.map((admin, index) => (
                                <div key={`admin_key_${index}`}>
                                    <Row
                                        field={company.governingBodyType === 5 ? getCouncilAdminPosition(index, translate) : null}
                                        value={`${admin.name} ${admin.surname || ''}`}
                                    />
                                </div>
                            ))
                    : company.governingBodyType !== 0
                            && <div>
                                {company.governingBodyType === 2
                                    && <Row
                                        field={translate.entity}
                                        value={`${company.governingBodyData.entityName}`}
                                    />
                                }
                                <Row
                                    field={company.governingBodyType === 2 ? translate.representative : null}
                                    value={`${company.governingBodyData.name} ${company.governingBodyData.surname || ''}`}
                                />
                            </div>
                    }

                </React.Fragment>
            }
        </div>

    );
};

const Row = ({ value, field }) => {
    const [tooltip, setTooltip] = React.useState(false);
    const [showActions, handlers] = useHoverRow();
    const secondary = getSecondary();

    React.useEffect(() => {
        let timeout;

        if (tooltip) {
            timeout = setTimeout(() => setTooltip(false), 2000);
        }
        return () => clearTimeout(timeout);
    }, [tooltip]);


    const copy = () => {
        setTooltip(true);
        CBX.copyStringToClipboard(value);
    };

    const icon = () => (
            <i className="fa fa-clone"
                onClick={copy}
                style={{
                    textAlign: 'right',
                    fontSize: '0.9em',
                    color: secondary,
                    marginLeft: '0.6em',
                    cursor: 'pointer'
                }}
            />
        );

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', background: showActions ? 'gainsboro' : '', paddingRight: '0.25em', paddingLeft: '0.25em', paddingBottom: '0.25em', paddingTop: '0.25em', }}
            {...handlers}
        >
            {field
                && <div style={{ fontWeight: '700', width: '32%' }}>{`${field}:`}</div>
            }
            {tooltip ?
                <div style={{ width: '64%', marginLeft: '1%' }} onClick={copy}>
                    <Tooltip title="Copiado" open={tooltip} placement="top">
                        <div>
                            {value}
                            {showActions && icon()}
                        </div>
                    </Tooltip>
                </div>
                : <div style={{ width: '64%', marginLeft: '1%', cursor: 'pointer' }} onClick={copy}>
                    {value}
                    {showActions && icon()}
                </div>
            }
        </div>
    );
};

export default GoverningBodyDisplay;
