import { Greeter } from './test';

const g = new Greeter();
g.memorize("secret words")
Greeter.say("hello world");
Greeter.say(123);
g.repeat();