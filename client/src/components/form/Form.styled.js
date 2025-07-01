import styled from "styled-components";

export const StyledForm = styled.form`
  width: 100%;
`;

export const StyledFieldError = styled.p`
  font-size: small;
  padding: 3px 0;
  color: #f8151d;
`;

export const StyledFormLabel = styled.label`
  display: inline-block;
  font-weight: ${({ bold }) => bold && "bold"};
  font-size: 14px;
  color: ${({ fill }) => fill && fill};
  ${({ margin }) => margin && `margin: ${margin};`};
  line-height: 1.45em;
`;

export const StyledDiv = styled.div`
 padding-top: 19px;
`;

