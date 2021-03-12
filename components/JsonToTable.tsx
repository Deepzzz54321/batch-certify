import React from "react";
import _ from "lodash";

interface JsonToTableProps {
  data: any[];
  classNames?: {
    table?: string;
    th?: string;
    tr?: string;
  };
}

const JsonToTable: React.FC<JsonToTableProps> = ({ data, classNames }) => {
  let headers: any[] = data.reduce(
    (result: any[], obj) => _.union(result, Object.keys(obj)),
    []
  );

  if (!data) {
    return <></>;
  }

  return (
    <table className={classNames && classNames.table}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className={classNames && classNames.th}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((obj, objectIndex) => (
          <tr key={"object-" + objectIndex}>
            {headers.map((header, attrIndex) => (
              <td key={"object-" + objectIndex + "-attr-" + attrIndex}>
                {obj[header] ? obj[header] : "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default JsonToTable;
