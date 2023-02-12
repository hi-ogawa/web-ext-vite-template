import { createIntl, createIntlCache } from "@formatjs/intl";

// https://formatjs.io/docs/intl/

export const intl = createIntl({ locale: "en" }, createIntlCache());

export function format(defaultMessage: string, values?: Record<string, any>) {
  return intl.formatMessage({ defaultMessage, id: defaultMessage }, values);
}
