// const promiseTest = () => {
//     return new Promise((resolve, reject) => {
//         console.log("promise callback")
//         resolve('resolve')
//         // reject(new Error('err'))
//     })
// }

// promiseTest()
// .then((res) => {
//     console.log('first then')
//     console.log(res)})
// .then((resolve) => {
//     console.log("second then method")
//     })
// .catch(console.log)

// function getUser(username) {
//     console.log(username)
//     return username
// }
// async function getUserAll() {
//     let user;
//     console.log('function getUserAll')
//     user = await getUser('jeresig');
//     // console.log(user);
  
//     // user = await getUser('ahejlsberg');
//     // // console.log(user);
  
//     // user = await getUser('ungmo2');
//     console.log('user');
//   }

// getUserAll()

// console.log("in first stack")
import fetch from "node-fetch";

// Promise를 반환하는 함수 정의
function getUser(username) {
  return fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json())
    .then(user => {
        console.log('in then')
        return user.name});
}
function test1() {
    setTimeout(() => console.log('hello'), 0)
}

async function getUserAll() {
  let user;
  user = await getUser('jeresig');
//   console.log(user);
console.log('user1');
console.log(user);
  await test1();
  console.log('test1');

  user = await getUser('ungmo2');
  console.log(user);
}

getUserAll();