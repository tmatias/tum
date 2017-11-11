const TEMPLATE = `
  <div class="alert {typeCssClass}">
    {message}
  </div>
`;

export default class Alert {
  constructor(type, message){
    this.type = type;
    this.message = message;
    return this.build();
  }
  build(){
    const parser = new DOMParser();
    let markup = TEMPLATE.replace('{typeCssClass}', this.getTypeCssClass(this.type))
                          .replace('{message}', this.message);
    const doc = parser.parseFromString(markup, 'text/html');
    return doc.querySelector('div');
  }
  getTypeCssClass(type){
    switch (type) {
      case 'error':
        return 'alert-error';
      case 'success':
        return 'alert-success';
      default:
        return '';
    }
  }
}
