import React from "react";
import { DataSource, DataSourceRegistryContext } from "./DataSource";

interface DataCellProps<DataSourceDataType, ComponentProps> {
  dataSource: string;
  dataMapper: (
    dataSource: DataSource<DataSourceDataType> | undefined
  ) => ComponentProps & JSX.IntrinsicAttributes;
  Component: React.ComponentType<ComponentProps>;
}

const DataCell = <DataSourceDataType, ComponentProps>({
  dataSource,
  dataMapper,
  Component
}: DataCellProps<DataSourceDataType, ComponentProps>): React.ReactElement => {
  const _datsSource = React.useContext(DataSourceRegistryContext).source[
    dataSource
  ] as DataSource<DataSourceDataType> | undefined;
  const props = React.useMemo(() => {
    return dataMapper(_datsSource);
  }, [dataMapper, _datsSource]);
  return <Component {...props} />;
};

export default DataCell;
