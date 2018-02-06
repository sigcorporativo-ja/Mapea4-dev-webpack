  const namespace = (namespace) => {
    return (target) => {
      let namespaceArray = namespace.split(".");
      const constructObject = (namespaceArray, obj) => {
        if (namespaceArray.length > 0) {
          let name = namespaceArray[0];
          if (!obj[name]) {
            obj[name] = {};
          }
          constructObject(namespaceArray.splice(1), obj[name]);
        }
        else {
          obj[target.name] = target;
        }
        return obj;
      };
      let mainPath = namespaceArray[0];
      if (!window[mainPath]) {
        window[mainPath] = {};
      }
      constructObject(namespaceArray.splice(1), window[mainPath]);
    };
  };

  module.exports = namespace;
