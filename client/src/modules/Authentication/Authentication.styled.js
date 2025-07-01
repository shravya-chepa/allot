import styled from "styled-components";
import backgroundImg from "../../assets/images/hepner-hall-zoom.png";

export const ContainerFluid = styled.div`
  padding: 0;
  background-image: url(${backgroundImg});
  height: calc(90vh - 72px);
`;

export const CardTitle = styled.div`
  font-weight: 600;
`;

export const StyledInputWrapper = styled.div`
  width: 100%;
`;

export const StyledAddUserSectionContainer = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
`;


export const StyledTitle = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 20px;
`;

export const StyledWrapper = styled.div`
  display: grid;
  gap: 10px;
`;

export const StyledFormContainer = styled.div`
  gap: 40px;
  background-color: white;
  box-shadow: 0px 1px 5px 1px lightgrey;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
`;

export const StyledItemWrapper = styled.div`
  display:flex;
  gap: 40px;
`
  
