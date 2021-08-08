class Greeter {
  _text;

  memorize(text) {
    this._text = text;
  }

  repeat() {
    console.log(this._text);
  }

  static say(text) {
    console.log(text);
  }
}
export { Greeter };