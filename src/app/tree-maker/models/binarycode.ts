export class BinaryCode {
  constructor(public original: string, public coded: string) {}

  public get gainPercent(): number {
    return (this.original.length - this.coded.length) / this.original.length;
  }
}
