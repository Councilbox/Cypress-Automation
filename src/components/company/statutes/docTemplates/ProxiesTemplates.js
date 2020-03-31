import React from 'react';
import { SectionTitle, GridItem, Checkbox, Grid } from '../../../../displayComponents';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { getPrimary } from '../../../../styles/colors';

let timeout;

const ProxiesTemplates = ({ statute, updateState, errors, translate, data, ...props }) => {
    const primary = getPrimary();
    const internalState = React.useRef({
        proxy: statute.proxy,
        proxySecondary: statute.proxySecondary,
        voteLetter: statute.voteLetter,
        voteLetterSecondary: statute.voteLetterSecondary
    });
    const proxyTemplate = React.useRef();
    const proxySecondary = React.useRef();
    const voteLetter = React.useRef();
    const voteLetterSecondary = React.useRef();

    console.log(statute);


    const handleUpdate = object => {
        clearTimeout(timeout);
        internalState.current = {
            ...internalState.current,
            ...object
        }

        timeout = setTimeout(() => {
            updateState(internalState.current)
        }, 350);
    }
    
    React.useEffect(() => {
        proxyTemplate.current.paste(statute.proxy || '');
        proxySecondary.current.paste(statute.proxySecondary || '');
        voteLetter.current.paste(statute.voteLetter || '');
        voteLetterSecondary.current.paste(statute.voteLetterSecondary || '');
    }, [statute.id]);

    //TRADUCCION

    return (
        <>
            <SectionTitle
                text={'Documentos'}
                color={primary}
                style={{
                    marginTop: "2em",
                    marginBottom: "1em"
                }}
            />
            <GridItem xs={12} md={12} lg={12}>
                <Checkbox
                    label={'Doble columna'}
                    value={statute.doubleColumnDocs === 1}
                    onChange={(event, isInputChecked) =>
                        updateState({
                            doubleColumnDocs: isInputChecked ? 1 : 0
                        })
                    }
                />
            </GridItem>
            <GridItem xs={12} md={12} lg={12}>
                <Checkbox
                    label={translate.require_proxies}
                    value={statute.requireProxy === 1}
                    onChange={(event, isInputChecked) =>
                        updateState({
                            requireProxy: isInputChecked ? 1 : 0
                        })
                    }
                />
            </GridItem>

            <GridItem xs={12} md={12} lg={12}>
                <RichTextInput
                    ref={proxyTemplate}
                    translate={translate}
                    floatingText={'Proxy personalizado'}
                    value={
                        !!internalState.proxy
                            ? internalState.proxy
                            : ""
                    }
                    onChange={value =>
                        handleUpdate({
                            proxy: value
                        })
                    }
                    // saveDraft={
                    //     <SaveDraftIcon
                    //         onClick={showSaveDraft('CONVENE_HEADER')}
                    //         translate={translate}
                    //     />
                    // }
                    //tags={conveneHeaderTags}
                    // loadDraft={
                    //     <LoadDraftModal
                    //         translate={translate}
                    //         companyId={props.company.id}
                    //         loadDraft={loadDraft}
                    //         statute={{
                    //             ...statute,
                    //             statuteId: statute.id
                    //         }}
                    //         defaultTags={{
                    //             "convene_header": {
                    //                 active: true,
                    //                 type: TAG_TYPES.DRAFT_TYPE,
                    //                 name: 'convene_header',
                    //                 label: translate.convene_header
                    //             }
                    //         }}
                    //         statutes={props.companyStatutes}
                    //         draftType={0}
                    //     />
                    // }
                />
            </GridItem>
            <GridItem xs={12} md={12} lg={12} style={{ ...(statute.doubleColumnDocs === 0? {display:  'none' } : {})}}>
                <RichTextInput
                    ref={proxySecondary}
                    translate={translate}
                    floatingText={'Proxy columna derecha'}
                    value={
                        !!internalState.proxySecondary
                            ? internalState.proxySecondary
                            : ""
                    }
                    onChange={value =>
                        handleUpdate({
                            proxySecondary: value
                        })
                    }
                    // saveDraft={
                    //     <SaveDraftIcon
                    //         onClick={showSaveDraft('CONVENE_HEADER')}
                    //         translate={translate}
                    //     />
                    // }
                    //tags={conveneHeaderTags}
                    // loadDraft={
                    //     <LoadDraftModal
                    //         translate={translate}
                    //         companyId={props.company.id}
                    //         loadDraft={loadDraft}
                    //         statute={{
                    //             ...statute,
                    //             statuteId: statute.id
                    //         }}
                    //         defaultTags={{
                    //             "convene_header": {
                    //                 active: true,
                    //                 type: TAG_TYPES.DRAFT_TYPE,
                    //                 name: 'convene_header',
                    //                 label: translate.convene_header
                    //             }
                    //         }}
                    //         statutes={props.companyStatutes}
                    //         draftType={0}
                    //     />
                    // }
                />
            </GridItem>
            <GridItem xs={12} md={12} lg={12}>
                <RichTextInput
                    ref={voteLetter}
                    translate={translate}
                    floatingText={'Carta de voto'}
                    value={
                        !!internalState.voteLetter
                            ? internalState.voteLetter
                            : ""
                    }
                    onChange={value =>
                        handleUpdate({
                            voteLetter: value
                        })
                    }
                    // saveDraft={
                    //     <SaveDraftIcon
                    //         onClick={showSaveDraft('CONVENE_HEADER')}
                    //         translate={translate}
                    //     />
                    // }
                    //tags={conveneHeaderTags}
                    // loadDraft={
                    //     <LoadDraftModal
                    //         translate={translate}
                    //         companyId={props.company.id}
                    //         loadDraft={loadDraft}
                    //         statute={{
                    //             ...statute,
                    //             statuteId: statute.id
                    //         }}
                    //         defaultTags={{
                    //             "convene_header": {
                    //                 active: true,
                    //                 type: TAG_TYPES.DRAFT_TYPE,
                    //                 name: 'convene_header',
                    //                 label: translate.convene_header
                    //             }
                    //         }}
                    //         statutes={props.companyStatutes}
                    //         draftType={0}
                    //     />
                    // }
                />
            </GridItem>
            <GridItem xs={12} md={12} lg={12} style={{ ...(statute.doubleColumnDocs === 0? {display:  'none' } : {})}}>
                <RichTextInput
                    ref={voteLetterSecondary}
                    translate={translate}
                    floatingText={'Carta de voto columna derecha'}
                    value={
                        !!internalState.voteLetterSecondary
                            ? internalState.voteLetterSecondary
                            : ""
                    }
                    onChange={value =>
                        handleUpdate({
                            voteLetterSecondary: value
                        })
                    }
                    // saveDraft={
                    //     <SaveDraftIcon
                    //         onClick={showSaveDraft('CONVENE_HEADER')}
                    //         translate={translate}
                    //     />
                    // }
                    //tags={conveneHeaderTags}
                    // loadDraft={
                    //     <LoadDraftModal
                    //         translate={translate}
                    //         companyId={props.company.id}
                    //         loadDraft={loadDraft}
                    //         statute={{
                    //             ...statute,
                    //             statuteId: statute.id
                    //         }}
                    //         defaultTags={{
                    //             "convene_header": {
                    //                 active: true,
                    //                 type: TAG_TYPES.DRAFT_TYPE,
                    //                 name: 'convene_header',
                    //                 label: translate.convene_header
                    //             }
                    //         }}
                    //         statutes={props.companyStatutes}
                    //         draftType={0}
                    //     />
                    // }
                />
            </GridItem>
        </>
    )
}

export default ProxiesTemplates;