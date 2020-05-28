import React from 'react';
import NumberFormat from 'react-number-format';

import { useIntl } from 'umi';

const MoneyFormat = props => {
  const { amount, prefix } = props;
  const { formatMessage } = useIntl();

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
