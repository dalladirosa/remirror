/**
 * @module
 *
 * Taken from
 * https://github.com/react-icons/react-icons/blob/10199cca7abeb3efbc647090714daa279da45779/packages/react-icons/src/iconBase.tsx#L1-L62
 */

import React, { createElement, ReactElement, ReactNode, SVGAttributes } from 'react';

import { DefaultContext, IconContext } from './icons-context';

export interface IconTree {
  tag: string;
  attr: { [key: string]: string };
  child?: IconTree[];
}

function Tree2Element(tree: IconTree[]): Array<ReactElement<object>> {
  return tree?.map((node, i) =>
    createElement(node.tag, { key: i, ...node.attr }, Tree2Element(node.child ?? [])),
  );
}

export function GenIcon(data: IconTree): IconType {
  // eslint-disable-next-line react/display-name
  return (props: IconBaseProps) => (
    <IconBase attr={{ ...data.attr }} {...props}>
      {Tree2Element(data.child ?? [])}
    </IconBase>
  );
}

export interface IconBaseProps extends SVGAttributes<SVGElement> {
  children?: ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}

export type IconType = (props: IconBaseProps) => JSX.Element;
export function IconBase(props: IconBaseProps & { attr?: object }): JSX.Element {
  const elem = (conf: IconContext) => {
    const computedSize = props.size || conf.size || '1em';
    let className;

    if (conf.className) {
      className = conf.className;
    }

    if (props.className) {
      className = (className ? `${className} ` : '') + props.className;
    }

    const { attr, title, ...svgProps } = props;

    return (
      <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        {...conf.attr}
        {...attr}
        {...svgProps}
        className={className}
        style={{ color: props.color || conf.color, ...conf.style, ...props.style }}
        height={computedSize}
        width={computedSize}
        xmlns='http://www.w3.org/2000/svg'
      >
        {title && <title>{title}</title>}
        {props.children}
      </svg>
    );
  };

  return IconContext !== undefined ? (
    <IconContext.Consumer>{(conf: IconContext) => elem(conf)}</IconContext.Consumer>
  ) : (
    elem(DefaultContext)
  );
}
