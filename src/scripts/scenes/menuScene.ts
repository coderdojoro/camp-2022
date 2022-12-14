import 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('level1', 'assets/menu/level1.png');
        this.load.image('level1-focus', 'assets/menu/level1-focus.png');
        this.load.image('level2', 'assets/menu/level2.png');
        this.load.image('level2-focus', 'assets/menu/level2-focus.png');
        this.load.image('logo', 'assets/menu/logo.png');
        this.load.image('main-image', 'assets/menu/mainscene image.jpg');
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
        let screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let title = this.add.image(screenCenterX, screenCenterY, 'main-image');
        let title1 = this.add.image(screenCenterX, screenCenterY, 'logo');
        title1.setScale(1.5);

        let scaleX = this.cameras.main.width / title.width;
        let scaleY = this.cameras.main.height / title.height;
        let scale = Math.max(scaleX, scaleY);
        title.setScale(scale);

        let playLvl1 = this.add.sprite(screenCenterX, 800, 'level1').setInteractive();
        playLvl1.setOrigin(0.5, 0);
        let playLvl2 = this.add.sprite(screenCenterX, 900, 'level2').setInteractive();
        playLvl2.setOrigin(0.5, 0);

        playLvl1.on(Phaser.Input.Events.POINTER_OVER, () => {
            playLvl1.setTexture('level1-focus');
        });
        playLvl1.on(Phaser.Input.Events.POINTER_OUT, () => {
            playLvl1.setTexture('level1');
        });
        playLvl1.on(Phaser.Input.Events.POINTER_DOWN, () => {
            playLvl1.setTexture('level1');
        });
        playLvl1.on(Phaser.Input.Events.POINTER_UP, () => {
            playLvl1.setTexture('level1-focus');
            this.scene.start('Level1Scene');
        });

        playLvl2.on(Phaser.Input.Events.POINTER_OVER, () => {
            playLvl2.setTexture('level2-focus');
        });
        playLvl2.on(Phaser.Input.Events.POINTER_OUT, () => {
            playLvl2.setTexture('level2');
        });
        playLvl2.on(Phaser.Input.Events.POINTER_DOWN, () => {
            playLvl2.setTexture('level2');
        });
        playLvl2.on(Phaser.Input.Events.POINTER_UP, () => {
            playLvl2.setTexture('level2-focus');
            this.scene.start('Level2Scene');
        });
    }
}
