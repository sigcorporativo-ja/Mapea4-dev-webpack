/**
 * @module M/impl/control/DrawJSONControl
 */
export default class DrawJSONControl extends M.impl.Control {
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
    // obtengo la interacción por defecto del dblclick para manejarla
    const olMap = map.getMapImpl();
    olMap.getInteractions().forEach((interaction) => {
      if (interaction instanceof ol.interaction.DoubleClickZoom) {
        this.dblClickInteraction_ = interaction;
      }
    });

    // super addTo - don't delete
    super.addTo(map, html);
  }

  draw(map, type) {
    const olMap = map.getMapImpl();

    if (olMap != null) {
      // Se eliminan las interacciones de dibujado del mapa
      const interaction = olMap.getInteractions();
      const arrayIn = interaction.getArray();
      arrayIn.filter((element) => {
        return element instanceof ol.interaction.Draw;
      }).forEach(element => olMap.removeInteraction(element));

      if (type !== 'None') {
        // se crea una nueva interacción de dibujado
        // no establezco soruce ya que se delega la persistencia a fachada
        const draw = new ol.interaction.Draw({
          type,
        });

        // se captura el evento drawend para crear la Feature Mapea
        draw.on('drawend', (e) => {
          // transformo a geojson para a posteriori crear Feature Mapea
          // TODO: estudiar círculo, ya que geoJSON no los soporta
          const olFormatGeoJSON = new ol.format.GeoJSON();
          const geoJSONf = olFormatGeoJSON.writeFeatureObject(e.feature);
          const mFeat = new M.Feature(e.feature.id, geoJSONf);
          // disparo un custom event que tendrá la Feature Mapea
          const evt = new CustomEvent('featureadd', {
            detail: mFeat,
            bubbles: true,
          });
          map.getContainer().dispatchEvent(evt);
        });

        // se añade la interación al mapa
        olMap.addInteraction(draw);
      }
    }
  }
}
