import Worker from "web-worker";
import gdalTest from "./gdalTest.mjs?worker";

export function testWorker() {
  const worker = new gdalTest();

  console.log(worker);
  
}
