import signatoriesResource from 'resources/signatories-resource'
import Alert from 'components/alert/alert-component'

const ITEM_TEMPLATE = `
  <li class="signatories-list-item">
    <div class="signatories-list-item-header">
      <a href="{profileUrl}" target="_blank">
        <span class="signatories-list-item-name">{name}</span>
      </a>
    </div>
    <div class="signatories-list-item-date">{date}</div>
  </li>
`;

export default class SignatoriesList {
  constructor(element){
    this.element = element;
  }
  init(){
    this.getSignatories();
  }
  getSignatories(){
    signatoriesResource.get()
      .then(response => {
        this.onGetSignatoriesComplete();
        this.onGetSignatoriesSuccess(response.data)
      }, () => {
        this.onGetSignatoriesComplete();
        this.onGetSignatoriesError();
      });
  }
  onGetSignatoriesComplete(){
    this.element.innerHTML = '';
  }
  onGetSignatoriesSuccess(signatories){
    const list = this.buildSignatoriesList(signatories);
    this.element.appendChild(list);
  }
  buildSignatoriesList(signatories){
    const listItems = this.buildSignatoriesListItems(signatories);
    const list = document.createElement('ul');
    list.classList.add('signatories-list');
    for (var i = 0; i < listItems.length; i++)
      list.appendChild(listItems[i]);
    return list;
  }
  buildSignatoriesListItems(signatories){
    const items = [];
    for (var i = 0; i < signatories.length; i++)
      items.push(this.buildSignatoriesListItemContent(signatories[i]));
    return items;
  }
  buildSignatoriesListItemContent(signatory){
    let content = this.buildSignatoriesListItemContentBase(signatory);
    return this.configListItemProfileUrl(content, signatory.profileUrl);
  }
  buildSignatoriesListItemContentBase(signatory){
    const parser = new DOMParser();
    let markup = ITEM_TEMPLATE.replace('{name}', signatory.name)
                              .replace('{date}', signatory.date)
                              .replace('{profileUrl}', signatory.profileUrl);
    const doc = parser.parseFromString(markup, 'text/html');
    return doc.querySelector('li');
  }
  configListItemProfileUrl(listItem, profileUrl){
    if(profileUrl)
      return this.appendProfileUrlOnListItem(listItem, profileUrl);
    return this.removeProfileUrlAnchorFromListItem(listItem);
  }
  appendProfileUrlOnListItem(listItem, profileUrl){
    const anchor = listItem.querySelector('a');
    anchor.setAttribute('href', profileUrl);
    return listItem;
  }
  removeProfileUrlAnchorFromListItem(listItem){
    const anchor = listItem.querySelector('a');
    const anchorChildren = anchor.children;
    for (var i = 0; i < anchorChildren.length; i++)
      anchor.parentElement.prepend(anchorChildren[i]);
    anchor.remove();
    return listItem;
  }
  onGetSignatoriesError(){
    const alert = new Alert('error', 'Something went wrong. Please, try again.');
    this.element.appendChild(alert);
  }
}
