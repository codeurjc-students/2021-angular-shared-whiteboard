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
            driver2.wait(until.elementsLocated(By.id('btnshapes'), 10000));

            await btnShapes.click();

            let btnShape = await driver2.findElement(By.id('btnshape'));
            driver2.wait(until.elementsLocated(By.id('btnshape'), 10000));

            await btnShape.click();
            let canvas = await driver1.findElement(By.id('canvas'));
            driver1.wait(until.elementsLocated(By.id('canvas'), 10000));
            // var objects = await canvas.getObjects();
            console.log(canvas);
        });
    } catch {
        console.log()
    }
});