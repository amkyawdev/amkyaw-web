// Advanced 3D Background with floating particles (down to up animation)
function initAdvanced3DBackground() {
    const container = document.getElementById('3d-background');
    if (!container) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;';
    container.appendChild(canvas);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create floating particles that move upward
    const particlesCount = 1500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const velocities = [];
    const colors = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount; i++) {
        positions[i*3] = (Math.random() - 0.5) * 2000;
        positions[i*3+1] = Math.random() * 1000 - 400;
        positions[i*3+2] = (Math.random() - 0.5) * 500;
        
        velocities.push({
            y: 0.5 + Math.random() * 1.5,
            x: (Math.random() - 0.5) * 0.2,
            z: (Math.random() - 0.5) * 0.2
        });
        
        // Vary colors between blue and purple
        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.15, 0.8, 0.6);
        colors[i*3] = color.r;
        colors[i*3+1] = color.g;
        colors[i*3+2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add a central glowing sphere with particles
    const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x667eea,
        transparent: true,
        opacity: 0.08,
        wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    
    // Add second inner sphere
    const innerSphereGeometry = new THREE.SphereGeometry(30, 32, 32);
    const innerSphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f46e5,
        transparent: true,
        opacity: 0.15,
        wireframe: true
    });
    const innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
    scene.add(innerSphere);
    
    // Add particle rings
    const ringGeometry = new THREE.TorusGeometry(80, 0.5, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    scene.add(ring);
    
    camera.position.z = 500;
    
    let time = 0;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.01;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Animate particles upward
        const positions = particlesGeometry.attributes.position.array;
        for(let i = 0; i < particlesCount; i++) {
            positions[i*3+1] += velocities[i].y;
            positions[i*3] += velocities[i].x;
            positions[i*3+2] += velocities[i].z;
            
            // Reset when too high
            if (positions[i*3+1] > 600) {
                positions[i*3+1] = -400;
                positions[i*3] = (Math.random() - 0.5) * 2000;
                positions[i*3+2] = (Math.random() - 0.5) * 500;
            }
        }
        particlesGeometry.attributes.position.needsUpdate = true;
        
        // Rotate spheres
        sphere.rotation.x = time * 0.2;
        sphere.rotation.y = time * 0.3;
        sphere.rotation.z = time * 0.1;
        
        innerSphere.rotation.x = time * -0.3;
        innerSphere.rotation.y = time * -0.2;
        
        // Rotate ring
        ring.rotation.x = time * 0.15;
        ring.rotation.y = time * 0.1;
        
        // Rotate entire particle system slowly
        particlesMesh.rotation.y += 0.0005;
        
        // Mouse parallax effect
        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (mouseY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAdvanced3DBackground();
});

// Also try on page load for safety
window.addEventListener('load', function() {
    initAdvanced3DBackground();
});
