import baseResource from 'resources/base-resource.js'

const _public = {};

_public.get = () => {
  return baseResource.get('data/signatories.json');
};

export default _public;
