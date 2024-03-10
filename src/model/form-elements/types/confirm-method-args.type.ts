export type ConfirmMethodArgs<ConfirmedValue> = {
  onSuccess?: (value: ConfirmedValue) => void;
  onFailure?: () => void;
};
