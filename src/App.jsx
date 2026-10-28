import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Sparkles, Send, CheckCircle2, MailOpen } from 'lucide-react';

import AmbientDust from './components/AmbientDust.jsx';
import RoyalEnvelope from './components/RoyalEnvelope.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import ScratchRevealDate from './components/ScratchRevealDate.jsx';
import CountdownTimer from './components/CountdownTimer.jsx';
import Itinerary from './components/Itinerary.jsx';

const App = () => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [rsvpState, setRsvpState] = useState({
    guestName: '',
    attendance: 'attending',
    guestsCount: '2',
    blessing: '',
    submitted: false,
  });

  const audioPlayerRef = useRef(null);
  const mainContentRef = useRef(null);
  const heroSectionRef = useRef(null);

  // Lock page scroll while the 3D envelope is still sealed
  useEffect(() => {
    if (!isEnvelopeOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      if (heroSectionRef.current) {
        gsap.fromTo(
          heroSectionRef.current.querySelectorAll('.hero-reveal'),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.14,
            ease: 'power3.out',
          }
        );
      }
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isEnvelopeOpen]);

  const handleTriggerAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playSealClick();
      audioPlayerRef.current.startMusic();
    }
  };

  const handleEnvelopeOpenComplete = () => {
    setIsEnvelopeOpen(true);
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpState.guestName.trim()) return;
    setRsvpState((prev) => ({ ...prev, submitted: true }));
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.75 },
      colors: ['#D4AF37', '#E8C868', '#FAF7EE'],
    });
  };

  return (
    <div className="relative min-h-screen bg-obsidian text-parchment bg-arabesque-pattern selection:bg-gold-primary/30 selection:text-gold-accent">
      {/* Component A: Fullscreen Ambient Golden Dust & Bokeh Canvas */}
      <AmbientDust />

      {/* Component C: Web Audio Oriental Sound Synthesizer (Maqam Hijaz) */}
      <AudioPlayer ref={audioPlayerRef} />

      {/* Component B: 3D Royal Wax Seal Envelope Modal */}
      {!isEnvelopeOpen && (
        <RoyalEnvelope
          onTriggerAudio={handleTriggerAudio}
          onOpenComplete={handleEnvelopeOpenComplete}
        />
      )}

      {/* Full-Page Royal Invitation Layout */}
      <main
        ref={mainContentRef}
        className={`relative z-10 transition-opacity duration-700 ${
          isEnvelopeOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Ornamental Filigree Banner */}
        <div className="w-full h-2 bg-gradient-to-r from-obsidian via-gold-primary to-obsidian opacity-80" />

        {/* Hero Section: Royal Proclamation & Couple Monogram */}
        <header
          ref={heroSectionRef}
          className="relative pt-16 sm:pt-24 pb-16 px-4 max-w-4xl mx-auto text-center"
        >
          {/* Moorish Grand Archway Frame */}
          <div className="relative rounded-t-[220px] rounded-b-3xl bg-gradient-to-b from-emerald-royal/90 via-[#071C15]/90 to-obsidian/95 border-2 border-gold-primary/60 shadow-gold-glow px-6 sm:px-14 pt-16 sm:pt-20 pb-14 overflow-hidden">
            {/* Inner Arch Filigree Line */}
            <div className="pointer-events-none absolute inset-3 rounded-t-[210px] rounded-b-2xl border border-gold-primary/25" />

            {/* Bismillah Calligraphy */}
            <p className="hero-reveal font-amiri text-2xl sm:text-4xl text-gold-foil mb-4 tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            <p className="hero-reveal font-montserrat text-[10px] sm:text-xs uppercase tracking-[0.32em] text-parchment/70 mb-8">
              In the Name of Allah, the Most Gracious, the Most Merciful
            </p>

            {/* Quranic Verse — Surah Ar-Rum 30:21 */}
            <div className="hero-reveal max-w-2xl mx-auto mb-10 px-4 py-5 rounded-xl bg-obsidian/55 border border-gold-primary/25">
              <p
                dir="rtl"
                className="font-amiri text-xl sm:text-2xl text-gold-accent leading-loose mb-2"
              >
                ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾
              </p>
              <p className="font-cormorant italic text-base sm:text-lg text-parchment/80">
                &ldquo;And among His Signs is that He created for you mates from among
                yourselves, that you may dwell in tranquility with them, and He has put
                love and mercy between your hearts.&rdquo;
              </p>
              <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-gold-primary/80 mt-2">
                Surah Ar-Rum &bull; 30:21
              </p>
            </div>

            {/* Royal Houses Invitation Line */}
            <p className="hero-reveal font-montserrat text-[11px] uppercase tracking-[0.3em] text-gold-accent mb-6">
              With the Blessings of the House of Al-Mansoor &amp; the House of Al-Hashimi
            </p>

            {/* Bride & Groom Names */}
            <div className="hero-reveal my-6">
              <p className="font-amiri text-2xl sm:text-3xl text-gold-primary/90 mb-2">
                زَيْد المَنْصُور ✦ لَيْلَى الهَاشِمِي
              </p>
              <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold text-gold-foil tracking-wider leading-tight">
                Zayd
                <span className="block sm:inline font-cormorant italic font-normal text-3xl sm:text-5xl text-gold-accent mx-4">
                  &amp;
                </span>
                Layla
              </h1>
            </div>

            {/* Ornamental Divider */}
            <div className="hero-reveal flex items-center justify-center gap-4 my-8">
              <span className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-transparent to-gold-primary" />
              <span className="text-gold-primary text-lg">❖</span>
              <span className="w-16 sm:w-28 h-[1px] bg-gradient-to-l from-transparent to-gold-primary" />
            </div>

            <p className="hero-reveal font-cormorant text-xl sm:text-2xl text-parchment/90 max-w-xl mx-auto leading-relaxed">
              Request the honor of your presence to celebrate the sacred covenant of their marriage
              on the night of <span className="italic text-gold-accent">Laylat Al-Umur</span>.
            </p>
          </div>
        </header>

        {/* Component D: Interactive Gold Foil Scratch Card */}
        <ScratchRevealDate />

        {/* Component E: Palace Archway Countdown Timer */}
        <CountdownTimer />

        {/* Component F: Royal Celebration Itinerary */}
        <Itinerary />

        {/* Royal RSVP & Blessing Registry Section */}
        <section className="relative py-20 px-4 max-w-2xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-b from-emerald-royal/95 via-[#071C15] to-obsidian p-8 sm:p-12 border-2 border-gold-primary/60 shadow-gold-glow relative overflow-hidden">
            <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold-primary/20" />

            <div className="text-center mb-8">
              <p className="font-amiri text-2xl text-gold-accent mb-1">
                تَشْرِيفُكُمْ يَزِيدُنَا فَرَحًا
              </p>
              <p className="font-montserrat text-[11px] uppercase tracking-[0.35em] text-gold-primary mb-2">
                Répondez S&apos;il Vous Plaît
              </p>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-gold-foil">
                Royal Registry &amp; Blessings
              </h3>
            </div>

            {rsvpState.submitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-gold-primary mx-auto" />
                <h4 className="font-cinzel text-xl text-gold-foil">
                  BarakAllahu Lakuma &bull; Response Recorded
                </h4>
                <p className="font-cormorant text-lg text-parchment/85 max-w-md mx-auto">
                  Thank you, <span className="text-gold-accent font-semibold">{rsvpState.guestName}</span>.
                  The Royal Protocol Office has inscribed your presence in the Grand Ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-5 relative z-10">
                <div>
                  <label
                    htmlFor="guestName"
                    className="block font-montserrat text-[10px] uppercase tracking-[0.25em] text-gold-accent mb-2"
                  >
                    Honored Guest Name &amp; Title
                  </label>
                  <input
                    id="guestName"
                    type="text"
                    required
                    placeholder="e.g., His Excellency Tariq Al-Sulaiman"
                    value={rsvpState.guestName}
                    onChange={(e) =>
                      setRsvpState({ ...rsvpState, guestName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-obsidian/80 border border-gold-primary/40 focus:border-gold-primary text-parchment placeholder-parchment/35 font-cormorant text-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="attendance"
                      className="block font-montserrat text-[10px] uppercase tracking-[0.25em] text-gold-accent mb-2"
                    >
                      Royal Attendance
                    </label>
                    <select
                      id="attendance"
                      value={rsvpState.attendance}
                      onChange={(e) =>
                        setRsvpState({ ...rsvpState, attendance: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-obsidian/80 border border-gold-primary/40 focus:border-gold-primary text-parchment font-cormorant text-lg focus:outline-none"
                    >
                      <option value="attending">Joyfully Attending</option>
                      <option value="regretfully-declining">Sending Warm Blessings Only</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="guestsCount"
                      className="block font-montserrat text-[10px] uppercase tracking-[0.25em] text-gold-accent mb-2"
                    >
                      Number of Guests
                    </label>
                    <select
                      id="guestsCount"
                      value={rsvpState.guestsCount}
                      onChange={(e) =>
                        setRsvpState({ ...rsvpState, guestsCount: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-obsidian/80 border border-gold-primary/40 focus:border-gold-primary text-parchment font-cormorant text-lg focus:outline-none"
                    >
                      <option value="1">1 Honored Guest</option>
                      <option value="2">2 Honored Guests</option>
                      <option value="3">3 Honored Guests</option>
                      <option value="4">Royal Family Suite (4)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="blessing"
                    className="block font-montserrat text-[10px] uppercase tracking-[0.25em] text-gold-accent mb-2"
                  >
                    Inscribe a Dua or Blessing for the Couple
                  </label>
                  <textarea
                    id="blessing"
                    rows={3}
                    placeholder="May Allah bless your union and join you in goodness..."
                    value={rsvpState.blessing}
                    onChange={(e) =>
                      setRsvpState({ ...rsvpState, blessing: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-obsidian/80 border border-gold-primary/40 focus:border-gold-primary text-parchment placeholder-parchment/35 font-cormorant text-lg focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#9E7423] via-gold-primary to-[#E8C868] text-obsidian font-montserrat font-semibold text-xs uppercase tracking-[0.28em] shadow-gold-glow hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Seal &amp; Dispatch Royal RSVP</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Ceremonial Footer */}
        <footer className="py-14 px-4 border-t border-gold-primary/25 text-center">
          <p className="font-amiri text-2xl text-gold-foil mb-2">
            بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
          </p>
          <p className="font-cinzel text-lg text-parchment/90 tracking-widest mb-4">
            ZAYD &amp; LAYLA &bull; XX . XI . MMXXVI
          </p>

          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsEnvelopeOpen(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-primary/35 hover:border-gold-primary text-gold-accent font-montserrat text-[10px] uppercase tracking-[0.22em] transition-all"
          >
            <MailOpen className="w-3.5 h-3.5" />
            <span>Replay Royal Wax Seal Ceremony</span>
          </button>
        </footer>
      </main>
    </div>
  );
};

export default App;

