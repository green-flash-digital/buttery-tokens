export declare const config: {
    runtime: {
        namespace: string;
        prefix: string;
        strict: boolean;
        suppressStrictWarnings: boolean;
    };
    sizeAndSpace: {
        baseFontSize: number;
        baselineGrid: number;
        size: {
            variants: {
                dense: number;
                normal: number;
                big: number;
            };
        };
        space: {
            mode: string;
            variants: number;
        };
    };
    font: {
        source: string;
        families: {
            Poppins: {
                fallback: string;
                styles: string[];
            };
            Inter: {
                fallback: string;
                styles: string[];
            };
            Mulish: {
                fallback: string;
                styles: string[];
            };
            Consolas: {
                fallback: string;
                styles: string[];
            };
        };
        variants: {
            logo: {
                family: string;
                weight: string;
                size: number;
                lineHeight: number;
            };
            heading: {
                family: string;
                weight: string;
                size: number;
                lineHeight: number;
            };
            body: {
                family: string;
                weight: string;
                size: number;
                lineHeight: number;
            };
            code: {
                family: string;
                weight: string;
                size: number;
                lineHeight: number;
            };
        };
    };
    response: {
        breakpoints: {
            phone: number;
            tablet: number;
            desktop: number;
        };
    };
    color: {
        brand: {
            type: string;
            colors: {
                primary: {
                    hue: number;
                    variants: number;
                };
                secondary: {
                    hue: number;
                    variants: number;
                };
                warning: {
                    hue: number;
                    variants: number;
                };
                danger: {
                    hue: number;
                    variants: number;
                };
                success: {
                    hue: number;
                    variants: number;
                };
            };
            saturation: number;
            brightness: number;
        };
        neutral: {
            background: string;
            surface: string;
            neutral: {
                hex: string;
                variants: {
                    dark: string;
                    light: string;
                };
            };
        };
    };
    custom: {
        "layout-header-height": {
            type: string;
            value: number;
            description: string;
        };
        "layout-max-width": {
            type: string;
            value: number;
            description: string;
        };
        "layout-gutters": {
            type: string;
            value: number;
            description: string;
        };
        "layout-section-title-height": {
            type: string;
            value: number;
            description: string;
        };
        "modal-gutters": {
            type: string;
            value: number;
            description: string;
        };
    };
};
