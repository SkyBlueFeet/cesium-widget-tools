import {
  Color,
  Event,
  Material,
  Property,
  ImageMaterialProperty,
  createPropertyDescriptor,
  defined,
} from "cesium";

const image = "https://openlayers.vip/examples/resources/earth_cloud.png"; // 云层颜色

const color = new Color(1.0, 1.0, 1.0, 0.5); // 用于计算云层速度

const time = 20;// 

export const staticCloudEffectMatrialProperty = new ImageMaterialProperty({
  image: image,
});

/**
 * @class
 * @namespace {CloudEffectMaterialProperty}
 *
 */
export function CloudEffectMaterialProperty() {
  this._definitionChanged = new Event();
  this.speed = 10; // 速度
  this.color = color; // 颜色
  this._image = image; // 图层
  this.time = time; // 时间
  const durationDefault = 100000; // 计算持续时间
  this.duration = (100 / this.speed) * durationDefault;
  this._time = new Date().getTime();
}

// 定义属性
Object.defineProperties(CloudEffectMaterialProperty.prototype, {
  /**
   * @memberof CloudEffectMaterialProperty
   */
  isConstant: {
    get: function () {
      return false;
    },
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  color: createPropertyDescriptor("color"),
});

CloudEffectMaterialProperty.prototype.getType = function (time) {
  return "CloudEffect";
};

CloudEffectMaterialProperty.prototype.getValue = function (time, result) {
  if (!defined(result)) {
    result = {};
  }
  result.color = Property.getValueOrClonedDefault(
    this._color,
    time,
    Color.WHITE,
    result.color
  );
  result.time =
    ((new Date().getTime() - this._time) % this.duration) / this.duration;
  return result;
};

CloudEffectMaterialProperty.prototype.equals = function (other) {
  return (
    this === other ||
    (other instanceof CloudEffectMaterialProperty &&
      Property.equals(this._color, other._color) &&
      Property.equals(this.speed, other.speed))
  );
};
Material.CloudEffectType = "CloudEffect";
Material.CloudEffectImage = image;

Material.CloudEffectColor = color;
// 着色器代码
Material.CloudEffectSource = `
czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    vec4 colorImage = texture2D(image, vec2(fract(st.s + time),st.t));
    material.alpha = colorImage.a * color.a;
    material.diffuse = color.rgb;
    return material;
}
`; // 添加着色器

Material._materialCache.addMaterial(Material.CloudEffectType, {
  fabric: {
    type: Material.CloudEffectType,
    uniforms: {
      color: Material.CloudEffectColor,
      image: Material.CloudEffectImage,
    //   constantSpeed: 0.001,
      time: time,
    },
    source: Material.CloudEffectSource,
  },
  translucent: function (material) {
    return true;
  },
});

// viewer.zoomTo(viewer.entities);
// Sandcastle.addToolbarButton("开启动态云层", function () {
//   alert("动态云层！");
//   entity.rectangle.height = 0;
//   entity.rectangle.extrudedHeight = 100000;
//   entity.rectangle.material = new CloudEffectMaterialProperty();
// });

// Sandcastle.addToolbarButton("开启静态云层", function () {
//   alert("静态云层！");
//   entity.rectangle.height = undefined;
//   entity.rectangle.extrudedHeight = undefined;
//   entity.rectangle.material = imageMaterial;
// });

// const name=new CloudEffectMaterialProperty()
