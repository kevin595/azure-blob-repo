import { FC } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RecordType = Record<string, any>;

export interface IColumnType<T> {
  dataIndex?: string & keyof T;
  title: string;
  render?: (value: never, record: T, index: number) => React.ReactNode | void;
  renderHeader?: () => React.ReactNode;
}

export interface ITableProps<T extends RecordType = never> {
  dataSource: RecordType[];
  columns: IColumnType<T>[];
}

const DynamicTable: FC<ITableProps> = ({ dataSource, columns }) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((column) => {
              return (
                <th key={column.title}>
                  {column?.renderHeader ? column.renderHeader() : column.title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(dataSource) && dataSource.length > 0 ? (
            dataSource.map((data, index) => {
              return (
                <tr key={data?.id}>
                  {columns.map((column) => {
                    let value;
                    if (column.dataIndex !== undefined) {
                      value = data[column.dataIndex];
                    }
                    if (column.render) {
                      value = column.render(
                        value as never,
                        data as never,
                        index
                      );
                    }
                    return (
                      <td key={`${column.title}:${data?.id}`}>
                        {value as never}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <div>No Records Found</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default DynamicTable;
