import components from './components'

function init(){
  initComponents();
}

function initComponents(){
  const componentWrappers = document.querySelectorAll('[data-component]');
  for (var i = 0; i < componentWrappers.length; i++)
    initComponent(componentWrappers[i]);
}

function initComponent(componentWrapper){
  const name = getComponentName(componentWrapper);
  const component = new components[name](componentWrapper);
  component.init();
}

function getComponentName(componentWrapper){
  return componentWrapper.getAttribute('data-component');
}

init();
