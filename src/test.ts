import { Transmission } from './transmission';
let t = new Transmission({
    host: 'localhost',
    username: 'transmission',
    password: 'transmission'
});
async function test() {
    let res =  await t.getSession();
    console.log(res || 'no');
}
test()