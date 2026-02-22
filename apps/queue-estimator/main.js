'use strict;'

/**
 * @param {string} str
 * @param {number} len
 * @param {string} char
 */
function leftpad(str, len, char) {
  const padlen = len - str.length;
  if (padlen <= 0) {
    return str;
  }
  return char.repeat(padlen) + str;
}

/** Returns a mm:ss string representing a millisecond time delta.
 * 
 * @param {number} millis 
 */
function millisToDisplayString (millis) {
  if (millis <= 0) {
    return '00:00';
  }
  const secs = Math.floor(millis / 1000) % 60;
  const mins = Math.floor(millis / (1000*60)) % 60;
  return leftpad(mins.toString(), 2, '0')
    + ':'
    + leftpad(secs.toString(), 2, '0');
}

function calculateEstimates(state) {
  const n = state.laps.length;

  if (n < 5) {
    return {};
  }

  let sum = 0;
  let sumSq = 0;
  for (const lap of state.laps) {
    sum += lap;
    sumSq += lap * lap;
  }
  const avg = sum / n;
  const nAhead = state.myNum - state.curNum;
  const avgRem = nAhead * avg;

  if (n < 8) {
    return { avgRem };
  }

  const sampleStdev = Math.sqrt((sumSq - n * avg * avg) / (n - 1));
  const zScore = 1.645; /* =norminv(.95;0;1) */
  const aheadHalfSpread = zScore * sampleStdev * Math.sqrt(nAhead);

  return {
    avgRem,
    ciLo: avgRem - aheadHalfSpread,
    ciHi: avgRem + aheadHalfSpread,
  };
}

const estimator = {
  _appState: {
    curNum: 0,
    myNum: 100,
    laps: [],
    timerId: 0,
    timerStartMillis: 0,
  },
  _ui: undefined,
  _TIMERUPDATEMILLIS: 200,

  _populateUI() {
    if (this._ui) return;
    this._ui = {
      inCurNum: document.getElementById('estimator__current-number'),
      inMyNum: document.getElementById('estimator__my-number'),
      displayTimer: document.querySelector('.timer__display'),
      displayAvgRem: document.getElementById('estimator__avg-rem'),
      displayCiLo: document.getElementById('estimator__ci-lo'),
      displayCiHi: document.getElementById('estimator__ci-hi'),
      displayTimingData: document.querySelector('.timing-data'),
      btnToggleTimer: document.querySelector('.timer__start'),
      btnTimerLap: document.querySelector('.timer__lap'),
      warnYoureNext: document.querySelector('#youre-next'),
      warnYoureUp: document.querySelector('#youre-up'),
    };
  },

  render() {
    this._populateUI();

    if (this._appState.timerId === 0) {
      this._ui.displayTimer.textContent = millisToDisplayString(0);
      this._ui.btnToggleTimer.textContent = "Start";
      this._ui.btnTimerLap.disabled = true;
    } else {
      const t = Date.now();
      const delta = t - this._appState.timerStartMillis;
      this._ui.displayTimer.textContent = millisToDisplayString(delta);
      this._ui.btnToggleTimer.textContent = "Stop";
      this._ui.btnTimerLap.disabled = false;
    }

    /* updates disabled when element has focus to prevent user input being
      overriden */
    /* if !document.hasFocus(), the user is tabbed out */
    /* document.activeElement is the element, if any, that will receive
      user input if the document has focus */
    if (document.activeElement !== this._ui.inCurNum) {
      this._ui.inCurNum.value = this._appState.curNum;
    }
    if (document.activeElement !== this._ui.inMyNum) {
      this._ui.inMyNum.value = this._appState.myNum;
    }

    /* NOTE: maybe avoid rebuilding the full list?
      it doesn't seem to cause scroll jumps, so it's probably fine as-is */
    this._ui.displayTimingData.innerHTML =
      '<ol>'
      + this._appState.laps
        .map(millis => millisToDisplayString(millis))
        .map(displayString => `<li>${displayString}</li>`)
        .join('\n');
      + '</ol>';

    if (this._appState.myNum === this._appState.curNum + 1) {
      this._ui.warnYoureNext.classList.remove('displaynone');
      this._ui.warnYoureUp.classList.add('displaynone');
    } else if (this._appState.myNum === this._appState.curNum) {
      this._ui.warnYoureNext.classList.add('displaynone');
      this._ui.warnYoureUp.classList.remove('displaynone');
    } else {
      this._ui.warnYoureNext.classList.add('displaynone');
      this._ui.warnYoureUp.classList.add('displaynone');
    }

    const estimates = calculateEstimates(this._appState);
    if (estimates.avgRem !== undefined) {
      this._ui.displayAvgRem.textContent = millisToDisplayString(estimates.avgRem);
    }
    if (estimates.ciLo !== undefined) {
      this._ui.displayCiLo.textContent = millisToDisplayString(estimates.ciLo);
      this._ui.displayCiHi.textContent = millisToDisplayString(estimates.ciHi);
    }
  },

  toggleTimer() {
    this._populateUI();
    if (this._appState.timerId === 0) {
      this._appState.timerStartMillis = Date.now();
      this._appState.timerId = setInterval(() => this.render(), this._TIMERUPDATEMILLIS);
    } else {
      clearInterval(this._appState.timerId);
      this._appState.timerId = 0;
    }
    this.render();
  },

  advanceQueue() {
    const t = Date.now();
    const delta = t - this._appState.timerStartMillis;
    this._appState.laps.push(delta);
    this._appState.timerStartMillis = t;
    this._appState.curNum++;
    if (this._appState.curNum === this._appState.myNum) {
      clearInterval(this._appState.timerId);
      this._appState.timerId = 0;
    }
    this.render();
  },

  /** @param {Event} event  */
  updateQueue(event) {
    this._populateUI();
    /** @type {HTMLInputElement} */
    const elem = event.target;
    const value = parseInt(elem.value);
    if (isNaN(value)) {
      return;
    }
    if (elem === this._ui.inCurNum) {
      this._appState.curNum = value;
    } else if (elem === this._ui.inMyNum) {
      this._appState.myNum = value;
    }
    this.render();
  }
}
