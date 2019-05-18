function Chunk(world, x, y, z, id) {
    this.id = id;
    this.world = world;
    this.from_x = x;
    this.from_y = y;
    this.from_z = z;
    this.obj = undefined;
    this.particle_size = 3;
    this.need_update = false;
    this.points = 0;
    this.batch_points = [];

    Chunk.prototype.init = function() {
        var geometry = new THREE.Geometry();
        geometry.colors = [];

        var material = new THREE.PointsMaterial( { size: this.particle_size, vertexColors: THREE.VertexColors} );
        this.obj = new THREE.Points( geometry, material );
        this.obj.position.set(this.from_x, this.from_y, this.from_z);
        this.obj.sortParticles = true;
        this.world.scene.add(this.obj);
    };

    Chunk.prototype.removeBatch = function() {
        if(this.obj == undefined) {
            return;
        }
        var removed = 0;
        for(var i = 0; i < this.batch_points.length; i++) {
            this.batch_points[i].x -= this.from_x;
            this.batch_points[i].y -= this.from_y;
            this.batch_points[i].z -= this.from_z;
            for(var n = 0; n < this.obj.geometry.vertices.length; n++) {
                if(this.obj.geometry.vertices[n].x == this.batch_points[i].x && this.obj.geometry.vertices[n].y == this.batch_points[i].y && this.obj.geometry.vertices[n].z == this.batch_points[i].z) {
                    this.obj.geometry.vertices[n] = 0;
                    this.obj.geometry.colors[n] = 0; // new THREE.Color(0, 0,1, 0.5);
                   // this.obj.geometry.vertices.splice(n, 1);
                   // this.obj.geometry.colors.splice(n, 1);
                    removed++;
                }
                if(removed == this.batch_points.length) {
                    break;
                }
            }
            if(removed == this.batch_points.length) {
                break;
            }
        }
        this.points -= removed;
        this.batch_points = [];
        this.obj.geometry.verticesNeedUpdate = true;
        this.checkVisible();
    };

    Chunk.prototype.removeBlock = function(x, y, z) {
        x -= this.from_x;
        y -= this.from_y;
        z -= this.from_z;
        for(var n = 0; n < this.obj.geometry.vertices.length; n++) {
            if(this.obj.geometry.vertices[n].x == x && this.obj.geometry.vertices[n].y == y && this.obj.geometry.vertices[n].z == z) {
                this.obj.geometry.vertices.splice(n, 1);
                this.obj.geometry.colors.splice(n, 1);
                break;
            }
        }
        this.obj.geometry.verticesNeedUpdate = true;
        this.points--;
        this.checkVisible();
    };

    Chunk.prototype.checkExists = function(x, y, z) {
        if(this.obj == undefined) {
            return false;
        }
        x -= this.from_x;
        y -= this.from_y;
        z -= this.from_z;
        for(var n = 0; n < this.obj.geometry.vertices.length; n++) {
            if(this.obj.geometry.vertices[n].x == x && this.obj.geometry.vertices[n].y == y && this.obj.geometry.vertices[n].z == z) {
                return true;
            }
        }
        return false; 
    };

    // points: x,y,z,r,g,b,intensity
    Chunk.prototype.addBatch = function() {
        this.points += this.batch_points.length;
        this.checkVisible();

        for(var i = 0; i < this.batch_points.length; i++) {
            this.batch_points[i].x -= this.from_x;
            this.batch_points[i].y -= this.from_y;
            this.batch_points[i].z -= this.from_z;
            var color = new THREE.Color((this.batch_points[i].r/255)*this.batch_points[i].intensity, (this.batch_points[i].g/255)*this.batch_points[i].intensity, (this.batch_points[i].b/255)*this.batch_points[i].intensity);
            this.obj.geometry.colors.push(color);
            this.obj.geometry.vertices.push(new THREE.Vector3(this.batch_points[i].x, this.batch_points[i].y, this.batch_points[i].z));
        }
        this.batch_points = [];
        this.obj.geometry.verticesNeedUpdate = true;
    };

    Chunk.prototype.addBlock = function(x, y, z, r, g, b) {
        this.points++;
        this.checkVisible();

        var intensity = 1;
        x -= this.from_x;
        y -= this.from_y;
        z -= this.from_z;
        var color = new THREE.Color((r/255)*intensity, (g/255)*intensity, (b/255)*intensity );
        this.obj.geometry.colors.push(color);
        this.obj.geometry.vertices.push(new THREE.Vector3(x, y, z));
        this.obj.sortParticles = true;
        this.obj.geometry.verticesNeedUpdate = true;
    };

    Chunk.prototype.checkVisible = function() {
        if(this.points > 0 && this.obj == undefined) {
            this.init();         
        } else if(this.points == 0 && this.obj != undefined) {
            this.world.scene.remove(this.obj);
            this.obj = undefined;
        }
    };

    Chunk.prototype.update = function(time, delta) {
    };
};
