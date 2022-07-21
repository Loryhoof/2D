import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useLoaders, usePhysics, useCleanup, useLocalPlayer, useWorld, useCamera, useNpcManager} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default () => {
  const app = useApp();
  const physics = usePhysics();
  const localPlayer = useLocalPlayer();
  const world = useWorld();
  const camera = useCamera();
  const npcManager = useNpcManager();

  //building blocks
  let block = null;
  let triangle = null;
  let green_block = null;
  let coin = null;
  let grass = null;
  let dirt = null;
  let dark_dirt = null;
  let backgroundParallax = null;

  let generated = false;

  // generation parameters
  let width = 100;
  let height = 10;

  //structures
  let structureMaxWidth = 10;
  let structureMinWidth = 3;

  let structureMaxHeight = 5;
  let structureMinHeight = 1;

  let structureMaxDistance = 10;
  let structureMinDistance = 5;

  let lastStructurePosX = 0;
  let lastStructurePosY = 0;
  //

  let prefabsArray = [];

  let backgroundLayer = -5;

  let backgroundPlane = null;
  let backgroundStartPos = 0;

  let stairs = 
  [
    [0, 0, 1], // block type, displacement-x, displacement-y
    [1, 1, 1],
    [1, 2, 1],
    [1, 3, 1],
    [1, 4, 1],
    [1, 5, 1],
    [1, 6, 1],

    [0, 1, 2],
    [1, 2, 2],
    [1, 3, 2],
    [1, 4, 2],

    [0, 2, 3],
    [1, 3, 3],
    [1, 4, 3],

    [0, 3, 4],
    [1, 4, 4],
    [1, 5, 4],
    [1, 6, 4]
  ];

  let climbs = 
  [
    [0, -1, 1],
    [1, 0, 1],
    [1, 3, 3],
    [2, -3, 6],
    [2, -6, 8],
    [1, -10, 8],
    [2, -11, 8],
    [1, -12, 8]
  ]

  let house = 
  [
    // [2, 0, 1],
    // [2, 1, 1],
    // [2, 2, 1],
    // [2, 3, 1],
    // [2, 4, 1],
    // [2, 5, 1],
    // [2, 6, 1],

    // [2, 0, 4],
    // [2, 6, 4],

    // [2, 0, 5],
    // [2, 1, 5],
    // [2, 2, 5],
    // [2, 3, 5],
    // [2, 4, 5],
    // [2, 5, 5],
    // [2, 6, 5]


    [2, 0, 1],
    [2, 1, 1],
    [2, 2, 1],

    [2, 0, 2],
    [1, 1, 2],
    [2, 2, 2],

    [2, 0, 3],
    [1, 1, 3],
    [2, 2, 3],

    [2, 0, 4],
    [1, 1, 4],
    [2, 2, 4],

    [2, 0, 5],
    [1, 1, 5],
    [2, 2, 5],

    [2, 0, 6],
    [2, 1, 6],
    [2, 2, 6],

    [2, 0, 7],
    [2, 2, 7]


    

  ]

  // var geo = new THREE.PlaneBufferGeometry(100, 100, 1, 1);
  // var mat = new THREE.MeshBasicMaterial({ color: 0x200000, side: THREE.DoubleSide });
  // backgroundPlane = new THREE.Mesh(geo, mat);
  // backgroundPlane.position.set(50,50,backgroundLayer);

  //app.add(backgroundPlane);

  app.name = '2D';

  const _instantiateObj = (obj, h, w, keep3D = false) => {

    let noCollider = obj.noCollider ? obj.noCollider : false;

    let prefab = obj.clone();

    if(!keep3D) {
      prefab.children[0].children[0].visible = false;
    }

    prefab.position.x += w;
    prefab.position.y -= h;

    app.add(prefab);
    
    if(h <= 0 && !noCollider) {
      const physicsId = physics.addGeometry(prefab);
      physicsIds.push(physicsId);
    }

    app.updateMatrixWorld();

  }

  const _updateBackground = () => {
    if(!backgroundParallax) {
      return;
    }

    let length = 18.7499970198 *2;
    let parallaxEffect = [0, 0.2, 0.5, 0];
    let layers = [-5, -10, -15, -20];

    for (var i = 0; i < backgroundParallax.children.length; i++) {
      let obj = backgroundParallax.children.find(x => x.name === i.toString())
      let dist = (camera.position.x * parallaxEffect[i]);

      let temp = (camera.position.x * (1 - parallaxEffect[i]));

      // if(temp > backgroundStartPos + length) {
      //   backgroundStartPos += length;
      // }
      // else if(temp < backgroundStartPos - length) {
      //   backgroundStartPos -= length;
      // }

     if(temp > backgroundStartPos + (length))
      {
          backgroundStartPos += length;
      }
      else if (temp < backgroundStartPos - (length))
      {
          backgroundStartPos -= length;
      }

      obj.position.z = layers[i];
      obj.position.x = backgroundStartPos + dist;
      obj.updateMatrixWorld();
    }

    //backgroundParallax.position.x = startPos + dist;
    //backgroundParallax.updateMatrixWorld();

    //console.log(camera.position, backgroundParallax.position);
  }

  const _generateWorld = () => {

    console.log(stairs);
    for (var h = 0; h < height; h++) {
      for (var w = 0; w < width; w++) {
        

        if(h == 0 ) {

          if(w == 30) {

            for (var i = 0; i < stairs.length; i++) {
              let prefab = triangle.clone();

              if(stairs[i][0] == 0) {
                prefab = triangle.clone();
              }

              if(stairs[i][0] == 1) {
                prefab = block.clone();
              }

              if(stairs[i][0] == 2) {
                prefab = green_block.clone();
              }

              _instantiateObj(prefab, h-stairs[i][2], w+stairs[i][1]);
            }


            // for (var y = 0; y < structureMaxHeight; y++) {
            //   for (var x = 0; x < structureMaxWidth; x++) {
            //     let prefab = triangle.clone();
            //     if(x > 0) {
            //       prefab = block.clone();
            //     }
            //    _instantiateObj(prefab, h-1-y, w+x);
            //   }
            // }

          }

          if(w == 45) {

            for (var i = 0; i < climbs.length; i++) {
              let prefab = triangle.clone();
              let keep3D = false;

              if(climbs[i][0] == 0) {
                prefab = triangle.clone();
              }

              if(climbs[i][0] == 1) {
                prefab = block.clone();
              }

              if(climbs[i][0] == 2) {
                prefab = green_block.clone();
              }

              if(climbs[i][0] == 10) {
                prefab = coin.clone();
                keep3D = true;
              }

              _instantiateObj(prefab, h-climbs[i][2], w+climbs[i][1], keep3D);
            }

          }

          if(w == 75) {

            for (var i = 0; i < house.length; i++) {
              let prefab = triangle.clone();
              let keep3D = false;

              if(house[i][0] == 0) {
                prefab = triangle.clone();
              }

              if(house[i][0] == 1) {
                prefab = block.clone();
              }

              if(house[i][0] == 2) {
                prefab = green_block.clone();
              }

              if(house[i][0] == 10) {
                prefab = coin.clone();
                keep3D = true;
              }

              _instantiateObj(prefab, h-house[i][2], w+house[i][1], keep3D);
            }

          }

          // if(i == 30) {
          //   let prefab2 = triangle.clone();
          //   _instantiateObj(prefab2, h-1, i);
          // }

          // if(i == 31) {
          //   let prefab2 = block.clone();
          //   _instantiateObj(prefab2, h-1, i);
          // }

          // if(i == 32) {
          //   let prefab2 = block.clone();
          //   _instantiateObj(prefab2, h-1, i);
          // }

        }

        let d = Math.random();

        if(h <= 0) {
          _instantiateObj(grass.clone(), h, w);

        }
        else {
          if(d<0.8) {
            _instantiateObj(dirt.clone(), h, w);
          }
          else {
            _instantiateObj(dark_dirt.clone(), h,w);
          }
        }
      }
    }
    generated = true;
  }

  useFrame(() => {

    if(!generated && block && triangle && green_block && grass && dirt && dark_dirt) {
      _generateWorld();
    }

    _updateBackground();

    if(localPlayer && world && npcManager) {
      //console.log(localPlayer, world);
      // let obj = world.appManager.apps.find(x => x.name === 'silsword');
      // if(obj) {
      //   //onsole.log(localPlayer, obj);
      //   localPlayer.appManager.apps.push(obj);
      // }
      //console.log(obj);
      //console.log(npcManager);

      if(npcManager.npcs.length > 0) {
        let bot = npcManager.npcs[0];

        if(bot.appManager[1]) {
          //bot.appManager[1].use();
        }

        console.log(bot);

        // if(!bot.hasAction('use')) {
        //   const newAction = {
        //     type: 'use'
        //   };
        //   bot.addAction(newAction);
        // }
        // else {
        //   bot.removeAction('use');
        // }
        
        
      }
    }

  });

  let physicsIds = [];
  (async () => {
    const u = `${baseUrl}2d/assets/block.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    o = o.scene;
    block = o;
  })();

  (async () => {
    const u = `${baseUrl}2d/assets/grass.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    o = o.scene;
    grass = o;
  })();

  (async () => {
    const u = `${baseUrl}2d/assets/dirt.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    o = o.scene;
    dirt = o;
  })();

  (async () => {
    const u = `${baseUrl}2d/assets/dark_dirt.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    o = o.scene;
    dark_dirt = o;
  })();

  (async () => {
    const u = `${baseUrl}2d/assets/green_block.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    o = o.scene;
    green_block = o;
  })();

  (async () => {
    const u = `${baseUrl}2d/assets/triangle.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    o = o.scene;
    triangle = o;
  })();

  (async () => {
    const u = `${baseUrl}2d/assets/coin.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    o = o.scene;
    coin = o;
  })();

  (async () => {
    const u = `${baseUrl}2d/assets/background.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    o = o.scene;
    backgroundParallax = o;
    app.add(backgroundParallax);
    //console.log(backgroundParallax);
  })();
  
  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
  });

  return app;
};
