import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//     font-family: "${(props) => props.theme.fontFamily}", sans-serif !important;
//   }

//   html {
//     scroll-behavior: smooth;
//   }

//   body {
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//     text-rendering: optimizeLegibility;
//     text-rendering: geometricPrecision;
//     font-smooth: always;
//   }

//   /* scrollar height and width */
//   ::-webkit-scrollbar {
//     height: 6px;
//     width: 6px;
//   }

//   /* Track */
//   ::-webkit-scrollbar-track {
//     background: transparent;
//   }

//   /* Handle */
//   ::-webkit-scrollbar-thumb {
//     background: var(--col-718EBF);
//     border-radius: 10px;
//   }

//   /* Handle on hover */
//   ::-webkit-scrollbar-thumb:hover {
//     background: var(--col-718EBF);
//   }

//   a {
//     color: inherit;
//     text-decoration: none;
//   }

//   .d-flex {
//     display: flex;
//   }

//   .flex-1 {
//     flex: 1;
//   }

//   .basis-30 {
//     flex-basis: 30%;
//   }

//   .basis-70 {
//     flex-basis: 70%;
//   }

//   .flex-gap-1 {
//     gap: 0.25rem;
//   }

//   .flex-gap-2 {
//     gap: 0.5rem;
//   }

//   .d-none {
//     display: none;
//   }

//   .flex-direction-column {
//     flex-direction: column;
//   }

//   .flex-direction-row {
//     flex-direction: row;
//   }

//   .flex-wrap {
//     flex-wrap: wrap;
//   }

//   .align-center {
//     align-items: center;
//   }

//   .align-baseline {
//     align-items: baseline;
//   }

//   .align-start {
//     align-items: flex-start;
//   }

//   .align-self-start {
//     align-self: flex-start;
//   }

//   .justify-center {
//     justify-content: center;
//   }

//   .justify-between {
//     justify-content: space-between;
//   }

//   .justify-end {
//     justify-content: flex-end;
//   }

//   .cursor-pointer {
//     cursor: pointer;
//   }

//   .cursor-not-allowed {
//     cursor: not-allowed;
//   }

//   /* text */
//   .text-right {
//     text-align: right;
//   }

//   .text-left {
//     text-align: left;
//   }

//   .text-xsm {
//     font-size: 0.85rem;
//   }

//   .text-sm {
//     font-size: 0.875rem;
//   }

//   .text-md {
//     font-size: 1rem;
//   }

//   .text-lg {
//     font-size: 1.25rem;
//   }

//   .text-xl {
//     font-size: 1.5rem;
//   }

//   .font-semibold {
//     font-weight: 600;
//   }

//   .font-bold {
//     font-weight: bold;
//   }

//   .break-all {
//     word-break: break-all;
//   }

//   .text-center {
//     text-align: center;
//   }

//   .text-capitalize {
//     text-transform: capitalize;
//   }

//   /* height */
//   .h-100 {
//     height: 100%;
//   }

//   /* width */
//   .w-100 {
//     width: 100%;
//   }

//   .w-75 {
//     width: 75%;
//   }

//   .w-50 {
//     width: 50%;
//   }

//   .w-25 {
//     width: 25%;
//   }

//   /* margins utility classes */
//   .m-0 {
//     margin: 0;
//   }

//   .m-1 {
//     margin: 0.25rem;
//   }

//   .m-2 {
//     margin: 0.5rem;
//   }

//   .mb-0 {
//     margin-bottom: 0;
//   }

//   .mt-0 {
//     margin-top: 0;
//   }

//   .mr-1 {
//     margin-right: 0.25rem;
//   }

//   .mr-2 {
//     margin-right: 0.5rem;
//   }

//   .mr-3 {
//     margin-right: 0.75rem;
//   }

//   .mr-4 {
//     margin-right: 1rem;
//   }

//   .mb-1 {
//     margin-bottom: 0.25rem;
//   }

//   .mb-2 {
//     margin-bottom: 0.5rem;
//   }

//   .mb-3 {
//     margin-bottom: 0.75rem;
//   }

//   .mb-4 {
//     margin-bottom: 1rem;
//   }

