"use strict";

module.exports = function gqlFromGraphqlTag(file, api, options) {
  const j = api.jscodeshift;
  const collection = j(file.source);
  const printOptions = options.printOptions || {
    quote: "single",
    trailingComma: true
  };

  // remove gql from import statements if gql is from react-apollo
  const gqlFromReactApollo = collection
    .find(j.ImportDeclaration)
    .filter(path => path.value.source.value === "react-apollo")
    .find(j.ImportSpecifier)
    .filter(specifier => specifier.value.imported.name === "gql");

  // quit early if we arent using gql here
  if (!gqlFromReactApollo.size()) {
    return collection.toSource(printOptions);
  }

  gqlFromReactApollo.remove();

  // remove react-apollo if its empty
  collection
    .find(j.ImportDeclaration)
    .filter(path => path.value.source.value === "react-apollo")
    .filter(path => path.node.specifiers.length === 0)
    .remove();

  // find graphql-tag import statement
  const graphqlTagImport = collection
    .find(j.ImportDeclaration)
    .filter(path => path.value.source.value === "graphql-tag");

  if (!graphqlTagImport.size()) {
    // create one if it doesnt exist
    return (
      'import gql from "graphql-tag";\n\n' + collection.toSource(printOptions)
    );
  } else {
    // append gql to imports
    graphqlTagImport
      .at(0)
      .get()
      .value.specifiers.push(j.importSpecifier(j.identifier("gql")));
  }

  return collection.toSource(printOptions);
};
