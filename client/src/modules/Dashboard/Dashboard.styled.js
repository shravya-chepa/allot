import styled from "styled-components";

export const StyledDashboardContainer = styled.div`
  display: flex;
  gap: 40px;
  flex-direction: column;
  background-color: white;
  // box-shadow: 0px 1px 5px 1px lightgrey;
  max-width: 990px;
  // width: 100%;
  margin: 0 auto;
  padding: 20px;
  /* height: calc(90vh - 72px);
  overflow-y: scroll;  */
`;

export const StyleHeading = styled.p`
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
  font-align: center;
  color:#ac1330;
`;

export const DashboardContent = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
`;
