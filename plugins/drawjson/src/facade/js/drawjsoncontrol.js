import namespace from 'mapea-util/decorator';
import drawJSONImplControl from 'impl/drawjsoncontrol';

let layer_;

@namespace("M.control")
export class drawJSONControl extends M.Control {

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
    if (M.utils.isUndefined(M.impl.control.drawJSONControl)) {
      M.exception('La implementación usada no puede crear controles PluginControl');
    }
    // 2. implementation of this control
    let impl = new M.impl.control.drawJSONControl();
    super(impl, "drawJSON");
    this.layer_ = layer;
    //TODO: estudiar si asociarlo a window puede traer algún problema
    window.addEventListener("featureadd", e => {
      layer.addFeatures(e.detail);
      alert(JSON.stringify(e.detail.getGeoJSON()));
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
      return M.template.compile('drawjson.html').then(html => {

        html.querySelectorAll(".drawCtrl").forEach(op => op.addEventListener("click", () => {
          this.getImpl().draw(map, op.getAttribute('data-type'));
        }));

        html.querySelector(".m-miplugin-clean").addEventListener("click", () => {
          this.layer_.clear();
          console.log("borradas features", this.layer_.getFeatures());
        });

        html.querySelector(".m-miplugin-export").addEventListener("click", () => {
          this.layer_.getFeatures().forEach(f => {
            console.log(f.getGeoJSON());
          });
        });
        success(html);
      });
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
}
