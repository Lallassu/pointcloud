function World(main) {
    this.main = main;
    this.scene = main.scene;
    this.world_x = 640;
    this.world_y = 64;
    this.world_z = 640;
    this.chunk_size_x = 16;
    this.chunk_size_y = 16;
    this.chunk_size_z = 16;
    this.chunks = 0;
    this.chunk_list = [];
    this.textures = 0;
    this.monsters = [];

    World.prototype.init = function() {
        // Create chunks.
        var id = 0;
        this.chunks = new Array(this.world_x/this.chunk_size_x);
        for(var x = 0; x <= this.world_x/this.chunk_size_x; x++) {
            this.chunks[x] = new Array(this.world_y/this.chunk_size_y);
            for(var y = 0; y <= this.world_y/this.chunk_size_y; y++) {
                this.chunks[x][y] = new Array(this.world_z/this.chunk_size_z);
                for(var z = 0; z <= this.world_z/this.chunk_size_z; z++) {
                    this.chunks[x][y][z] = new Chunk(this, x*this.chunk_size_x/2,y*this.chunk_size_y/2,z*this.chunk_size_z/2);
                    this.chunks[x][y][z].id = id;
                    this.chunk_list[id] = this.chunks[x][y][z];
                    id++;
                }
            }
        }
        this.textures = new Textures();
        this.textures.prepare();
        this.loadMap();

      //  var vox = new Vox();
      //  var that = this;
      //  vox.LoadFile("world", "assets/vox/monu9.vox", "map", function(data) {
      //      var d = vox.LoadModel(data.target.response, "world");
      //      var list = [];
      //      // Add 30 of them
      //      for(var n = 0; n < 1; n++) {
      //          var ox = Math.random()*that.world_x|0;
      //          var oz = Math.random()*that.world_z|0;
      //          for(var i = 0; i < d.data.length; i++) {
      //              var a = d.data[i];
      //              var r = (a.val >> 24) & 0xFF;
      //              var g = (a.val >> 16) & 0xFF;
      //              var b = (a.val >> 8) & 0xFF;
      //              
      //              list.push({x: ox+a.x, y: a.z+2, z: oz+a.y, r: r, g: g, b: b, intensity: 1});
      //          }
      //          that.addBatch(list);
      //      }
      //  });
    };

    World.prototype.getChunk = function(x, y, z) {
        var x_ = parseInt(x  / (this.chunk_size_x));
        var y_ = parseInt(y  / (this.chunk_size_y));
        var z_ = parseInt(z  / (this.chunk_size_z));
        if(x_ < 0 || y_ < 0 || z_ < 0 || 
            x_ > (this.world_x/this.chunk_size_x)-1 ||
            y_ > (this.world_y/this.chunk_size_y)-1 ||
            z_ > (this.world_z/this.chunk_size_z)-1)
        {
            return undefined;
        }
        return this.chunks[x_][y_][z_]; 
    };

    World.prototype.explode = function(x, y, z, power) {
        var pow = power*power;

        var list = [];
        var vx = 0, vy = 0, vz = 0, val = 0, offset = 0;
        for(var rx = x-power; rx <= x+power; rx++) {
            vx = Math.pow((rx-x), 2); //*(rx-x);
                for(var rz = z-power; rz <= z+power; rz++) {
                    vz = Math.pow((rz-z),2)+vx; //*(rz-z);
                        for(var ry = y-power; ry <= y+power; ry++) {
                            val = Math.pow((ry-y),2)+vz;
                            if(val <= pow) {
                                list.push({x: rx, y: ry, z: rz});
                            }
                        }
                }
        }
        this.removeBatch(list);
    };

    World.prototype.checkHit = function(pos) {
        pos.x |= 0;
        pos.y |= 0;
        pos.z |= 0;
        var c = this.getChunk(pos.x, pos.y, pos.z);
        if(c == undefined) {
            return false;
        }
        return c.checkExists(pos.x, pos.y, pos.z);
    };

    World.prototype.removeBatch = function(points) {
        var list = {};
        for(var i = 0; i < points.length; i++) {
            c = this.getChunk(points[i].x, points[i].y, points[i].z);
            if(c == undefined) { 
                continue; 
            }
            c.batch_points.push({x: points[i].x, y: points[i].y, z: points[i].z});
            list[c.id] = 1;
        }
        for(var i in list) {
            this.chunk_list[i].removeBatch();
        }
    };

    World.prototype.addBatch = function(points) {
        var list = {};
        for(var i = 0; i < points.length; i++) {
            c = this.getChunk(points[i].x, points[i].y, points[i].z);
            c.batch_points.push({x: points[i].x, y: points[i].y, z: points[i].z,
                r: points[i].r, g: points[i].g, b: points[i].b, intensity: points[i].intensity});
            list[c.id] = 1;
        }
        for(var i in list) {
            this.chunk_list[i].addBatch();
        }
    };

    World.prototype.addBlock = function(x, y, z, r, g, b) {
        var c = this.getChunk(x,y,z); 
        c.addBlock(x, y, z, r, g, b);
    };

    World.prototype.removeBlock = function(x, y, z) {
        var c = this.getChunk(x,y,z); 
        if(c != undefined && c.obj != undefined) {
            c.removeBlock(x, y, z);
            console.log("REMOVE",x,y,z);
        }
    };

    World.prototype.addCrate = function(x_,y_,z_) {
        var list = [];
        var size = 16;
        for(var x = x_; x < x_+size; x++) {
            for(var y = y_; y < y_+size; y++) {
                for(var z = z_; z < z_+size; z++) {
                    col = this.textures.getPixel(x-x_, y-y_, CRATE1);
                    list.push({x: x, y: y, z: z, r: col.r, g: col.g, b: col.b, intensity: 1});
                }
            }
        }
        this.addBatch(list);
    };

    World.prototype.loadMap = function() {
        if(!this.textures.isLoaded()) {
            var that = this;
            setTimeout(function() { that.loadMap()}, 100);
            console.log("loading map...");
            return;
        }
        var map = this.textures.getMap(MAP1);
        var d = 0;
        var list = [];
        for(var x = 0; x < map.width; x++) {
            for(var y = 0; y < map.height; y++) {
                var r = 0, g = 0, b = 0, intensity = 1;
                r = map.map[x][y].r;
                g = map.map[x][y].g;
                b = map.map[x][y].b;
                if(r == 0xFF && g == 0x00) {
                    // Red: Spawn enemy.
                    // B = type of enemy.
                    if(b == 170) {
                        var m = new Monster(this.main, x, 2, y, "models/monster.dae");
                        m.init();
                        this.monsters.push(m);
                        console.log("Added monster");
                    } else if(b == 0x02) {

                    }
                }
                if(r == 0xFF && g == 0xFF && b == 0xFF) {
                    // walls
                    var build_wall = false;
                    var shift = false;
                    if(x > 0) {
                        if(map.map[x-1][y].r == 0 && map.map[x-1][y].g == 0 && map.map[x-1][y].b == 0) {
                            build_wall = true;
                        }
                    }
                    if(x < map.width) {
                        if(map.map[x+1][y].r == 0 && map.map[x+1][y].g == 0 && map.map[x+1][y].b == 0) {
                            build_wall = true;
                        }
                    }
                    if(y < map.height) {
                        if(map.map[x][y+1].r == 0 && map.map[x][y+1].g == 0 && map.map[x][y+1].b == 0) {
                            build_wall = true;
                        }
                    }
                    if(y > 0) {
                        if(map.map[x][y-1].r == 0 && map.map[x][y-1].g == 0 && map.map[x][y-1].b == 0) {
                            build_wall = true;
                        }
                    }
                    if(y < map.height && x < map.width) {
                        if(map.map[x+1][y+1].r == 0 && map.map[x+1][y+1].g == 0 && map.map[x+1][y+1].b == 0) {
                            build_wall = true;
                        }
                    }
                    if(y > 0 && x > 0) {
                        if(map.map[x-1][y-1].r == 0 && map.map[x-1][y-1].g == 0 && map.map[x-1][y-1].b == 0) {
                            build_wall = true;
                        }
                    }
                    if(y < map.height && x > 0) {
                        if(map.map[x-1][y+1].r == 0 && map.map[x-1][y+1].g == 0 && map.map[x-1][y+1].b == 0) {
                            build_wall = true;
                        }
                    }
                    if(y > 0 && x < map.width) {
                        if(map.map[x+1][y-1].r == 0 && map.map[x+1][y-1].g == 0 && map.map[x+1][y-1].b == 0) {
                            build_wall = true;
                        }
                    }
                    if(build_wall) {
                        for(var yy = 0; yy < 40; yy++) {
                            var col = 0;
                            if(shift) {
                                col = this.textures.getPixel(yy, x, WALL1);
                            } else {
                                col = this.textures.getPixel(x, yy, WALL1);
                            }
                            list.push({x: x, y: yy, z: y, r: col.r, g: col.g, b: col.b, intensity: intensity});
                        }
                    }
                    var col = this.textures.getPixel(x, y, FLOOR1);
                    list.push({x: x, y: 0, z: y, r: col.r, g: col.g, b: col.b, intensity: intensity});
                    col = this.textures.getPixel(x, y, ROOF1);
                    list.push({x: x, y: 40, z: y, r: col.r, g: col.g, b: col.b, intensity: intensity});
                }
            }
        }
        this.addBatch(list);
        // Cleanup
        this.textures.clean();
    };

    World.prototype.update = function(time, delta) {
    //    var total = 0;
    //    for(var i = 0 ; i < this.chunk_list.length; i++) {
    //        this.chunk_list[i].update(time, delta);
    //        total += this.chunk_list[i].points;
    //    }
        THREE.AnimationHandler.update(delta);
        for(var i = 0; i < this.monsters.length; i++) {
            this.monsters[i].update(time, delta);
        }
    };

}
