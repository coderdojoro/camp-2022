import { Scene } from 'phaser';
<<<<<<< HEAD
import Hero from '../sprites/hero';
=======
>>>>>>> f77307134e20cf453bd5c24588b211530f4cd074
import { PhaserNavMeshPlugin } from 'phaser-navmesh';
import Hero from '../sprites/hero';

export default class TelportScene extends Scene {
    hero: Hero;
    teleportAreas: Array<Phaser.Types.Tilemaps.TiledObject>;
    map: Phaser.Tilemaps.Tilemap;
    worldLayer: Phaser.Tilemaps.TilemapLayer;
    navMeshPlugin: PhaserNavMeshPlugin;
}
