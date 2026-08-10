import { Billboard, MeshDistortMaterial, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type MutableRefObject,
	type ReactNode,
} from 'react';
import type { Group } from 'three';
import * as THREE from 'three';

type Pointer = { x: number; y: number };

const PointerContext = createContext<MutableRefObject<Pointer>>({
	current: { x: 0, y: 0 },
});

const CORE_CENTER: [number, number, number] = [1.35, 0.15, 0];
/** Visual core radius ≈ 1.15 + distort; logos stay outside this shell */
const LOGO_ORBIT_RADIUS = 1.72;

function PointerProvider({ children }: { children: ReactNode }) {
	const pointer = useRef<Pointer>({ x: 0, y: 0 });

	useEffect(() => {
		const onMove = (event: PointerEvent) => {
			pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
		};
		window.addEventListener('pointermove', onMove);
		return () => window.removeEventListener('pointermove', onMove);
	}, []);

	return <PointerContext.Provider value={pointer}>{children}</PointerContext.Provider>;
}

const TECH_LOGOS = [
	{ src: '/tech/react.svg', color: '#61DAFB', label: 'React' },
	{ src: '/tech/vuedotjs.svg', color: '#4FC08D', label: 'Vue' },
	{ src: '/tech/typescript.svg', color: '#3178C6', label: 'TypeScript' },
	{ src: '/tech/nextdotjs.svg', color: '#E4EBF2', label: 'Next.js' },
	{ src: '/tech/nuxtdotjs.svg', color: '#00DC82', label: 'Nuxt' },
	{ src: '/tech/nodedotjs.svg', color: '#5FA04E', label: 'Node.js' },
	{ src: '/tech/go.svg', color: '#00ADD8', label: 'Go' },
	{ src: '/tech/docker.svg', color: '#2496ED', label: 'Docker' },
] as const;

function useColoredSvgTexture(src: string, color: string) {
	const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

	useEffect(() => {
		let cancelled = false;
		let objectUrl: string | null = null;
		let created: THREE.CanvasTexture | null = null;

		const load = async () => {
			const response = await fetch(src);
			let svg = await response.text();
			svg = svg
				.replace(/fill="(?!none)[^"]*"/gi, `fill="${color}"`)
				.replace(/<svg\b([^>]*)>/i, (match, attrs: string) =>
					/\bfill=/.test(attrs) ? match : `<svg${attrs} fill="${color}">`,
				);

			const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
			objectUrl = URL.createObjectURL(blob);

			await new Promise<void>((resolve, reject) => {
				const image = new Image();
				image.onload = () => {
					const canvas = document.createElement('canvas');
					canvas.width = 256;
					canvas.height = 256;
					const ctx = canvas.getContext('2d');
					if (!ctx) {
						reject(new Error('Canvas unavailable'));
						return;
					}
					ctx.clearRect(0, 0, 256, 256);
					ctx.drawImage(image, 28, 28, 200, 200);
					created = new THREE.CanvasTexture(canvas);
					created.colorSpace = THREE.SRGBColorSpace;
					created.anisotropy = 4;
					created.needsUpdate = true;
					if (!cancelled) setTexture(created);
					resolve();
				};
				image.onerror = () => reject(new Error(`Failed to load ${src}`));
				image.src = objectUrl!;
			});
		};

		load().catch(() => {
			if (!cancelled) setTexture(null);
		});

		return () => {
			cancelled = true;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
			created?.dispose();
		};
	}, [src, color]);

	return texture;
}

function TechLogo({
	src,
	color,
	position,
	scale = 0.21,
	phase = 0,
}: {
	src: string;
	color: string;
	position: [number, number, number];
	scale?: number;
	phase?: number;
}) {
	const texture = useColoredSvgTexture(src, color);
	const group = useRef<Group>(null);

	useFrame((state) => {
		if (!group.current) return;
		// Tiny bob along the orbit tangent — keeps logos off the core shell
		group.current.position.set(
			position[0],
			position[1] + Math.sin(state.clock.elapsedTime * 0.9 + phase) * 0.04,
			position[2],
		);
	});

	if (!texture) return null;

	return (
		<group ref={group} position={position}>
			<Billboard follow>
				<mesh position={[0, 0, -0.01]} scale={scale * 1.35}>
					<circleGeometry args={[0.5, 32]} />
					<meshBasicMaterial
						color={color}
						transparent
						opacity={0.12}
						depthTest
						depthWrite={false}
					/>
				</mesh>
				<mesh scale={scale}>
					<planeGeometry args={[1, 1]} />
					<meshBasicMaterial
						map={texture}
						transparent
						opacity={0.92}
						depthTest
						depthWrite={false}
						side={THREE.DoubleSide}
					/>
				</mesh>
			</Billboard>
		</group>
	);
}

