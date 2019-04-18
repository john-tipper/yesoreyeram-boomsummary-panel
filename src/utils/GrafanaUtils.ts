///<reference path="../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from "lodash";
import kbn from "app/core/utils/kbn";

export const getDecimalsForValue = function (value, _decimals) {
  if (_.isNumber(+_decimals)) {
    let o: Object = {
      decimals: _decimals,
      scaledDecimals: null
    };
    return o;
  }

  let delta = value / 2;
  let dec = -Math.floor(Math.log(delta) / Math.LN10);

  let magn = Math.pow(10, -dec),
    norm = delta / magn, // norm is between 1.0 and 10.0
    size;

  if (norm < 1.5) {
    size = 1;
  } else if (norm < 3) {
    size = 2;
    // special case for 2.5, requires an extra decimal
    if (norm > 2.25) {
      size = 2.5;
      ++dec;
    }
  } else if (norm < 7.5) {
    size = 5;
  } else {
    size = 10;
  }

  size *= magn;

  // reduce starting decimals if not needed
  if (Math.floor(value) === value) {
    dec = 0;
  }

  let result: Object = {
    decimals: Math.max(0, dec),
    scaledDecimals:
      Math.max(0, dec) - Math.floor(Math.log(size) / Math.LN10) + 2
  };

  return result;
};

export let getFormattedOutput = function (value, format, decimals) {
  if (isNaN(value) || !value) {
    return value;
  } else {
    let decimalInfo: any = getDecimalsForValue(value, decimals || "0");
    let formatFunc = kbn.valueFormats[format || "none"];
    let value_formatted = formatFunc(
      value,
      decimalInfo.decimals,
      decimalInfo.scaledDecimals
    );
    return String(value_formatted);
  }
};
