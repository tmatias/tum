import baseResource from 'resources/base-resource.js'

const _public = {};

_public.get = () => {
  return baseResource.get('data/signatories.json', {
    v: new Date().getTime()
  });
};

export default _public;
