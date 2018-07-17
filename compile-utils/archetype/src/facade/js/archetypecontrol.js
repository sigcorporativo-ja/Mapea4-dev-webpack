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
      M.exception('La implementación usada no puede crear controles {{archetype.plugin.name}}Control');
    }
    // 2. implementation of this control
    let impl = new M.impl.control.{{archetype.plugin.name}}Control();
    super(impl, "{{archetype.plugin.name}}");

    //captura de customevent lanzado desde impl con coords
    window.addEventListener("mapclicked", e => {
      this.map_.addLabel("Hola Mundo!", e.detail);
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
     return new Promise((success, fail) => {
      return M.template.compile('{{archetype.plugin.id}}.html').then(html => {
         /** Añadir código dependiente del DOM */
         success(html);
        });
    });
   }
  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    super.activate(); //calls super to manage de/activation
    let div = document.createElement("div");
    div.id = "msgInfo";
    div.classList.add("info");
    div.innerHTML = "Haz doble click sobre el mapa";
    this.map_.getContainer().appendChild(div);

    this.getImpl().activateClick(this.map_);
  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    super.deactivate(); //calls super to manage de/activation
    let div = document.getElementById("msgInfo");
    this.map_.getContainer().removeChild(div);

    this.getImpl().deactivateClick(this.map_);
  }
   /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api stable
   */
  getActivationButton(html) {
    return html.querySelector('.m-{{archetype.plugin.id}} button');
  };
  
  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof {{archetype.plugin.id}}Control;
  }

  //** Add your own functions */
}
