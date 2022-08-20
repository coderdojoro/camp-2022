import 'phaser';
import House1FirstFloorScene from './scenes/house1FirstFloorScene';
import House1GroundFloorScene from './scenes/house1GroundFloorScene';
import House1Scene from './scenes/house1GroundFloorScene';
import Level1Scene from './scenes/level1Scene';
import Level2Scene from './scenes/level2Scene';
import MenuScene from './scenes/menuScene';
import StoreScene from './scenes/storeScene';
import { PhaserNavMeshPlugin } from 'phaser-navmesh';

export const phaserConfiguration = {
    type: Phaser.AUTO,
    backgroundColor: '#008080',
    plugins: {
        scene: [
            {
                key: 'PhaserNavMeshPlugin', // Key to store the plugin class under in cache
                plugin: PhaserNavMeshPlugin, // Class that constructs plugins
                mapping: 'navMeshPlugin', // Property mapping to use for the scene, e.g. this.navMeshPlugin
                start: true
            }
        ]
    },
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    render: {
        antialiasGL: false,
        pixelArt: true
    },
    scene: [MenuScene, Level1Scene, Level2Scene, House1GroundFloorScene, House1FirstFloorScene, StoreScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            debugShowVelocity: true,
            debugShowBody: true,
            debugShowStaticBody: true
        }
    },
    audio: {
        disableWebAudio: false
    },
    autoFocus: true
};

export let game: Phaser.Game;
window.addEventListener('load', () => {
    game = new Phaser.Game(phaserConfiguration);
});
