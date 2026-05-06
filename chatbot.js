(function () {

  /* ── Styles ───────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #todo-chat-fab {
      position: fixed;
      bottom: 28px; right: 28px;
      width: 58px; height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; border: none;
      font-size: 1.55rem; cursor: pointer;
      box-shadow: 0 6px 24px rgba(99,102,241,0.45);
      display: flex; align-items: center; justify-content: center;
      z-index: 9998;
      transition: transform 0.22s ease, box-shadow 0.22s ease;
    }
    #todo-chat-fab:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 10px 30px rgba(99,102,241,0.55);
    }
    .fab-badge {
      position: absolute; top: -4px; right: -4px;
      background: #10b981; color: #fff;
      font-size: 0.6rem; font-weight: 700;
      padding: 2px 5px; border-radius: 999px;
    }
    #todo-chat-panel {
      position: fixed;
      bottom: 100px; right: 28px;
      width: 360px; max-height: 540px;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.18);
      display: flex; flex-direction: column;
      z-index: 9999;
      opacity: 0;
      transform: translateY(16px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.24s ease, transform 0.24s ease;
      overflow: hidden;
      border: 1px solid rgba(99,102,241,0.12);
    }
    .dark #todo-chat-panel {
      background: #1e2937;
      border-color: rgba(99,102,241,0.25);
    }
    #todo-chat-panel.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }
    #todo-chat-header {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; padding: 14px 18px;
      display: flex; align-items: center; gap: 10px;
      flex-shrink: 0;
    }
    .chat-header-avatar {
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem; flex-shrink: 0;
    }
    .chat-header-info { flex: 1; line-height: 1.3; }
    .chat-header-info strong { font-size: 0.95rem; display: block; }
    .chat-header-info span { font-size: 0.75rem; opacity: 0.82; }
    #todo-chat-close {
      background: rgba(255,255,255,0.15);
      border: none; color: #fff; border-radius: 8px;
      width: 30px; height: 30px; font-size: 1.1rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background 0.18s;
    }
    #todo-chat-close:hover { background: rgba(255,255,255,0.28); }
    #todo-chat-messages {
      flex: 1; overflow-y: auto;
      padding: 16px 14px;
      display: flex; flex-direction: column; gap: 10px;
      scroll-behavior: smooth;
    }
    #todo-chat-messages::-webkit-scrollbar { width: 4px; }
    #todo-chat-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
    .dark #todo-chat-messages::-webkit-scrollbar-thumb { background: #475569; }
    .tchat-bubble {
      display: flex; gap: 8px;
      max-width: 88%;
      animation: tchat-pop 0.2s ease;
    }
    @keyframes tchat-pop {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .tchat-bubble.user { align-self: flex-end; flex-direction: row-reverse; }
    .tchat-bubble.bot  { align-self: flex-start; }
    .tchat-avatar {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; font-size: 0.85rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 2px;
    }
    .tchat-text {
      padding: 10px 13px;
      border-radius: 14px;
      font-size: 0.88rem;
      line-height: 1.55;
    }
    .tchat-bubble.user .tchat-text {
      background: #6366f1; color: #fff;
      border-bottom-right-radius: 4px;
    }
    .tchat-bubble.bot .tchat-text {
      background: #f3f4f6; color: #1f2937;
      border-bottom-left-radius: 4px;
    }
    .dark .tchat-bubble.bot .tchat-text {
      background: #334155; color: #e2e8f0;
    }
    .tchat-chips {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 0 14px 10px;
    }
    .tchat-chip {
      font-size: 0.78rem; padding: 5px 11px;
      background: #ede9fe; color: #6d28d9;
      border: 1px solid #ddd6fe;
      border-radius: 999px; cursor: pointer;
      white-space: nowrap;
      transition: background 0.18s, transform 0.15s;
    }
    .dark .tchat-chip { background: #312e81; color: #c4b5fd; border-color: #4c1d95; }
    .tchat-chip:hover { background: #c4b5fd; transform: translateY(-1px); }
    .typing-dots { display: flex; gap: 4px; align-items: center; padding: 2px 0; }
    .typing-dots span {
      width: 6px; height: 6px; border-radius: 50%;
      background: #9ca3af; display: inline-block;
      animation: tdot 1.2s ease-in-out infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes tdot {
      0%,60%,100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-5px); opacity: 1; }
    }
    #todo-chat-input-bar {
      padding: 12px 14px;
      border-top: 1px solid #e5e7eb;
      display: flex; gap: 8px; align-items: center;
      flex-shrink: 0; background: #fff;
    }
    .dark #todo-chat-input-bar {
      border-top-color: #334155; background: #1e2937;
    }
    #todo-chat-input {
      flex: 1; border: 1.5px solid #d1d5db;
      border-radius: 10px; padding: 10px 13px;
      font-size: 0.88rem; outline: none;
      background: #fff; color: #1f2937;
      transition: border-color 0.18s;
    }
    .dark #todo-chat-input {
      background: #334155; border-color: #475569; color: #e2e8f0;
    }
    #todo-chat-input:focus { border-color: #6366f1; }
    #todo-chat-send {
      width: 38px; height: 38px;
      background: #6366f1; color: #fff;
      border: none; border-radius: 10px;
      font-size: 1.1rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: background 0.18s, transform 0.15s;
    }
    #todo-chat-send:hover { background: #4f46e5; transform: scale(1.05); }
    @media (max-width: 420px) {
      #todo-chat-panel { width: calc(100vw - 24px); right: 12px; bottom: 90px; }
      #todo-chat-fab   { bottom: 20px; right: 16px; }
    }
  `;
  document.head.appendChild(style);

  /* ── HTML ─────────────────────────────────── */
  document.body.insertAdjacentHTML('beforeend', `
    <button id="todo-chat-fab" aria-label="Open task assistant">
      🤖<span class="fab-badge">AI</span>
    </button>
    <div id="todo-chat-panel" role="dialog" aria-label="Task Assistant">
      <div id="todo-chat-header">
        <div class="chat-header-avatar">✦</div>
        <div class="chat-header-info">
          <strong>Task Assistant</strong>
          <span>Your smart to-do helper</span>
        </div>
        <button id="todo-chat-close" aria-label="Close">✕</button>
      </div>
      <div id="todo-chat-messages"></div>
      <div class="tchat-chips" id="todo-chat-chips"></div>
      <div id="todo-chat-input-bar">
        <input id="todo-chat-input" type="text" placeholder="Ask about your tasks…" autocomplete="off"/>
        <button id="todo-chat-send" aria-label="Send">➤</button>
      </div>
    </div>
  `);

  /* ── Task helpers ─────────────────────────── */
  function getTasks() {
    try {
      const session = localStorage.getItem('todo_session');
      const key = session ? 'tasks_' + JSON.parse(session).email.toLowerCase() : 'tasks';
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) { return []; }
  }

  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function isOverdue(d) { return d && d < todayStr(); }
  function isDueToday(d) { return d && d === todayStr(); }

  /* ── Smart reply engine ───────────────────── */
  function getReply(msg) {
    msg = msg.toLowerCase().trim();
    const tasks    = getTasks();
    const active   = tasks.filter(t => !t.completed);
    const done     = tasks.filter(t => t.completed);
    const high     = active.filter(t => t.priority === 'high');
    const medium   = active.filter(t => t.priority === 'medium');
    const low      = active.filter(t => t.priority === 'low');
    const overdue  = active.filter(t => isOverdue(t.dueDate));
    const dueToday = active.filter(t => isDueToday(t.dueDate));
    const names    = (list) => list.map(t => `• ${t.text}`).join('\n');

    if (/^(hi|hey|hello|heyy|yo|sup|wassup|howdy)/.test(msg))
      return `Hey! 👋 You have **${active.length} active task${active.length !== 1 ? 's' : ''}** right now. What would you like to know? 😊`;

    if (/how many|count|total|number of/.test(msg))
      return `📊 Task summary:\n• Total: **${tasks.length}**\n• Active: **${active.length}**\n• Completed: **${done.length}**\n• Overdue: **${overdue.length}**`;

    if (/done|complet|finish|progress/.test(msg)) {
      if (done.length === 0) return `You haven't completed any tasks yet. Keep going! 💪`;
      const pct = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
      return `🎉 **${done.length} task${done.length !== 1 ? 's' : ''}** completed — **${pct}%** of your list!\n${names(done.slice(0, 5))}${done.length > 5 ? `\n…and ${done.length - 5} more` : ''}`;
    }

    if (/today|due today/.test(msg)) {
      if (dueToday.length === 0) return `✅ Nothing is due today! Great time to get ahead.`;
      return `📅 Due **today** (${dueToday.length}):\n${names(dueToday)}`;
    }

    if (/overdue|late|missed|past due/.test(msg)) {
      if (overdue.length === 0) return `🎉 No overdue tasks! You're right on schedule.`;
      return `⚠️ **${overdue.length} overdue** task${overdue.length !== 1 ? 's' : ''}:\n${names(overdue)}\n\nTry tackling these first!`;
    }

    if (/high|urgent|important|critical/.test(msg)) {
      if (high.length === 0) return `No high-priority tasks right now. 👌`;
      return `🔴 **High priority** (${high.length}):\n${names(high)}`;
    }

    if (/medium|mid/.test(msg)) {
      if (medium.length === 0) return `No medium-priority tasks at the moment.`;
      return `🟡 **Medium priority** (${medium.length}):\n${names(medium)}`;
    }

    if (/\blow\b/.test(msg)) {
      if (low.length === 0) return `No low-priority tasks. Nice!`;
      return `🟢 **Low priority** (${low.length}):\n${names(low)}`;
    }

    if (/all|list|show|active|pending|remaining/.test(msg)) {
      if (active.length === 0) return `🎉 All tasks are done! You're a productivity machine!`;
      return `📋 **Active tasks** (${active.length}):\n${names(active)}`;
    }

    if (/next|what (should|to) (do|work)|suggest|recommend|focus|start/.test(msg)) {
      if (active.length === 0) return `All done! 🎉 Nothing left to do — enjoy the rest!`;
      const pick = overdue[0] || dueToday[0] || high[0] || medium[0] || active[0];
      const reason = overdue[0] ? '(overdue — do this first!)' : dueToday[0] ? '(due today)' : high[0] ? '(high priority)' : '';
      return `👉 I'd suggest working on:\n**"${pick.text}"** ${reason}\n\n${active.length - 1} other task${active.length !== 2 ? 's' : ''} remaining after this.`;
    }

    if (/add|create|new task|remind/.test(msg))
      return `To add a task, type it in the input box at the top of the page and hit **+**.\nYou can also set a due date and priority! 📝`;

    if (/delete|remove|clear/.test(msg))
      return `Click the 🗑️ button next to any task to delete it.\nUse **"Clear completed"** to bulk-remove all finished tasks.`;

    if (/motivat|help|stuck|overwhelm|tired|stress/.test(msg)) {
      return active.length > 5
        ? `You have ${active.length} tasks — try picking just **3 to focus on today**. Small wins build momentum! 💪`
        : `Only ${active.length} task${active.length !== 1 ? 's' : ''} left. You're almost there! 🚀`;
    }

    if (tasks.length === 0)
      return `Your task list is empty! Add your first task using the input at the top. 📋`;

    const fallbacks = [
      `I can help with: tasks due today, overdue items, priorities, progress, or what to do next. Just ask! 😊`,
      `Try: "What's overdue?", "Show high priority tasks", or "What should I do next?" 📋`,
      `Not sure what you mean! Ask me about overdue tasks, priorities, progress, or suggestions. 🤖`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  /* ── UI helpers ───────────────────────────── */
  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function formatBot(t) {
    return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
  }

  function appendMsg(role, text) {
    const c = document.getElementById('todo-chat-messages');
    const d = document.createElement('div');
    d.className = `tchat-bubble ${role}`;
    d.innerHTML = role === 'bot'
      ? `<div class="tchat-avatar">✦</div><div class="tchat-text">${formatBot(text)}</div>`
      : `<div class="tchat-text">${escapeHtml(text)}</div>`;
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
  }

  function showTyping() {
    const c = document.getElementById('todo-chat-messages');
    const d = document.createElement('div');
    d.className = 'tchat-bubble bot'; d.id = 'tchat-typing';
    d.innerHTML = `<div class="tchat-avatar">✦</div><div class="tchat-text"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
    c.appendChild(d); c.scrollTop = c.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('tchat-typing');
    if (el) el.remove();
  }

  function renderChips() {
    const bar = document.getElementById('todo-chat-chips');
    bar.innerHTML = '';
    ['What tasks are due today?', 'Show high priority tasks', 'What should I do next?', 'How many tasks done?']
      .forEach(label => {
        const b = document.createElement('button');
        b.className = 'tchat-chip';
        b.textContent = label;
        b.addEventListener('click', (e) => {
          e.stopPropagation();   // ← prevents outside-click from closing panel
          bar.innerHTML = '';
          sendMessage(label);
        });
        bar.appendChild(b);
      });
  }

  /* ── Send ─────────────────────────────────── */
  function sendMessage(text) {
    const input = document.getElementById('todo-chat-input');
    text = (text || input.value).trim();
    if (!text) return;
    input.value = '';
    appendMsg('user', text);
    showTyping();
    setTimeout(() => {
      removeTyping();
      appendMsg('bot', getReply(text));
    }, 500 + Math.random() * 400);
  }

  /* ── Init ─────────────────────────────────── */
  function init() {
    const fab   = document.getElementById('todo-chat-fab');
    const panel = document.getElementById('todo-chat-panel');
    const close = document.getElementById('todo-chat-close');
    const input = document.getElementById('todo-chat-input');
    const send  = document.getElementById('todo-chat-send');
    let   open  = false;

    function openPanel() {
      open = true; panel.classList.add('open');
      if (document.getElementById('todo-chat-messages').children.length === 0) {
        const active = getTasks().filter(t => !t.completed).length;
        appendMsg('bot', `Hey! 👋 You have **${active} active task${active !== 1 ? 's' : ''}** right now. What can I help you with?`);
        renderChips();
      }
      setTimeout(() => input.focus(), 200);
    }

    function closePanel() { open = false; panel.classList.remove('open'); }

    // stopPropagation on the panel itself so clicks inside never reach document
    panel.addEventListener('click', (e) => e.stopPropagation());

    fab.addEventListener('click', (e) => { e.stopPropagation(); open ? closePanel() : openPanel(); });
    close.addEventListener('click', (e) => { e.stopPropagation(); closePanel(); });
    send.addEventListener('click', (e) => { e.stopPropagation(); sendMessage(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    // Clicking anywhere outside closes the panel
    document.addEventListener('click', () => { if (open) closePanel(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
