const { AssertionError } = require('assert');
const { Builder, By, until} = require('selenium-webdriver');
describe('testing', () => {
    try {
        jest.setTimeout(500000); //By default jest tests are at least 5 seconds.

        test('it should draw a rectangle', async () => {

            let driver1 = new Builder().forBrowser('chrome').build();
            await driver1.get('http://localhost:4200/sala1');

            let driver2 = new Builder().forBrowser('chrome').build();
            await driver2.get('http://localhost:4200/sala1');

            await driver1.wait(until.elementLocated(By.id('canvas')), 60000);
            await driver2.wait(until.elementLocated(By.id('canvas')), 60000);

            var canvas1Data = await driver1.executeScript('return document.getElementById("canvas").getContext("2d").getImageData(0,0,400,400);').then(async e => {
                return e
            });
            console.log('canvas1Data ', canvas1Data.data);
            var canvas2Data = await driver2.executeScript('return document.getElementById("canvas").getContext("2d").getImageData(0,0,400,400);').then(async e => {
                return e
            });
            console.log('canvas2Data ', canvas2Data.data);

            canvas1Data.data.forEach(function(pixel) {
                return pixel==expect(0);
            });
            canvas2Data.data.forEach(function(pixel) {
                return pixel==expect(0);
            });

            let btnShapes = await driver2.findElement(By.id('btnshapes'));
            await btnShapes.click();

            let btnShapeRect = await driver2.findElement(By.id('btnRect'));
            await btnShapeRect.click().then(async clicked=>{
                var cv1data = await driver1.executeScript('return document.getElementById("canvas").getContext("2d").getImageData(0,0,400,400).data;').then(async e => {
                    return e
                });
                console.log('cv1data drawed: ', cv1data);
                cv1data.forEach(function(pixel) {
                    return pixel==expect(0);
                });
                var cv2data = await driver2.executeScript('return document.getElementById("canvas").getContext("2d").getImageData(0,0,400,400).data;').then(async e => {
                    return e
                });
                console.log('cv2data drawed: ', cv2data);
                let sonCeros = cv2data.forEach(function(pixel) {
                    return pixel==0;
                });
                console.log(sonCeros)
            });

          
         


            driver1.close();
            driver2.close();
        });
    } catch {
        console.log()
    }
});