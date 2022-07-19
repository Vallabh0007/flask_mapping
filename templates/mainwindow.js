/**
 * @module examples.rotate
 */
import olcsCore from "olcs/core.js";
import OLCesium from "olcs/OLCesium.js";
import olSourceOSM from "ol/source/OSM.js";
import { OLCS_ION_TOKEN } from "./_common.js";
import olLayerVector from "ol/layer/Vector.js";
import { Fill, Stroke, Style } from "ol/style";
import { OSM, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";

/**
 * @param {!olcs.OLCesium} cesViewer
 * @constructor
 */
const OlcsControl = function (cesViewer) {
  /**
   * @type {!olcs.OLCesium}
   * @private
   */
  this.cesViewer_ = cesViewer;
};

/**
 * Almost PI / 2.
 * @const
 * @type {number}
 */
OlcsControl.MAX_TILT = (7 * Math.PI) / 16;

/**
 * @const
 * @type {number}
 */
OlcsControl.MIN_TILT = 0;

/**
 * @return {ol.View}
 */
OlcsControl.prototype.getOlView = function () {
  return this.cesViewer_.getOlView();
};

/**
 * @return {Array.<number>}
 */
OlcsControl.prototype.getTiltRange = function () {
  return [OlcsControl.MIN_TILT, OlcsControl.MAX_TILT];
};

/**
 * @return {number}
 */
OlcsControl.prototype.getHeading = function () {
  return this.getOlView().getRotation() || 0;
};

/**
 * @return {number|undefined}
 */
OlcsControl.prototype.getTiltOnGlobe = function () {
  const scene = this.cesViewer_.getCesiumScene();
  const tiltOnGlobe = olcsCore.computeSignedTiltAngleOnGlobe(scene);
  return -tiltOnGlobe;
};

/**
 * @param {function()} callback
 */
OlcsControl.prototype.resetToNorthZenith = function (callback) {
  const scene = this.cesViewer_.getCesiumScene();
  const camera = scene.camera;
  const pivot = olcsCore.pickBottomPoint(scene);

  if (!pivot) {
    callback();
    return;
  }

  const currentHeading = this.getHeading();
  const angle = olcsCore.computeAngleToZenith(scene, pivot);

  // Point to North
  olcsCore.setHeadingUsingBottomCenter(scene, currentHeading, pivot);

  // Go to zenith
  const transform = Cesium.Matrix4.fromTranslation(pivot);
  const axis = camera.right;
  const options = { callback };
  olcsCore.rotateAroundAxis(camera, -angle, axis, transform, options);
};

OlcsControl.prototype.rotate = function (angle) {
  const view = this.cesViewer_.getOlView();
  const current = view.getRotation();
  view.animate({
    rotation: current + angle,
    duration: 250,
  });
};

/**
 * @param {number} angle
 */
OlcsControl.prototype.setHeading = function (angle) {
  const scene = this.cesViewer_.getCesiumScene();
  const bottom = olcsCore.pickBottomPoint(scene);
  if (bottom) {
    olcsCore.setHeadingUsingBottomCenter(scene, angle, bottom);
  }
};

/**
 * @param {number} angle
 */
OlcsControl.prototype.tiltOnGlobe = function (angle) {
  const scene = this.cesViewer_.getCesiumScene();
  const camera = scene.camera;
  const pivot = olcsCore.pickBottomPoint(scene);
  if (!pivot) {
    // Could not find the bottom point
    return;
  }

  const options = {};
  const transform = Cesium.Matrix4.fromTranslation(pivot);
  const axis = camera.right;
  const rotateAroundAxis = olcsCore.rotateAroundAxis;
  rotateAroundAxis(camera, -angle, axis, transform, options);
};

window["control"] = new OlcsControl(cesViewer); // eslint-disable-line no-unused-vars
