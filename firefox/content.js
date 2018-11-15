var main=function(){var u,n=/^data:audio\/midi/i,o=/\.mid$/i,a=/\.midi$/i,r=/\.kar$/i,l=/\.rmi$/i,h=/\.mp3$/i,m=/\.wav$/i,g=/\.ogg$/i,d="audio/midi",p="audio/mpeg",y="audio/ogg",f="audio/wav";function Z(e,t){return!!(e&&e.attributes&&e.attributes[t])&&(""==(n=e.attributes[t].nodeValue)||"f"!=(n=n.toLowerCase())&&"false"!=n&&0!=n&&!!n);var n}function b(e,t){return e&&e.attributes&&e.attributes[t]?e.attributes[t].nodeValue:""}function v(e,t){var n=b(e,t);return n==parseInt(n)?n:0}function w(e,t){return e.match(n)||e.match(o)||e.match(a)||e.match(r)||e.match(l)||t==d}function e(o){var i,a,e=o.dom.parentNode;i=o.ctrl?((a=document.createElement("div")).style.display="inline-block",a.style.margin="0px",a.style.padding="0px",a.style.borderStyle="none",a.style.cursor="default",e.insertBefore(a,o.dom),new JZZ.gui.Player(a)):new JZZ.gui.Player,e.removeChild(o.dom),a=i.gui;var r=o.src;if(r.match(n)){r="data:audio/midi";try{i.load(new JZZ.MIDI.SMF(JZZ.lib.fromBase64(o.src.substring(o.src.indexOf(",")+1)))),a.title=r,i.loop(o.loop),o.auto&&i.play()}catch(e){console.log(e.message?e.message:e),a.title="Cannot load "+r}}else{a.title="Loading "+r;var l=new XMLHttpRequest;l.onreadystatechange=function(){if(4==this.readyState)if(200==this.status){for(var e=l.responseText,t="",n=0;n<e.length;n++)t+=String.fromCharCode(255&e.charCodeAt(n));try{i.load(new JZZ.MIDI.SMF(t)),a.title=r,i.loop(o.loop),o.auto&&i.play()}catch(e){console.log(e.message?e.message:e),a.title="Cannot load "+r}}else a.title="Cannot load "+r},l.overrideMimeType("text/plain; charset=x-user-defined"),l.open("GET",o.src,!0),l.send()}}var t=function(){window.JZZ||(window.JZZ=_JZZ()),JZZ.synth&&JZZ.synth.Tiny||_Tiny(),JZZ.synth.Tiny.register("Web Audio"),JZZ().openMidiOut(),JZZ.MIDI.SMF||_SMF(),JZZ.gui&&JZZ.gui.Player||_Player(),t=function(){}};for(function(){var e,t,n,o,i,a,r,l,d,c,s=[];for(e=document.getElementsByTagName("BGSOUND"),n=0;n<e.length;n++)i=b(t=e[n],"src"),"infinity"==(r=b(t,"loop")).toLowerCase()?r=-1:(r!=parseInt(r)||r<2)&&(r=0),w(i)&&s.push({dom:t,type:"bgsound",src:i,loop:r,auto:!0,ctrl:!1,h:0,w:0});for(e=document.getElementsByTagName("AUDIO"),n=0;n<e.length;n++){if(l=[],(t=e[n]).attributes&&t.attributes.src&&l.push([b(t,"src")]),t.children)for(o=0;o<t.children.length;o++)"SOURCE"==t.children[o].nodeName&&t.children[o].attributes&&l.push([b(t.children[o],"src"),b(t.children[o],"type")]);for(i=void 0,o=0;o<l.length;o++){if(w(l[o][0],l[o][1])){i=l[o][0];break}if(d=l[o][0],c=l[o][1],d.match(h)||d.match(m)||d.match(g)||c==p||c==f||c==y)break}i&&s.push({dom:t,type:"audio",src:i,loop:Z(t,"loop")?-1:0,auto:Z(t,"autoplay"),ctrl:Z(t,"controls"),h:t.clientHeight,w:t.clientWidth})}for(e=document.getElementsByTagName("EMBED"),n=0;n<e.length;n++)w(i=b(t=e[n],"src"),i?b(t.children[o],"type"):void 0)&&(a=v(t,"height"),r=v(t,"width"),s.push({dom:t,type:"embed",src:i,loop:0,auto:Z(t,"autostart")||Z(t,"autoplay"),h:a,w:r,ctrl:!0}));for(e=document.getElementsByTagName("OBJECT"),n=0;n<e.length;n++)if(w(i=b(t=e[n],"data"),i?b(t.children[o],"type"):void 0)&&(a=v(t,"height"),r=v(t,"width"),s.push({dom:t,type:"object",src:i,loop:0,auto:!1,h:a,w:r,ctrl:!0}),t.children))for(o=0;o<t.children.length;o++)"PARAM"==t.children[o].nodeName&&t.children[o].attributes&&("loop"==b(t.children[o],"name")&&(s[s.length-1].loop=b(t.children[o],"value")||0),"autoplay"==b(t.children[o],"name")&&(s[s.length-1].auto=Z(t.children[o],"value")),"autostart"==b(t.children[o],"name")&&(s[s.length-1].auto=Z(t.children[o],"value")));u=s}(),u.length&&t(),i=0;i<u.length;i++)e(u[i]);u=[]};if(document instanceof HTMLDocument){var code=main.toString();code="("+code.substring(0,code.lastIndexOf("}"))+";"+_JZZ.toString()+_Tiny.toString()+_SMF.toString()+_Player.toString()+"})()";var script=document.createElement("script");script.textContent="\n\n/// begin: [code injected by MIDI Player browser extension]\n"+code+"\n/// end: [code injected by MIDI Player browser extension]\n\n",document.documentElement.appendChild(script)}