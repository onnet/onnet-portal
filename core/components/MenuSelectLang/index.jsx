import { Menu } from 'antd';
import { getLocale, setLocale, connect } from 'umi';

import React, { useState } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const SelectLang = (props) => {
  const { global } = props;
  const selectedLang = getLocale();
  const locales = ['en-US', 'ru-RU'];
  const languageLabels = {
    'ru-RU': 'Русский',
    'en-US': 'English',
  };
  const languageIcons = {
    'ru-RU': '🇷🇺',
    'en-US': '🇺🇸',
  };

  const [currentLanguage, setCurrentLanguage] = useState(languageLabels[selectedLang]);

  const changeLang = ({ key }) => {
    setLocale(key, false);
    setCurrentLanguage(languageLabels[getLocale()]);
  };

  const langMenuItems = locales.map((locale) => ({
    key: locale,
    label: (
      <>
        <span role="img" aria-label={languageLabels[locale]}>
          {languageIcons[locale]}
        </span>{' '}
        <span>{languageLabels[locale]}</span>
      </>
    ),
  }));

  return (
    <HeaderDropdown
      menu={{ onClick: changeLang, items: langMenuItems }}
      placement="topRight"
      trigger={['click']}
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        <span>{languageIcons[selectedLang]}</span>
        {!global.collapsed ? <span style={{ marginLeft: '9px' }}>{currentLanguage}</span> : null}
      </a>
    </HeaderDropdown>
  );
};

export default connect(({ global }) => ({
  global,
}))(SelectLang);
