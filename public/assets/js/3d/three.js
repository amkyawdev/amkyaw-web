// Three.js 3D Background for AmkyawDev
(function() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    const container = document.getElementById('3d-background');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 30;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color(0x4f46e5); // Primary purple
    const color2 = new THREE.Color(0x7c3aed); // Secondary purple
    const color3 = new THREE.Color(0x10b981); // Secondary green

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 60;
        posArray[i + 1] = (Math.random() - 0.5) * 60;
        posArray[i + 2] = (Math.random() - 0.5) * 40;

        // Colors - mix between three colors
        const mixRatio = Math.random();
        let color;
        if (mixRatio < 0.33) {
            color = color1;
        } else if (mixRatio < 0.66) {
            color = color2;
        } else {
            color = color3;
        }
        
        colorsArray[i] = color.r;
        colorsArray[i + 1] = color.g;
        colorsArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // Particles material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Create particles mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating shapes
    const shapes = [];
    const shapeGeometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.TorusGeometry(0.7, 0.2, 8, 16)
    ];

    const shapeColors = [0x4f46e5, 0x7c3aed, 0x10b981, 0xf59e0b];

    for (let i = 0; i < 8; i++) {
        const geometry = shapeGeometries[i % shapeGeometries.length];
        const material = new THREE.MeshPhongMaterial({
            color: shapeColors[i % shapeColors.length],
            transparent: true,
            opacity: 0.4,
            wireframe: true
        });
        
        const shape = new THREE.Mesh(geometry, material);
        
        shape.position.x = (Math.random() - 0.5) * 30;
        shape.position.y = (Math.random() - 0.5) * 30;
        shape.position.z = (Math.random() - 0.5) * 20 - 10;
        
        shape.rotation.x = Math.random() * Math.PI;
        shape.rotation.y = Math.random() * Math.PI;
        
        shape.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: Math.random() * 0.02 + 0.01,
            floatOffset: Math.random() * Math.PI * 2,
            initialY: shape.position.y
        };
        
        shapes.push(shape);
        scene.add(shape);
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x4f46e5, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10b981, 0.8, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.001;

        // Smooth mouse follow
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Rotate particles
        particlesMesh.rotation.y = time * 0.1;
        particlesMesh.rotation.x = targetY * 0.2;

        // Animate shapes
        shapes.forEach((shape) => {
            // Rotation
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            
            // Floating
            shape.position.y = shape.userData.initialY + 
                Math.sin(time * shape.userData.floatSpeed * 50 + shape.userData.floatOffset) * 2;
        });

        // Camera movement based on mouse
        camera.position.x += (targetX * 5 - camera.position.x) * 0.05;
        camera.position.y += (targetY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        renderer.dispose();
        scene.clear();
    });
})();