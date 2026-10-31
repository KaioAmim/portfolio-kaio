import { siReact, siJavascript, siPhp, siNodedotjs, siMysql, siHtml5, siCss, siGit, siDocker, siLinux } from 'simple-icons';
import { Database, Network, ShieldCheck, Terminal, Code2 } from 'lucide-react';
const icons = { React:siReact, JavaScript:siJavascript, PHP:siPhp, 'Node.js':siNodedotjs, MySQL:siMysql, HTML:siHtml5, CSS:siCss, 'HTML & CSS':siHtml5, 'Git & GitHub':siGit, Git:siGit, Docker:siDocker, Linux:siLinux };
export const tagColors = {JavaScript:'js',CSS:'css',HTML:'html','HTML & CSS':'html',PHP:'php',MySQL:'mysql',React:'react','Node.js':'node','REST API':'api'};
export default function TechIcon({name,size=22}) {const icon=icons[name];if(icon)return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={icon.path}/></svg>;const Icon={SQL:Database,'APIs REST':Network,CRUD:Database,Autenticação:ShieldCheck,'Active Directory':Network,Terminal}[name]||Code2;return <Icon size={size} aria-hidden="true"/>;}
