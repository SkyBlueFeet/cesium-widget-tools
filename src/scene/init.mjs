import {
  CesiumWidget,
  DataSourceDisplay,
  DataSourceCollection,
  OpenStreetMapImageryProvider,
  CallbackProperty,
  Cartesian3,
  SampledPositionProperty,
  JulianDate,
  ReferenceFrame,
  HeadingPitchRoll,
  WebMapTileServiceImageryProvider,
  Entity,
  Rectangle,
  HeightReference,
  Color,
  EventHelper,
  Clock,
} from "cesium";
import { SatellitePrimitive } from "./equips/satellite.mjs";
import { testPlaceMark } from "./placemark/index.mjs";
import {
  CloudEffectMaterialProperty,
  staticCloudEffectMatrialProperty,
} from "./widgets/cloud.mjs";

//

export class Earth {
  /**
   * @type {Earth}
   */
  static instance;

  static async init() {
    const earth = new this();
    this.instance = earth;

    await this.instance.readyPromise;
    return earth;
  }

  static testMove() {
    let i = 0;

    const sample = new SampledPositionProperty(ReferenceFrame.FIXED);
    let now = JulianDate.now();

    sample.addSample(now.clone(), Cartesian3.fromDegrees(120, 24));

    sample.addSample(
      JulianDate.addMinutes(now.clone(), 1, now),
      Cartesian3.fromDegrees(121, 24.5)
    );

    sample.addSample(
      JulianDate.addMinutes(now.clone(), 2, now),
      Cartesian3.fromDegrees(122, 25)
    );

    this.instance.widget.scene.primitives.add(
      new SatellitePrimitive({
        position: sample,
        hpr: new CallbackProperty((time) => {
          return HeadingPitchRoll.fromDegrees(-45, 0, 0);
        }, false),
        // position: new CallbackProperty(function (time) {
        //   i += 0.001;

        //   return Cartesian3.fromDegrees(120 + i, 24);
        // }, false),
      })
    );
  }

  static testGeojson() {
    testPlaceMark(this.instance.widget);
  }

  static testCloud() {
    const dsplay = this.instance.datasourceDisplay;
    // console.log(this.instance)
    const entity = new Entity({
      rectangle: {
        coordinates: Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
        material: new CloudEffectMaterialProperty(),
        height: 1000 * 100,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
      },
    });

    dsplay.defaultDataSource.entities.add(entity);
  }

  constructor() {
    /**
     * @type {CesiumWidget}
     */
    this.widget = undefined;

    this.datasourceDisplay = undefined;

    /**
     * @type {Promise<this>}
     * @member {}
     */
    this.readyPromise = new Promise((resolve) => {
      this.init();
      resolve(this);
    });

    /**
     * @type {DataSourceDisplay}
     */
  }

  init() {
    const imageryProvider = new WebMapTileServiceImageryProvider({
      url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS",
      layer: "World_Imagery",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
      maximumLevel: 19,
      // credit: new Cesium.Credit("? Esri", "https://www.esri.com/"),
    });
    
    const widget = new CesiumWidget("cesiumContainer", {
      // imageryProvider: new OpenStreetMapImageryProvider({
      //   url: "https://tile.openstreetmap.org/",
      // }),
      imageryProvider: imageryProvider,
    });

    const clock = widget.clock;
    const scene = widget.scene;

    clock.canAnimate = true;
    clock.shouldAnimate = true;

    const dsCollection = new DataSourceCollection();

    this.datasourceDisplay = new DataSourceDisplay({
      scene: widget.scene,
      dataSourceCollection: dsCollection,
      visualizersCallback: DataSourceDisplay.defaultVisualizersCallback,
    });

    var eventHelper = new EventHelper();

    eventHelper.add(clock.onTick, Earth.prototype._onTick, this);
    eventHelper.add(
      scene.morphStart,
      function () {
        console.log("scene.morphStart");
      },
      this
    );

    console.log(this.datasourceDisplay);

    this.widget = widget;

    return widget;
  }

  /**
   *
   * @param {Clock} clock
   */
  _onTick(clock) {
    const time=clock.currentTime;

    this.datasourceDisplay.update(time)
  }
}

async function test() {}
