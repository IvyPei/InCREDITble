import {AbsoluteFill, CanvasImage, staticFile, useCurrentFrame, spring} from 'remotion';
import {C, progress, Logo} from '../Shared';

/** Settle on the brand before returning to the pitch deck. */
export const StageOutro = () => {
  const f = useCurrentFrame();
  const wipe = progress(f, 0, 22);
  const mark = spring({frame: Math.max(0, f - 10), fps: 30, config: {damping: 15, stiffness: 110}});
  const headline = progress(f, 23, 45);
  const brand = progress(f, 39, 62);
  return <AbsoluteFill className="film" style={{overflow:'hidden',background:C.ink}}>
    <CanvasImage src={staticFile('stage-outro-freeze.png')} style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover'}} />
    <AbsoluteFill style={{background:C.ink,clipPath:`circle(${wipe * 125}% at 50% 44%)`}} />
    <div style={{position:'absolute',left:842,top:210,width:236,height:236,borderRadius:'50%',background:C.lime,display:'flex',alignItems:'center',justifyContent:'center',opacity:progress(f,10,20),transform:`scale(${mark}) rotate(${(1-mark)*-16}deg)`}}>
      <CanvasImage src={staticFile('wink.svg')} style={{width:182,height:182}} />
    </div>
    <div style={{position:'absolute',top:490,width:'100%',textAlign:'center',color:C.paper,fontSize:102,fontWeight:600,letterSpacing:'-.055em',opacity:headline,transform:`translateY(${(1-headline)*28}px)`}}>Start your bond journey.</div>
    <div style={{position:'absolute',top:651,width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:27,opacity:brand,transform:`translateY(${(1-brand)*18}px)`}}>
      <span style={{fontSize:44,color:'#C5B8D3'}}>with</span><Logo white width={490}/>
    </div>
    <div style={{position:'absolute',bottom:90,width:'100%',textAlign:'center',fontSize:24,color:'#C5B8D3',opacity:progress(f,65,82)}}>Prototype demo · No real money required</div>
  </AbsoluteFill>;
};
