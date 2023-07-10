/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
declare module 'chayns-components' {
    import React, {
        CSSProperties,
        FunctionComponent,
        MouseEvent,
        MutableRefObject,
        ReactElement,
        ReactNode,
    } from 'react';

    export type BaseComponentProps = {
        style?: CSSProperties;
        className?: string;
    };

    enum ButtonType {
        BUTTON = 'button',
    }

    type ButtonProps = {
        chooseButton?: boolean;
        disabled?: boolean;
        onClick?: () => void | Promise<void>;
        className?: string;
        icon?: string;
        secondary?: boolean;
        stopPropagation?: boolean;
        type?: ButtonType;
        style?: CSSProperties;
    };

    export const Button: React.FunctionComponent<ButtonProps>;

    export const ChooseButton: React.FunctionComponent<
        Omit<ButtonProps, 'chooseButton'>
    >;

    type SelectButtonProps = {
        title?: string;
        list: Array<{ id: string | number; name: string }>;
        onSelect?: () => void;
        listKey?: string;
        listValue?: string;
        selectedFlag?: string | number;
        showSelection?: boolean;
        className?: string;
    };
    type SelectionButtonSelection = {
        selection: Array;
    };

    export const SelectButton: React.FunctionComponent;

    type TextStringProps = {
        stringName?: string;
        replacement?: { [key: string]: string | number };
        useDangerouslySetInnerHTML?: boolean;
        language?: string;
        fallback?: string;
        preventNoTranslate?: boolean;
        replacements?: Record<string, string | number>;
    };

    export const TextString: React.FunctionComponent<TextStringProps> & {
        getTextString: (
            stringName: string,
            language?: string,
            fallback?: string
        ) => string;
        loadLibrary: (
            projectName: string,
            middle?: string,
            language?: string
        ) => Promise<void>;
    };

    type RadioButtonProps = {
        id: string | number;
        name: string;
        checked: boolean;
        onChange: (checked: boolean) => void;
        disabled?: boolean;
        value?: boolean;
        className?: string;
        stopPropagation?: boolean;
        style?: CSSProperties;
    };

    export const RadioButton: React.FunctionComponent<RadioButtonProps>;

    type CheckboxProps = {
        id?: string | number;
        className?: string;
        labelClassName?: string;
        style?: CSSProperties;
        labelStyle?: CSSProperties;
        // eslint-disable-next-line no-undef
        label?: JSX.Element;
        onChange: (checked: boolean) => void;
        toggleButton?: boolean;
        checked: boolean;
        defaultChecked?: boolean;
        disabled?: boolean;
        dangerouslySetLabel?: {
            __html: string;
        };
        stopPropagation?: boolean;
    };

    export const Checkbox: React.FunctionComponent<CheckboxProps>;

    type AmountControlProps = {
        buttonText: string;
        amount: number;
        onChange?: (value: number) => void;
        onInput?: (value: number) => void;
        onAdd?: () => void;
        onRemove?: () => void;
        disabled?: boolean;
        disableAdd?: boolean;
        disableInput?: boolean;
        disableRemove?: boolean;
        className?: string;
        autoInput?: boolean;
        buttonFormatHandler?: () => string;
        showInput?: boolean;
        icon?: string;
        plusIcon?: string;
        minusIcon?: string;
        removeIcon?: string;
        addColor?: string;
        removeColor?: string;
        iconColor?: string;
        equalize?: string;
        focusOnClick?: boolean;
        contentWidth?: number;
        min?: number;
        max?: number;
        stopPropagation?: boolean;
        hasAlwaysControls?: boolean;
    };

    export const AmountControl: React.FunctionComponent<AmountControlProps>;

    enum TooltipPosition {
        TOP_LEFT = 0,
        BOTTOM_LEFT = 1,
        BOTTOM_RIGHT = 2,
        TOP_RIGHT = 3,
        TOP_CENTER = 4,
        BOTTOM_CENTER = 5,
    }

    interface TooltipRef {
        show(): void;

