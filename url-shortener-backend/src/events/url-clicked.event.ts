export class UrlClickedEvent {
  constructor(
    public readonly urlId: number,
    public readonly ipAddress: string,
    public readonly userAgent: string,
  ) {}
}