function TechLogoOrbit() {
	const group = useRef<Group>(null);

	const positions = useMemo(() => {
		return TECH_LOGOS.map((_, index) => {
			const angle = (index / TECH_LOGOS.length) * Math.PI * 2;
			const radius = LOGO_ORBIT_RADIUS + (index % 2) * 0.12;
			const tilt = ((index % 3) - 1) * 0.18;
			// Classic orbit in local space around core origin (0,0,0)
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle * 2) * 0.22 + tilt;
			const z = Math.sin(angle) * radius;
			return [x, y, z] as [number, number, number];
		});
	}, []);

	useFrame((_, delta) => {
		if (!group.current) return;
		group.current.rotation.y += delta * 0.22;
		group.current.rotation.x = Math.sin(performance.now() * 0.00015) * 0.12;
	});

	return (
		<group ref={group}>
			{TECH_LOGOS.map((logo, index) => (
				<TechLogo
					key={logo.label}
					src={logo.src}
					color={logo.color}
					position={positions[index]}
					scale={0.19 + (index % 3) * 0.02}
					phase={index * 0.7}
				/>
			))}
		</group>
	);
}

function OrbitRings() {
	const group = useRef<Group>(null);
	const pointer = useContext(PointerContext);

	useFrame((_, delta) => {
		if (!group.current) return;
		group.current.rotation.y += delta * 0.12;
		group.current.rotation.x = THREE.MathUtils.lerp(
			group.current.rotation.x,
			pointer.current.y * 0.18,
			0.04,
		);
		group.current.rotation.z = THREE.MathUtils.lerp(
			group.current.rotation.z,
			pointer.current.x * 0.12,
			0.04,
		);
	});

	return (
		<group ref={group}>
			{[1.15, 1.55, 1.95].map((radius, index) => (
				<mesh key={radius} rotation={[Math.PI / 2.4, 0.2 * index, 0.4 * index]}>
					<torusGeometry args={[radius, 0.012, 16, 120]} />
					<meshBasicMaterial
						color={index === 1 ? '#3dd9c5' : '#7a8ba3'}
						transparent
						opacity={index === 1 ? 0.55 : 0.22}
						depthTest
						depthWrite={false}
					/>
				</mesh>
			))}
		</group>
	);
}

function CoreVisual() {
	const spin = useRef<Group>(null);

	useFrame((state) => {
		if (!spin.current) return;
		spin.current.rotation.x = state.clock.elapsedTime * 0.15;
		spin.current.rotation.y = state.clock.elapsedTime * 0.22;
	});

	return (
		<group ref={spin} scale={1.15}>
			{/* Depth-only shell for logo occlusion — slightly smaller than the visible core */}
			<mesh renderOrder={0}>
				<icosahedronGeometry args={[0.98, 1]} />
				<meshBasicMaterial colorWrite={false} depthWrite depthTest />
			</mesh>
			{/* Visible core ignores that depth so it stays bright */}
			<mesh renderOrder={2}>
				<icosahedronGeometry args={[1, 1]} />
				<MeshDistortMaterial
					color="#0ea5a0"
					emissive="#0a5452"
					emissiveIntensity={0.7}
					roughness={0.15}
					metalness={0.85}
					transparent
					opacity={0.42}
					distort={0.28}
					speed={1.6}
					depthTest={false}
					depthWrite={false}
				/>
			</mesh>
			<mesh renderOrder={2}>
				<icosahedronGeometry args={[1.02, 1]} />
				<meshBasicMaterial
					color="#7af0df"
					wireframe
					transparent
					opacity={0.55}
					depthTest={false}
					depthWrite={false}
				/>
			</mesh>
		</group>
	);
}

function CoreSystem() {
	const group = useRef<Group>(null);
	const pointer = useContext(PointerContext);

	useFrame(() => {
		if (!group.current) return;
		group.current.position.x = THREE.MathUtils.lerp(
			group.current.position.x,
			CORE_CENTER[0] + pointer.current.x * 0.35,
			0.05,
		);
		group.current.position.y = THREE.MathUtils.lerp(
			group.current.position.y,
			CORE_CENTER[1] + pointer.current.y * 0.25,
			0.05,
		);
	});

	return (
		<group ref={group} position={CORE_CENTER}>
			<CoreVisual />
			<TechLogoOrbit />
			<OrbitRings />
		</group>
	);
}

function SceneContent() {
	return (
		<PointerProvider>
			<color attach="background" args={['#05080f']} />
			<fog attach="fog" args={['#05080f', 6, 16]} />
			<ambientLight intensity={0.45} />
			<directionalLight position={[4, 5, 2]} intensity={1.2} color="#e4ebf2" />
			<pointLight position={[-3, 1, 2]} intensity={18} color="#1fbfab" distance={12} />
			<pointLight position={[3, -2, -1]} intensity={10} color="#7af0df" distance={10} />
			<Stars radius={40} depth={30} count={1200} factor={2.2} saturation={0} fade speed={0.4} />
			<CoreSystem />
		</PointerProvider>
	);
}

export default function Scene3D() {
	return (
		<Canvas
			dpr={[1, 1.75]}
			camera={{ position: [0, 0, 5.2], fov: 42 }}
			gl={{ antialias: true, alpha: false }}
			style={{ width: '100%', height: '100%' }}
		>
			<SceneContent />
		</Canvas>
	);
}
