import namespace from 'util/decorator';

@namespace("M.impl.control")
export class {{archetype.plugin.name}}Control extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the {{archetype.plugin.name}}Control.
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

  draw(layer, mapjs, type) {
    this.layer_ = layer;
    let impl = this.layer_.getImpl();
    let source = impl.getOL3Layer().getSource();
    let vector = new ol.layer.Vector({
      source: source
    });

    if (mapjs != null) {
      let interaction = mapjs.getInteractions();
      let arrayIn = interaction.getArray();
      arrayIn.filter(function(element) {
        return element instanceof ol.interaction.Draw;
      }).forEach(element => mapjs.removeInteraction(element));

      if (type == "Clean") {
        source.clear();
      }

      if (type != 'None') {
        let draw = new ol.interaction.Draw({
          source: source,
          type: type
        });
        mapjs.addInteraction(draw);
      }
    }
  }
}
