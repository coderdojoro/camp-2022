import 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('play', 'assets/menu/play.png');
        this.load.image('play-focus', 'assets/menu/play-focus.png');
        this.load.image('title', 'assets/menu/title-bg.png');
    }

    create() {
        //remove the loading screen
        let loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('transparent');
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    // @ts-ignore
                    loadingScreen.remove();
                }
            });
        }

        this.cameras.main.fadeIn(2000);
        this.cameras.main.setBackgroundColor('#008080');

        let screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        let title = this.add.image(screenCenterX, 50, 'title');
        title.setOrigin(0.5, 0);
        let playLvl1 = this.add.sprite(screenCenterX, 850, 'play').setInteractive();
        title.setOrigin(0.5, 0);
        let playLvl2 = this.add.sprite(screenCenterX, 980, 'play').setInteractive();
        title.setOrigin(0.5, 0);

        playLvl1.on(Phaser.Input.Events.POINTER_OVER, () => {
            playLvl1.setTexture('play-focus');
        });
        playLvl1.on(Phaser.Input.Events.POINTER_OUT, () => {
            playLvl1.setTexture('play');
        });
        playLvl1.on(Phaser.Input.Events.POINTER_DOWN, () => {
            playLvl1.setTexture('play');
        });
        playLvl1.on(Phaser.Input.Events.POINTER_UP, () => {
            playLvl1.setTexture('play-focus');
            this.scene.start('Level1Scene');
        });

        playLvl2.on(Phaser.Input.Events.POINTER_OVER, () => {
            playLvl2.setTexture('play-focus');
        });
        playLvl2.on(Phaser.Input.Events.POINTER_OUT, () => {
            playLvl2.setTexture('play');
        });
        playLvl2.on(Phaser.Input.Events.POINTER_DOWN, () => {
            playLvl2.setTexture('play');
        });
        playLvl2.on(Phaser.Input.Events.POINTER_UP, () => {
            playLvl2.setTexture('play-focus');
            this.scene.start('Level2Scene');
        });
    }
}
