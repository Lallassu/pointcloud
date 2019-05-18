function Monster(main, x, y, z, filename) {
    this.main = main;
    this.filename = filename;
    this.x = x;
    this.y = y;
    this.z = z;
    this.mesh = undefined;

    Monster.prototype.init = function() {
        this.loadModel();
    };

    Monster.prototype.loadModel = function() {
        var loader = new THREE.ColladaLoader();
        var that = this;
        loader.load( this.filename, function ( collada ) {
            collada.scene.traverse( function ( child ) {
                if ( child instanceof THREE.SkinnedMesh ) {
                    var animation = new THREE.Animation( child, child.geometry.animation );
                    animation.play();
                }
            } );
            collada.scene.position.set(that.x, that.y, that.z);
            that.main.scene.add( collada.scene );
            collada.scene.scale.set(0.01, 0.01, 0.01);
            collada.scene.rotation.set(-Math.PI/2, 0,0);
            collada.scene.updateMatrix();
            that.mesh = collada.scene;
        } );
    };

    Monster.prototype.update = function(time, delta) {
        // Move only if player is nearby
        // wall Collision handler.
    };
};
