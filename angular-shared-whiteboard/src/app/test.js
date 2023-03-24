const { fabric } = require('fabric');
const { Builder, By, Key, until } = require('selenium-webdriver');
describe('testing', () => {
    try {
        jest.setTimeout(60000);
        test('it should draw a rectangle', async () => {
            let driver1 = new Builder().forBrowser('firefox').build();
            await driver1.get('localhost:4200/sala1');

            let driver2 = new Builder().forBrowser('firefox').build();
            await driver2.get('localhost:4200/sala1');

            let btnShapes = await driver2.findElement(By.id('btnshapes'));
            await btnShapes.click();

            let btnShapeRect = await driver2.findElement(By.id('btnRect'));
            await btnShapeRect.click();

            

            // var p = await driver1.findElement(By.id('canvas')).then(function(p){
            //     console.log(p);
            //     p.then(function(e){
            //         console.log(e);
            //     })
            // });
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