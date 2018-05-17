import { css, cx } from "emotion";
import * as React from "react";
import { CSSProperties } from "react";

export { css, cx };
const isDevDebugMode = true;

export interface DivProps extends CSSProperties {
  component?: string;
  className?: string;
  onClick?: () => void;
  children?: any;
  height?: string;
  bgColor?: string;
  theme?: CSSProperties | {}; // theme property accepts CSSProperty based object, this object will override dynamically generated style values
}

export const Div: React.SFC<DivProps> = ({
  component = "div",
  className = null,
  theme = {},
  children = null,
  onClick = null,
  ...rest
}) => {
  const styleClassName = cx([
    css([
      cssSanitize(rest),
      cssSanitize(theme) // so theme will do overriding
    ]),
    className
  ]);
  return React.createElement(
    component,
    {
      className: styleClassName,
      onClick
    },
    children
  );
};

// remove non css elements from object ex replace bgColor with backgroundColor
const cssSanitize = props => {
  if (!props) {
    return null;
  }
  const { bgColor, justify, hoverColor, ...rest } = props;
  if (bgColor) {
    rest.backgroundColor = bgColor;
  }
  if (justify) {
    rest.justifyContent = justify;
  }
  if (hoverColor) {
    rest["&:hover"] = {
      color: hoverColor
    };
  }
  return rest;
};

export interface FitProps extends DivProps {
  size?: string | number;
}

/**
 * Should be used in situation where element size is fixed or should take as few space as needed.
 * Will generate css class as:
 * css```
 * .random{
 *   flex: 0 1 auto;
 * }
 * ```
 */
export const Fit: React.SFC<FitProps> = ({ size = null, ...props }) => {
  return (
    <Div flexGrow={0} flexShrink={1} flexBasis={size || "auto"} {...props} />
  );
};
Fit.displayName = "Fit";

export interface FillProps extends DivProps {
  size?: string | number;
}

/**
 * Should be used in cases where element will take as much space as possible
 * Will generate css class as:
 * css```
 * .random{
 *   flex: 1 1 auto;
 * }
 * ```
 */
export const Fill: React.SFC<FillProps> = ({ size = null, ...props }) => {
  return (
    <Div flexGrow={1} flexShrink={1} flexBasis={size || "auto"} {...props} />
  );
};
Fill.displayName = "Fill";

export interface BoxProps extends DivProps {
  fit?: boolean;
  col?: boolean;
  size?: string | number;
}

/**
 * Will create a flex-box container element by extending Div component.
 * This component is Container element for other Box components or Fit or Fill components
 * text```
 * +-Box--------------------+
 * |+Fit--++Fill------------+|
 * ||     ||                ||
 * ||     ||                ||
 * |+-> <-+|<-----+  +----->||
 * ||     ||                ||
 * ||     ||                ||
 * |+-----++----------------+|
 * +-------------------------+
 * ```
 * Fit and Fill should be used only for last resort layouts.
 * if you want to change element axis or use content elements you should use Flex element.
 */
export const Box: React.SFC<BoxProps> = ({
  fit = false,
  col = false,
  size = null,
  ...props
}) => {
  props.flex = fit ? 0 : 1;
  props.flexDirection = col ? "column" : "row";

  props.flexBasis = size || "auto";
  return <Div display="flex" {...props} />;
};
Box.displayName = "Box";
