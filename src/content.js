var main = function() {
  var _data_ = /^data:/i;
  var _data = /^data:audio\/midi/i;
  var _midi_kar_rmi = /\.(midi?|kar|rmi)$/i;
  var _mp3_wav_ogg = /\.(mp3|wav|ogg)$/i;
  var __midi = 'audio/midi';
  var __mpeg = 'audio/mpeg';
  var __ogg = 'audio/ogg';
  var __wav = 'audio/wav';

  function isTrue(str) {
    if (str == '') return true;
    str = str.toLowerCase();
    if (str == 'f' || str == 'false' || str == 0) return false;
    return !!str;
  }
  function getBool(x, a) {
    if (x && x.attributes && x.attributes[a]) return isTrue(x.attributes[a].nodeValue);
    return false;
  }
  function getAttr(x, a) {
    if (x && x.attributes && x.attributes[a]) return x.attributes[a].nodeValue;
    return '';
  }
  function getInt(x, a) {
    var n = getAttr(x, a);
    return n == parseInt(n) ? n : 0;
  }
  function isMidi(s, t) { return s.match(_data) || s.match(_midi_kar_rmi) || t ==__midi; }
  function isAudio(s, t) { return s.match(_mp3_wav_ogg) || t == __mpeg || t == __wav || t == __ogg; }

  function search() {
    var a, x, i, j, s, t, h, w;
    var added = false;
    var all = [];
    var src;
    a = document.getElementsByTagName('BGSOUND');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      s = getAttr(x, 'src');
      w = getAttr(x, 'loop');
      if (w.toLowerCase() == 'infinity' || w.toLowerCase() == 'infinite') w = -1;
      else if (w != parseInt(w) || w < 2) w = 0;
      if (isMidi(s)) {
        all.push({
          dom: x,
          type: 'bgsound',
          src: s,
          loop: w,
          auto: true,
          ctrl: false,
          h: 0,
          w: 0
        });
      }
    }
    a = document.getElementsByTagName('AUDIO');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      src = [];
      if (x.attributes && x.attributes.src) src.push([getAttr(x, 'src')]);
      if (x.children) {
        for (j = 0; j < x.children.length; j++) {
          if (x.children[j].nodeName == 'SOURCE' && x.children[j].attributes) {
            src.push([getAttr(x.children[j], 'src'), getAttr(x.children[j], 'type')]);
          }
        }
      }
      s = undefined;
      for (j = 0; j < src.length; j++) {
        if (isMidi(src[j][0], src[j][1])) {
          s = src[j][0]; break;
        }
        if (isAudio(src[j][0], src[j][1])) {
          break;
        }
      }
      if (s) {
        all.push({
          dom: x,
          type: 'audio',
          src: s,
          loop: getBool(x, 'loop') ? -1 : 0,
          auto: getBool(x, 'autoplay'),
          ctrl: getBool(x, 'controls'),
          h: x.clientHeight,
          w: x.clientWidth
        });
      }
    }
    a = document.getElementsByTagName('EMBED');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      s = getAttr(x, 'src');
      t = s ? getAttr(x.children[j], 'type') : undefined;
      if (isMidi(s, t)) {
        h = getInt(x, 'height');
        w = getInt(x, 'width');
        all.push({
          dom: x,
          type: 'embed',
          src: s,
          loop: 0,
          auto: getBool(x, 'autostart') || getBool(x, 'autoplay'),
          h: h,
          w: w,
          ctrl: true
        });
      }
    }
    a = document.getElementsByTagName('OBJECT');
    for (i = 0; i < a.length; i++) {
      x = a[i];
      s = getAttr(x, 'data');
      t = s ? getAttr(x.children[j], 'type') : undefined;
      if (isMidi(s, t)) {
        h = getInt(x, 'height');
        w = getInt(x, 'width');
        all.push({
          dom: x,
          type: 'object',
          src: s,
          loop: 0,
          auto: false,
          h: h,
          w: w,
          ctrl: true
        });
        if (x.children) {
          for (j = 0; j < x.children.length; j++) {
            if (x.children[j].nodeName == 'PARAM' && x.children[j].attributes) {
              if (getAttr(x.children[j], 'name') == 'loop') all[all.length - 1].loop = getAttr(x.children[j], 'value') || 0;
              if (getAttr(x.children[j], 'name') == 'autoplay') all[all.length - 1].auto = getBool(x.children[j], 'value');
              if (getAttr(x.children[j], 'name') == 'autostart') all[all.length - 1].auto = getBool(x.children[j], 'value');
            }
          }
        }
      }
    }
    a = document.links;
    var midisite = window.location.hostname.match(/midi/i);
    for (i = 0; i < a.length; i++) {
      if (a[i].dataset && a[i].dataset.jzzGuiPlayer) continue;
      if (!a[i].dataset) a[i].dataset = {};
      a[i].dataset.jzzGuiPlayer = true;
      if (midisite || a[i].href.match(_data) || a[i].href.match(_midi_kar_rmi)) {
        added = true;
        link(a[i]);
      }
    }
    if (all.length || added) init();
    for (i = 0; i < all.length; i++) create(all[i]);
  }
  function testMime(url, good, bad, ugly) {
    if (url.match(_data_)) {
      if (url.match(_data)) {
        good();
      }
      else {
        bad();
      }
    }
    else {
      var xhttp = new XMLHttpRequest();
      var received = false;
      xhttp.onreadystatechange = function() {
        if (this.readyState == this.HEADERS_RECEIVED || (this.readyState == this.DONE && !received)) {
          received = true;
          if (this.status == 200) {
            var type = this.getResponseHeader("Content-Type");
            var disposition = this.getResponseHeader("Content-Disposition");
            if (disposition && disposition[disposition.length - 1] == '"') disposition = disposition.substring(0, disposition.length - 1);
            if (type && type.match(__midi)) good();
            else if (disposition && disposition.match(_midi_kar_rmi)) good();
            else if (url.match(/^file:/i)) good();
            else bad();
          }
          else ugly();
          xhttp.abort();
        }
      };
      xhttp.open('HEAD', url, true);
      xhttp.send();
    }
  }
  function load(player, url, play, loop) {
    var isData = url.match(_data_);
    var div = player.gui;
    var title = isData ? 'data:audio/midi' : url;
    player.setUrl(url, isData ? 'midi-player.mid' : undefined);
    if (isData) {
      try {
        player.load(new JZZ.MIDI.SMF(JZZ.lib.fromBase64(url.substring(url.indexOf(',') + 1))));
        div.title = title;
        if (loop) player.loop(loop);
        if (play) player.play();
      }
      catch (e) {
        div.title = 'Cannot load ' + title;
      }
    }
    else {
      div.title = 'Loading ' + title;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (this.status == 200) {
            var r, i;
            var data = '';
            r = xhttp.response;
            if (r instanceof ArrayBuffer) {
              r = new Uint8Array(r);
              for (i = 0; i < r.length; i++) data += String.fromCharCode(r[i]);
            }
            else {
              r = xhttp.responseText;
              for (i = 0; i < r.length; i++) data += String.fromCharCode(r.charCodeAt(i) & 0xff);
            }
            try {
              player.load(new JZZ.MIDI.SMF(data));
              div.title = title;
              if (loop) player.loop(loop);
              if (play) player.play();
            }
            catch (e) {
              div.title = 'Cannot load ' + title;
            }
          }
          else {
            div.title = 'Cannot load ' + title;
          }
        }
      };
      try {
        xhttp.responseType = 'arraybuffer';
      }
      catch (e) {}
      xhttp.overrideMimeType('text/plain; charset=x-user-defined');
      xhttp.open('GET', url, true);
      xhttp.send();
    }
  }
  function link(a) {
    var busy = false;
    var player;
    var cancel = function() {
      a.removeEventListener('click', listener);
      a.click();
    };
    var proceed = function() {
      var r = a.getBoundingClientRect();
      var x = Math.round(r.left) - 32;
      if (x < 0) x = 0;
      if (x > document.documentElement.clientWidth - 270) x = document.documentElement.clientWidth - 270;
      var y = Math.round(r.top) - 32;
      if (y > document.documentElement.clientHeight - 40) y = document.documentElement.clientHeight - 40;
      if (y < 0) y = 0;
      player = new JZZ.gui.Player({ link: true, close: true, x: x, y: y });
      player.onClose = function() { busy = false; };
      load(player, a.href, true);
    }
    var listener = function(e) {
      e.preventDefault();
      if (busy) {
        if (player) player.play();
        return;
      }
      busy = true;
      testMime(a.href, proceed, cancel, cancel);
    };
    a.addEventListener('click', listener);
  }
  function create(x) {
    var player;
    var parent = x.dom.parentNode;
    var div;
    if (x.ctrl) {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.margin = '0px';
      div.style.padding = '0px';
      div.style.borderStyle = 'none';
      div.style.cursor = 'default';
      parent.insertBefore(div, x.dom);
      player = new JZZ.gui.Player({ at: div, link: true });
    }
    else {
      player = new JZZ.gui.Player({ link: true, close: true });
    }
    parent.removeChild(x.dom);
    load(player, x.src, x.auto, x.loop);
  }
  var init = function() {
    if (!window.JZZ) window.JZZ = _JZZ();
    if (!JZZ.synth || !JZZ.synth.Tiny) _Tiny();
    JZZ.synth.Tiny.register('Web Audio');
    JZZ().openMidiOut();
    if (!JZZ.MIDI.SMF) _SMF();
    if (!JZZ.gui || !JZZ.gui.Player) _Player();
    init = function() {};
  };
  search();
  setInterval(search, 500);
};

if (document instanceof HTMLDocument) {
  var code = main.toString();
  code = '(' + code.substring(0, code.lastIndexOf('}')) + ';' + _JZZ.toString() + _Tiny.toString() + _SMF.toString() + _Player.toString() + '})()';
  var script = document.createElement('script');
  script.textContent = '\n\n/// begin: [code injected by MIDI Player browser extension]\n' + code + '\n/// end: [code injected by MIDI Player browser extension]\n\n';
  document.documentElement.appendChild(script);
}
