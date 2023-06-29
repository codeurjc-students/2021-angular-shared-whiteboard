const { AssertionError } = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
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
            var canvas2Data = await driver2.executeScript('return document.getElementById("canvas").getContext("2d").getImageData(100,100,2,2);').then(async e => {
                return e
            });
            let areEqualsBefore = JSON.stringify(canvas1Data.data) === JSON.stringify(canvas2Data.data);
            if (!areEqualsBefore){
                driver1.close();
                driver2.close();
                throw new Error("Canvas at these points are not equeals!");
            }
            let btnShapes = await driver2.findElement(By.id('btnshapes'));
            await btnShapes.click();

            let btnShapeRect = await driver2.findElement(By.id('btnRect'));
            var rectDrawed = await btnShapeRect.click().then(async clicked => {
                return clicked;
            });
            console.log(areEqualsBefore);
            let areEqualsAfter = false;
            var cv1data = await driver1.executeScript('return document.getElementById("canvas").getContext("2d").getImageData(0,0,400,400);').then(async e => {
                return e
            });

            console.log('cv1data drawed: ', cv1data.data);
            var cv2data = await driver2.executeScript('return document.getElementById("canvas").getContext("2d").getImageData(0,0,400,400);').then(async e => {
                return e
            });
            console.log('cv2data drawed: ', cv2data.data);
            areEqualsAfter = JSON.stringify(cv1data.data) === JSON.stringify(cv2data.data);
            if (!areEqualsAfter) {
                driver1.close();
                driver2.close();
                console.log('cv2data drawed: ', cv1data.data);
                console.log('cv2data drawed: ', cv2data.data);
                throw new Error("Canvas at these points are not equeals!")
            }
            

            driver1.close();
            driver2.close();
        });
    } catch {
        console.log()
    }
});