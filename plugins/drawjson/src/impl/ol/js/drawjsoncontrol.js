import namespace from 'mapea-util/decorator';

@namespace("M.impl.control")
export class drawJSONControl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the drawJSONControl.
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor() {
    super();
  }
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    // specific code

    // super addTo
    super.addTo(map, html);
  }

  /**
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    M.dialog.info('Hello World!');
  }

  /**
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    M.dialog.info('Bye World!');
  }

  draw(map, type) {
    let olMap = map.getMapImpl();

    if (olMap != null) {
      //Se eliminan las interacciones de dibujado del mapa
      let interaction = olMap.getInteractions();
      let arrayIn = interaction.getArray();
      arrayIn.filter(element => {
        return element instanceof ol.interaction.Draw;
      }).forEach(element => olMap.removeInteraction(element));

      if (type != 'None') {
        //se crea una nueva interacción de dibujado
        //no establezco soruce ya que se delega la persistencia a fachada
        let draw = new ol.interaction.Draw({
          type: type
        });

        //se captura el evento drawend para crear la Feature Mapea
        draw.on("drawend", e => {
          //transformo a geojson para a posteriori crear Feature Mapea
          //TODO: estudiar círculo, ya que geoJSON no los soporta
          let olFormatGeoJSON = new ol.format.GeoJSON();
          let geoJSONf = olFormatGeoJSON.writeFeature(e.feature);
          let mFeat = new M.Feature(e.feature.id, geoJSONf);
          //disparo un custom event que tendrá la Feature Mapea
          let evt = new CustomEvent('featureadd', {
            detail: mFeat,
            bubbles: true
          });
          map.getContainer().dispatchEvent(evt);
        });

        //se añade la interación al mapa
        olMap.addInteraction(draw);
      }
    }
  }

}
