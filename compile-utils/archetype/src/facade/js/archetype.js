/**
 * @module M/plugin/{{archetype.plugin.name}}
 */
import 'assets/css/{{archetype.plugin.id}}';
import {{archetype.plugin.name}}Control from './{{archetype.plugin.id}}control';

export default class {{archetype.plugin.name}} extends M.Plugin {
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
    this.controls_.push(new {{archetype.plugin.name}}Control());
    this.map_ = map;
    // panel para agregar control - no obligatorio
    this.panel_ = new M.ui.Panel('panel{{archetype.plugin.name}}', {
      collapsible: true,
      position: M.ui.position.TR,
      collapsedButtonClass: 'g-cartografia-flecha-izquierda',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
