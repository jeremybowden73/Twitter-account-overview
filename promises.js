let p = new Promise(
  function (resolve, reject) {
    const result = "Result from Func 1";
    resolve(result);
    const err = "error 1";
    reject(err);
  });



let p2 = new Promise(
  function (resolve, reject) {
    const result = "Result from Func 2";
    resolve(result);
    const err = "error 2";
    reject(err);
  });



let myObject = {};              // object to store cumulative data
console.log(p);

p                               // call func1
  .then(function (result1) {    // if asyncFunc1 resolves ok...
    myObject.val1 = result1;    // ...store the resolved value in myObject      
    return p2;                  // return a new Promise to the next .then
  })
  .then(function (result2) {    // if asyncFunc2 resolves ok...
    myObject.val2 = result2;    // ...store the resolved value in myObject
    console.log(myObject);      // myObject now contains both properties
  })
  .catch(function (error) {     // if any Promises "reject", do this
    console.log(error);
  });

