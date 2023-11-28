import React from "react";
import { DataSource, DataSourceRegistryContext } from "./DataSource";

interface DataListProps<DataSourceDataType, ComponentProps> {
  dataSource: string;
  dataMapper: (
    dataSource: DataSource<DataSourceDataType>
  ) => ComponentProps & JSX.IntrinsicAttributes & { key: string };
  Component: React.ComponentType<ComponentProps>;
}

const DataList = <DataSourceDataType, ComponentProps>({
  dataSource,
  dataMapper,
  Component
}: DataListProps<DataSourceDataType, ComponentProps>): React.ReactElement => {
  const _dataSource = React.useContext(DataSourceRegistryContext).source[
    dataSource
  ] as DataSource<DataSourceDataType[]> | undefined;
  return (
    <React.Fragment>
      {_dataSource?.data?.map((datum) => {
        const { data, ...dataSourceWithoutData } = _dataSource;
        const props = dataMapper({
          ...dataSourceWithoutData,
          data: datum!
        });
        return <Component {...props} />;
      })}
    </React.Fragment>
  );
};

export default DataList;
