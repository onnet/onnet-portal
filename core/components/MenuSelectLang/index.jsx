import { Menu } from 'antd';
import { getLocale, setLocale, connect } from 'umi';

import React from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const SelectLang = (props) => {
  const { global } = props;
  const selectedLang = getLocale();
  const changeLang = ({ key }) => setLocale(key, false);
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
    <HeaderDropdown overlay={langMenu} placement="topRight" trigger={['click']}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        <span>{languageIcons[selectedLang]}</span>
        {!global.collapsed ? (
          <span style={{ marginLeft: '9px' }}>{languageLabels[selectedLang]}</span>
        ) : null}
      </a>
    </HeaderDropdown>
  );
};

export default connect(({ global }) => ({
  global,
}))(SelectLang);