        hide(): void;
    }

    type TooltipProps = {
        content:
            | {
                  // eslint-disable-next-line no-undef
                  html: JSX.Element | string;
              }
            | {
                  text: string;
                  headline?: string;
                  imageUrl?: string;
                  buttonText?: string;
                  buttonOnClick?: () => void;
              };
        bindListeners?: boolean;
        position?: TooltipPosition;
        ref?: React.RefObject<TooltipRef>;
        childrenClassNames?: string;
        children: React.ReactNode;
        removeIcon?: boolean;
    };

    export const Tooltip: React.FunctionComponent<TooltipProps> & {
        position: typeof TooltipPosition;
    };

    type ListProps = {
        className?: string;
        notExpandable?: boolean;
    };

    export const List: React.FunctionComponent<ListProps>;

    type ListItemProps = {
        title: string;
        subtitle?: string;
        image?: string;
        images?: string[];
        icon?: string;
        className?: string;
        onClick?: () => void;
        right?: JSX.Element;
        style?: CSSProperties;
        headerProps?: { [key: string]: unknown };
        circle?: boolean;
        hoverItem?: JSX.Element;
        onLongPress?: () => void;
        onMouseDown?: () => void;
        onMouseMove?: () => void;
        onMouseUp?: () => void;
        onTouchStart?: () => void;
        onTouchMove?: () => void;
        onTouchEnd?: () => void;
        onTouchCancel?: () => void;
        longPressTimeout?: number;
        noContentClass?: boolean;
        onOpen?: () => void;
        imageBorderColor?: string;
    };

    export const ListItem: React.FunctionComponent<ListItemProps>;

    type IconProps = {
        icon: string | string[];
        className?: string;
        style?: CSSProperties;
        onClick?: (event: MouseEvent) => void;
        disabled?: boolean;
        stopPropagation?: boolean;
    };

    export const Icon: React.FunctionComponent<IconProps>;

    type InputProps = {
        className?: string;
        onKeyUp?: () => void;
        onKeyDown?: () => void;
        onEnter?: () => void;
        onChange?: (value: string) => void;
        onBlur?: (value: string) => void;
        onFocus?: () => void;
        regExp?: RegExp | string;
        style?: CSSProperties;
        placeholder?: string;
        value?: string;
        defaultValue?: string;
        invalid?: boolean;
        type?: string;
        inputRef?: (ref: unknown) => void;
        icon?: string;
        onIconClick?: () => void;
        wrapperRef?: (ref: unknown) => void;
        dynamic?: boolean | number;
        customProps?: { [key: string]: unknown };
        required?: boolean;
        disabled?: boolean;
        clearIcon?: boolean;
        design?: number;
        iconLeft?: string;
        right?: JSX.Element;
        invalidMessage?: string;
    };

    export const Input: React.FunctionComponent<InputProps> & {
        DEFAULT_DESIGN: number;
        BORDER_DESIGN: number;
        MOVING_DYNAMIC: number;
        NO_DYNAMIC: number;
        BOTTOM_DYNAMIC: number;
    };

    type AccordionProps = {
        head: JSX.Element | string | { open: string; close: string };
        headMultiline?: boolean;
        headClassNames?: string | string[];
        headCustomAttributes?: { [key: string]: unknown };
        right?: JSX.Element | { open: string; close: string } | null;
        renderClosed?: boolean;
        isWrapped?: boolean;
        dataGroup?: string;
        className?: string;
        id?: string;
        style?: CSSProperties;
        styleBody?: CSSProperties;
        onOpen?: () => void;
        onClose?: () => void;
        defaultOpened?: boolean;
        reference?: (ref: unknown) => void;
        autogrow?: boolean;
        open?: boolean;
        icon?: string;
        noRotate?: boolean;
        fixed?: boolean;
        noIcon?: boolean;
        onSearch?: () => void;
        onSearchEnter?: () => void;
        searchPlaceholder?: string;
        searchValue?: string;
        removeContentClosed?: boolean;
        onClick?: () => void;
        disabled?: boolean;
        controlled?: boolean;
    };