//   .mb-5 {
//     margin-bottom: 1.5rem;
//   }

//   .ml-1 {
//     margin-left: 0.25rem;
//   }

//   .ml-2 {
//     margin-left: 0.5rem;
//   }

//   .ml-3 {
//     margin-left: 0.75rem;
//   }

//   .ml-4 {
//     margin-left: 1rem;
//   }

//   .ml-5 {
//     margin-left: 1.25rem;
//   }

//   .ml-6 {
//     margin-left: 1.5rem;
//   }

//   .mt-1 {
//     margin-top: 0.25rem;
//   }

//   .mt-2 {
//     margin-top: 0.5rem;
//   }

//   .mt-3 {
//     margin-top: 0.75rem;
//   }

//   .mt-4 {
//     margin-top: 1rem;
//   }

//   .my-2 {
//     margin-top: 0.5rem;
//     margin-bottom: 0.5rem;
//   }

//   .my-4 {
//     margin-top: 1rem;
//     margin-bottom: 1rem;
//   }

//   .mx-2 {
//     margin-left: 0.5rem;
//     margin-right: 0.5rem;
//   }

//   .mx-4 {
//     margin-left: 1rem;
//     margin-right: 1rem;
//   }

//   .mx-auto {
//     margin-left: auto;
//     margin-right: auto;
//   }

//   .m-auto {
//     margin: auto;
//   }

//   /* padding utility classes */
//   .p-0 {
//     padding: 0;
//   }

//   .p-1 {
//     padding: 0.25rem;
//   }

//   .p-2 {
//     padding: 0.5rem;
//   }

//   .p-4 {
//     padding: 1rem;
//   }

//   .pb-0 {
//     padding-bottom: 0;
//   }

//   .pt-0 {
//     padding-top: 0;
//   }

//   .pr-1 {
//     padding-right: 0.25rem;
//   }

//   .pr-2 {
//     padding-right: 0.5rem;
//   }

//   .pr-3 {
//     padding-right: 0.75rem;
//   }

//   .pr-4 {
//     padding-right: 1rem;
//   }

//   .pb-1 {
//     padding-bottom: 0.25rem;
//   }

//   .pb-2 {
//     padding-bottom: 0.5rem;
//   }

//   .pb-3 {
//     padding-bottom: 0.75rem;
//   }

//   .pb-4 {
//     padding-bottom: 1rem;
//   }

//   .pl-1 {
//     padding-left: 0.25rem;
//   }

//   .pl-2 {
//     padding-left: 0.5rem;
//   }

//   .pl-3 {
//     padding-left: 0.75rem;
//   }

//   .pl-4 {
//     padding-left: 1rem;
//   }

//   .pt-1 {
//     padding-top: 0.25rem;
//   }

//   .pt-2 {
//     padding-top: 0.5rem;
//   }

//   .pt-3 {
//     padding-top: 0.75rem;
//   }

//   .pt-4 {
//     padding-top: 1rem;
//   }

//   .px-4 {
//     padding-left: 1rem;
//     padding-right: 1rem;
//   }

//  /* Line-height */

//   .line-height-110 {
//     line-height: 110%;
//   }

//   svg,
//   img {
//     max-width: 100%;
//   }

//   img {
//     object-fit: cover;
//   }

//   .bg-white {
//     background: ${(props) => props.theme.colors.white};
//   }

//   .bg-background {
//     background: ${(props) => props.theme.colors.background};
//   }

//   .rotate-icon {
//     transform: rotate(135deg);
//   }

//   .break-word {
//     word-break: break-word;
//   }

//   .border-top {
//     border-top: 2px solid;
//   }

//   .border-grey {
//     border-color: ${(props) => props.theme.colors.darkGrey};
//   }

//   .nowrap {
//     white-space: nowrap;
//   }

//   .inline-block {
//     display: inline-block;
//   }

//   .gap-x-2 {
//     column-gap: 0.5rem;
//   }

//   /* React Modal Classes */
//   .ReactModal__Overlay {
//     opacity: 0;
//     transition: opacity 300ms ease-in-out;
//   }

//   .ReactModal__Overlay--after-open {
//     opacity: 1;
//   }

//   .ReactModal__Overlay--before-close {
//     opacity: 0;
//   }

