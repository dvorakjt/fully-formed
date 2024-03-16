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
