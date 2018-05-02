import namespace from 'util/decorator';
import {{archetype.plugin.name }}Control from './{{archetype.plugin.id}}control.js';
import css from 'assets/css/{{archetype.plugin.id}}.css';

@namespace("M.plugin")
class {{archetype.plugin.name}} extends M.Plugin {

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
  constructor() {

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

    /**
     * add your variables
     *
     */

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
    this.controls_.push(new M.control.{{archetype.plugin.name}}Control());
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
}
