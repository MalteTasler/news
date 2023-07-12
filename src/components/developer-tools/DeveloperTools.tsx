import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, SelectButton, Checkbox } from 'chayns-components';
import { DeveloperToolsProps } from 'constants/types';
import './developerTools.scss';

require('../../constants/chayns.d');
require('../../constants/chayns-components.d');

const DeveloperTools = ({
    numberOfDisplayedNews,
    numberOfFetchedNews,
    numberOfDatabaseNews,
    numberOfDatabaseUnhiddenNews,
    showNews,
    cbShowNewsOnChange,
    activeBackend,
    setActiveBackend,
}: DeveloperToolsProps) => {
    const sbBackendList = [
        {
            id: '0',
            name: 'chayns.codes',
            isSelected: activeBackend === 0,
        },
        {
            id: '1',
            name: 'ASP.NET lokal',
            isSelected: activeBackend === 1,
        },
    ];
    const [hasCopiedSiteId, setHasCopiedSiteId] = useState(false);
    const [hasCopiedTappId, setHasCopiedTappId] = useState(false);
    const copySiteId = async () => {
        await navigator.clipboard.writeText(chayns.env.site.id);
        setHasCopiedSiteId(true);
    };
    const copyTappId = async () => {
        await navigator.clipboard.writeText(`${chayns.env.site.tapp.id}`);
        setHasCopiedTappId(true);
    };

    return (
        <Accordion head="Developer Tools" open dafaultOpened>
            <div className="developerTools">
                <div
                    className="developerTools__idDisplay"
                    onClick={() => copySiteId}
                >
                    <div className="developerTools__idDisplay__label">
                        SiteId = {chayns.env.site.id}
                    </div>
                    <i className="fa fa-copy" />
                    {hasCopiedSiteId && (
                        <div className="developerTools__idDisplay__copiedLabel">
                            ✅ Copied to clipboard.
                        </div>
                    )}
                    <br />
                </div>
                <div
                    className="developerTools__idDisplay"
                    onClick={() => copyTappId}
                >
                    <div className="developerTools__idDisplay__label">
                        TappId = {chayns.env.site.tapp.id}
                    </div>
                    <i className="fa fa-copy" />
                    {hasCopiedTappId && (
                        <div className="developerTools__idDisplay__copiedLabel">
                            ✅ Copied to clipboard.
                        </div>
                    )}
                    <br />
                </div>
                Number of total News in the databse = {numberOfDatabaseNews}
                <br />
                Number of unhidden News in the databse ={' '}
                {numberOfDatabaseUnhiddenNews}
                <br />
                Number of fetched News = {numberOfFetchedNews}
                <br />
                Number of displayed News = {numberOfDisplayedNews}
                <div className="developerTools__selectBackend">
                    Backend:
                    <SelectButton
                        title="Select the backend"
                        list={sbBackendList}
                        onSelect={(data: {
                            selection: Array<{ id: string }>;
                        }) =>
                            setActiveBackend(
                                data.selection[0].id as unknown as number
                            )
                        }
                        listKey="id"
                        listValue="name"
                        selectedFlag="isSelected"
                        showSelection
                        className="developerTools__selectBackend__selectButton"
                    />
                </div>
                <Checkbox
                    checked={showNews}
                    onChange={cbShowNewsOnChange}
                    className="developerTools__cbShowMore"
                    title="Show news"
                />
                <br />
                <u>Sources: </u>
                <ul>
                    <li>
                        Frontend Code:
                        <a
                            href="https://github.com/MalteTasler/news"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    </li>
                    <li>
                        Backend Code:
                        <ul>
                            <li>
                                <a
                                    href="https://schule.chayns.site/admin/code-editor?backendId=f11828e3"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    chayns.Codes
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://gitlab.tobit.com/MTasler/news-backend2"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    GitLab (Tobit members only)
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/MalteTasler/news-backend"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    GitHub (Private - ask for permissions)
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </Accordion>
    );
};

DeveloperTools.propTypes = {
    numberOfDatabaseNews: PropTypes.number,
    numberOfDatabaseUnhiddenNews: PropTypes.number.isRequired,
    numberOfFetchedNews: PropTypes.number.isRequired,
    numberOfDisplayedNews: PropTypes.number.isRequired,
    showNews: PropTypes.bool.isRequired,
    cbShowNewsOnChange: PropTypes.func.isRequired,
    activeBackend: PropTypes.number.isRequired,
    setActiveBackend: PropTypes.func.isRequired,
};

DeveloperTools.defaultProps = {
    numberOfDatabaseNews: null,
};

DeveloperTools.DisplayName = 'DeveloperTools';

export default DeveloperTools;
