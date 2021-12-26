import React from 'react';
import styled from 'styled-components';

interface ICustomInput {
    uniqueKey: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: number | string;
    width: number;
    textField?: boolean;
}

interface IInputProps {
    width: number;
}

const CustomInput: React.FC<ICustomInput> = ({
    onChange,
    uniqueKey,
    value,
    textField,
    width
}) => {
    return textField
        ? <Input key={uniqueKey} type="text" defaultValue={value} width={width} onChange={onChange} />
        : <Input key={uniqueKey} type="number" value={value} width={width} onChange={onChange} max={100} min={0} />
}

export default CustomInput;

const Input = styled.input<IInputProps>`
    width: ${props => `${props.width}px`};
    margin: 5px 5px 0 0;
    border-radius: 3px
`