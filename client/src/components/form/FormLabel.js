import React from 'react';
import { StyledFormLabel } from './Form.styled';

const FormLabel = ({ label, ...rest }) => {
  if (!label) {
    return null;
  }

  return <StyledFormLabel {...rest}>{label}</StyledFormLabel>;
};

export default FormLabel;
