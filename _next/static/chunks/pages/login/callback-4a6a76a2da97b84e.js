(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[339],{9076:function(n,e,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/login/callback",function(){return t(6698)}])},6698:function(n,e,t){"use strict";t.r(e);var l=t(5893),i=t(7294),c=t(8244);function o(){let{passportClient:n}=(0,c.useImmutableProvider)(),e=async()=>{await (null==n?void 0:n.loginCallback());let e=await (null==n?void 0:n.getUserInfo());e&&(console.log("logged in email: ".concat(null==e?void 0:e.email)),window.ue5("print",{email:e.email}))};return(0,i.useEffect)(()=>{e()},[n]),(0,l.jsx)(l.Fragment,{})}class a extends i.Component{componentDidMount(){let n=document.createElement("script");n.src="/script.js",n.async=!0,document.body.appendChild(n)}render(){return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)("div",{children:[(0,l.jsx)("div",{children:"callback"}),(0,l.jsx)(o,{})]})})}}e.default=a}},function(n){n.O(0,[774,888,179],function(){return n(n.s=9076)}),_N_E=n.O()}]);