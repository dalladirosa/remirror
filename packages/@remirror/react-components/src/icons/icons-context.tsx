/**
 * @module
 *
 * Taken from
 * https://github.com/react-icons/react-icons/blob/10199cca7abeb3efbc647090714daa279da45779/packages/react-icons/src/iconContext.tsx#L1-L19
 */

import React, { createContext } from 'react';

export interface IconContext {
  color?: string;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
  attr?: React.SVGAttributes<SVGElement>;
}

export const DefaultContext: IconContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined,
};

export const IconContext: React.Context<IconContext> = createContext(DefaultContext);
