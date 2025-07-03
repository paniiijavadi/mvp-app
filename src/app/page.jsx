'use client';
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const slides = [
  {
    image: "/photos/Group.svg",
    text: "This is your planet. Tap on your planet and complete your profile to tell others who you are and what care your interests.",
  },
  {
    image: "/planet-group.png",
    text: "Every dim star and planet is a person you can connect with.",
  },
  {
    image: "/profile-info.png",
    text: "You see users' information and your similarity percentage by tapping on each element.",
  },
];

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(0);
  const [planets, setPlanets] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [connections, setConnections] = useState([]);
  const [lines, setLines] = useState([]);

  const planetRefs = useRef({});
  const centerRef = useRef(null);

  useEffect(() => {
    const seen = localStorage.getItem("onboardingSeen");
    if (seen !== "true") {
      setShowOnboarding(true);
    }

    fetch("/api/test")
        .then((res) => res.json())
        .then((data) => {
          setPlanets(data.data);

          const defaultConnections = data.data
              .filter((planet) => planet.hasLine === true && planet.user?.id)
              .map((planet) => planet.user.id);

          setConnections(defaultConnections);
        });
  }, []);

  useEffect(() => {
    if (!isHovering) {
      const timeout = setTimeout(() => setHovered(null), 200);
      return () => clearTimeout(timeout);
    }
  }, [isHovering]);

  useEffect(() => {
    if (!centerRef.current) return;
    const center = centerRef.current.getBoundingClientRect();
    const updatedLines = connections.map((planetId) => {
      const planetEl = planetRefs.current[planetId];
      if (!planetEl) return null;
      const target = planetEl.getBoundingClientRect();
      return {
        x1: center.left + center.width / 2,
        y1: center.top + center.height / 2,
        x2: target.left + target.width / 2,
        y2: target.top + target.height / 2,
      };
    }).filter(Boolean);
    setLines(updatedLines);
  }, [connections, planets]);

  useEffect(() => {
    const handleResize = () => setConnections((prev) => [...prev]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleConnect = async (userId) => {
    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: userId }),
      });
      if (res.ok) {
        if (!connections.includes(userId)) {
          setConnections(prev => [...prev, userId]);
        }
        setHovered(prev => ({
          ...prev,
          user: { ...prev.user, connectionStatus: 'pending' }
        }));
      }
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("onboardingSeen", "true");
      setShowOnboarding(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboardingSeen", "true");
    setShowOnboarding(false);
  };

  return (
      <div className="relative min-h-screen bg-[url('/photos/bg.png')] bg-cover text-white flex items-center justify-center">
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          {lines.map((line, idx) => (
              <line
                  key={idx}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="white"
                  strokeWidth={2}
              />
          ))}
        </svg>

        <div ref={centerRef} className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-[1]">
          <Image src='/photos/3600_2_07[Converted].svg' width={63} height={120} />
        </div>

        {showOnboarding && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
              <div className="bg-[#1f2944] rounded-xl p-6 w-[90%] max-w-md text-center space-y-4">
                <Image src={slides[step].image} alt="onboarding" width={120} height={120} className="mx-auto relative" />
                <p className="text-sm">{slides[step].text}</p>
                <div className="flex justify-center space-x-2">
                  {slides.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-cyan-400' : 'bg-gray-500'}`} />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <button onClick={handleSkip} className="text-gray-400 hover:underline">Skip</button>
                  <button onClick={handleNext} className="text-cyan-400 hover:underline">{step === slides.length - 1 ? "Finish" : "Next"}</button>
                </div>
              </div>
            </div>
        )}

        {planets.map((planet, index) => (
            <div
                key={index}
                ref={(el) => planetRefs.current[planet.user.id] = el}
                className="absolute cursor-pointer transition-transform hover:scale-110"
                style={{ top: planet.y, left: planet.x }}
                onMouseEnter={() => {
                  setHovered(planet);
                  setIsHovering(true);
                }}
                onMouseLeave={() => setIsHovering(false)}
            >
              <Image
                  src={planet.user.icon}
                  alt={`Planet ${index + 1}`}
                  width={48}
                  height={48}
                  className=" opacity-80"
              />
            </div>
        ))}

        {hovered && (
            <div
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="absolute z-40 bg-[#273550] rounded-xl p-4 shadow-lg backdrop-blur-sm text-white"
                style={{
                  top: `calc(${hovered.y} - 250px)`,
                  left: `calc(${hovered.x} - 50px)`
                }}
            >
              <div className="flex gap-6 items-center justify-between">
                <div className="flex">
                  <img src={hovered.user.icon} alt="user" className="w-12 h-12 rounded-full" />
                  <div className="mx-3">
                    <h2 className="font-semibold px-1">{hovered.user.fullname}</h2>
                    <p className="text-sm text-gray-400">Mutual connections 98</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#14D790]">
                  {hovered.user.similarPercentage}% similarity
                </p>
              </div>

              <div className="mt-3 text-sm space-y-3">
                <p className="flex items-center gap-2">
                  <Image src="/icons/bag.svg" alt="Profession" width={18} height={18} />
                  <strong className="text-[#08FDD8]">Professionality:</strong> {hovered.user.professional}
                </p>
                <p className="flex items-center gap-2">
                  <Image src="/icons/playstation-gamepad.svg" alt="Hobbies" width={18} height={18} />
                  <strong className="text-[#08FDD8]">Hobbies:</strong> {hovered.user.hobbies}
                </p>
                <p className="flex items-center gap-2">
                  <Image src="/icons/heart.svg" alt="Interests" width={18} height={18} />
                  <strong className="text-[#08FDD8]">Interests:</strong> {hovered.user.interests || 'N/A'}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                {hovered.user.connectionStatus === 'connect' && (
                    <button
                        className="bg-[#08FDD8] text-black font-semibold px-6 py-2 rounded-full w hover:opacity-90"
                        onClick={() => handleConnect(hovered.user.id)}
                    >
                      Connect
                    </button>
                )}
                {hovered.user.connectionStatus === 'pending' && (
                    <button
                        className="bg-[#0A8D82] text-[#0D1B2A] gap-2 flex font-semibold px-6 py-2 rounded-full w cursor-not-allowed"
                        disabled
                    >
                      <Image src="/icons/clock.svg" alt="Pending" width={18} height={18} />
                      Pending...
                    </button>
                )}
                {hovered.user.connectionStatus === 'connected' && (
                    <button
                        className="bg-green-500 text-white font-semibold px-6 py-2 rounded-full w cursor-not-allowed"
                        disabled
                    >
                      Connected
                    </button>
                )}
              </div>
            </div>
        )}

        <div className="fixed bottom-0 left-0 w-full bg-[#415A77] py-2 text-center text-white flex justify-around items-center">
          <div className="flex flex-col items-center">
            <span className="material-icons">home</span>
            <span className="text-sm">Home</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-icons">search</span>
            <span className="text-sm">Search</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-icons">account_circle</span>
            <span className="text-sm">Profile</span>
          </div>
        </div>
      </div>
  );
}