import Input from "./input";

export default class FileInput extends Input {
  _onChange(e) {
    const file = e.target.files[0]
    const fileReader = new FileReader();
    const thiz = this;
    fileReader.onload = function(fileLoadedEvent){
        const textFromFileLoaded = fileLoadedEvent.target.result;
        thiz.set(textFromFileLoaded);
        thiz.options.onChange();
    };
  
    fileReader.readAsText(file, "UTF-8");
  }

  value() {
    if (!('__bs_data' in window)) {
      window.__bs_data = {}
    }
    return window.__bs_data[this.dataKey()]
  }

  set(value) {
    if (!('__bs_data' in window)) {
      window.__bs_data = {};
    }
    window.__bs_data[this.dataKey()] = value;
  }

  dataKey() {
    return this.id() + "-value";
  }

  createElement() {
    const element = super.createElement();
    const input = element.querySelector("input")
    input.addEventListener("input", this._onChange.bind(this));
    input.checked = this.options.defaultValue;
    if (this.options.accept) {
      input.accept = this.options.accept;
    }
    input.type = "file";
    return element
  }

  getValue() {
    const value = this.value();
    if (value) {
      return value;
    } else {
      return this.options.defaultValue;
    }
  }
}