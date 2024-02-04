import {
  Primitive,
  Model,
  Matrix4,
  Transforms,
  Cartesian3,
  BillboardCollection,
  PointPrimitiveCollection,
  JulianDate,
  ModelAnimation,
  ModelAnimationLoop,
  CallbackProperty,
  PositionProperty,
  SampledPositionProperty,
  Property,
  defaultValue,
  Clock,
  CompositePositionProperty,
  TimeIntervalCollectionPositionProperty,
  VelocityOrientationProperty,
  Matrix3,
  Math as CesiumMath,
  Ellipsoid,
  SampledProperty,
  HeadingPitchRoll,
} from "cesium";

/**
 * @typedef {CallbackProperty|PositionProperty|SampledPositionProperty|CompositePositionProperty|TimeIntervalCollectionPositionProperty} PositionType
 */

/**
 * @typedef {Object} SatellitePrimitiveOption
 * @property {PositionType} [position]
 * @property {Property} [hpr]
 * @property {Property} [orientation]
 */

export class SatellitePrimitive extends Primitive {
  /**
   *
   * @param {SatellitePrimitiveOption} [options]
   */
  constructor(options = {}) {
    super();

    /**
     * @type {Array<Primitive|Model|BillboardCollection|PointPrimitiveCollection>}
     * @memberof  SatellitePrimitive
     */
    this.primitives = [];
    // this.geometryInstances.push()

    /**
     * @type {PositionType}
     * @memberof  SatellitePrimitive
     */
    this.position = defaultValue(options.position, undefined);

    /**
     * @type {VelocityOrientationProperty}
     */
    this.orientation = defaultValue(options.orientation, undefined);

    /**
     * @type {Property}
     */
    this.hpr = defaultValue(options.hpr, new SampledProperty(HeadingPitchRoll));

    /**
     * @type {Promise<this>}
     */
    this._readyPromise = this.init();
  }

  async init() {
    await this.createModel();

    console.log("createPoint Ready");

    return this;
  }

  /**
   *
   * @param {JulianDate} time
   */
  submitChange(time) {
    // const time = time;

    /**
     * @type {Cartesian3}
     */
    let center;

    /**
     * @type {Matrix4}
     */
    let modelMatrix = new Matrix4();

    if (this.position) {
      // console.log(this.position.getValue(time))
      // console.log(JulianDate.toDate(time))
      center = Property.getValueOrUndefined(
        this.position,
        time,
        new Cartesian3()
      );

      // console.log(JulianDate.toDate(time))
    }

    // const ori = Property.getValueOrUndefined(this.orientation, time);

    /**
     * @type {HeadingPitchRoll}
     */
    const hpr = Property.getValueOrUndefined(
      this.hpr,
      time,
      HeadingPitchRoll.fromDegrees(0, 0, 0)
    );

    // console.log(ori)
    if (center) {
      // let hpr = this.hdr.getValue(time);

      // hpr.heading=CesiumMath.toRadians(-50)

      // console.log(HeadingPitchRoll.fromQuaternion(ori));

      // HeadingPitchRoll.fromQuaternion(ori)

      // hpr = HeadingPitchRoll.fromQuaternion(ori);

      if (hpr) {
        Transforms.headingPitchRollToFixedFrame(
          center,
          hpr,
          undefined,
          undefined,
          modelMatrix
        );
      } else {
        Transforms.eastNorthUpToFixedFrame(center, undefined, modelMatrix);
      }
    }

    for (const primitive of this.primitives) {
      // console.log(center)
      if (modelMatrix instanceof Matrix4) {
        primitive.modelMatrix = modelMatrix;
      } else {
        // console.log('center',center)
      }
    }
  }

  async createModel() {
    //  const trans= Transforms.eastNorthUpToFixedFrame()
    const model = Model.fromGltf({
      url: import.meta.env.BASE_URL + "Cesium_Air.glb",
      // modelMatrix: Transforms.eastNorthUpToFixedFrame(
      //   Cartesian3.fromDegrees(120, 24)
      // ),
      // clampAnimations:true,
      scale: 1000,
      clampAnimations: true,
    });

    if (this.position instanceof SampledPositionProperty) {
      // console.log(this.position.numberOfDerivatives)
    }

    this.primitives.push(model);

    return model.readyPromise;

    // model.activeAnimations.add({
    //   index:0,
    //   delay: 100000,
    //   startTime: JulianDate.now(),
    //   animationTime: function animationTime(duration) {
    //     return 1000 / duration;
    //   },
    //   loop:ModelAnimationLoop.REPEAT
    // });

    // model
    // const primitive=new Point
  }

  update(frameState) {
    console.log("update");
    this.submitChange(frameState.time);
    for (const primitive of this.primitives) {
      primitive.update(frameState);
    }
    
    // console.log(frameState.time)
    // super.update(frameState);
  }
}
