# js-transforms
A repo of codemods for javascript

## Setup
```
npm install -g jscodeshift
git clone https://github.com/ddrabik/js-transforms.git
jscodeshift -t <codemod-script> <file>
```

## Scripts

### gql-from-graphql-tag
[React Apollo 2.0](https://www.apollographql.com/docs/react/2.0-migration.html#install) requires `gql` to be imported from `graphql-tag` instead of `react-apollo`. 