    export const Accordion: React.FunctionComponent<AccordionProps>;

    type SmallWaitCursorProps = {
        show: boolean;
        style?: CSSProperties;
        showBackground?: boolean;
        inline?: boolean;
        className?: string;
    };

    export const SmallWaitCursor: React.FunctionComponent<SmallWaitCursorProps>;

    type ImageProps = {
        image: string;
        onClick?: () => void;
        moreImages?: number;
        className?: string;
        classNamePortrait?: string;
        classNameLandscape?: string;
        style?: CSSProperties;
        stylePortrait?: CSSProperties;
        styleLandscape?: CSSProperties;
        preventParams?:
            | boolean
            | {
                  width: boolean;
                  height: boolean;
                  format: boolean;
              };
    };

    export const Image: React.FunctionComponent<ImageProps>;

    export type SliderButtonPropsItem = {
        id: string | number;
        text: string | ReactNode;
    };
    export type SliderButtonProps = BaseComponentProps & {
        items?: Array<SliderButtonPropsItem>;
        onChange?: (elem: SliderButtonPropsItem) => void;
        onDragStop?: () => void;
        onDragStart?: () => void;
        selectedItemId?: number;
        disabled?: boolean;
    };
    export const SliderButton: FunctionComponent<SliderButtonProps>;

    export enum TextAreaDesign {
        DEFAULT,
        BORDER,
    }

    export type TextAreaProps = BaseComponentProps & {
        disabled?: boolean;
        placeholder?: string;
        required?: boolean;
        design?: TextAreaDesign;
        onChange?: (value: string) => void;
        onBlur?: () => void;
        defaultValue?: string;
        value?: string;
        onKeyUp?: () => void;
        onKeyDown?: () => void;
        autogrow?: boolean;
        stopPropagation?: boolean;
    };
    export const TextArea: FunctionComponent<TextAreaProps> & {
        DEFAULT_DESIGN: number;
        BORDER_DESIGN: number;
    };

    type SelectListProps<T> = BaseComponentProps & {
        onChange?: (id: string | number, value: T) => void | Promise<void>;
        defaultValue?: number;
        value?: T;
        selectFirst?: boolean;
        children: React.ReactNode;
    };

    export const SelectList: <T extends unknown>(
        props: SelectListProps<T>
    ) => ReturnType<FunctionComponent<SelectListProps<T>>>;

    type SelectListItemProps = BaseComponentProps & {
        id?: number | string;
        disabled?: boolean;
        name?: string | ReactElement;
        value?: unknown | Array<unknown>;
        tooltipProps?: TooltipProps;
        children?: React.ReactNode;
    };

    export const SelectListItem: FunctionComponent<SelectListItemProps>;

    export const Badge: FunctionComponent;

    type ComboBoxProps<T> = BaseComponentProps & {
        list: T[];
        listKey: keyof T;
        listValue: keyof T;
        disabled?: boolean;
        value?: number | string;
        onSelect?: (value: T) => void;
    };

    export const ComboBox: <T extends unknown>(
        props: ComboBoxProps<T>
    ) => ReturnType<FunctionComponent<ComboBoxProps<T>>>;

    type PersonFinderProps = BaseComponentProps & {
        placeholder?: string;
        onChange: (value: { personId: string }) => void;
        sites?: boolean;
        showId?: boolean;
    };

    export const PersonFinder: FunctionComponent<PersonFinderProps>;

    type DateInfoProps = BaseComponentProps & {
        date: string | number | Date;
    };

    export const DateInfo: FunctionComponent<DateInfoProps>;

    type SharingBarProps = {
        link: string;
        className?: string;
    };

    export const SharingBar: FunctionComponent<SharingBarProps>;

    type GalleryProps = BaseComponentProps & {
        images: Array<string>;
        deleteMode?: boolean;
        onDelete?: (img: string, index: number) => void | Promise<void>;
        dragMode?: boolean;
        onDragEnd?: (imageUrls: string[]) => void | Promise<void>;
    };

