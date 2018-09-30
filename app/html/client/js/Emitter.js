function Emitter () {
    var eventTarget = document.createDocumentFragment();
  
    function delegate (method) {
      this[method] = eventTarget[method].bind(eventTarget);
    }
  
    Emitter.methods.forEach(delegate, this);
  }
  
  Emitter.methods = ["addEventListener", "dispatchEvent", "removeEventListener"];