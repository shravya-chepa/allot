import React from "react";
import { StyledButton } from "./Button.styled";

const Button = ({text, ...rest}) => {
    return (
      <StyledButton type="primary" htmlType="submit" {...rest} >
        {text}
      </StyledButton>
    );
};

export default Button;


