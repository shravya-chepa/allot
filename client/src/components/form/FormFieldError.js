import React from "react";
import { StyledFieldError, StyledDiv } from "./Form.styled";

const FormFieldError = ({ error }) => {
  if (!error) {
    return <StyledDiv></StyledDiv>;
  }

  return <StyledFieldError>{error}</StyledFieldError>;
};

export default FormFieldError;
