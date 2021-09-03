import { GlobalOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useIntl, getLocale, setLocale, connect } from 'umi';

import { ClickParam } from 'antd/es/menu';
import React from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

interface SelectLangProps {
  className?: string;
}
const SelectLang: React.FC<SelectLangProps> = (props) => {
  const { className, global } = props;
  const { formatMessage } = useIntl();
  const selectedLang = getLocale();
  const changeLang = ({ key }: ClickParam): void => setLocale(key, false);
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
