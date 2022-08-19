import 'phaser';
import { AreaCollider } from '../../areaCollider';
import Grizzly from '../sprites/grizzly';
import Hero from '../sprites/hero';
import TelportScene from './telportScene';

export default class Level1Scene extends TelportScene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    preload() {
        this.load.image('ground-tiles', 'assets/tilesets/ground-tileset.png');
        this.load.image('maze-tiles', 'assets/tilesets/maze-tileset1.png');
        this.load.image('things1-tiles', 'assets/tilesets/things-tileset1.png');
        this.load.image('things2-tiles', 'assets/tilesets/things-tileset2.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/town.json');

        this.load.spritesheet('hero-idle-e-spritesheet', 'assets/hero/idle_aggro_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-walk-e-spritesheet', 'assets/hero/walk_aggro_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-walk-s-spritesheet', 'assets/hero/walk_aggro_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-idle-s-spritesheet', 'assets/hero/idle_aggro_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-idle-n-spritesheet', 'assets/hero/idle_aggro_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-walk-n-spritesheet', 'assets/hero/walk_aggro_N.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('hero-atk-e-spritesheet', 'assets/hero/atk_heavy_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-atk-n-spritesheet', 'assets/hero/atk_heavy_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-atk-s-spritesheet', 'assets/hero/atk_heavy_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-hitdead-e-spritesheet', 'assets/hero/hitdead_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-hitdead-n-spritesheet', 'assets/hero/hitdead_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-hitdead-s-spritesheet', 'assets/hero/hitdead_S.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('grizzly-idle-spritesheet', 'assets/enemies/grizzly-idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-walk-n-spritesheet', 'assets/enemies/grizzly-north.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-walk-s-spritesheet', 'assets/enemies/grizzly-south.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-walk-e-spritesheet', 'assets/enemies/grizzly-east.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-die-spritesheet', 'assets/enemies/grizzly-die.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.cameras.main.fadeIn(2000);
        this.cameras.main.setBackgroundColor('#008080');

        this.map = this.make.tilemap({ key: 'map' });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        let tileset = this.map.addTilesetImage('ground', 'ground-tiles', 32, 32, 1, 2);
        let tileset2 = this.map.addTilesetImage('maze', 'maze-tiles', 32, 32, 1, 2);
        let tileset3 = this.map.addTilesetImage('things1', 'things1-tiles', 32, 32, 0, 0);
        let tileset4 = this.map.addTilesetImage('things2', 'things2-tiles', 32, 32, 1, 2);

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        let belowLayer = this.map.createLayer('Below hero', [tileset, tileset2, tileset3, tileset4], 0, 0);
        let objectsBelowLayer = this.map.createLayer('Objects below hero', [tileset, tileset2, tileset3, tileset4], 0, 0);
        this.worldLayer = this.map.createLayer('World', [tileset, tileset2, tileset3, tileset4], 0, 0);
        let aboveLayer = this.map.createLayer('Above hero', [tileset, tileset2, tileset3, tileset4], 0, 0);

        this.worldLayer.setCollisionBetween(tileset.firstgid, tileset.firstgid + tileset.total, true);
        this.worldLayer.setCollisionBetween(tileset2.firstgid, tileset2.firstgid + tileset2.total, true);
        this.worldLayer.setCollisionBetween(tileset3.firstgid, tileset3.firstgid + tileset3.total, true);
        this.worldLayer.setCollisionBetween(tileset4.firstgid, tileset4.firstgid + tileset4.total, true);

        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above this.hero" layer to sit on top of the this.hero, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects.
        aboveLayer.setDepth(200);

        // include tiles in red squares
        // belowLayer.layer.data.forEach((arr) => {
        //     arr.forEach((tile) => {
        //         let rectangle = this.add.rectangle(tile.pixelX, tile.pixelY, 32, 32);
        //         rectangle.setDepth(1000);
        //         rectangle.setStrokeStyle(1, 0xff0000, 1);
        //         rectangle.setOrigin(0, 0);
        //     });
        // });

        // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
        // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
        let spawnPoint: Phaser.Types.Tilemaps.TiledObject = this.map.findObject('Objects', (obj) => obj.name == 'Spawn Point');

        this.hero = new Hero(this, spawnPoint.x, spawnPoint.y);
        this.hero.setDepth(100);
        this.hero.setScale(0.4);

        this.teleportAreas = this.map.filterObjects('Objects', (obj) => obj.type === 'TELEPORT_AREA');

        let grizzlyObjects: Phaser.Types.Tilemaps.TiledObject[] = this.map.getObjectLayer('Objects').objects.filter((obj) => obj.name == 'grizzly');
        for (let grizzlyObject of grizzlyObjects) {
            let grizzly = new Grizzly(this, grizzlyObject.x, grizzlyObject.y);
        }

        // Watch the this.hero and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(this.hero, this.worldLayer);

        this.physics.world.setBoundsCollision(true, true, true, true);

        let camera = this.cameras.main;
        camera.startFollow(this.hero);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // camera.setZoom(0.5);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }

    update(time, delta) {
        AreaCollider.update(this);
    }
}
