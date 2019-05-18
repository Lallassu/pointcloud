if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

function Main() {
    this.renderer = 0;
    this.controls = 0;
    this.camera = 0;
    this.scene = 0;
    this.stats = 0;
    this.clock = 0;
    this.world = 0;
    this.player = 0;
    this.light1 = 0;

    Main.prototype.init = function() {
        var container = document.getElementById( 'container' );

        this.scene = new THREE.Scene();

        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 150 );
        this.camera.applyMatrix( new THREE.Matrix4().makeTranslation( 140, 5, 161 ) );
        this.camera.applyMatrix( new THREE.Matrix4().makeRotationX( -0.5 ) );
        
        this.scene.fog = new THREE.FogExp2( 0x0, 0.0120 );

     //   this.controls = new THREE.FlyControls( this.camera );
     //   this.controls.movementSpeed = 1000;
     //   this.controls.domElement = container;
     //   this.controls.rollSpeed = Math.PI / 14;
     //   this.controls.autoForward = false;
     //   this.controls.dragToLook = false;
        this.controls = new THREE.FirstPersonControls(this.camera);
        this.controls.lookSpeed = 0.4;
        this.controls.noFly = true;
        this.controls.lookVertical = false;
        this.controls.constrainVertical = true;
        this.controls.verticalMin = Math.PI/2;
        //this.controls.verticalMax = 2.0;
        this.controls.lon = -150;
        this.controls.lat = 120;
        this.controls.movementSpeed = 70;
        this.controls.object.position.x = 515;
        this.controls.object.position.z = 173;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( this.renderer.domElement );

        this.stats = new Stats();
        container.appendChild( this.stats.dom );

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

        var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
        light.position.set( 0, -4, -4 ).normalize();
        this.scene.add( light );
        
        this.world = new World(this);
        this.player = new Player(this);
        this.player.init();
        this.world.init();

        this.animate();
    };

    Main.prototype.onWindowResize = function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

    };

    Main.prototype.animate = function() {
        requestAnimationFrame( this.animate.bind(this) );
        this.render();
    };

    Main.prototype.render = function() {
        var time = Date.now() * 0.00005;
        var delta = this.clock.getDelta();

       // this.world.update(time, delta);
        this.player.update(time, delta);
        this.controls.update(delta);
        this.stats.update();
        this.renderer.render(this.scene, this.camera);
    };
}
