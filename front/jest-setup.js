/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
require("@testing-library/jest-dom");
const { TextDecoder, TextEncoder } = require("node:util");

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
