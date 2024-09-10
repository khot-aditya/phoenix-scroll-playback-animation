import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Load and animate the model with camera animations
const AnimatedHumanModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/phoenix_bird.glb");
  const { actions, mixer } = useAnimations(animations, groupRef);
  const [scrollY, setScrollY] = useState(0);
  const [animationLength, setAnimationLength] = useState(0); // To store total animation length

  // Scroll event handler to track user scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Once the animation is loaded, get its duration and play it initially
  useEffect(() => {
    console.log(actions); // Check available animations in the console
    if (actions && actions["Take 001"]) {
      const totalDuration = actions["Take 001"].getClip().duration;
      setAnimationLength(totalDuration);

      // Play the animation at least once
      actions["Take 001"].play();
    }
  }, [actions]);

  // Control animation playback based on scroll position
  useFrame(() => {
    if (mixer && animationLength > 0) {
      const maxScroll = 2000; // Define max scroll value for full animation
      const scrollFactor = Math.min(scrollY / maxScroll, 1); // Normalize scroll to 0-1 range

      // Calculate the current time in the animation based on the scroll
      const currentTime = scrollFactor * animationLength;

      // Set the mixer to the current time (go forward or backward based on scroll)
      mixer.setTime(currentTime);

      // Ensure the mixer keeps updating
      mixer.update(0.01);
    }
  });

  return <primitive object={scene} ref={groupRef} />;
};

// Main App Component
const App: React.FC = () => {
  return (
    <div style={{ height: "300vh", width: "100vw" }}>
      <Canvas>
        {/* <ambientLight intensity={0.5} />{" "} */}
        <PerspectiveCamera makeDefault position={[-100, 0, 1500]} />
        <AnimatedHumanModel />
      </Canvas>
    </div>
  );
};

export default App;
