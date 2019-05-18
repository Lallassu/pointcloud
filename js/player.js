function Player(main) {
    this.main = main;
    this.missiles = [];

    Player.prototype.init = function() {
        document.onmousedown = this.mouseClick.bind(this);

    };

    Player.prototype.mouseClick = function(e) {
        this.shoot();
    };

    Player.prototype.shoot = function() {
        var m = new Missile(this.main);
        m.init();
        this.missiles.push(m);
    };

    Player.prototype.checkCollision = function() {

    };

    Player.prototype.move = function() {

    };


    Player.prototype.update = function(time, delta) {
        for(var i = 0; i < this.missiles.length; i++) {
            this.missiles[i].update(time, delta);
        }
    };

}
