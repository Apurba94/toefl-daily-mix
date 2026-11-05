/* TOEFL Daily Mix: fifteen minutes a day across reading, listening, writing and vocabulary, with a streak. */
(function () {
  'use strict';
  const KEY = 'toefl-daily-mix.days';
  const today = (data, day) => {
    const seed = SK.daySeed('toefl-daily-mix', day), r = SK.rng(seed);
    const p = SK.pick(r, data.toefl_passages), c = SK.cTest(p.text, 8);
    const ctw = { id: 'dm-ctw-' + p.id, type: 'gaps', topic: 'Complete the Words', stem: 'Fill in the missing letters.', parts: c.parts, answer: c.answer, explanation: p.text };
    const resp = SK.sample(r, data.responses, 4).map((x) => SK.shuffleItem(r, { id: 'dm-cr-' + x.id, type: 'single', topic: 'Choose a Response', stem: 'Choose the best response.', audio: { title: 'Speaker', text: x.say }, choices: x.choices, answer: x.answer }));
    const build = SK.sample(r, data.build_sentences, 3).map((x) => SK.shuffleItem(r, { id: 'dm-bs-' + x.id, type: 'order', topic: 'Build a Sentence', stem: 'Put the words in order.', frame: x.context, answer: x.s.split(' ') }));
    return [ctw].concat(resp, build, SK.wordItems(data.academic_words, 5, seed, ['meaning', 'blank']));
  };
  const App = {
    about: 'Fifteen minutes, every day: one Complete the Words paragraph, four Listen and Choose a Response lines, three Build a Sentence items and five academic words. The set stays the same all day, and a streak counts the days in a row you finish it.',
    how: ['Open the app each day and press **Start**.', 'Turn the sound on for the listening items.', 'Missed items go to the TOEFL Error Log.'],
    tabs: [{ id: 'today', label: 'Today', render(el, ctx) {
      const days = SK.store.get(KEY, {}), d = SK.dayKey();
      el.appendChild(SK.card('Today\'s mix', SK.stats([['Day streak', SK.streak(Object.keys(days))], ['Days done', Object.keys(days).length], ['Today', days[d] ? days[d] + ' / 13' : 'Not yet']]),
        SK.btn(days[d] ? 'Do it again' : 'Start', () => SK.quiz(el, today(ctx.data, d), { title: 'TOEFL daily mix, ' + d, mode: 'practice', onFinish: (sum) => { const all = SK.store.get(KEY, {}); all[d] = Math.max(all[d] || 0, sum.correct); SK.store.set(KEY, all); } }), '', { 'data-auto': 'once' })));
    } }],
    today,
    checks: { 'thirteen valid items that stay the same all day': (data, assert) => {
      const a = today(data, '2026-11-05');
      assert.equal(a.length, 13);
      assert.deepEqual(a.map((x) => x.id), today(data, '2026-11-05').map((x) => x.id));
      for (const it of a) assert.deepEqual(SK.validateItem(it), []);
    } },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();
