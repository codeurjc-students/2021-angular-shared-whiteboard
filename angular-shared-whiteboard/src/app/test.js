
const { fabric } = require('fabric');
const { Builder, By, Key, until } = require('selenium-webdriver');
describe('testing', () => {
    try {
        jest.setTimeout(60000);


        test('it should open a browser', async () => {
            let driver1 = new Builder().forBrowser('firefox').build();
            await driver1.get('localhost:4200/sala1');

            let driver2 = new Builder().forBrowser('firefox').build();
            await driver2.get('localhost:4200/sala1');

            
        });

        test('it should open another browser', async () => {
        });

        test('it should insert text in canvas1', async () => {
            let btnText = await driver1.findElement(By.id('btnText'));
            driver1.wait(until.elementsLocated(By.id('btnText'), 10000));

            await btnText.click();
        });
        test('it should draw a rect in canvas2', async () => {
            let btnShapes = await driver2.findElement(By.id('btnshapes'));
            driver2.wait(until.elementsLocated(By.id('btnshapes'), 10000));

            await btnShapes.click();

            let btnShape = await driver2.findElement(By.id('btnshape'));
            driver2.wait(until.elementsLocated(By.id('btnshape'), 10000));

            await btnShape.click();



        });
        test('it should detect text inserted', async () => {
            try {
                driver2.wait(until.elementsLocated(By.id('canvas'), 10000)).then(async function (value) {
                    try {
                        let canvas = await driver2.findElement(By.id('canvas'));
                        await canvas.getAttribute("outerHTML").then(async function (w) {
                            canvasFabric = new fabric.Canvas(w, { width: 500, height: 500 });

                            console.log(canvasFabric.getObjects());
                        })
                    } catch (e) {
                        console.log("Exception: ", e)

                    }

                });


            } catch (e) {
                console.log("carh: ", e)
            }
        });
    } catch {
        console.log()
    }
});