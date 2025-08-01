// This code is a Qiskit project.
//
// (C) Copyright IBM 2023.
//
// This code is licensed under the Apache License, Version 2.0. You may
// obtain a copy of this license in the LICENSE file in the root directory
// of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
//
// Any modifications or derivative works of this code must retain this
// copyright notice, and modified files need to carry a notice indicating
// that they have been altered from the originals.

import { expect, test } from "@playwright/test";

import { parseAnchors, parseLinks } from "./extractLinks.js";

test("parseAnchors()", () => {
  const result = parseAnchors(`
  # My top-level heading

  Some text that should be ignored.

  <span id="this-is-a-hardcoded-anchor" />
  <span id="another_span" >Some text</span>

  More text and [a link](https://docs.quantum.ibm.com)!

  ##### Header 2

  ## \`code-header\`

  ## Header.with periods-and wild! punctuation?? and numbers 1234 8 (parentheses)

  ## header_using\_underscores

  ## Header: With colon

  ## UpperCase Should Be lowercase

  ## repeated
  ## repeated
  ## repeated

  <Function id="mdx.component.testId" name="testId" signature="testId">
    Convert to dictionary.

    **Return type**

    \`Dict\`
  </Function>

  <Class>
      ### Header inside a component
  </Class>

  ### Click Run on (QPU name)

  ### Click "Run on (QPU name)"

  ### Click 'Run on (QPU name)'
  `);
  expect(result).toEqual(
    new Set([
      "#my-top-level-heading",
      "#header-2",
      "#code-header",
      "#headerwith-periods-and-wild-punctuation-and-numbers-1234-8-parentheses",
      "#header_using_underscores",
      "#header-with-colon",
      "#uppercase-should-be-lowercase",
      "#this-is-a-hardcoded-anchor",
      "#another_span",
      "#mdx.component.testId",
      "#header-inside-a-component",
      "#repeated",
      "#repeated-1",
      "#repeated-2",
      "#click-run-on-qpu-name",
      "#click-run-on-qpu-name-1",
      "#click-run-on-qpu-name-2",
    ]),
  );
});

test("parseLinks()", async () => {
  const markdown = `
    # A header
    Our [first link!](https://ibm.com) and, look, [another](./relative)!

    ![](/images/my_image.png)

    <a href="./explicit-anchor">Explicit anchor</a>
    `;
  const [internalLinks, externalLinks] = await parseLinks(markdown);
  expect(internalLinks).toEqual(
    new Set(["./relative", "/images/my_image.png", "./explicit-anchor"]),
  );
  expect(externalLinks).toEqual(new Set(["https://ibm.com"]));
});
