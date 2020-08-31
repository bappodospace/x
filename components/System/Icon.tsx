import styles from '@/styles/System/Icon.module.scss';

import type { FC } from 'react';

import { useDoubleTap } from 'use-double-tap';

type Icon = {
  icon: string;
  name: string;
  onDoubleClick: () => void;
  tabIndex: number;
};

export const Icon: FC<Icon> = ({ icon, name, onDoubleClick, tabIndex }) => (
  <li
    className={styles.icon}
    onDoubleClick={onDoubleClick}
    {...useDoubleTap(onDoubleClick)}
    tabIndex={tabIndex}
  >
    <figure>
      <img alt={name} src={icon} />
      <figcaption>{name}</figcaption>
    </figure>
  </li>
);