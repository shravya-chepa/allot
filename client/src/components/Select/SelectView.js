import React from "react";
import PropTypes from "prop-types";

import { StyledSelect } from "./Select.styled";

const { Option } = StyledSelect;

const optionList = (options) => {
  return options.map((data) => {
    return <Option value={data.value}>{data.label}</Option>;
  });
};
const filterOption = (input, option) =>
   option.children.toLowerCase().includes(input.toLowerCase());
  
const Select = ({ options, color, ...rest }) => {
  return (
    <StyledSelect color={color} {...rest} filterOption={filterOption}>
      {optionList(options)}
    </StyledSelect>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  color: PropTypes.string,
  showSearch: PropTypes.bool,
};

Select.defaultProps = {
  options: [],
  color: "primary",
  showSearch:false, 
};

export default Select;
