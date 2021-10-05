import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import useMergeValue from 'use-merge-value';
import React, { useRef } from 'react';

import classNames from 'classnames';
import styles from './index.less';

const HeaderSearch = (props) => {
  const { className, defaultValue, onVisibleChange, placeholder, open, defaultOpen, ...restProps } =
    props;

  const inputRef = useRef(null);

  const [value, setValue] = useMergeValue(defaultValue, {
    value: props.value,
    onChange: props.onChange,
  });

  const [searchMode, setSearchMode] = useMergeValue(defaultOpen || false, {
    value: props.open,
    onChange: onVisibleChange,
  });

  const inputClass = classNames(styles.input, {
    [styles.show]: searchMode,
  });

  return (
    <div
      className={classNames(className, styles.headerSearch)}
      style={props.style}
      onClick={() => {
        setSearchMode(true);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
      onTransitionEnd={({ propertyName }) => {
        if (propertyName === 'width' && !searchMode) {
          if (onVisibleChange) {
            onVisibleChange(searchMode);
          }
        }
      }}
    >
      <SearchOutlined
        key="Icon"
        style={{
          cursor: 'pointer',
          verticalAlign: 'middle',
        }}
      />
      <AutoComplete
        key="AutoComplete"
        className={inputClass}
        value={value}
        style={{
          height: 26,
          marginTop: -6,
        }}
        options={restProps.options}
        onChange={setValue}
      >
        <Input
          ref={inputRef}
          defaultValue={defaultValue}
          aria-label={placeholder}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (restProps.onSearch) {
                restProps.onSearch(value);
              }
            }
          }}
          onBlur={() => {
            console.log('onBlur', value);
            if (value) console.log('onBlur value.length', value.length);
            if (!value || value.length === 0) setSearchMode(false);
          }}
        />
      </AutoComplete>
    </div>
  );
};

export default HeaderSearch;
