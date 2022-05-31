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

        let idShape;
        test('it should draw a rect in canvas1', async () => {
            let btnText = await driver1.findElement(By.id('btnText'));
            var button = driver1.wait(until.elementsLocated(By.id('btnText'), 10000));

            await btnText.click();
        });
    } catch {
        console.log()
    }
});