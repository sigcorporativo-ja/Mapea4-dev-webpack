import namespace from 'util/decorator';
import drawJSONControl from './drawjsoncontrol.js';
import css from 'assets/css/drawjson.css';

@namespace("M.plugin")
class drawJSON extends M.Plugin {

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

    //TODO: check if layers is compatible
    if (typeof layer === 'undefined') layer = new M.layer.Vector();
    this.layer_ = layer;
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
    this.controls_.push(new M.control.drawJSONControl(this.layer_));
    map.addLayers(this.layer_);
    this.map_ = map;
   this.panel_ = new M.ui.Panel("panelmiplugin", {
     collapsible: true,
     position: M.ui.position.TR,
     className: "m-miplugin",
     collapsedButtonClass: "g-cartografia-editar2"
   });
   this.panel_.addControls(this.controls_);
   map.addPanels(this.panel_);
  }

  setLayer(layer){
    this.layer_ = layer;
    this.controls_.forEach(c => c.setLayer(layer));    
  }

  getLayer(){
    return this.layer_;
  }
}
