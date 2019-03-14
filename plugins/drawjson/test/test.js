import DrawJSON from 'facade/drawjson';

const map = M.map({
  container: 'mapjs',
});

const mp = new DrawJSON();

map.addPlugin(mp);
