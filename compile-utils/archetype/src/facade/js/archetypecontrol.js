import namespace from 'util/decorator';
import {{archetype.plugin.name}}ImplControl from 'impl/{{archetype.plugin.id}}control';

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
     let olmap = map.getMapImpl();
     let layer = new M.layer.Vector();
     map.addLayers(layer);
     return new Promise((success, fail) => {
     return M.template.compile('{{archetype.plugin.id}}.html').then(html => {
       let element1 = html.querySelector(".m-miplugin-punto");
       let element2 = html.querySelector(".m-miplugin-circulo");
       let element3 = html.querySelector(".m-miplugin-polygon");
       let element4 = html.querySelector(".m-miplugin-linea");
       let element5 = html.querySelector(".m-miplugin-nada");
       let element6 = html.querySelector(".m-miplugin-clean");
       element1.addEventListener("click", () => {
         let tipo = "Point";
         this.getImpl().draw(layer, olmap, tipo);
       });
       element2.addEventListener("click", () => {
         let tipo = "Circle";
         this.getImpl().draw(layer, olmap, tipo);
       });
       element3.addEventListener("click", () => {
         let tipo = "Polygon";
         this.getImpl().draw(layer, olmap, tipo);
       });
       element4.addEventListener("click", () => {
         let tipo = "LineString";
         this.getImpl().draw(layer, olmap, tipo);
       });
       element5.addEventListener("click", () => {
         let tipo = "None";
         this.getImpl().draw(layer, olmap, tipo);
       });
       element6.addEventListener("click", () => {
         let tipo = "Clean";
         this.getImpl().draw(layer, olmap, tipo);
       });
       success(html);
      });
    });
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