    export const Gallery: FunctionComponent<GalleryProps>;

    export const imageUpload: (
        file: string | File | Blob,
        referenceId?: string,
        personId?: string,
        siteId?: string,
        url?: string
    ) => Promise<{ base: string; key: string; meta: { preview: string } }>;

    type FileInputProps = BaseComponentProps & {
        disabled?: boolean;
        stopPropagation?: boolean;
        errorMessages?: {
            tooMuchFiles: string;
            fileTooBig: string;
            wrongFileType: string;
            permanentNoPermission: string;
            temporaryNoPermission: string;
        };
        items?: Array<{
            types?: Array<string>;
            maxFileSize?: number;
            maxNumberOfFiles?: number;
            directory?: boolean;
            onClick?: unknown;
            onChange?: unknown;
            className?: string;
            style?: CSSProperties;
            disabled?: boolean;
            content?:
                | { text: string; icon?: string }
                | { children: ReactElement | Array<ReactElement> };
        }>;
    };

    export const FileInput: FunctionComponent<FileInputProps> & {
        typePresets: {
            TSIMG_CLOUD: Array<string>;
        };
    };

    type FilterButtonProps = BaseComponentProps & {
        label?: string | ReactElement;
        count?: number;
        value?: unknown;
        onChange?: (value: unknown) => void | Promise<void>;
        checked?: boolean;
        name?: string;
        icon?: string | { iconName: string; prefix: string };
        id?: string;
        disabled?: boolean;
        stopPropagation?: boolean;
        small?: boolean;
        rectangular?: boolean;
    };

    export const FilterButton: FunctionComponent<FilterButtonProps>;

    type ContextMenuRef = {
        show: () => void;
        hide: () => void;
    };

    type ContextMenuProps = BaseComponentProps & {
        onLayerClick?: () => void | Promise<void>;
        coordinates?: { x: number; y: number };
        items?: Array<{
            className?: string;
            onClick?: () => void | Promise<void>;
            text: string | ReactElement;
            stringName?: string;
            icon: string;
        }>;
        position?: number;
        positionOnChildren?: number;
        parent?: unknown;
        onChildrenClick?: (event: React.MouseEvent) => void | Promise<void>;
        childrenStyle?: CSSProperties;
        childrenClassName?: string;
        stopPropagation?: boolean;
        minWidth?: number;
        maxWidth?: number;
        showTriggerBackground?: boolean;
        removeParentSpace?: boolean;
        disableDialog?: boolean;
        arrowDistance?: number;
        ref: MutableRefObject<ContextMenuRef | undefined>;
    };

    export const ContextMenu: FunctionComponent<ContextMenuProps>;

    type ExpandableContentClassNameProps = {
        opening?: string;
        opened?: string;
        closing?: string;
        closed?: string;
    };

    type ExpandableContentTimeoutProps = {
        opening?: number;
        closing?: number;
    };

    type ExpandableContentProps = {
        children: JSX.Element | JSX.Element[];
        open: boolean;
        classNames?: ExpandableContentClassNameProps;
        className?: string;
        timeout?: ExpandableContentTimeoutProps;
        style?: CSSProperties;
        removeContentClosed?: boolean;
    };

    export const ExpandableContent: React.FunctionComponent<ExpandableContentProps>;

    type AnimationWrapperProps = {
        children: ReactNode;
        className?: string;
        style?: CSSProperties;
    };

    export const AnimationWrapper: FunctionComponent<AnimationWrapperProps>;
}

declare module 'chayns-components/lib/utils/selectFile' {
    type SelectFileOptions = {
        type: string;
    };

    export default function selectFile(
        options: SelectFileOptions
    ): Promise<File | null>;
}

declare module 'chayns-components/lib/utils/compressImage' {
    const compressImage: (
        file: File,
        maxFileSize: number,
        quality?: number
    ) => Promise<File>;

    export default compressImage;
}
