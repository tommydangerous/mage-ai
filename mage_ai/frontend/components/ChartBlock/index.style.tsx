import styled, { css } from 'styled-components';

import dark from '@oracle/styles/themes/dark';
import { BORDER_RADIUS, BORDER_RADIUS_SMALL } from '@oracle/styles/units/borders';
import { BlockTypeEnum } from '@interfaces/BlockType';
import {UNIT } from '@oracle/styles/units/spacing';
import { ThemeType } from '@oracle/styles/themes/constants';
import { transition } from '@oracle/styles/mixins';

export const ChartBlockStyle = styled.div`
  border-radius: ${BORDER_RADIUS}px;
  margin-left: ${UNIT * 1}px;
  margin-right: ${UNIT * 1}px;
  margin-top: ${UNIT * 1}px;
  overflow: hidden;
  // padding: ${UNIT * 1}px;

  ${props => `
    background-color: ${(props.theme.background || dark.background).chartBlock};
  `}
`;

export const ConfigurationOptionsStyle = styled.div`
  flex: 1;
  padding-left: ${UNIT * 1}px;
  padding-right: ${UNIT * 1}px;

  // ${props => `
  //   border-left: 1px solid ${(props.theme.borders || dark.borders).medium};
  // `}
`;

export const CodeStyle = styled.div`
  // border-radius: ${BORDER_RADIUS_SMALL}px;
  padding-top: ${UNIT / 2}px;
  // overflow: hidden;

  ${props => `
    background-color: ${(props.theme.background || dark.background).codeTextarea};
  `}
`;
