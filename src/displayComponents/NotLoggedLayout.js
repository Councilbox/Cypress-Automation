import React from 'react';
import Header from '../components/Header';
import { getPrimary, getSecondary } from '../styles/colors';
const primary = getPrimary();
const secondary = getSecondary();

const NotLoggedLayout = ({ children, translate, helpIcon, languageSelector }) => (
    <div
        style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            height: "100vh",
            overflow: "auto",
            background: `linear-gradient(to right, ${secondary}, ${primary})`,
            padding: 0,
            margin: 0
        }}
    >
        <Header
            translate={translate}
            helpIcon={helpIcon}
            languageSelector={languageSelector}
        />
        <div
            className="row"
            style={{
                width: "100%",
                margin: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                fontSize: "0.85em",
                height: "100%",
            }}
        >
            {children}
        </div>
    </div>
)

export default NotLoggedLayout;