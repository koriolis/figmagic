import { replaceMediaQuery } from '../bin/functions/helpers/replaceMediaQuery';

test('It should throw an error if no parameter is provided', () => {
  expect(() => {
    replaceMediaQuery();
  }).toThrow();
});
