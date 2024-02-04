import workerUrl from "gdal3.js/dist/package/gdal3.js?url";
import dataUrl from "gdal3.js/dist/package/gdal3WebAssembly.data?url";
import wasmUrl from "gdal3.js/dist/package/gdal3WebAssembly.wasm?url";
import initGdalJs from "gdal3.js";

const paths = {
  wasm: wasmUrl,
  data: dataUrl,
  js: workerUrl
};

let count = 0;
console.log(new Date());

(async function bootstrap() {
  const gdal = await initGdalJs({ paths });
  // const resp = await fetch("/cities.shp");
  // const blob=await resp.blob()
  // new File([blob],"cities.shp")
  // const file=
  // const datasets = await gdal.open(["cities.shp","cities.shx","cities.dbf","cities.prj","cities.cpg"]);
  // const dataset = datasets.datasets[0];

  // const infos = await gdal.ogrinfo(dataset);
  console.log(gdal);
})();

// initGdalJs({ paths })
//   .then((Gdal) => {
//     count =
//       Object.keys(Gdal.drivers.raster).length +
//       Object.keys(Gdal.drivers.vector).length;
//     return [
//       ...Object.keys(Gdal.drivers.raster),
//       ...Object.keys(Gdal.drivers.vector),
//     ];
//   })
//   .then((drivers) => {
//     postMessage(drivers);
//   });
