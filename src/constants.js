export const MAX_TRAVELLER_COUNT = 5;
export const MAX_COUNTRY_COUNT = 5;

export const RUSSIA = "Russia";
export const SNG = "SNG";
export const SCHENGEN = "Schengen";
export const WORLDWIDE = "Worldwide";
export const USA = "USA";

export const FORM_PATHS = {
  TRAVELLERS: "content.insuredPerson.list",
  TRIP_TYPE: "content.insConditions.insVariant.tripType",
  TRIP_TYPE_CODE: "content.insConditions.insVariant.tripType.code",
  COUNTRIES: "content.insConditions.insVariant.countries",
  COUNTRY_LIST: "content.insConditions.insVariant.countriesList",
  CURRENCY: "content.insConditions.currency",
  CURRENCY_CODE: "content.insConditions.currency.code",
  COVERS: "content.insConditions.insVariant.covers",
  COVER_TRIP_CANCEL: "content.insConditions.insVariant.covers.tripCancel",
  COVER_TRIP_CANCEL_ON: "content.insConditions.insVariant.covers.tripCancel.on",
  COVER_TRIP_CANCEL_PROGRAM:
    "content.insConditions.insVariant.covers.tripCancel.program",
  COVER_ESTATE_TYPE: "content.insConditions.insVariant.covers.estate.type",
  COVER_ESTATE_INS_VARIANT:
    "content.insConditions.insVariant.covers.estate.insVariant",
  COVER_ESTATE_ON: "content.insConditions.insVariant.covers.estate.on",
  LIMIT: "content.insConditions.insVariant.covers.medical.limit",
  LIMIT_CODE: "content.insConditions.insVariant.covers.medical.limit.code",
  OPTIONS: "content.insConditions.insVariant.options",
  OPTION_SPORT: "content.insConditions.insVariant.options.sportK",
  OPTION_QUARANTINE: "content.insConditions.insVariant.options.quarantineK",
  IS_IN_TRIP: "content.contract.data.inTrip",
  BEGIN_DATE: "content.contract.beginDate",
  ARRIVAL: "content.contract.arrival",
  TRIP_LENGTH: "content.insConditions.insVariant.length",
  TRIP_PERIOD: "content.insConditions.insVariant.period",
  PROGRAM: "content.insConditions.insVariant.covers.medical.program",
  PROGRAM_CODE: "content.insConditions.insVariant.covers.medical.program.code",
  POLICYHOLDER: "content.policyHolder",
  POLICYHOLDER_LAST_NAME: "content.policyHolder.lastName",
  POLICYHOLDER_FIRST_NAME: "content.policyHolder.firstName",
  POLICYHOLDER_MIDDLE_NAME: "content.policyHolder.middleName",
  POLICYHOLDER_DOB: "content.policyHolder.dob",
  POLICYHOLDER_EMAIL: "content.policyHolder.email",
  POLICYHOLDER_EMAIL_CONFIRM: "content.policyHolder.emailConfirm",
  POLICYHOLDER_CITIZENSHIP: "content.policyHolder.citizenship",
  POLICYHOLDER_CITIZENSHIP_CODE: "content.policyHolder.citizenship.code",
  POLICYHOLDER_DOCUMENT: "content.policyHolder.document",
  POLICYHOLDER_DOCUMENT_TYPE: "content.policyHolder.document.type",
  POLICYHOLDER_DOCUMENT_TYPE_CODE: "content.policyHolder.document.type.code",
  POLICYHOLDER_DOCUMENT_TYPE_NAME: "content.policyHolder.document.type.name",
  POLICYHOLDER_DOCUMENT_SERIES: "content.policyHolder.document.seria",
  POLICYHOLDER_DOCUMENT_NUMBER: "content.policyHolder.document.number",
  POLICYHOLDER_DOCUMENT_DOI: "content.policyHolder.document.doi",
  POLICYHOLDER_DOCUMENT_ISSUED: "content.policyHolder.document.issued",
  POLICYHOLDER_DOCUMENT_NAME: "content.policyHolder.document.name",
  POLICYHOLDER_ADDRESS: "content.policyHolder.address",
  POLICYHOLDER_ADDRESS_REGION:
    "content.policyHolder.address.registration.region",
  POLICYHOLDER_ADDRESS_CDI:
    "content.policyHolder.address.registration.addressCdi",
  POLICYHOLDER_CDI_DATA_FLAT:
    "content.policyHolder.address.registration.addressCdi.cdiData.flat",
  POLICYHOLDER_ADDRESS_FLAT: "content.policyHolder.address.registration.flat",
  SCONTO: "properties.sconto",
  SCONTO_PERCENT: "properties.sconto.percent",
  PAYMENT_INSTRUMENT: "properties.paymentInstrument",
  PAYMENT_INSTRUMENT_CODE: "properties.paymentInstrument.code",
  PAYMENT_INSTRUMENT_NAME: "properties.paymentInstrument.name",
};

