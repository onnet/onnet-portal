import { GlobalOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useIntl, getLocale, setLocale } from 'umi';

import React from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const SelectLang = () => {
  const { formatMessage } = useIntl();
  const selectedLang = getLocale();
  const changeLang = (key) => setLocale(key, false);
  const locales = ['en-US', 'ru-RU'];
  const languageLabels = {
    'ru-RU': 'Русский',
    'en-US': 'English',
  };
  const languageIcons = {
    'ru-RU': '🇷🇺',
    'en-US': '🇺🇸',
  };
  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {locales.map((locale) => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <GlobalOutlined title={formatMessage({ id: 'navBar.lang' })} />
    </HeaderDropdown>
  );
};

export default SelectLang;
