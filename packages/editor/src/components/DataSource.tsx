import React, { PropsWithChildren } from "react";
// import { useDataSource } from "@ozza/data-source-firebase";
import { useDataSource, DataSourceType } from "./DataSourceFirebase";

// import {
//   FirebaseOptions,
//   initializeApp,
//   FirebaseApp,
//   getApp
// } from "firebase/app";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   getFirestore
// } from "firebase/firestore";

// const app = initializeApp({
//   apiKey: "AIzaSyA43Pg1T9QPZyY2_BUdl2gDqjJYRTPoEcY",
//   authDomain: "craft-plus.firebaseapp.com",
//   projectId: "craft-plus",
//   storageBucket: "craft-plus.appspot.com",
//   messagingSenderId: "734149720607",
//   appId: "1:734149720607:web:0c4259ac48fe7a877e332a",
//   measurementId: "G-JY4M6CVFT4"
// });
// const firestore = getFirestore(app);

// console.log(firestore);

export interface DataSource<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
  fetchMore: (offset: number, size: number) => void;
}

interface IDataSourceRegistryContext {
  source: Record<string, DataSource<unknown>>;
}

export const DataSourceRegistryContext = React.createContext<
  IDataSourceRegistryContext
>({
  source: {}
});

interface DataSourceRegistryProps extends PropsWithChildren {
  plugins: string[];
}

const DataSourceRegistry: React.FC<DataSourceRegistryProps> = ({
  children,
  plugins
}) => {
  const articles = useDataSource<Article[]>({
    firebaseOptions: {
      apiKey: "AIzaSyA43Pg1T9QPZyY2_BUdl2gDqjJYRTPoEcY",
      authDomain: "craft-plus.firebaseapp.com",
      projectId: "craft-plus",
      storageBucket: "craft-plus.appspot.com",
      messagingSenderId: "734149720607",
      appId: "1:734149720607:web:0c4259ac48fe7a877e332a",
      measurementId: "G-JY4M6CVFT4"
    },
    dataSourceConfig: {
      type: DataSourceType.DataList,
      ref: "articles"
    }
  });
  const profile = useDataSource<Profile>({
    firebaseOptions: {
      apiKey: "AIzaSyA43Pg1T9QPZyY2_BUdl2gDqjJYRTPoEcY",
      authDomain: "craft-plus.firebaseapp.com",
      projectId: "craft-plus",
      storageBucket: "craft-plus.appspot.com",
      messagingSenderId: "734149720607",
      appId: "1:734149720607:web:0c4259ac48fe7a877e332a",
      measurementId: "G-JY4M6CVFT4"
    },
    dataSourceConfig: {
      type: DataSourceType.DataCell,
      ref: "users/chengkang"
    }
  });

  React.useEffect(() => {
    plugins.forEach((plugin) => {
      console.log(plugin);
    });
  }, []);

  const context = React.useMemo(() => {
    return {
      source: {
        profile,
        articles
      }
    };
  }, [profile, articles]);

  return (
    <DataSourceRegistryContext.Provider value={context}>
      {children}
    </DataSourceRegistryContext.Provider>
  );
};

export default DataSourceRegistry;

export interface Profile {
  id: string;
  name: string;
  avatar: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
}
