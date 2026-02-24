import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { motion } from "framer-motion";
import { RefreshCw, Play, Pause } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCatStore } from "@/store/useCatStore";
import { getCats } from "@/utils/supabaseApi";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cats, setCats } = useCatStore();
  const [catType, setCatType] = useState("WhiteCat");
  const [timerStart, setTimerStart] = useState(false);
  const [huntingTime, setHuntingTime] = useState(60 * 20); // 20 minutes
  const [movementState, setMovementState] = useState("BasicMovement");

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["cats", user?.id],
    queryFn: () => getCats(user?.id || ""),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setCats(data);
    }
  }, [data, isSuccess, setCats]);

  const huntingStart = () => {
    if (timerStart) {
      setTimerStart(false);
      setMovementState("BasicMovement");
      setHuntingTime(60 * 20);
    } else {
      setTimerStart(true);
      setMovementState("HuntingMovement");
    }
  };

  const formatTime = (remainingTime: number) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-wePeep"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center">
        {/* Cat Selection Button */}
        <div className="relative mb-8">
          <button
            onClick={() => navigate("/create-cat")}
            className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RefreshCw size={24} />
          </button>

          {/* Cat Animation Area */}
          <div className="flex justify-center mb-8">
            <motion.div
              className="w-32 h-32 bg-wePeep rounded-full flex items-center justify-center"
              animate={{
                scale: movementState === "HuntingMovement" ? [1, 1.1, 1] : 1,
                rotate: movementState === "HuntingMovement" ? [0, 5, -5, 0] : 0,
              }}
              transition={{
                duration: 2,
                repeat: movementState === "HuntingMovement" ? Infinity : 0,
              }}
            >
              <span className="text-6xl">🐱</span>
            </motion.div>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-8 flex justify-center">
          <CountdownCircleTimer
            key={huntingTime}
            isPlaying={timerStart}
            duration={huntingTime}
            strokeWidth={6}
            colors={["#EF798A", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[huntingTime / 2, huntingTime / 3, huntingTime / 4, huntingTime / 5]}
            onComplete={() => {
              setTimerStart(false);
              setMovementState("BasicMovement");
              setHuntingTime(60 * 20);
            }}
          >
            {({ remainingTime }) => (
              <button
                onClick={() => {
                  // Timer picker modal would go here
                  const newTime = prompt("시간을 분 단위로 입력하세요 (기본: 20분)", "20");
                  if (newTime) {
                    setHuntingTime(parseInt(newTime) * 60);
                  }
                }}
                className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
              >
                {formatTime(remainingTime)}
              </button>
            )}
          </CountdownCircleTimer>
        </div>

        {/* Start/Stop Button */}
        <button
          onClick={huntingStart}
          className="w-full py-4 px-6 bg-wePeep text-white text-xl font-semibold rounded-lg hover:bg-wePeep/90 transition-colors flex items-center justify-center space-x-2"
        >
          {timerStart ? (
            <>
              <Pause size={24} />
              <span>사냥 놀이 중지</span>
            </>
          ) : (
            <>
              <Play size={24} />
              <span>사냥 놀이 시작하기</span>
            </>
          )}
        </button>

        {/* Cat List */}
        {cats.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">내 반려묘들</h2>
            <div className="space-y-2">
              {cats.map((cat) => (
                <article
                  key={cat.id}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-wePeep rounded-full flex items-center justify-center">
                      <span className="text-2xl" aria-hidden="true">
                        🐱
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                      <p className="text-sm text-gray-600">
                        {cat.birth_date
                          ? `${new Date().getFullYear() - new Date(cat.birth_date).getFullYear()}살`
                          : "나이 미상"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