// New CSS

:root{
    --col-primary: #E32235;
    --col-darker: #444445;
    --col-lighter: #FDEEEE;
    --col-subtle: #F7FAFC;
    --col-white: #FFFFFF;
    --col-E9E0E0: #E9E0E0;
    --col-DDE4F0: #DDE4F0;
    --col-C52B2B: #C52B2B;
    --col-4B5564: #4B5564;
    --col-EFF1F3: #EFF1F3;
    --col-F1F5FF: #F1F5FF;
    --col-FEFBEC: #FEFBEC;
    --col-EEF9FB: #EEF9FB;
    --col-C4CDD5: #C4CDD5;
    --col-FDF3FC: #FDF3FC;
    --col-919EAB: #919EAB;
    --col-FFF7ED: #FFF7ED;
    --col-F0F0F2: #F0F0F2;
    --col-EEF8FF: #EEF8FF;
    --col-EEF0F4: #EEF0F4;
    --col-2D343F: #2D343F;
    --col-DFE3E8: #DFE3E8;
    --col-FBFDFF: #FBFDFF;
    --col-4C5055: #4C5055;
    --col-D7D7D7: #D7D7D7;
    --col-0CBF59: #0CBF59;
    --col-444445:#444445;
    --model-heading:#2D343F;
    --bg-transparent:transparent;
    --col-D18A4F: #D18A4F;
    --col-E2985A: #E2985A;
    --col-EEAC76: #EEAC76;
    --col-F5B885: #F5B885;
    --col-F1BF95: #F1BF95;
    --col-A8FF74: #A8FF74;
    --col-FFBD8D: #FFBD8D;
    --col-A8FF74: #A8FF74;
    --col-8AF848: #8AF848;
    --col-79E737: #79E737;
    --col-69D526: #69D526;
    --col-50CE03: #50CE03;
    --col-333333: #333333;
    --col-4A4543: #4a4543;
    --col-425466: #425466;
    --col-7A7A9D: #7a7a9d;
    --col-757575: #757575;
    --col-DE4849: #de4849;
    --col-8A8A8A: #8a8a8a;
    --col-EAEAEA: #eaeaea;

    /* adarsh-code */
    --col-444444: #444444;
    --col-F5F7FA: #F5F7FA;

    /* state color */
    --col-error: #FF0000;
    --col-warning: #F3C652;
    --col-info: #0066FF;
    --col-success: #06C270;

    /* light color */
    --col-light1: #F5F7FA;
    --col-light2: rgba(216, 216, 216, 0.2);
    --col-light3: #F3FAFF;

    /* dark color */
    --col-dark1: #E0D3D3;
    --col-dark2: #B5B5BD;

    /*font size and weight */
    --f-10: 10px;
    --f-12: 12px;
    --f-13: 13px;
    --f-14: 14px;
    --f-16: 16px;
    --f-17: 17px;
    --f-18: 18px;
    --f-20: 20px;
    --f-26: 26px;
    --f-28: 28px;
    --f-32: 32px;
    --f-36: 36px;
    --f-42: 42px;
    --f-48: 48px;

    --fw-400: 400;
    --fw-500: 500;
    --fw-600: 600;
    --fw-700: 700;

    --col-Noto: "Noto Sans", sans-serif;
    --col-red-hat: "Red Hat Display", sans-serif;

}
body{
    font-family: var(--col-red-hat);
    font-optical-sizing: auto;
    font-weight: var(--fw-500);
    font-style: normal;
}
.cursor-pointer{
    cursor: pointer;
}

/* breadcrumb css starts */
.breadcrumb-container{
    font-size: var(--f-12);
    font-weight: var(--fw-700);
    line-height: 14px;
    letter-spacing: -0.01em;
    color: var(--col-darker);
}
.breadcrumb-container .active{
    color: var(--col-C52B2B);
}
/* breadcrumb css ends */

/* scrool css starts */
::-webkit-scrollbar {
    height: 4px;
    width: 4px;
}
/* Track */
::-webkit-scrollbar-track {
    background-color: var(--col-lighter);
}
/* Handle */
::-webkit-scrollbar-thumb {
    background-color: var(--col-C52B2B);
    border-radius: 10px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background-color: var(--col-C52B2B);
}
/* scroolar css ends */

