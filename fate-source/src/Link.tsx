import React from 'react';
export default function Link({href,children,...props}:React.AnchorHTMLAttributes<HTMLAnchorElement>){return <a {...props} href={href==='/local'?'/fate/':href==='/library'?'/fate/?view=library':href}>{children}</a>}
