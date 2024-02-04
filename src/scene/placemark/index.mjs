import { radiansToDegrees } from "@turf/helpers";
import { CesiumWidget, Color, Rectangle, Viewer, Math } from "cesium";
import { GeoJsonPrimitiveLayer } from "primitive-geojson";

/**
 *
 * @param {CesiumWidget} widget
 */
export function testPlaceMark(widget) {
  const primitives = [];

  const controllers = [];

  widget.camera.moveStart.addEventListener(() => {
    while (controllers.length) {
      const controller = controllers.pop();

      controller.abort();
    }
  });

  widget.camera.moveEnd.addEventListener(async function () {
    console.log(widget.camera.positionCartographic.height);

    while (primitives.length) {
      const primitive = primitives.pop();
      widget.scene.primitives.remove(primitive);
    }

    if (widget.camera.positionCartographic.height > 1000 * 1000) {
      return;
    }

    const controller = new AbortController();

    controllers.push(controller);

    const { signal } = controller;

    const bbox = Rectangle.pack(widget.camera.computeViewRectangle(), []).map(
      radiansToDegrees
    );

    const types = ["qwert:cities-point"];

    for await (const type of types) {
      const layer = new GeoJsonPrimitiveLayer();

      let queryUrl = `/geo8085/geoserver/wfs?request=GetFeature&version=1.1.0&typeName=${type}&outputFormat=application/json&BBOX=${bbox.toString()},EPSG:4326`;

      try {
        const response = await fetch(queryUrl, { signal });
        if (response.ok) {
          const json = await response.json();
          console.log(json);
          await layer.load(json, {
            fill: Color.TRANSPARENT,
            clampToGround: true,
            stroke: Color.YELLOW,
          });
          primitives.push(layer.primitiveCollection);

          widget.scene.primitives.add(layer.primitiveCollection);
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
}
