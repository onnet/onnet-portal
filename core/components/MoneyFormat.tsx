import React from 'react';
import NumberFormat from 'react-number-format';

import { formatMessage } from 'umi-plugin-react/locale';

const MoneyFormat = props => {
  const { amount, prefix } = props;

  return (
    <NumberFormat
      value={amount}
      displayType="text"
      thousandSeparator=" "
      decimalScale={2}
      fixedDecimalScale
      renderText={value => (
        <span>
          {prefix}
          {value} {formatMessage({ id: 'reseller_portal.rub_short', defaultMessage: 'rub.' })}
        </span>
      )}
    />
  );
};

export default MoneyFormat;
