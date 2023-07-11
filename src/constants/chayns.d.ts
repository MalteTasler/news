/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
declare namespace chayns {
    const ready: Promise<void>;

    const enum orientation {
        DEFAULT = 0,
        PORTRAIT = 1,
        LANDSCAPE = 2,
        PORTRAIT_SENSOR = 3,
        LANDSCAPE_SENSOR = 4,
        PORTRAIT_REVERSE = 5,
        LANDSCAPE_REVERSE = 6,
    }

    function getGlobalData(): Promise<unknown>;

    function getWindowMetrics(): Promise<any>;

    function addAdminSwitchListener(
        cb: (event: { mode: number }) => void
    ): Promise<void>;

    function invokeCall(value: string | any): Promise<void>;

    function appendUrlParameter(
        parameters: Record<string, string>,
        override?: boolean
    ): Promise<void>;

    type WebViewOptions = {
        bounces?: boolean;
    };

    function setWebviewOptions(options: WebViewOptions): Promise<void>;

    function showWaitCursor(text?: string, timeout?: number): Promise<void>;

    function hideWaitCursor(): Promise<void>;

    type ChaynsScrollEvent =
        | {
              event: {
                  scrollX: number;
                  scrollY: number;
                  timeStamp: number;
                  type: 'scroll';
              };
              windowMetrics: {
                  AvailHeight: number;
                  WindowInnerHeight: number;
                  WindowInnerWidth: number;
                  coverHeight: number;
                  frameX: number;
                  frameY: number;
                  menuHeight: number;
                  offsetTop: number;
                  pageYOffset: number;
              };
          }
        | {};

    function addScrollListener(cb: (event: ChaynsScrollEvent) => void): void;

    function removeScrollListener(callback: (data: any) => any): Promise<any>;

    function invokeCall(chaynsCall: string | any): void;

    function vibrate(timeInMS: number): void;

    function getSchemeColor(): string;

    function disableDisplayTimeout(): Promise<void>;

    function setScreenOrientation(value: orientation): Promise<void>;

    function disallowRefreshScroll(): Promise<void>;

    function hideFloatingButton(): void;

    function closeUrl(): void;

    type SetHeightParam = {
        height?: number;
        growOnly?: boolean;
        fullViewport?: boolean;
        addJSONParam?: object;
        full?: boolean;
    };

    function setHeight(param: SetHeightParam): Promise<void>;

    namespace env {
        const isMyChaynsApp: boolean;

        const myChaynsAppVersion: number;

        const isLocationApp: boolean;

        const isChaynsWeb: boolean;

        const isApp: boolean;

        const isIOS: boolean;

        const isAndroid: boolean;

        const os: string;

        const parameters: Record<string, string | undefined>;

        const isChaynsWebLight: boolean;

        const isBrowser: boolean;

        const isMobile: boolean;

        const isDesktop: boolean;

        const isSTB: boolean;

        const appVersion: number;

        const language: 'de' | 'en' | string;

        namespace user {
            const id: number;
            const adminMode: boolean | undefined;
            const isAuthenticated: boolean;
            const isAdmin: boolean;
            const personId: string;
            const firstName: string;
            const lastName: string;
            const tobitAccessToken: string;
            const name: string;
            const facebookAccessToken: string | undefined;

            type UserGroup = {
                id: number;
                name: string | undefined;
                isActive: boolean;
                isSystemGroup: boolean | undefined;
            };
            const groups: UserGroup[];
        }

        namespace device {
            // const imei: string;
        }

        namespace site {
            const id: string;
            const title: string;
            const domain: string;
            const locationId: number;
            const locationPersonId: string;
            const color: string;
            const colorMode: 0 | 1 | 2;
            const language: 'de' | 'en' | string;
            const facebookPageId: string | undefined;

            namespace tapp {
                const id: number;
                const showName: string;
                const customUrl: string;
                const isExclusiveView: boolean | undefined;
                const isKioskMode: boolean | undefined;
            }
        }

        namespace app {
            const flavor: string | undefined;
        }
    }

    namespace storage {
        function set(key: string, value: any): Promise<void>;
        function get(key: string): Promise<null | {
            object: any;
        }>;
        function remove(key: string): Promise<void>;
    }

    namespace dialog {
        function close(): Promise<void>;

        type DisabledWeekDayInterval = {
            start: number;
            end: number;
        };

        type AdvancedDateOptions = {
            title?: string;
            message?: string;
            dateType?: dateType;
            minDate?: Date | number;
            maxDate?: Date | number;
            monthSelect?: boolean;
            yearSelect?: boolean;
            minuteInterval?: number;
            multiselect?: boolean;
            disabledDates?: (Date | number)[];
            interval?: boolean;
            minInterval?: number;
            maxInterval?: number;
            disabledWeekDayIntervals?: (DisabledWeekDayInterval[] | null)[];
            getLocalTime?: boolean;
            preSelect?: Date | Date[] | number;
        };

