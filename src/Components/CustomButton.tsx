import React from 'react';
import styled from 'styled-components';
import { ColorCodes } from '../misc/ColorCodes';

interface ICustomButton {
    label: string;
    onClick: () => void
}

const CustomButton: React.FC<ICustomButton> = ({
    onClick,
    label
}) => {
    return (
        <Button onClick={onClick}  >
            {label}
        </Button>
    );
}

export default CustomButton;

const Button = styled.button`
  background: ${ColorCodes.LIGHT_GREY};
  &:hover{
      background: ${ColorCodes.DARK_GREY};
  };
`