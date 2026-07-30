"use client";
import {useEffect} from "react";
export default function SiteShell({html}:{html:string}){
 useEffect(()=>{const s=document.createElement("script");s.src="/script.js";s.defer=true;document.body.appendChild(s);return()=>{s.remove()}},[]);
 return <div dangerouslySetInnerHTML={{__html:html}}/>;
}
