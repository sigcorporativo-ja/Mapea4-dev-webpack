/**
 * @module M/plugin/DrawJSON
 */
import 'assets/css/drawjson';
import DrawJSONControl from './drawjsoncontrol';

export default class DrawJSON extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(layer) {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    // TODO: check if layers is compatible
    const layerParam = layer || new M.layer.Vector();
    this.layer_ = layerParam;
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.controls_.push(new DrawJSONControl(this.layer_));
    map.addLayers(this.layer_);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelmiplugin', {
      collapsible: true,
      position: M.ui.position.TR,
      className: 'm-miplugin',
      collapsedButtonClass: 'g-cartografia-editar2',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  setLayer(layer) {
    this.layer_ = layer;
    this.controls_.forEach(c => c.setLayer(layer));
  }

  getLayer() {
    return this.layer_;
  }
}
