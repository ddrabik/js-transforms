"use strict";

module.exports = function gqlFromGraphqlTag(file, api, options) {
  const j = api.jscodeshift;
  const collection = j(file.source);
  const printOptions = options.printOptions;

  // remove compose from import statements if compose is from react-apollo
  const composeFromReactApollo = collection
    .find(j.ImportDeclaration)
    .filter(path => path.value.source.value === "react-apollo")
    .find(j.ImportSpecifier)
    .filter(specifier => specifier.value.imported.name === "compose");

  // quit early if no compose is found
  if (!composeFromReactApollo.size()) {
    return collection.toSource(printOptions);
  }

  composeFromReactApollo.remove();

  // add the lodash replacement
  const apolloImport = collection
    .find(j.ImportDeclaration)
    .filter(path => path.value.source.value === "react-apollo")
    .get()

  apolloImport.insertAfter('import { flowRight as compose } from "lodash";')

  // remove react-apollo if its empty
  collection
    .find(j.ImportDeclaration)
    .filter(path => path.value.source.value === "react-apollo")
    .filter(path => path.node.specifiers.length === 0)
    .remove();

  return (collection.toSource(printOptions));
};
