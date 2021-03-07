import classNames from "classnames";
import React from "react";

interface IconProps {
  name: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, style = {} }) => {
  return (
    <span className="px-2">
      <i className={"ri-" + name} style={{ fontSize: "1.7rem", ...style }}></i>
    </span>
  );
};

export default Icon;
