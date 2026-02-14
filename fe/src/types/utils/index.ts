export interface UploadsTriggerProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  className?: string;
  disable?: boolean;
}

type BaseOptions = {
  timeZone?: string;
  locale?: string;
};

type DateOnlyOptions = BaseOptions & {
  style?: "date";
  withTime?: false;
};

type DateTimeOptions = BaseOptions & {
  style: "datetime";
};

type TimeOnlyOptions = BaseOptions & {
  style: "time";
};

type InputDateOptions = {
  style: "input";
};

type DayDateSlashOptions = BaseOptions & {
  style: "day-date-slash";
};

export type FormatDateOptions =
  | DateOnlyOptions
  | DateTimeOptions
  | TimeOnlyOptions
  | InputDateOptions
  | DayDateSlashOptions;

export type SupportedCurrency =
  | "IDR"
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "SGD"
  | "MYR"
  | "AUD"
  | "CNY";
