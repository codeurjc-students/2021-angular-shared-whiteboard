const { fabric } = require('fabric');
const { Builder, By, until, WebElementCondition } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
describe('testing', () => {
    try {
        jest.setTimeout(60000); //By default jest tests are at least 5 seconds.

        test('it should draw a rectangle', async () => {

            let driver1 = new Builder().forBrowser('chrome').build();
            await driver1.get('http://localhost:4200/sala1');

            let driver2 = new Builder().forBrowser('chrome').build();
            await driver2.get('http://localhost:4200/sala1');

            let btnShapes = await driver2.findElement(By.id('btnshapes'));
            await btnShapes.click();

            let btnShapeRect = await driver2.findElement(By.id('btnRect'));
            await btnShapeRect.click();



            // jest.setTimeout(60000);

            // await driver1.manage().setTimeouts(( { implicit: 60000 } ));
            // driver1.sleep(60000);
            // jest.setTimeout(60000);




            // var canvas1 =  driver1.executeScript(' canvas');
            // console.log('canvas1 ', canvas1);9
            // canvas1.getAttribute('innerHTML').then(e=>{
            //     console.log('html1 ', e);
            // })
            let ele = await driver1.wait(until.elementLocated(By.id('canvas')), 60000);
            // console.log('ele',ele);
            // let canvas = await driver1.findElement(By.id("canvas"));
            // console.log(ele.getText());
            // var el= driver1.findElements(By.id("canvas")).then(async e=>{
            //     var canvsa = await driver1.findElement(By.id('canvas'));
            //     console.log('canvsa',canvsa);
            // });
            //     console.log(el.getText())

            var canvas = await driver1.executeScript('return document.getElementById("canvas").getContext("2d").getImageData(20,20,20,20);;').then(async e => {
                // e[1].click()
                // var att = e[1].getAttribute("innerHTML").then(async e => {
                //     return e;
                // });
                // console.log('atri ', att);
                return e
            });
            console.log('canvas ', canvas);
            // var attr = await canvas12.getAttribute("innerHTML").then(e=>{
            //     return e;
            // })
            // console.log('attr '. attr);
            // const element = driver1.findElement(By.id('canvas'));
            // console.log(await element.getAttribute('innerHTML').then(e=>{
            //     console.log('que te pintes coño ', e)
            // }));
            // let cv =  driver1.executeScript('let canvas = document.getElementById("canvas");');
            // console.log('dscsdsdv ', cv);
            // cv.then(async e=>{
            //     await console.log('sdfsdf ', e);
            // })


            // let canvas = await driver1.findElement(By.xpath('canvas[id*="canvas"]'));
            // let html = await canvas.getAttribute('innerHTML').then(e => {
            //     console.log(e);
            // });
            // console.log(html);
            // var c = p.then(function(e){
            //     console.log(e);
            // });
            // var bg = c.toDataURL("image/png");

            // var canvas = new fabric.Canvas('c');
            // console.log(canvas);
        });
    } catch {
        console.log()
    }
});