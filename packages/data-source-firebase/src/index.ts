import React from 'react';
import { FirebaseOptions, initializeApp, getApp } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from 'firebase/firestore';

export interface DataSource<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
  fetchMore: (offset: number, size: number) => void;
}

enum DataSourceType {
  DataCell,
  DataList,
}

interface DataSourceConfigFirestore {
  // id: string;
  type: DataSourceType;
  ref: string;
}

type DataSourceConfig = DataSourceConfigFirestore;

export interface PluginOptions {
  firebaseOptions: FirebaseOptions;
  firebaseName?: string;
  dataSourceConfig: DataSourceConfig;
}

export function useDataSource<T = unknown>(
  options: PluginOptions,
): DataSource<T> {
  const app = React.useRef(
    getApp(options.firebaseName)
      ? getApp(options.firebaseName) // avoid initializing same firebase app again
      : initializeApp(options.firebaseOptions, options.firebaseName),
  );
  const firestore = React.useRef(getFirestore(app.current));
  const [data, setData] = React.useState<DataSource<T>['data']>();
  const [error, setError] = React.useState<DataSource<T>['error']>();
  const [loading, setLoading] = React.useState<DataSource<T>['loading']>(false);

  const fetch = React.useCallback(() => {
    setLoading(true);
    const { type, ref } = options.dataSourceConfig;

    switch (type) {
      case DataSourceType.DataCell: {
        getDoc(doc(firestore.current, ref))
          .catch((error) => {
            console.error(error);
            throw new Error('[data-source-firebase] error getting document');
          })
          .then((snapshot) => {
            if (snapshot.exists) {
              setData(snapshot.data() as T);
            } else {
              throw new Error("[data-source-firebase] document doesn't exist");
            }
          })
          .catch((error: Error) => {
            setError(error);
          })
          .finally(() => {
            setLoading(false);
          });
        return;
      }
      case DataSourceType.DataList: {
        getDocs(collection(firestore.current, ref))
          .catch((error) => {
            console.error(error);
            throw new Error('[data-source-firebase] error getting collection');
          })
          .then((snapshot) => {
            setData(snapshot.docs.map((doc) => doc.data()) as T);
          })
          .catch((error: Error) => {
            setError(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, []);

  React.useEffect(() => {
    fetch();
  }, []);

  return {
    data,
    error,
    loading,
    refresh: fetch,
    fetchMore: () => {
      return [];
    },
  };
}