        type AdvancedDateOptionsResponse = {
            buttonType: number;
            selectedDates: {
                timestamp: number;
                isSelected: boolean;
            }[];
        };

        function advancedDate(
            options: AdvancedDateOptions
        ): Promise<AdvancedDateOptionsResponse>;

        function sendData(data: any): Promise<void>;

        /**
         * Dialog-API only
         */
        function setResult(resultData: any): Promise<void>;

        function addDialogDataListener(cb: (data: any) => void): Promise<void>;

        function removeDialogDataListener(
            cb: (data: any) => void
        ): Promise<void>;

        type DialogButton = {
            text: string;
            buttonType: buttonType;
        };

        type IFrameDialogOptions = {
            url: string;
            waitCursor?: boolean;
            seamless?: boolean;
            input?: any;
            buttons?: DialogButton[];
            transparent?: boolean;
            maxHeight?: string;
            width?: number;
            customTransitionTimeout?: number;
        };

        type IFrameDialogResponse = {
            buttonType: buttonType;
            value: any;
        };

        function iFrame(
            options: IFrameDialogOptions
        ): Promise<IFrameDialogResponse>;

        function mediaSelect(
            options: IFrameDialogOptions
        ): Promise<IFrameDialogResponse>;

        function alert(
            title: string | undefined,
            description?: string
        ): Promise<number>;

        function confirm(
            title: string | undefined,
            description?: string,
            buttons?: DialogButton[]
        ): Promise<number>;

        type SelectDialogItem<T> = {
            name: string;
            value: T;
            backgroundColor?: string;
            className?: string;
            url?: string;
            isSelected?: boolean;
        };

        type SelectDialogOptions<T> = {
            title?: string;
            message?: string;
            list: SelectDialogItem<T>[];
            multiselect?: boolean;
            quickfind?: boolean;
            type?: selectType;
            preventCloseOnClick?: boolean;
            buttons?: DialogButton[];
            selectAllButton?: string;
        };

        type SelectDialogResponse<T> = {
            buttonType: buttonType | number;
            selection: SelectDialogItem<T>[];
        };

        function select<T = any>(
            options: SelectDialogOptions<T>
        ): Promise<SelectDialogResponse<T>>;

        type InputDialogOptions = {
            title?: string;
            message?: string;
            placeholderText?: string;
            text?: string;
            textColor?: string;
            buttons?: DialogButton[];
            type?: inputType;
            regex?: string;
            pattern?: string;
            disableButtonTypes?: number[];
        };

        type InputDialogResponse = {
            buttonType: buttonType;
            text: string;
        };

        function input<T = any>(
            options: InputDialogOptions
        ): Promise<InputDialogResponse>;

        type DateDialogOptions = {
            dateType: dateType;
            minDate?: Date | string;
            preSelect?: Date | string;
        };

        function date(options: DateDialogOptions): Promise<number>;

        type ToastOptions = {
            title: string;
            type: number;
        };

        function toast(options: ToastOptions): Promise<void>;

        enum selectType {
            DEFAULT = 0,
            ICON = 1,
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        enum inputType {
            PASSWORD = 1,
            TEXTAREA = 2,
            INPUT = 3,
            NUMBER = 4,
        }

        enum buttonType {
            POSITIVE = 1,
            NEGATIVE = 0,
            CANCEL = -1,
        }

        namespace buttonText {
            const YES: string;
            const NO: string;
            const CANCEL: string;
            const OK: string;
        }

        enum dateType {
            DATE = 1,
            TIME = 2,
            DATE_TIME = 3,
        }
    }

    namespace utils {
        function isNumber(value: number | any): value is number;

        function isObject(
            value: Record<any, any> | any
        ): value is Record<any, any>;

        function isPresent<T>(
            value: T | null | undefined
        ): value is Exclude<T, null | undefined>;

        function isFunction(value: any): value is (...args: any[]) => any;

        function isArray(value: any): value is any[];

        function isBlank(value: any): value is undefined | null;

        function isString(value: any): value is string;

        function isJwt(value: any): value is string;

        function isUrl(value: any): value is string;

        function mixColor(
            color1: string,
            color2: string,
            weight: number
        ): string;

        function getJwtPayload(jwt: string): Record<string, any>;

