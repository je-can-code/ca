class Ninja {
  constructor(testVar) {
    this.var = testVar;
  };

  test() {
    console.log(this.var);
  }
}


module.exports.Ninja = Ninja;