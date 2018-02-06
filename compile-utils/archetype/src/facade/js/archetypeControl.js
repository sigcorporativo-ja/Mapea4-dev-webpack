import namespace from 'util/decorator';
import {{archetype.plugin.name}}ImplControl from 'impl/{{archetype.plugin.id}}Control';

@namespace("M.control")
export class {{archetype.plugin.name}}Control extends M.Control {

  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(M.impl.control.{{archetype.plugin.name}}Control)) {
      M.exception('La implementación usada no puede crear controles PluginControl');
    }
    // 2. implementation of this control
    let impl = new M.impl.control.{{archetype.plugin.name}}Control();
    super(impl, "{{archetype.plugin.name}}");
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
     return M.template.compile('{{archetype.plugin.id}}.html');
   }

   /**
    * @public
    * @function
    * @param {HTMLElement} html to add the plugin
    * @api stable
    * @export
    */
   getActivationButton(html) {
     return html.querySelector('button#m-{{archetype.plugin.id}}control-button');
   }
}
