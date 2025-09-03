import React, {
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import gsap from "gsap";
import LoginForm from "../components/Auth/Login";
import SignupForm from "../components/Auth/Signup";
import Loginbanner from "../assets/img/loginbanner.jpg";
const AuthPage = () => {
  const cardRef = useRef(null);
  const [isLoginVisible, setIsLoginVisible] =
    React.useState(true);

  // Animate flip on state change
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotationY: isLoginVisible ? 0 : 180,
      duration: 0.6,
      ease: "power2.inOut",
    });
  }, [isLoginVisible]);

  const switchToSignup = () => {
    setIsLoginVisible(false);
  };

  const switchToLogin = () => {
    setIsLoginVisible(true);
  };

  return (
   <div className="flex h-screen w-full overflow-hidden">
  {/* Left half: Image container */}
  <div className="w-1/2 h-full relative overflow-hidden">
    <img
      src={Loginbanner}
      alt="Kanban"
      className="w-full h-full object-cover filter brightness-75"
    />
    
  </div>

  {/* Right half: Forms container with perspective for 3D */}
  <div
    className="relative w-1/2 h-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center"
    style={{ perspective: '2000px' }}
  >
    {/* Flip card container */}
    <div
      ref={cardRef}
      className="relative w-4/5 max-w-lg h-3/4 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-2xl shadow-blue-500/30 dark:shadow-blue-800/30 transition-transform duration-700"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front side (Login form) */}
      <div
        className="absolute inset-0 bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center rounded-2xl p-8"
        style={{
          backfaceVisibility: 'hidden',
        }}
      >
        <LoginForm switchToSignup={switchToSignup} />
      </div>

      {/* Back side (Signup form, rotated 180deg initially) */}
      <div
        className="absolute inset-0 bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center rounded-2xl p-8"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <SignupForm switchToLogin={switchToLogin} />
      </div>
    </div>
  </div>
</div>

  );
};

export default AuthPage;
