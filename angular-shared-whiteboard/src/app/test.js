const { Builder, By, Key, until } = require('selenium-webdriver');

describe('testing', () => {
    try {
        jest.setTimeout(60000);
        let driver1 = new Builder().forBrowser('firefox').build();
        test('it should open a browser', async () => {
            await driver1.get('localhost:4200/sala1');

        });

        let driver2 = new Builder().forBrowser('firefox').build();

        test('it should open another browser', async () => {
            await driver2.get('localhost:4200/sala1');
        });
        var textName='';
        test('it should insert text in canvas1', async () => {
            let btnText = await driver1.findElement(By.id('btnText'));
            var button = driver1.wait(until.elementsLocated(By.id('btnText'), 10000));

            
            await btnText.click();
        });
        
        test('it should draw a rect in canvas2', async () => {
            let btnShapes = await driver2.findElement(By.id('btnshapes'));
            var button = driver2.wait(until.elementsLocated(By.id('btnshapes'), 10000));

            await btnShapes.click();

            let btnShape = await driver2.findElement(By.id('btnshape'));
            var button = driver2.wait(until.elementsLocated(By.id('btnshape'), 10000));

            await btnShape.click();
        });
    } catch {
        console.log()
    }
});