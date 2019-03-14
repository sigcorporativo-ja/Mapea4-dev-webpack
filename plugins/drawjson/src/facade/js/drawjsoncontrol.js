/**
 * @module M/control/DrawJSONControl
 */

import DrawJSONImplControl from 'impl/drawjsoncontrol';
import template from 'templates/drawjson';

export default class DrawJSONControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(layer) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(DrawJSONImplControl)) {
      M.exception('La implementación usada no puede crear controles DrawJSONControl');
    }
    // 2. implementation of this control
    const impl = new DrawJSONImplControl();
    super(impl, 'DrawJSON');
    this.layer_ = layer;
    window.addEventListener('featureadd', (e) => {
      layer.addFeatures(e.detail);
      window.alert(JSON.stringify(e.detail.getGeoJSON()));
    });
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    map.addLayers(this.layer_);
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      html.querySelectorAll('.drawCtrl').forEach(op => op.addEventListener('click', (evt) => {
        this.getImpl().draw(map, op.getAttribute('data-type'));
      }));

      html.querySelector('.m-miplugin-clean').addEventListener('click', (evt) => {
        this.layer_.clear();
        console.log('borradas features', this.layer_.getFeatures());
      });

      html.querySelector('.m-miplugin-export').addEventListener('click', (evt) => {
        this.layer_.getFeatures().forEach((f) => {
          console.log(f.getGeoJSON());
        });
      });
      success(html);
    });
  }

  /**
   * @public
   * @function
   * @param {M.Layer} layer to add the control
   * @api stable
   * @export
   */
  setLayer(layer) {
    this.layer_ = layer;
  }

  /**
   * @public
   * @function
   * @param {HTMLElement} html to add the plugin
   * @api stable
   * @export
   */
  getActivationButton(html) {
    return html.querySelector('button#m-drawjsoncontrol-button');
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof DrawJSONControl;
  }

  // Add your own functions
}
