'use strict';
/*
 * Invite builder: turns church/event details into a QR code that opens a
 * pre-filled text message (recipient left blank) on an iPhone.
 * Everything runs in the browser; nothing is sent anywhere.
 */
(function () {
  var MAX_PNG_PX = 1600;   // target size of the downloaded PNG
  var QUIET_ZONE = 4;      // modules of white border (QR spec minimum)

  var $ = function (id) { return document.getElementById(id); };
  var generated = null;

  var els = {
    host: $('host'), event: $('event'), date: $('date'), time: $('time'), link: $('link'),
    message: $('message'), count: $('count'), error: $('error'), status: $('status'),
    empty: $('empty'), ready: $('ready'), qr: $('qr'), preview: $('preview'),
    result: $('result'), draft: $('draft'), generate: $('generate'), png: $('png')
  };

  /* ---------- helpers ---------- */

  function updateCount() {
    els.count.textContent = els.message.value.length + ' characters';
  }

  function showError(text) {
    els.error.textContent = text;
    els.status.textContent = '';
  }

  // Any edit to the message invalidates a QR code that was already made.
  function reset() {
    generated = null;
    els.ready.hidden = true;
    els.empty.hidden = false;
    els.error.textContent = '';
    els.status.textContent = '';
    updateCount();
  }

  function isValidLink(value) {
    try {
      var u = new URL(value);
      return (u.protocol === 'https:' || u.protocol === 'http:') &&
        u.hostname.indexOf('.') > 0 && !u.username && !u.password;
    } catch (e) {
      return false;
    }
  }

  // Lets people paste "dreamerschurch.com/visit" without the https://.
  function cleanLink(raw) {
    var v = raw.trim();
    if (v && !/^[a-z][a-z0-9+.-]*:/i.test(v) && /^[^\s\/]+\.[^\s\/]+/.test(v)) v = 'https://' + v;
    return v;
  }

  // Links at the end of a sentence often drag punctuation along with them.
  function linksIn(text) {
    return (text.match(/https?:\/\/[^\s]+/g) || []).map(function (u) {
      return u.replace(/[.,;:!?)\]}'"]+$/, '');
    });
  }

  /* ---------- step 1: draft the message ---------- */

  els.draft.addEventListener('click', function () {
    var host = els.host.value.trim();
    var event = els.event.value.trim();
    var date = formatInviteDate(els.date.value);
    var time = els.time.value.trim();
    var link = cleanLink(els.link.value);

    if (!host || !event || !date || !time || !isValidLink(link)) {
      showError('Add the church or host name, what you are inviting them to, a valid date, a time, and a full link first. Try a date like 12/20/2026.');
      return;
    }

    els.link.value = link;
    els.message.value =
      'Hey, are you free for ' + event + '? I’d love for you to come to ' + host + ' with me!\n\n' +
      'It’s ' + date + ' at ' + time + '. We can meet out front and go in together!\n\n' +
      'Here’s some more info:\n' + link;
    reset();
    els.status.textContent = 'Message built. Edit it any way you like, then create your QR code.';
  });

  els.message.addEventListener('input', reset);

  /* ---------- step 2: make the QR code ---------- */

  function buildSvg(qr) {
    var n = qr.getModuleCount();
    var size = n + QUIET_ZONE * 2;
    var path = '';
    for (var r = 0; r < n; r++) {
      var c = 0;
      while (c < n) {
        if (qr.isDark(r, c)) {
          var start = c;
          while (c < n && qr.isDark(r, c)) c++;
          path += 'M' + (start + QUIET_ZONE) + ' ' + (r + QUIET_ZONE) + 'h' + (c - start) + 'v1h-' + (c - start) + 'z';
        } else {
          c++;
        }
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size +
      '" shape-rendering="crispEdges" focusable="false" aria-hidden="true">' +
      '<rect width="' + size + '" height="' + size + '" fill="#fff"/>' +
      '<path d="' + path + '" fill="#000"/></svg>';
  }

  els.generate.addEventListener('click', function () {
    var message = els.message.value.trim();

    if (!message) {
      showError('Write your invitation first. Use “Build my message” or type your own.');
      return;
    }
    if (/\[(?:church or host name|event|date|time|event link)\]/i.test(message)) {
      showError('Replace the sample details with your actual invitation before creating a QR code.');
      return;
    }
    if (!linksIn(message).some(isValidLink)) {
      showError('Include the full link to your event details in the invitation text.');
      return;
    }

    try {
      // sms://open?addresses=&body=... opens Messages on iPhone with no recipient chosen.
      var payload = 'sms://open?addresses=&body=' + encodeURIComponent(message);
      var qr = qrcode(0, 'M');
      qr.addData(payload, 'Byte');
      qr.make();

      generated = { message: message, payload: payload, qr: qr };
      els.qr.innerHTML = buildSvg(qr);
      els.preview.textContent = message;
      els.ready.hidden = false;
      els.empty.hidden = true;
      els.error.textContent = '';
      els.status.textContent = 'QR ready. Test with your iPhone before sharing.';

      // On a phone the result sits below the form, so bring it into view.
      if (window.matchMedia('(max-width: 860px)').matches) {
        var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        els.result.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
      }
    } catch (e) {
      generated = null;
      showError('This message is too long for a clear QR code. Shorten it and try again.');
    }
  });

  /* ---------- download ---------- */

  function saveBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  els.png.addEventListener('click', function () {
    if (!generated) return;
    var qr = generated.qr;
    var n = qr.getModuleCount();
    var total = n + QUIET_ZONE * 2;
    var scale = Math.ceil(MAX_PNG_PX / total);
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = total * scale;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(r, c)) ctx.fillRect((c + QUIET_ZONE) * scale, (r + QUIET_ZONE) * scale, scale, scale);
      }
    }
    canvas.toBlob(function (blob) {
      if (blob) saveBlob(blob, 'dreamers-invitation-qr.png');
    }, 'image/png');
  });

  updateCount();
})();
