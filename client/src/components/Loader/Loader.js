import React from "react";
import { Spin as DefaultLoader } from "antd";
import { StyledLoader } from "./Loader.style";

const Loader = (props) => {
  const { position } = props;

  return (
    <StyledLoader position={position}>
      <DefaultLoader size={80} {...props} />
    </StyledLoader>
  );
};

export default Loader;
