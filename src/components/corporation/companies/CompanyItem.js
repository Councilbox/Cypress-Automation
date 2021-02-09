import React from 'react';
import FontAwesome from 'react-fontawesome';
import { MenuItem, Table, TableRow, TableCell } from 'material-ui';
import { Checkbox } from '../../../displayComponents';
import { isMobile } from '../../../utils/screen';

const CompanyItem = ({ company, onCheck, checkable, checked, tableRoot }) => {
    if (tableRoot) {
        if (isMobile) {
            return (
                <Table
                    style={{ width: '100%', maxWidth: '100%', height: '100%' }}
                >
                    <TableRow>
                        <TableCell style={{ width: '15%', padding: '4px 56px 4px 15px', textAlign: 'center' }}>
                            {company.logo ?
                                <img src={company.logo} alt={'logo'} style={{ height: '2em', width: 'auto', maxWidth: '3em' }} />
                                : <FontAwesome
                                    name={'building-o'}
                                    style={{ fontSize: '1.7em', color: 'lightgrey' }}
                                />

                            }
                        </TableCell>
                        <TableCell style={{ width: '10%', padding: '4px 56px 4px 15px' }}>
                            <span style={{ fontSize: '0.9rem' }}>{`${company.id}`}</span>
                        </TableCell>
                        <TableCell style={{ width: '75%', padding: '4px 56px 4px 5px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{company.businessName}</span>
                        </TableCell>
                    </TableRow>
                </Table>
            );
        }
            return (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {checkable
                        && <div style={{ width: '5em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Checkbox
                                value={checked}
                                onChange={(event, isInputChecked) => {
                                    onCheck(company, isInputChecked);
                                }}
                            />
                        </div>
                    }
                    <MenuItem
                        style={{
                            borderBottom: '1px solid gainsboro',
                            height: '3em',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row'
                        }}
                    >
                        <div
                            style={{
                                width: '15%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    paddingRight: '60px'
                                }}
                            >
                                {company.logo ?
                                    <img src={company.logo} alt={'logo'} style={{ height: '2em', width: 'auto', maxWidth: '3em' }} />
                                    : <FontAwesome
                                        name={'building-o'}
                                        style={{ fontSize: '1.7em', color: 'lightgrey' }}
                                    />

                                }
                            </div>
                        </div>
                        <div
                            style={{
                                width: '10%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                // paddingLeft: '1.4em'
                            }}
                        >
                            <span style={{ fontSize: '0.9rem' }}>{`${company.id}`}</span>
                        </div>
                        <div
                            style={{
                                width: '75%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                // paddingLeft: '1.4em'
                            }}
                        >
                            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{company.businessName}</span>
                        </div>
                    </MenuItem>
                </div>
            );
    }
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {checkable
                    && <div style={{ width: '5em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Checkbox
                            value={checked}
                            onChange={(event, isInputChecked) => {
                                onCheck(company, isInputChecked);
                            }}
                        />
                    </div>
                }
                <MenuItem
                    style={{
                        border: '1px solid gainsboro',
                        height: '3em',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    <div
                        style={{
                            width: '5em',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {company.logo ?
                            <img src={company.logo} alt={'logo'} style={{ height: '2em', width: 'auto', maxWidth: '3em' }} />
                            : <FontAwesome
                                name={'building-o'}
                                style={{ fontSize: '1.7em', color: 'lightgrey' }}
                            />

                        }
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            paddingLeft: '1.4em'
                        }}
                    >
                        <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{company.businessName}</span>
                        <span style={{ fontSize: '0.7rem' }}>{`ID: ${company.id}`}</span>
                    </div>
                </MenuItem>
            </div>
        );
};

export default CompanyItem;
