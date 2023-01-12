export class Helpers {
  static firstLetterUpercase(str: string): string {
    const valueString = str.toLowerCase();

    return valueString
      .split(' ')
      .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
      .join(' ');
  }

  static generateRandomIntegers(integerLength: number): number {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < integerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return parseInt(result, 10);
  }

  static parseJson(prop: string): any {
    try {
      return JSON.parse(prop);
    } catch (err) {
      return prop;
    }
  }
}
