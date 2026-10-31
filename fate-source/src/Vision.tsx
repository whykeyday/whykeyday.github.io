export default function Vision({topic,label}:{chartKey:string;topic:string;label:string}){
 return <section className="vision"><div className="vision-art"><img src={import.meta.env.BASE_URL+'art/'+topic+'.png'} alt={label+'主题的玄学迷幻艺术图'} loading="lazy"/></div><div className="vision-caption"><div><h3>{label} · 星辰意象</h3><p>预先生成的主题艺术图，不是针对个人实时生成，也不代表现实预测。</p></div><a href={import.meta.env.BASE_URL+'art/'+topic+'.png'} download={label+'-意象图.png'}>保存图片</a></div></section>;
}
