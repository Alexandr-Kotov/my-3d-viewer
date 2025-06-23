import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let currentModel = null;

init();
loadModel('./models/model1.glb');

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  const viewer = document.getElementById('viewer');

  camera = new THREE.PerspectiveCamera(60, viewer.clientWidth / viewer.clientHeight, 0.1, 100);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  viewer.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(2, 2, 2);
  scene.add(light1);

  const light2 = new THREE.AmbientLight(0x404040, 2);
  scene.add(light2);

  window.addEventListener('resize', () => {
    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  });

  animate();
}

function loadModel(url) {
  const loader = new GLTFLoader();

  if (currentModel) {
    scene.remove(currentModel);
    currentModel.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }

  loader.load(
    url,
    (gltf) => {
      currentModel = gltf.scene;
    if (url.includes('model2.glb')) {
      currentModel.scale.set(0.013, 0.013, 0.013);
    } else if (url.includes('model3.glb')) {
      currentModel.scale.set(10, 10, 10);
    } else {
      currentModel.scale.set(2, 2, 2);
    }
      scene.add(currentModel);
    },
    undefined,
    (error) => {
      console.error('Ошибка загрузки модели:', error);
    }
  );
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Кнопки выбора моделей
document.getElementById('btn1').addEventListener('click', () => loadModel('./models/model1.glb'));
document.getElementById('btn2').addEventListener('click', () => loadModel('./models/model2.glb'));
document.getElementById('btn3').addEventListener('click', () => loadModel('./models/model3.glb'));
