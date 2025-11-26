module.exports = `
h1 {
  font-family: initial;
  font-size: 30px;
  padding: 0.25em;
  background: #2196f3;
  color: #fff;
  font-weight: bold;
  width: fit-content;
  margin: 1em 0;
}

h1:first-child {
  margin-top: 0;
}

h1:last-child {
  margin-bottom: 0;
}

h2 {
  font-family: initial;
  font-size: 27px;
  font-weight: bold;
  padding-left: 0.3em;
  border-left: 0.3em #2196f3 solid;
  margin: 1em 0;
}

h2:first-child {
  margin-top: 0;
}

h2:last-child {
  margin-bottom: 0;
}

h3 {
  color: inherit;
  font-family: initial;
  font-size: 24px;
  font-weight: bold;
  width: fit-content;
  margin: 1em 0;
  background-size: 100% 0.6em;
  background-position: bottom;
  background-repeat: no-repeat;
  background-image: linear-gradient(to bottom, #2196f3, #2196f3);
}

h3:first-child {
  margin-top: 0;
}

h3:last-child {
  margin-bottom: 0;
}

h4 {
  font-family: initial;
  font-size: 21px;
  font-weight: bold;
  margin: 1em 0;
}

h4:first-child {
  margin-top: 0;
}

h4:last-child {
  margin-bottom: 0;
}

h5 {
  font-family: initial;
  font-size: 18px;
  font-weight: bold;
  margin: 1em 0;
}

h5:first-child {
  margin-top: 0;
}

h5:last-child {
  margin-bottom: 0;
}

h6 {
  font-family: initial;
  font-size: 15px;
  font-weight: bold;
  margin: 1em 0;
}

h6:first-child {
  margin-top: 0;
}

h6:last-child {
  margin-bottom: 0;
}

p {
  font-family: initial;
  font-size: 15px;
  line-height: 1.8em;
  line-break: break-word;
  text-align: justify;
  margin: 1em 0;
}

p:first-child {
  margin-top: 0;
}

p:last-child {
  margin-bottom: 0;
}

a {
  text-decoration: none;
  color: #2196f3;
}

a::after {
  content: '[↑]';
  font-size: 80%;
}

strong {
  color: #2196f3;
}

em {
  font-style: italic;
}

li {
  font-family: initial;
  font-size: 15px;
  line-height: 1.8em;
  line-break: break-word;
  text-align: justify;
  margin: 0.5em 0;
}

hr {
  border-color: #2196f3;
}

:not(pre) code {
  line-break: break-word;
  padding: 0.2em 0.4em;
  font-size: 85%;
  border-radius: 0.2em;
  background-color: rgba(33, 150, 243, 0.1);
}

pre {
  border-radius: 8px;
  font-size: 15px;
  margin: 1em 0;
  overflow: hidden;
}

pre:first-child {
  margin-top: 0;
}

pre:last-child {
  margin-bottom: 0;
}

blockquote {
  padding: 15px;
  background: rgba(33, 150, 243, 0.1);
  border-left: 4px #2196f3 solid;
  margin: 15px 0;
}

blockquote:first-child {
  margin-top: 0;
}

blockquote:last-child {
  margin-bottom: 0;
}

img {
  display: block;
  border-radius: 8px;
}

img:first-child {
  margin-top: 0;
}

img:last-child {
  margin-bottom: 0;
}

pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}

code.hljs {
  padding: 3px 5px
}

.gallery-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  margin: 15px 0;
}

.gallery-wrapper:first-child {
  margin-top: 0;
}

.gallery-wrapper:last-child {
  margin-bottom: 0;
}

.gallery {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  font-size: 0;
  border-radius: 8px;
  background: #121212;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.gallery-image-wrapper {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  scroll-snap-align: start;
}

.gallery-image-wrapper:not(:first-child) {
  margin-left: 8px;
}

.gallery-image-wrapper:not(:last-child) {
  margin-right: 8px;
}

.gallery-image {
  width: 100%;
}

.gallery img {
  max-width: unset;
  border-radius: 0;
  box-shadow: none;
}

.hljs {
  background: #1d1f21;
  color: #c5c8c6
}

.hljs span::selection,
.hljs::selection {
  background: #373b41
}

.hljs span::-moz-selection,
.hljs::-moz-selection {
  background: #373b41
}

.hljs-name,
.hljs-title {
  color: #f0c674
}

.hljs-comment,
.hljs-meta,
.hljs-meta .hljs-keyword {
  color: #707880
}

.hljs-deletion,
.hljs-link,
.hljs-literal,
.hljs-number,
.hljs-symbol {
  color: #c66
}

.hljs-addition,
.hljs-doctag,
.hljs-regexp,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-string {
  color: #b5bd68
}

.hljs-attribute,
.hljs-code,
.hljs-selector-id {
  color: #b294bb
}

.hljs-bullet,
.hljs-keyword,
.hljs-selector-tag,
.hljs-tag {
  color: #81a2be
}

.hljs-subst,
.hljs-template-tag,
.hljs-template-variable,
.hljs-variable {
  color: #8abeb7
}

.hljs-built_in,
.hljs-quote,
.hljs-section,
.hljs-selector-class,
.hljs-type {
  color: #de935f
}

.hljs-emphasis {
  font-style: italic
}

.hljs-strong {
  font-weight: 700
}
`;