        type ColorNames = Record<string, string> & {
            '100': string;
            '101': string;
            '102': string;
            '103': string;
            '104': string;
            '105': string;
            '106': string;
            '107': string;
            '108': string;
            '109': string;
            '200': string;
            '201': string;
            '202': string;
            '203': string;
            '204': string;
            '205': string;
            '206': string;
            '207': string;
            '208': string;
            '209': string;
            '300': string;
            '301': string;
            '302': string;
            '303': string;
            '304': string;
            '305': string;
            '306': string;
            '307': string;
            '308': string;
            '309': string;
            '400': string;
            '401': string;
            '402': string;
            '403': string;
            '404': string;
            '405': string;
            '406': string;
            '407': string;
            '408': string;
            '409': string;
            '000': string;
            '001': string;
            '002': string;
            '003': string;
            '004': string;
            '005': string;
            '006': string;
            '007': string;
            '008': string;
            '009': string;
            'secondary-100': string;
            'secondary-101': string;
            'secondary-102': string;
            'secondary-103': string;
            'secondary-104': string;
            'secondary-105': string;
            'secondary-106': string;
            'secondary-107': string;
            'secondary-108': string;
            'secondary-109': string;
            'secondary-200': string;
            'secondary-201': string;
            'secondary-202': string;
            'secondary-203': string;
            'secondary-204': string;
            'secondary-205': string;
            'secondary-206': string;
            'secondary-207': string;
            'secondary-208': string;
            'secondary-209': string;
            'secondary-300': string;
            'secondary-301': string;
            'secondary-302': string;
            'secondary-303': string;
            'secondary-304': string;
            'secondary-305': string;
            'secondary-306': string;
            'secondary-307': string;
            'secondary-308': string;
            'secondary-309': string;
            'secondary-400': string;
            'secondary-401': string;
            'secondary-402': string;
            'secondary-403': string;
            'secondary-404': string;
            'secondary-405': string;
            'secondary-406': string;
            'secondary-407': string;
            'secondary-408': string;
            'secondary-409': string;
            primary: string;
            secondary: string;
            headline: string;
            'headline-1': string;
            'headline-2': string;
            'headline-3': string;
            'headline-4': string;
            'headline-5': string;
            text: string;
            footer: string;
            'cw-body-background': string;
            red: string;
            green: string;
            wrong: string;
            'depend-on-brightness': string;
            'red-1': string;
            'red-2': string;
            'red-3': string;
            'red-4': string;
            'yellow-1': string;
            'yellow-2': string;
            'yellow-3': string;
            'yellow-4': string;
            'green-1': string;
            'green-2': string;
            'green-3': string;
            'green-4': string;
        };

        namespace colors {
            function getAvailableColorList(): (keyof ColorNames)[];
            function get(): string;
            function getColorFromPalette(value: keyof ColorNames): string;
        }

        namespace ls {
            function get<T>(name: string): T | undefined;
            function get(name: string): any | undefined;

            function set<T>(name: string, value: T): boolean;
            function set(name: string, value: any): boolean;
        }
    }

    // eslint-disable-next-line no-shadow
    const enum floatingButtonPosition {
        RIGHT = 0,
        CENTER = 1,
        LEFT = 2,
    }

    enum loginState {
        FACEBOOK,
        T_WEB,
        CANCEL,
        ALREADY_LOGGED_IN,
    }

    type SelectTappConfig = {
        id?: number | undefined;
        internalName?: string | undefined;
        showName?: string | undefined;
        position?: number | undefined;
        siteId?: string;
        params?: string;
    };

    function selectTapp(
        tapp: chayns.SelectTappConfig,
        parameter?: string | string[]
    ): Promise<any>;

    function scrollToY(position: number): Promise<any>;

    function addAccessTokenChangeListener(func: () => void);

    function removeAccessTokenChangeListener(func: () => void);

    function addOnActivateListener(callback: (value: unknown) => any): void;

    function login(params?: string[], permissions?: string[]): void;

    function logout(): void;

    type RemoveSubTappOptions = {
        tappID: number;
        remove?: boolean;
        close?: boolean;
    };
    function removeSubTapp(options: RemoveSubTappOptions): void;

    type GeoLocationResponse = {
        latitude: number;
        longitude: number;
        speed: number;
        accuracy: number;
    };

    function getGeoLocation(): Promise<GeoLocationResponse>;

    function hideBackButton(): void;

    type ShowFloatingButtonOptions = {
        color?: string;
        tappID?: number;
        text?: string;
        icon?: string;
        textSize?: number;
        position?: number;
        progress?: {
            type: number;
            color: string;
            value?: number;
        };
        badge?: string;
    };
    function showFloatingButton(
        caption: ShowFloatingButtonOptions,
        callback: () => any
    ): void;

    type SetSubTappOptions = {
        sortID?: number;
        url: string;
        tappID?: number;
        buttonName?: string;
        isExclusiveView?: boolean;
        boldText?: boolean;
        color?: string;
        colorText?: string;
        icon?: string;
        name?: string;
        replaceParent?: boolean;
    };
    function setSubTapp(object: SetSubTappOptions): Promise<void>;

    function openUrlInBrowser(url: string): void;

    function updateChaynsId(): Promise<void>;

    function hideOverlay(): Promise<void>;

    type OpenUrlOptions = {
        url: string;
        title?: string;
    };
    function openUrl(object: OpenUrlOptions): Promise<void>;
}
