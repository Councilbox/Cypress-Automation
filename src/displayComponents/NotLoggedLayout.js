import React from 'react';
import Header from '../components/Header';
import bg from '../assets/img/fondo_test_mundo2.jpg';
import { getCustomBackground, getCustomRoomBackground, useSubdomain } from '../utils/subdomain';
import LoadingMainApp from './LoadingMainApp';


const NotLoggedLayout = ({ children, translate, helpIcon, languageSelector, councilIsFinished, setSelectHeadFinished, selectHeadFinished, ...props }) => {
    const [loadingImg, setLoadingImg] = React.useState(true);
    const customBackground = getCustomBackground();
    const customRoomBackground = getCustomRoomBackground();
    const imgUrl = window.location.pathname.includes('participant') ?
        customRoomBackground ? customRoomBackground : customBackground ? customBackground : bg
        :
        customBackground ? customBackground : bg

    React.useEffect(() => {
        let img = new Image();
        img.src = imgUrl;
        img.onload = () => setLoadingImg(false);
    }, [customBackground, customRoomBackground]);

    if (loadingImg) {
        return <LoadingMainApp />
    }
    
    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                height: "100%",
                overflow: "auto",
                background: `url(${imgUrl})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                ...((customBackground || customRoomBackground) ? {} : {
                    backgroundPosition: 'center center',
                }),
                padding: 0,
                margin: 0,
                width: '100%',
            }}
        >
            <Header
                translate={translate}
                helpIcon={helpIcon}
                languageSelector={languageSelector}
                councilIsFinished={councilIsFinished}
                setSelectHeadFinished={setSelectHeadFinished}
                selectHeadFinished={selectHeadFinished}
                contactAdmin={window.location.pathname.search("attendance")}
                council={props.council}
                participant={props.participant}
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
}

export default NotLoggedLayout;