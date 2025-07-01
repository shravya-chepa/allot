import styled from "styled-components";
import { Input } from "antd";
import { INPUT_CUSTOM_HEIGHT } from "./constants";

export const StyledInput = styled(Input)`
  &&& {
    width: 100%;
    border: solid 1px
      ${({ color }) => {
        if (color === "success") {
          return "#07cb6e";
        }
        if (color === "error") {
          return "#f8151d";
        }
        return "#e0e0e0";
      }};

    height: ${({ size }) => INPUT_CUSTOM_HEIGHT[size]};
    :disabled {
      background-color: "#f6f7f8";
    }

    ::placeholder {
      color: "#f6f7f8";
    }

    .ant-input-group-addon:first-child {
      min-width: fit-content;
      height: auto;
      padding: 0;
    }

    .ant-input-group-addon .ant-select {
      border: none;
    }

    .ant-select-selection-item {
      min-width: fit-content;
      margin-right: 30px;
    }

    color: "#3b3636";
  }
`;
