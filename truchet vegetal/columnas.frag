// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// /https://www.shadertoy.com/view/WdKXRV
//https://www.shadertoy.com/view/ttXXD8

float circle(in vec2 _st,in float _radius){
    vec2 l=_st;//-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*.01),
    _radius+(_radius*.09),
    dot(l,l)*4.);
}

float box(vec2 _st,vec2 _size,float _smoothEdges){
    _size=vec2(.5)-_size*.5;
    vec2 aa=vec2(_smoothEdges*.5);
    vec2 uv=smoothstep(_size,_size+aa,_st);
    uv*=smoothstep(_size,_size+aa,vec2(1.)-_st);
    return uv.x*uv.y;
}

vec2 rotacion(vec2 pos,float cantidad){
    return pos*mat2(cos(cantidad),sin(cantidad),-sin(cantidad),cos(cantidad));
}

float random(vec2 st){
    return fract(sin(dot(st.xy,
                vec2(12.9898,78.233)))*
            43758.5453123);
        }
        float noise(in vec2 st){
            vec2 i=floor(st);
            vec2 f=fract(st);
            
            // Four corners in 2D of a tile
            float a=random(i);
            float b=random(i+vec2(1.,0.));
            float c=random(i+vec2(0.,1.));
            float d=random(i+vec2(1.,1.));
            
            // Smooth Interpolation
            
            // Cubic Hermine Curve.  Same as SmoothStep()
            vec2 u=f*f*(3.-2.*f);
            // u = smoothstep(0.,1.,f);
            
            // Mix 4 coorners percentages
            return mix(a,b,u.x)+
            (c-a)*u.y*(1.-u.x)+
            (d-b)*u.x*u.y;
        }
        
        vec2 random2(vec2 st){
            st=vec2(dot(st,vec2(127.1,311.7)),
            dot(st,vec2(269.5,183.3)));
            return-1.+2.*fract(sin(st)*43758.5453123);
        }
        float noise2(vec2 st){
            vec2 i=floor(st);
            vec2 f=fract(st);
            
            vec2 u=f*f*(3.-2.*f);
            
            return mix(mix(dot(random2(i+vec2(0.,0.)),f-vec2(0.,0.)),
            dot(random2(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
            mix(dot(random2(i+vec2(0.,1.)),f-vec2(0.,1.)),
            dot(random2(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);
        }
        
        /////
        void main(){
            float div=4.;
            float distancia=.249;
            vec2 st=gl_FragCoord.xy/u_resolution.xy;
            st.x*=u_resolution.x/u_resolution.y;
            vec2 uv=st;
            vec2 ipos=floor(st*div);
            vec2 id=floor(st*div)/div+.2;
            vec2 id_div=floor(st*10.)/10.;
            
            float damero=mod(ipos.s+ipos.t,2.);
            float dameroInvert=1.-damero;
            
            float forma=sin(st.x+sin(st.x))*cos(st.y);
            
            id+=vec2(u_time*.0000001);//podria agregarle random
            
            float columnas=mod(ipos.s,2.);
            vec2 st2=st;
            
            st2.x+=u_time*.25;
            st-=.5;
            st=rotacion(st,columnas*PI*.50);
            
            st+=.5;
            st*=div;
            
            st=fract(st);
            
            float diametro=4.008;
            forma=circle(st,diametro);
            forma-=circle(st,diametro-.5);
            
            forma+=circle(1.-st,diametro);
            forma-=circle(1.-st,diametro-.5);
            
            // vec3 f= fract(vec3(forma));
            
            vec3 color=fract(vec3(forma));
            color=vec3(forma);
            // color.r*=fract(random(id));
            // color.g*=fract(random(id+0.1));
            // color.b*=fract(random(id-0.1));
            // if(  ==0.){
                vec3 pares=vec3(damero*color*vec3(.900,.980,.164));
            // }
            vec3 impares=vec3(dameroInvert*(1.-color*vec3(.980,.933,.260)));
            
            // color=pares+impares;
            //     color*=1.50;
            color.r*=(noise2(uv+u_time*.05))+.5;
            color.g*=(noise2(uv+u_time*.05+.1))+.5;
            color.b*=(noise2(uv+u_time*.07-.1))+.5;
            
            // color=vec3(columnas);
            
            gl_FragColor=vec4(color,1.);
        }