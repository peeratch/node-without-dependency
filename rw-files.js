/*
        node.js ทำงานในรูปแบบของ module ( เหมือนกับ package ในภาษา golang )
        เราสามารถเรียกใช้งานด้วยการ require แล้วเก็บเอาไว้ที่ variables
*/

const fs = require('fs'); // io package 

// blocking synchronous way
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

fs.writeFileSync('./txt/output.txt', textOut);
console.log(textOut);

// Non blocking, asynchronous way 
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
        console.log(data);
});

console.log('non blocking statement at line 18');

// understand callback-hell :: don't write like that 
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
        console.log(data1);
        fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
                console.log(data2);
                fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
                        console.log(data3);
                        fs.writeFile('.text/final.txt', `${data2}\n&{data3}`, 'utf-8', err => {
                                console.log('file has been written :)')
                        })
                });
        });
});



