export interface ApiErrorResponse {
  code: string;
  error: string;
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
}
