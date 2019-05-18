function Missile(main) {
    this.main = main;
    this.mesh = undefined;
    this.color = '0xFFFFFF';
    this.active = 0;
    this.ray = 0;
    this.direction = 0;
    this.speed = 4;

    Missile.prototype.init = function() {
        var geo = new THREE.BoxGeometry(1,1,1);

        var mat = new THREE.MeshBasicMaterial({color: 0xFF0000});
        this.mesh = new THREE.Mesh(geo, mat);

        this.mesh.scale.set(0.5, 0.5, 0.5);
        this.mesh.position.x = this.main.camera.position.x;
        this.mesh.position.y = this.main.camera.position.y;
        this.mesh.position.z = this.main.camera.position.z;
        this.mesh.visible = true;
        this.main.scene.add(this.mesh);


        //this.main.camera.updateMatrixWorld();
        //var vector = new THREE.Vector3();
        //vector.setFromMatrixPosition( this.main.camera.matrixWorld );

        //var rotationMatrix = new THREE.Matrix4() ;
        //rotationMatrix.extractRotation( this.main.camera.matrix ) ;
        //var rotationVector = new THREE.Vector3( 0, -1, 0 ) ;
        //rotationVector.applyMatrix4(rotationMatrix) ;
        //var ray = new THREE.Raycaster( vector, rotationVector );


        var targetVec = new THREE.Vector3();
        var projector = new THREE.Projector();
        targetVec.set(0,0,1);
        var vector = targetVec;
        //projector.unprojectVector(vector, this.main.camera);
        vector.unproject(this.main.camera);
        var ray = new THREE.Ray(this.main.camera.position, vector.sub(this.main.camera.position).normalize() );
        targetVec.copy(ray.direction);

        this.ray = ray;
        this.direction = ray.direction;

    };

    Missile.prototype.update = function(time, delta) {
        if(this.mesh != undefined) {
            this.mesh.position.x += this.direction.x * this.speed;
            this.mesh.position.z += this.direction.z * this.speed;
            if(this.main.world.checkHit(this.mesh.position)) {
                this.main.world.explode(this.mesh.position.x|0, this.mesh.position.y|0, this.mesh.position.z|0, 4);
                this.main.scene.remove(this.mesh);
                this.mesh = undefined;
            }
        }
    };
}
