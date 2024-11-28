export interface IColumnType<T> {
  dataKey?: keyof T;
  title: string;
  render?: (value: never, record: T, index: number) => React.ReactNode | void;
  renderHeader?: () => React.ReactNode;
}

export interface ITableProps<T> {
  dataSource: T[];
  columns: IColumnType<T>[];
  dataId: keyof T;
}

function DynamicTable<T>({ dataSource, columns, dataId }: ITableProps<T>) {
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
              const tempKey = data[dataId];
              return (
                <tr key={`${tempKey}`}>
                  {columns.map((column) => {
                    let value;
                    if (column.dataKey !== undefined) {
                      value = data[column.dataKey];
                    }
                    if (column.render) {
                      value = column.render(
                        value as never,
                        data as never,
                        index
                      );
                    }
                    return (
                      <td key={`${column.title}:${tempKey}`}>
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
}

export default DynamicTable;
