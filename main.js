import * as THREE from 'three';






export function GenerateMap() {
  stopAnimation();
  fillMap();
  for (var i = 0; i < 80; i++) {
    smoothMap();
  }
drawMap();
map3dGen();
}

function SmoothAndDraw(){
          smoothMap();
          drawMap();
          map3dGen();
}
let animaInterval;
export function GenerateAnimaMap() {
  document.getElementById("anima").disabled = true;
  document.getElementById("instant").disabled = true;
  fillMap();
  animaInterval = setInterval(SmoothAndDraw, 90);
}

export function stopAnimation(){
  document.getElementById("anima").disabled = false;
  document.getElementById("instant").disabled = false;
  clearInterval(animaInterval);
}

function fillMap() {
  pepper = document.getElementById("pepper").value == "" ? 4 : document.getElementById("pepper").value;
  width = realwidth/pepper;
  height = realheight/pepper;
  map = [];
  map.length = width;
  for (var i = 0; i < width; i++) {
    map[i] = [];
    map[i].length = height;
  }
          for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
              if (i == 0 || j == 0 || i == width - 1 || j == height - 1) {
                map[i][j] = new Cell(i, -3, j);
              } else {
              map[i][j] = new Cell(i, Math.random()*12 - 6, j);
              }
            }
          }
}

function smoothMap() {
          for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
              var surroundingsSum = getNeighbours(i,j)/7.84;
              if (map[i][j].y < surroundingsSum) { if (map[i][j].y < 5.2){map[i][j].y += ascend }}
              else {if(map[i][j].y > -6.5) {map[i][j].y -= descend }}
            }
          }
}

function getNeighbours(x,y) {
          var quantity = 0;
          for (var nx = x-1; nx <= x+1; nx++) {
            for (var ny = y-1; ny <= y+1; ny++) {
              if (nx >= 0 && nx < width && ny > 0 && ny < height && ( nx != x || ny != y)){
                quantity += map[nx][ny].y;
              } else {
                quantity += -4;
              }
            }
          }
          return quantity;
}

function drawMap() {
          for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
              map[i][j].defineColor();
              ctx.fillStyle = map[i][j].color;
              ctx.fillRect(i*pepper,j*pepper,pepper,pepper);
              }
          }
}



export function map3dGen() {


  let arr1d = [];
  let colors = [];
  for (let i = 0; i < map.length; i++){
      for (let j = 0; j < map[i].length; j++){
        arr1d.push(...[i*10 - width*5, map[i][j].y*(10), j*10 - width*5]);
        var cl = map[i][j].parseColor();
        colors.push(+cl[0], +cl[1], +cl[2]);
    
        //console.log(map[i][j]);
      }
  }

  
  //console.log(colors);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1/1, 0.1, 20000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(1000, 1000, false);
  renderer.domElement.id = "zaza";
  (document.getElementById('zaza')).replaceWith(renderer.domElement);
  
  //-------- ----------
  // CUSTOM GEO WITH JUST A POSITION, AND NORMAL ATTRIBUTES
  //-------- ----------
  const geometry = new THREE.BufferGeometry();
  // position array of 4 points
  const pos = new THREE.BufferAttribute(
      new Float32Array([
          ...arr1d
      ]),
      3    // 3 numbers for every item in the buffer attribute ( x, y, z)
  );
  geometry.setAttribute('position', pos);
  // using computeVertexNormals to create normal attribute
  
  //-------- ----------
  //CREATING AN INDEX BY USING THE setIndex METHOD AND PASSING AN ARRAY
  //-------- ----------
  // drawing 2 trangles with just 4 points in the position attribute by giving an
  // array of index values for points in the position attribute to the setIndex method

 let indexedTriangles = [];
 
 for (let i = 0; i < arr1d.length/3 - width; i = i + 1) {
   if (i % width < width-1) {
     //console.log(i);
    indexedTriangles.push(i, i + 1, i + width);
    indexedTriangles.push(i + width + 1, i + width, i + 1);
    //console.log(i, i+1, i + 150);
   }
 }

 colors = new THREE.BufferAttribute(
  new Uint8Array([
      ...colors
  ]),
  3, true   // 3 numbers for every item in the buffer attribute ( x, y, z)
);


geometry.setAttribute( 'color', colors);
  
geometry.setIndex( indexedTriangles);

geometry.computeVertexNormals();
  //-------- ----------
  // SCENE CHILD OBJECTS
  //-------- ----------
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, vertexColors: true }) );
  const al = new THREE.PointLight(0xffffff, 1);
  al.position.y = 300;
  al.position.x = -1050;
  scene.add(mesh);
  scene.add(al);
 // scene.add( new THREE.GridHelper(10000, 10000) );
  //-------- ----------
  // RENDER
  //-------- ----------

  camera.position.set(-width*5 - 200,width*4, -width*5);
  camera.lookAt(0, 0, 0);
 
  renderer.render(scene, camera);
  
  
  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.003;
    //mesh.rotation.x += 0.003;
  
    renderer.render(scene, camera);
  }
  animate();
  }