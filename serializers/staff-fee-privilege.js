const config = require('config');
const decamelize = require('decamelize');
const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const api = config.get('api');

// Read attributes from swagger and adjust them to match oracledb column names
const swagger = yaml.safeLoad(fs.readFileSync('./swagger.yaml', 'utf8'));
keys = _.keys(swagger.definitions.StaffFeePrivilegeRourceObject.properties.attributes.properties);
_.forEach(keys, (key, index) => {
  keys[index] = decamelize(key).toUpperCase();
});

module.exports = new JSONAPISerializer(
  'staffFeePrivileges',
  {
    attributes: keys,
    id: 'ID',
    keyForAttribute: 'camelCase',
    dataLinks: {
      self: (row) => `${api.endpointUri}/${api.name}/${row.ID}`
    }
  }
);
