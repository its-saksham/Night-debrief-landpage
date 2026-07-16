/* ════════════════════════════════════════════════
   Night Debrief — Waitlist  ·  waitlist.js
   ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll Reveal System
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  reveals.forEach(el => revealObserver.observe(el));

  // 2. Typewriter effect for Hero Aside Card
  const scText = document.getElementById('scText');
  if (scText) {
    const fullText = "I said I'd finish the deck, but I didn't. Client called and I lost the afternoon.";
    let i = 0;
    
    // Clear initial text (leave cursor)
    scText.childNodes.forEach(node => {
      if (node.nodeType === 3) node.textContent = ''; // clear text nodes only
    });

    // Start typing after a short delay
    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (i < fullText.length) {
          // Insert text before the cursor span
          const textNode = document.createTextNode(fullText.charAt(i));
          scText.insertBefore(textNode, scText.lastElementChild);
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 45); // typing speed
    }, 1200);
  }

  // 3. Directional Hover for Log Entries (Magnetic spotlight)
  const entries = document.querySelectorAll('.entry-clickable');
  entries.forEach(entry => {
    entry.addEventListener('mousemove', (e) => {
      const rect = entry.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      entry.style.setProperty('--mx', `${x}px`);
      entry.style.setProperty('--my', `${y}px`);
    });
  });

  // 4. Click-to-reveal entries + unlock debrief
  const dcBody = document.getElementById('dcBody');
  const dcLock = document.getElementById('dcLock');
  const debrief = document.getElementById('debriefSection');
  
  function checkAllRevealed() {
    const all = Array.from(entries).every(e => e.classList.contains('revealed'));
    if (all && debrief) {
      if (dcLock) dcLock.style.display = 'none';
      if (dcBody) dcBody.style.display = 'block';
      debrief.classList.add('unlocked');
    }
  }

  entries.forEach(entry => {
    const toggle = () => {
      const revealed = entry.classList.toggle('revealed');
      entry.setAttribute('aria-expanded', revealed);
      checkAllRevealed();
    };

    entry.addEventListener('click', toggle);
    entry.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // 5. Waitlist Form Submission
  const form = document.getElementById('waitlistForm');
  const input = document.getElementById('emailInput');
  const submitBtn = document.getElementById('submitBtn');
  const success = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim().toLowerCase();
      
      // Basic validation
      if (!email || !email.includes('@')) {
        errorMsg.textContent = 'Please enter a valid email.';
        input.focus();
        return;
      }
      errorMsg.textContent = '';
      
      // Visual feedback: disable button
      submitBtn.disabled = true;
      const originalText = submitBtn.querySelector('.wf-submit-text').textContent;
      submitBtn.querySelector('.wf-submit-text').textContent = 'Securing...';

      // Simulate network request
      await new Promise(r => setTimeout(r, 800));

      // Persist to storage if available (mock)
      try {
        const key = 'waitlist:' + email;
        if (window.storage) {
          await window.storage.set(key, JSON.stringify({ email, joinedAt: new Date().toISOString() }), true);
        }
      } catch (err) {
        console.error('Storage error:', err);
      }

      // Transition to success state
      form.style.opacity = '0';
      form.style.transform = 'translateY(10px)';
      form.style.transition = 'opacity 0.4s var(--ease-expo), transform 0.4s var(--ease-expo)';
      
      setTimeout(() => { 
        form.style.display = 'none'; 
        if (success) {
          success.classList.add('show');
        }
      }, 400);
    });
  }
});
