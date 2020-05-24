import React from 'react';
import { connect } from 'umi';

import SelectLang from '../components/SelectLang';
import styles from './LoginLayout.less';

const LoginLayout: React.SFC = props => {
  const { children } = props;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default connect(({ settings }) => ({
  ...settings,
}))(LoginLayout);
