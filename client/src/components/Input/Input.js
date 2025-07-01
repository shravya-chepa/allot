import React from "react";
import propsTypes from "prop-types";
import { StyledInput } from "./Input.styled";

const Input = ({ color, disabled, ...rest }) => {
  return (
    <StyledInput
      disabled={disabled}
      color={disabled ? "grey" : color}
      {...rest}
    />
  );
};

Input.propTypes = {
  placeholder: propsTypes.string,
  type: propsTypes.string,
  size: propsTypes.string,
  disabled: propsTypes.bool,
  onChange: propsTypes.func,
  onPressEnter: propsTypes.func,
  prefix: propsTypes.oneOfType([propsTypes.string, propsTypes.node]),
  suffix: propsTypes.oneOfType([propsTypes.string, propsTypes.node]),
  defaultValue: propsTypes.string,
  color: propsTypes.string,
};

Input.defaultProps = {
  placeholder: "",
  type: "text",
  color: "primary",
  size: "",
  disabled: false,
  defaultValue: "",
  onChange: () => {},
  onPressEnter: () => {},
  prefix: "",
  suffix: "",
};

export default Input;
