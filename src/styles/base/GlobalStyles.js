import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: ${props => props.theme.fontRedHat};
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    text-rendering: geometricPrecision;
    font-smooth: always;
  }

  /* scrollar height and width */
  ::-webkit-scrollbar {
    height: 4px;
    width: 4px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.lighter};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primaryFocus};
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primaryFocus};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .d-flex {
    display: flex;
  }

  .flex-1 {
    flex: 1;
  }

  .basis-30 {
    flex-basis: 30%;
  }

  .basis-70 {
    flex-basis: 70%;
  }

  .flex-gap-1 {
    gap: 0.25rem;
  }

  .flex-gap-2 {
    gap: 0.5rem;
  }

  .d-none {
    display: none;
  }

  .flex-direction-column {
    flex-direction: column;
  }

  .flex-direction-row {
    flex-direction: row;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  .align-center {
    align-items: center;
  }

  .align-baseline {
    align-items: baseline;
  }

  .align-start {
    align-items: flex-start;
  }

  .align-self-start {
    align-self: flex-start;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .cursor-not-allowed {
    cursor: not-allowed;
  }

  /* text */
  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  .text-xsm {
    font-size: 0.85rem;
  }

  .text-sm {
    font-size: 0.875rem;
  }

  .text-md {
    font-size: 1rem;
  }

  .text-lg {
    font-size: 1.25rem;
  }

  .text-xl {
    font-size: 1.5rem;
  }

  .font-semibold {
    font-weight: 600;
  }

  .font-bold {
    font-weight: bold;
  }

  .break-all {
    word-break: break-all;
  }

  .text-center {
    text-align: center;
  }

  .text-capitalize {
    text-transform: capitalize;
  }

  /* height */
  .h-100 {
    height: 100%;
  }

  /* width */
  .w-100 {
    width: 100%;
  }

  .w-75 {
    width: 75%;
  }

  .w-50 {
    width: 50%;
  }

  .w-25 {
    width: 25%;
  }

  /* margins utility classes */
  .m-0 {
    margin: 0;
  }

  .m-1 {
    margin: 0.25rem;
  }

  .m-2 {
    margin: 0.5rem;
  }

  .mb-0 {
    margin-bottom: 0;
  }

  .mt-0 {
    margin-top: 0;
  }

  .mr-1 {
    margin-right: 0.25rem;
  }

  .mr-2 {
    margin-right: 0.5rem;
  }

  .mr-3 {
    margin-right: 0.75rem;
  }

  .mr-4 {
    margin-right: 1rem;
  }

  .mb-1 {
    margin-bottom: 0.25rem;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .mb-3 {
    margin-bottom: 0.75rem;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .mb-5 {
    margin-bottom: 1.5rem;
  }

  .ml-1 {
    margin-left: 0.25rem;
  }

  .ml-2 {
    margin-left: 0.5rem;
  }

  .ml-3 {
    margin-left: 0.75rem;
  }

  .ml-4 {
    margin-left: 1rem;
  }

  .ml-5 {
    margin-left: 1.25rem;
  }

  .ml-6 {
    margin-left: 1.5rem;
  }

  .mt-1 {
    margin-top: 0.25rem;
  }

  .mt-2 {
    margin-top: 0.5rem;
  }

  .mt-3 {
    margin-top: 0.75rem;
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .my-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .my-4 {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .mx-2 {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  .mx-4 {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .m-auto {
    margin: auto;
  }

  /* padding utility classes */
  .p-0 {
    padding: 0;
  }

  .p-1 {
    padding: 0.25rem;
  }

  .p-2 {
    padding: 0.5rem;
  }

  .p-4 {
    padding: 1rem;
  }

  .pb-0 {
    padding-bottom: 0;
  }
  .pe-1{
    padding-right: 0.25rem;
  }

  .pt-0 {
    padding-top: 0;
  }

  .pr-1 {
    padding-right: 0.25rem;
  }

  .pr-2 {
    padding-right: 0.5rem;
  }

  .pr-3 {
    padding-right: 0.75rem;
  }

  .pr-4 {
    padding-right: 1rem;
  }

  .pb-1 {
    padding-bottom: 0.25rem;
  }

  .pb-2 {
    padding-bottom: 0.5rem;
  }

  .pb-3 {
    padding-bottom: 0.75rem;
  }

  .pb-4 {
    padding-bottom: 1rem;
  }

  .pl-1 {
    padding-left: 0.25rem;
  }

  .pl-2 {
    padding-left: 0.5rem;
  }

  .pl-3 {
    padding-left: 0.75rem;
  }

  .pl-4 {
    padding-left: 1rem;
  }

  .pt-1 {
    padding-top: 0.25rem;
  }

  .pt-2 {
    padding-top: 0.5rem;
  }

  .pt-3 {
    padding-top: 0.75rem;
  }

  .pt-4 {
    padding-top: 1rem;
  }

  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

 /* Line-height */

  .line-height-110 {
    line-height: 110%;
  }

  img {
    object-fit: contain;
  }

  .bg-white {
    background: {props => props.theme.colors.white};
  }

  .bg-background {
    background: {props => props.theme.colors.background};
  }

  .rotate-icon {
    transform: rotate(135deg);
  }

  .break-word {
    word-break: break-word;
  }

  .border-top {
    border-top: 2px solid;
  }

  .border-grey {
    border-color: {props => props.theme.colors.darkGrey};
  }

  .nowrap {
    white-space: nowrap;
  }

  .inline-block {
    display: inline-block;
  }

  .gap-x-2 {
    column-gap: 0.5rem;
  }

  /* React Modal Classes */
  .ReactModal__Overlay {
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }

  .ReactModal__Overlay--after-open {
    opacity: 1;
  }

  .ReactModal__Overlay--before-close {
    opacity: 0;
  }

  .p-3{
    padding: 1rem;
  }

  .col-12 {
    width: 100%;
    float: left;
}
`;

export default GlobalStyle;
