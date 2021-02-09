import React from 'react';
import { Icon } from 'material-ui';
import { withApollo } from 'react-apollo';
import { CardPageLayout, TextInput } from '../../../displayComponents';
import CompanyDraftList, { useTags } from './CompanyDraftList';
import CompanyTags from './companyTags/CompanyTags';
import withSharedProps from '../../../HOCs/withSharedProps';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import { isMobile } from '../../../utils/screen';
import { DropdownEtiquetas } from './LoadDraft';
import { DRAFTS_LIMITS } from '../../../constants';
import { companyDrafts as query, getCompanyDraftDataNoCompany } from '../../../queries/companyDrafts.js';
import CompanyDocumentsPage from './documents/CompanyDocumentsPage';
import { showOrganizationDashboard } from '../../../utils/CBX';
import { ConfigContext } from '../../../containers/AppControl';
import StatutesBody from '../statutes/StatutesBody';
import { bHistory } from '../../../containers/App';


const CompanyDraftsPage = ({ translate, client, ...props }) => {
    const config = React.useContext(ConfigContext);
    const [data, setData] = React.useState({});
    const tabs = showOrganizationDashboard(props.company, config, props.user) ?
        [translate.dasboard_documentation, translate.drafts, '<Tags>', translate.council_types]
        : [translate.dasboard_documentation, translate.drafts, '<Tags>'];
    const tabsUrl = showOrganizationDashboard(props.company, config, props.user) ?
        ['documentation', 'drafts', 'tags', 'councilTypes']
        : ['documentation', 'drafts', 'tags'];
    const [selecteDraftPadre, setSelecteDraftPadre] = React.useState(tabs[0]);
    const [mostrarMenu, setMostrarMenu] = React.useState(true);
    const [inputSearch, setInputSearch] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const { testTags, vars, setVars, removeTag, addTag, filteredTags, setTagText, tagText } = useTags(translate);

    const getDrafts = async variables => {
        const response = await client.query({
            query,
            variables: {
                companyId: props.company.id,
                options: {
                    limit: DRAFTS_LIMITS[0],
                    offset: 0
                },
                ...variables
            }

        });

        setData(response.data);
    };

    React.useEffect(() => {
        getDrafts({
            companyId: props.company.id,
            ...(search ? {
                filters: [
                    {
                        field: 'title',
                        text: search
                    },
                ]
            } : {}),
            tags: Object.keys(testTags).map(key => testTags[key].name),
        });
    }, [testTags, search]);


    const getData = async () => {
        const response = await client.query({
            query: getCompanyDraftDataNoCompany,
            variables: {
                companyId: props.company.id
            }
        });
        setVars(response.data);
    };

    React.useEffect(() => {
        getData();
    }, [props.company.id]);

    React.useEffect(() => {
        const pathname = window.location.pathname.split('/')[4];
        const index = tabs.indexOf(selecteDraftPadre);
        const index2 = tabsUrl.indexOf(pathname);
        if (pathname !== tabsUrl[index]) {
            setSelecteDraftPadre(tabs[index2]);
        }
    }, [window.location.pathname]);

    const goToPadre = item => {
        const indexPadre = tabs.indexOf(item);
        bHistory.push(`/company/${props.company.id}/drafts/${tabsUrl[indexPadre]}`);
    };


    return (
        <CardPageLayout title={translate.tooltip_knowledge_base} disableScroll>
            <div style={{ padding: '1em', height: '100%', paddingTop: '0px' }}>
                {mostrarMenu
                    && <div style={{ display: 'flex', padding: '1em', justifyContent: 'space-between', paddingTop: '0px' }}>
                        <div style={{ fontSize: '13px', }}>
                            <MenuSuperiorTabs
                                items={tabs}
                                setSelect={setSelecteDraftPadre}
                                selected={selecteDraftPadre}
                                goToPadre={goToPadre}
                            />
                        </div>
                        {isMobile && selecteDraftPadre !== '<Tags>' && selecteDraftPadre !== translate.dasboard_documentation
                            && <div style={{ marginRight: '0.8em', display: 'flex', justifyContent: isMobile ? 'space-between' : 'flex-end', alignItems: 'center' }}>
                                <div style={{ marginRight: isMobile ? '0.5em' : '3em' }}>
                                    <DropdownEtiquetas
                                        translate={translate}
                                        search={tagText}
                                        setSearchModal={setTagText}
                                        matchSearch={filteredTags}
                                        company={props.company}
                                        vars={vars}
                                        testTags={testTags}
                                        addTag={addTag}
                                        styleBody={{ minWidth: '50vw' }}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        removeTag={removeTag}
                                        stylesMenuItem={{ padding: '3px 3px', marginTop: isMobile && '0', width: isMobile && '' }}
                                        soloIcono={true}
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        className={isMobile && !inputSearch ? 'openInput' : ''}
                                        disableUnderline={true}
                                        styleInInput={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', padding: isMobile && inputSearch && '4px 5px', paddingLeft: !isMobile && '5px' }}
                                        stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: isMobile && inputSearch ? '8px' : '4px' }}
                                        adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
                                        floatingText={' '}
                                        type="text"
                                        value={search}
                                        styles={{ marginTop: '-16px' }}
                                        stylesTextField={{ marginBottom: '0px' }}
                                        placeholder={isMobile ? '' : translate.search}
                                        onChange={event => {
                                            setSearch(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                }
                {selecteDraftPadre === translate.dasboard_documentation
                    && <CompanyDocumentsPage
                        translate={translate}
                        company={props.company}
                    />
                }
                {selecteDraftPadre === translate.drafts
                    && <div style={{ width: '100%', height: '100%', padding: '1em', paddingBottom: '2em', paddingTop: isMobile && '0em' }}>
                        <CompanyDraftList setMostrarMenu={setMostrarMenu} searchDraft={search} />
                    </div>
                }
                {selecteDraftPadre === '<Tags>'
                    && <div style={{ width: '100%', height: '100%', padding: '1em' }}><CompanyTags /></div>
                }
                {selecteDraftPadre === translate.council_types
                    && <div style={{ width: '100%', height: '100%', padding: '1em' }}>
                        <StatutesBody
                            companyId={props.company.id}
                            organization={true}
                        />
                    </div>
                }
            </div>
        </CardPageLayout>
    );
};

export default withApollo(withSharedProps()(CompanyDraftsPage));
