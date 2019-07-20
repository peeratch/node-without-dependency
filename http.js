const fs = require('fs');
const http = require('http'); // net/http
const url = require('url'); // mux

const slugify = require('slugify'); // slugify ใช้ทำ beautiful url ?id=1 เป็น fresh-water ไรงี้

const replaceTemplate = require('./modules/replace-template'); // start จากที่ module อยู่ไม่เหมือนกับการอ้าง path ของการเรียกไฟล์นะ
/*
        workflow 
        
        ## create server##

                (1) create server โยน handler function เข้าไปในรูปแบบของ callback 
                        - type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;
                        - createServer มันรับ handler function เข้าไปโดยที่  signature function take 2 parameter คือ req,res 
        
                (2) listen incoming request 

                (3) เมื่อมี request เรียกไปยัง host:port ที่ทำการ listen ก็จะทำการเรียกใช้งาน 
                handler function ที่ทำการ register เอาไว้ 

                (4) ทำ business logic ที่ระบุใน callback function และ response กลับไป   
*/

/* 
         ./ ::  current dir ที่ใช้คำสั่ง node 
         __dirname :: ใช้ dir ที่ script อยู่ ณ ตำแหน่งนั้น ๆ          
*/

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productDataObject = JSON.parse(productData);

const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const slugs = productDataObject.map(element =>
  slugify(element.productName, { lower: true })
);

const server = http.createServer((req, res) => {
  // "?id=0" เรียกว่าการทำ query string เราสามารถ parse มันออกมาจาก URL ได้
  const { query, pathname } = url.parse(req.url, true); // url.parse( , true); ไม่เอา key ตอนดึงค่าออกมาด้วย
  console.log(query.id);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const cardHTML = productDataObject
      .map(element => replaceTemplate(cardTemplate, element))
      .join('');
    const output = overviewTemplate.replace('{%PRODUCT_CARD%}', cardHTML);
    res.end(output); // response and return
  } else if (pathname === '/product') {
    const product = productDataObject[query.id]; // get element by index
    const output = replaceTemplate(productTemplate, product);

    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(output); // response and return
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(productData);
  } else {
    // res.writeHead :: method สำหรับเขียน header ของ http request
    // เขียนก่อน header ก่อน response นะ
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello world'
    });
    res.end('<h1>not found</h1>');
  }
});

server.listen(3000, '127.0.0.1', () => {
  // port host and callback
  // do stuff after server is started
  console.log('server start @ 3000');
});
