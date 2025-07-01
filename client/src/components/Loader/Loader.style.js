import styled from 'styled-components';

export const StyledLoader = styled.div`
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: ${({ position }) => position || 'fixed'};
`;
