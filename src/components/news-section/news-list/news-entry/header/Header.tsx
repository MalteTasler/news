import React from "react";
import PropTypes from "prop-types";
import { ContextMenu } from "chayns-components";
import { HeaderProps } from "constants/types";
import { deleteNewsEntry } from "api/news/delete";
import { BackendUrls } from "constants/enums";

interface ContextMenuItem {
    className: string | null | undefined;
    onClick: () => void | Promise<void> | void;
    text: string;
    icon: string;
}

const Header = ({ id, isHidden, isEditMode, setEditMode, handleHide, loadNews, activeBackend } : HeaderProps ) => {
    const contextMenuItems = {
        delete: {
            className: null,
            onClick: async () => {
                await handleDelete();
                void loadNews({ shouldLoadMore: false });
            },
            text: 'Delete',
            icon: 'fa fa-trash',
        },
        edit: {
            className: null,
            onClick: () => {
                setEditMode(!isEditMode);
            },
            text: 'Edit',
            icon: 'fa fa-edit',
        },
        view: {
            className: null,
            onClick: () => {
                setEditMode(!isEditMode);
            },
            text: 'View',
            icon: 'fa fa-check',
        },
        hide: {
            className: null,
            onClick: async () => {
                await handleHide({ shouldBeHidden: true });
            },
            text: 'Hide',
            icon: 'fa fa-eye-slash',
        },
        unhide: {
            className: null,
            onClick: async () => {
                await handleHide({ shouldBeHidden: false });
            },
            text: 'Unhide',
            icon: 'fa fa-eye',
        },
    };
    
    function buildContextMenuItems(): ContextMenuItem[] {
        const array: ContextMenuItem[] = [];
        array.push(contextMenuItems.delete);
        if (isEditMode) {
            array.push(contextMenuItems.view);
        } else {
            array.push(contextMenuItems.edit);
        }
        if (isHidden) {
            array.push(contextMenuItems.unhide);
        } else {
            array.push(contextMenuItems.hide);
        }

        return array;
    }

    const handleDelete = async () => {
        await chayns.dialog
            .confirm(
                'Confirm',
                'Are you sure you want to delete that new entry?',
                [
                    {
                        text: 'YES',
                        buttonType: 1,
                    },
                    {
                        text: 'NO',
                        buttonType: 0,
                    },
                ]
            )
            .then(async (result) => {
                if (result === 1) {
                    const fetchUrlWithParameters = `${BackendUrls[activeBackend]}/${id}`;
                    await deleteNewsEntry({
                        fetchUrlWithParameters,
                    });                
                }
            });
    };

    return (
        <div className="newsEntry__header">
            {isHidden && (
                <div className="newsEntry__header__hideDisplayLabel">
                    Ausgeblendet
                </div>
            )}
            <div className="newsEntry__header__contextMenuFrame">
                <ContextMenu
                    items={buildContextMenuItems()}
                    className="newsEntry__header__contextMenuFrame__contextMenu"
                />
            </div>
        </div>
    );
};

Header.propTypes = {
    id: PropTypes.number.isRequired,
    isHidden: PropTypes.bool.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    activeBackend: PropTypes.number.isRequired,
    setEditMode: PropTypes.func.isRequired,
    handleHide: PropTypes.func.isRequired,
    loadNews: PropTypes.func.isRequired,
};

Header.displayName = 'Header';

export default Header;
