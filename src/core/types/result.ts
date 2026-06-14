import { ResultStatus } from './result-code';

export type ExtensionType = {
  field: string | null;
  message: string;
};

// export type Result<T = null> = {
//   status: ResultStatus;
//   errorMessage?: string;
//   extensions: ExtensionType[];
//   data: T;
// };

export type SuccessResult<T> = {
  status: ResultStatus.Success;
  data: T;
  errorMessage?: string;
  extensions: ExtensionType[];
};

export type FailureResult = {
  status: Exclude<ResultStatus, ResultStatus.Success>;
  data: null;
  errorMessage?: string;
  extensions: ExtensionType[];
};

export type Result<T> = SuccessResult<T> | FailureResult;
