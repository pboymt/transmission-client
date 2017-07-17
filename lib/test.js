"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transmission_1 = require("./transmission");
let t = new transmission_1.Transmission({
    host: 'localhost',
    username: 'transmission',
    password: 'transmission'
});
async function test() {
    let res = await t.getSession();
    console.log(res || 'no');
}
test();
