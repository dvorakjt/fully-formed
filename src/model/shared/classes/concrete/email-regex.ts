/**
 * A regular expression that can be used to test if a string is a valid email
 * address.
 * 
 * @remarks
   * The following requirements have been implemented:
   * - The local part of the email must be between 1 and 64 characters in
   * length.
   * - The length of the domain must be between 4 and 255 characters in length.
   * - The local part can consist of printable characters separated by a period.
   * Periods must not occur consecutively or at the beginning or end of the
   * local part. Printable characters are:
   *   - Alphanumeric characters
   *   - Any of the following symbols: !#$%&'*+-/=?^_\`\{|\}~
   * - The domain consists of DNS labels separated by periods.
   * - Each DNS label may be between 1 and 63 characters in length.
   * - Each DNS label may consist of alphanumeric characters and hyphens,
   * provided it is not comprised only of numbers, does not start or end with a
   * hyphen, and does not include consecutive hyphens.
   * - The top-level domain must consist of 2 or more alphabetical characters.
   *
   * Please see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696) for
   * more information.
 */
export class EmailRegExp extends RegExp {
  private static pattern: string;

  static {
    const localPartLength = '(?=.{1,64}@)';
    const localPart =
      "[a-zA-Z0-9!#$%&'*+\\-\\/=?^_`{|}~]+(?:\\.[a-zA-Z0-9!#$%&'*+\\-\\/=?^_`{|}~]+)*";
    const domainLength = '(?=.{4,255}$)';
    const dnsLabelLength = '(?=[a-zA-Z0-9\\-]{1,63}\\.)';
    const dnsLabel =
      '(?=[a-zA-Z0-9\\-]*[a-zA-Z][a-zA-Z0-9\\-]*\\.)[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\\.';
    const topLevelDomain = '[a-zA-Z]{2,}';
    this.pattern = `^${localPartLength}${localPart}@${domainLength}(?:${dnsLabelLength}${dnsLabel})+${topLevelDomain}$`;
  }

  public constructor() {
    super(EmailRegExp.pattern);
  }
}
