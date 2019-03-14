import {{archetype.plugin.name}} from 'facade/{{archetype.plugin.id}}';

const map = M.map({
  container: 'mapjs',
});

const mp = new {{archetype.plugin.name}}();

map.addPlugin(mp);
