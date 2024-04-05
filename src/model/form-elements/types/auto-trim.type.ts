// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DefaultAdapter, DefaultExcludableAdapter } from "../../adapters";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AdaptFn } from "../../adapters";

/**
 * Defines how string-type fields should be auto-trimmed.
 * 
 * @remarks
 * If true, the {@link DefaultAdapter}/{@link DefaultExcludableAdapter}s
 * created for all non-transient string-type fields will be instantiated with
 * an {@link AdaptFn} that trims the value of their source field.
 * 
 * Alternatively, an `include` or `exclude` array may be provided. If an 
 * `include` array is provided, any string-type, non-transient fields whose
 * names appear in the array will receive auto-trimming adapters as described
 * above.
 * 
 * If an `exclude` array is provided, all string-type, non-transient fields
 * except those that appear in the array will receive auto-trimming adapters
 * as described above.
 */
export type AutoTrim =
  | boolean
  | {
      include: string[];
    }
  | {
      exclude: string[];
    };