/* serach box css starts */
.seacrh-box-container .seacrh-box{
    background-color: var(--col-light1);
    border-radius: 4px;
    border: 1px solid var(--col-DDE4F0);
    padding: 15px 8px;
    gap: 8px;
    height: 50px;
}
.search-box-bar{
    background-color: transparent;
}
.search-box-bar:focus-visible{
    outline: none !important;
}
.search-box-bar::placeholder{
    font-size: var(--f-16);
    font-weight: var(--fw-500);
    line-height: 21.17px;
    letter-spacing: 0.01em;
    color: var(--col-dark2);
}
/* search box css ends */

.dropdown-toggle::after{
    display: none !important;
}

/* main-view-layout */
.main-view-area {
    height: calc(100vh - 78px);
    overflow: hidden;
}
.main-view-area .main-space{
    height: calc(100vh - 78px);
    width: calc(100vw - 250px);
    overflow: hidden;
    padding: 37px 50px 22px 20px;
}
.main-view-area .main-space .main-title-div{
    gap: 10px;
}
.main-view-area .main-space .main-title-div h4{
    font-family: var(--col-Noto);
    font-size: var(--f-20);
    font-weight: var(--fw-600);
    line-height: 27.24px;
    color: var(--col-darker);
}
.main-view-area .main-space .dropdown-div{
    gap: 10px;
}

/* custom-dropdown */
.custom-dropdown-1 .dropdown-toggle{
    gap: 13px;
    height: 37px;
    padding: 10px 12px 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--col-DDE4F0);
    background-color: var(--col-light1);
}
.custom-dropdown-1 .dropdown-toggle.show .arrow-div svg{
    transform: rotate(180deg);
}
.custom-dropdown-1 .text-span-set{
    gap: 3px;
    font-family: var(--col-Noto);
    font-size: var(--f-14);
    font-weight: var(--fw-500);
    line-height: 24px;
    letter-spacing: 0.01em;
    color: var(--col-4B5564);
}
.custom-dropdown-1 .dropdown-menu{
    box-shadow: 0px 0px 5px 0px rgba(156, 131, 131, 0.15);
    border-radius: 6px;
    min-width: auto !important;
}
.custom-dropdown-1 .dropdown-menu li{
    height:34px;
    padding: 8px;
    gap: 10px;
    font-family: var(--col-Noto);
    font-size: var(--f-13);
    font-weight: var(--fw-500);
    line-height: 17.71px;
    letter-spacing: 0.005em;
    color: var(--col-4B5564);
    transition: all ease-in-out 0.3s;
}
.custom-dropdown-1 .dropdown-menu li:hover{
    background-color: var(--col-EFF1F3);
}
.custom-dropdown-1 .floating-label{
    font-family: var(--col-Noto);
    font-size: var(--f-10);
    font-weight: var(--fw-500);
    line-height: 24px;
    letter-spacing: 0.01em;
    top: -22px;
    left: 0px;
    color: var(--col-4B5564);
}

/* buttons */
.btn-primary{
    background-color: var(--col-C52B2B);
    font-family: var(--col-Noto);
    font-size: var(--f-14);
    font-weight: var(--fw-700);
    line-height: 14px;
    color: var(--col-white);
    height: 37px;
    gap: 2px;
    border-radius: 5px;
    padding: 13px 8px;
    cursor: pointer;
}
.btn-primary.disabled, .btn-secondary.disabled{
    opacity: 0.5;
}
.btn-secondary{
    background-color: var( --bg-transparent);
    font-family: var(--col-Noto);
    font-size: var(--f-14);
    font-weight: var(--fw-700);
    line-height: 14px;
    color:var(--col-darker) ;
    height: 37px;
    gap: 2px;
    border-radius: 5px;
    padding: 13px 8px;
    cursor: pointer;
    border: 1px solid var(--col-444445);
}
@media screen and (max-width: 991.8px) {
    .main-view-area .main-space{
        width: calc(100vw - 00px);
        padding: 37px 23px 22px 100px;
    }
}


`;

export default GlobalStyle;
