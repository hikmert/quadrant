import React from 'react';
import { ColorCodes } from '../misc/ColorCodes';

interface ICustomLabel {
    label: string;
    chartLabel: boolean;
    xPosition?: number;
    yPosition?: number;
    width?: number
}

function CustomLabel(props: ICustomLabel) {

    return props.chartLabel ? (
        <p style={{
            position: "absolute",
            top: props.yPosition,
            left: props.xPosition,
            background: `${ColorCodes.LIGHT_BLUE}`,
            color: `${ColorCodes.WHITE}`,
            padding: 5,
            borderRadius: 2
        }}>{props.label}</p>
    ) :
        <p style={{
            width: props.width,
            background: `${ColorCodes.LIGHT_BLUE}`,
            color: `${ColorCodes.WHITE}`,
            marginLeft: 5,
            textAlign: "center",
            borderRadius: 3,
            fontFamily: "sans-serif"
        }}>{props.label}</p>
}

export default CustomLabel;