export const PREMIUM_PATH = "logic.results.data.premiumRUR";

export const TRIP_TYPES = [
  { code: "single", name: "Однократная" },
  { code: "multiple", name: "Многократная" },
];

export const TRIP_PERIODS = [
  { code: "30_365", name: "30 дней" },
  { code: "60_365", name: "60 дней" },
  { code: "90_365", name: "90 дней" },
  { code: "180_365", name: "180 дней" },
  { code: "365_365", name: "365 дней" },
];

export const OPTION_SPORT_OPTIONS = [
  { code: true, name: "Нужна" },
  { code: false, name: "Не нужна" },
];

export const CURRENCY_OPTION_USD = { code: "USD", name: "USD" };
export const CURRENCY_OPTION_EUR = { code: "EUR", name: "EUR" };
export const CURRENCY_OPTION_RUR = { code: "RUR", name: "RUR" };

export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  RUR: "₽",
};

export const VARIATIVE_LIMITS_UE = [30_000, 35_000, 40_000];
export const HARDCODED_LIMITS_UE = [50_000, 100_000];
export const MIN_LIMIT = 2_000_000;

export const DATES_TITLE = {
  single: "Даты поездки",
  multiple: "Дата начала действия полиса",
};

export const COVER_NAMES = {
  estate: "Страхование квартиры",
};

export const QUARANTINE_OPTIONS = [
  { code: true, name: "С карантином" },
  { code: false, name: "Без карантина" },
];

export const MAX_TRAVELLER_AGE = 120;
export const MIN_POLICYHOLDER_AGE = 18;
export const MAX_POLICYHOLDER_AGE = 120;
export const DEFAULT_POLICYHOLDER_AGE = 35;

export const CITIZENSHIP_RU = {
  code: "643",
  name: "Российская Федерация",
  isoCountryCode: "RUS",
  dnsCountryCode: "RU",
};

export const DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION = {
  code: "russianPassport",
  name: "Паспорт РФ",
};
export const DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION = {
  code: "foreignPassport",
  name: "Иностранный паспорт",
};

export const PREMIUM_THRESHOLD = 15_000;

export const INTEGER_FORMAT_PROPS = {
  displayType: "text",
  renderText: (value, props) => <nobr {...props}>{value}</nobr>,
  thousandSeparator: " ",
};

export const HOSTS_FOR_CREDIT = [
  "rgs.ru",
  "www.rgs.ru",
  "partner.rgs.ru",
  "testpartner.rgs.ru",
  "test2partner.rgs.ru",
  "localhost",
  "demo.avinfors.ru",
];

export const REGEX_VALIDATION = {
  EN: {
    pattern: /^[A-Z-\s`']+$/i,
    message: "Разрешена только латиница",
  },
  RU_EN: {
    pattern: /^[А-ЯЁ-\s`']+$|^[A-Z-\s`']+$/i,
    message: "Разрешены только кириллица, латиница, дефис, апостроф",
  },
};
