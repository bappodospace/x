import index from '@/public/index.json';

import type { FSModule } from 'browserfs/dist/node/core/FS';
import type { Stats } from 'browserfs/dist/node/generic/emscripten_fs';
import type { FC } from 'react';

import { createContext, useEffect, useState } from 'react';
import * as BrowserFS from 'browserfs';

type StatsProto = {
  isDirectory: () => boolean;
  isFile: () => boolean;
};

type FsStats = Stats & StatsProto;

type FsModule = Partial<FSModule>;

type ListingObj = {
  [key: string]: ListingObj | string | null
}

const writableJsonFs = (path: string, listingUrlOrObj: string | ListingObj): { [key: string]: BrowserFS.FileSystemConfiguration } => ({
  [path]: {
    fs: 'OverlayFS',
    options: {
      readable: {
        fs: 'XmlHttpRequest',
        options: {
          index: listingUrlOrObj
        }
      },
      writable: {
        fs: 'IndexedDB',
        options: {
          storeName: `browser-fs-cache (${ path })`
        }
      }
    }
  }
});

const fsConfig = {
  fs: 'MountableFileSystem',
  options: writableJsonFs('/', index)
};

export const getFileStat = (fs: FsModule, path: string): Promise<FsStats> =>
  new Promise((resolve) => fs?.stat?.(path, (_error, stats) => resolve(stats)));

export const FilesContext = createContext<FsModule>({});

export const FilesProvider: FC = ({ children }) => {
  const [fs, setFS] = useState<FsModule>({});

  useEffect(() => {
    BrowserFS.install(window);

    BrowserFS.configure(fsConfig, () => {
      setFS(BrowserFS.BFSRequire('fs'));
    });
  }, []);

  return <FilesContext.Provider value={fs}>{children}</FilesContext.Provider>;
};