import classNames from "classnames";
import React from "react";

interface IconProps {
  name: string;
}

const Icon: React.FC<IconProps> = ({ name }) => {
  return (
    <span className="px-2">
      <i className={"ri-" + name} style={{ fontSize: "1.7rem" }}></i>
    </span>
  );
};

export default Icon;
