'use strict';
/*
 * Friendly date parsing for the invite builder.
 *
 * Accepts things people actually type ("12/20/2026", "Dec 20", "20 December",
 * "Sunday, December 20th", "2026-12-20") and returns a polished string such as
 * "Sunday, December 20th". Dates are built from their calendar parts so the
 * visitor's timezone can never shift the day. The weekday is always computed
 * from the date, so a wrong weekday typed by the user is corrected.
 *
 * Numeric dates are month/day/year (US). When no year is given, the next
 * occurrence of that date (today counts) is used.
 */
(function (root) {
  var MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
    'august', 'september', 'october', 'november', 'december'];

  function monthFromWord(word) {
    for (var i = 0; i < 12; i++) {
      if (word === MONTHS[i] || word === MONTHS[i].slice(0, 3) || (i === 8 && word === 'sept')) return i + 1;
    }
    return 0;
  }

  function ordinalSuffix(day) {
    if (day % 100 >= 11 && day % 100 <= 13) return 'th';
    return { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th';
  }

  // A real calendar date at noon (so DST edges never matter), or null.
  function realDate(year, month, day) {
    var d = new Date(year, month - 1, day, 12);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day ? d : null;
  }

  function normalize(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/^(?:sun(?:day)?|mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?)\.?[,\s]+/, '')
      .replace(/(\d)(?:st|nd|rd|th)\b/g, '$1')
      .replace(/,/g, '')
      .replace(/\s+/g, ' ');
  }

  function formatInviteDate(value, now) {
    now = now || new Date();
    var text = normalize(value);
    var m, year, month, day;

    if ((m = text.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/))) {
      year = m[1]; month = m[2]; day = m[3];
    } else if ((m = text.match(/^(\d{1,2})[-\/.](\d{1,2})(?:[-\/.](\d{4}|\d{2}))?$/))) {
      month = m[1]; day = m[2]; year = m[3];
    } else if ((m = text.match(/^([a-z]+)\.? (\d{1,2})(?: (\d{4}))?$/))) {
      month = monthFromWord(m[1]); day = m[2]; year = m[3];
    } else if ((m = text.match(/^(\d{1,2}) (?:of )?([a-z]+)\.?(?: (\d{4}))?$/))) {
      day = m[1]; month = monthFromWord(m[2]); year = m[3];
    } else {
      return null;
    }

    var yearOmitted = !year;
    year = yearOmitted ? now.getFullYear() : Number(year);
    if (year < 100) year += 2000;
    month = Number(month);
    day = Number(day);
    if (year < 1900 || year > 2199 || month < 1 || month > 12 || day < 1 || day > 31) return null;

    var date = realDate(year, month, day);
    if (yearOmitted) {
      // Roll forward to the next occurrence if this year's date has fully passed.
      // Looping lets Feb 29 find the next leap year.
      var tries = 0;
      while ((!date || new Date(year, month - 1, day + 1) <= now) && tries < 9) {
        year++; tries++;
        date = realDate(year, month, day);
      }
    }
    if (!date) return null;

    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date) +
      ordinalSuffix(day);
  }

  root.formatInviteDate = formatInviteDate;
  if (typeof module !== 'undefined' && module.exports) module.exports = { formatInviteDate: formatInviteDate };
})(typeof window !== 'undefined' ? window : globalThis);
