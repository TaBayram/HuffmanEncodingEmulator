import { BinaryCode } from './binarycode';

export class CodesAndGain {
  constructor(private codes: Map<string, BinaryCode>) {}

  public get gainPercent(): number {
    let averageGain = 0;

    for (let code of this.codes.values()) {
      averageGain += code.gainPercent;
    }

    return averageGain / this.codes.size;
  }

  public get orijinalSize(): number {
    let originalSize = 0;

    for (let code of this.codes.values()) {
      originalSize += code.original.length;
    }

    return originalSize;
  }

  public get codedSize(): number {
    let codedSize = 0;

    for (let code of this.codes.values()) {
      codedSize += code.coded.length;
    }

    return codedSize;
  }

  public get gainSize(): number {
    return this.orijinalSize - this.codedSize;
  }
}
