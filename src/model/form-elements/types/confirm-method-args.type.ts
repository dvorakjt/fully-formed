export type ConfirmMethodArgs<ConfirmedValue> = {
  onSuccess?: (value: ConfirmedValue) => void;
  onError?: () => void;
  errorMessage?: string;
};
