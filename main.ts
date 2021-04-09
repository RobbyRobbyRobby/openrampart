function LevelStart () {
    info.startCountdown(60)
    game.showLongText("Prepare to defend yourself!", DialogLayout.Center)
}
function LoadNeutralSprites () {
	
}
function InitLevels () {
    Levels = []
    CurrentLevelIndex = 0
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    Shoot()
})
function LoadLevel () {
    LoadEnemySprites()
    LoadNeutralSprites()
    scene.setBackgroundColor(8)
    tiles.setTilemap(tilemap`level1`)
    mySprite.setPosition(152, 112)
    Cursor.setPosition(144, 104)
    info.setLife(3)
    LevelStart()
}
function LoadEnemySprites () {
	
}
info.onCountdownEnd(function () {
	
})
function Shoot () {
    if (MaxActiveProjectiles > Projectiles.length) {
        ProjectileDestinationX = Cursor.x
        ProjectileDestinationY = Cursor.y
        if (mySprite.x - ProjectileDestinationX < mySprite.y - ProjectileDestinationY) {
            ProjectileVelocityX = (mySprite.x - ProjectileDestinationX) / (mySprite.y - ProjectileDestinationY) * ProjectileBaseSpeed
            ProjectileVelocityY = ProjectileBaseSpeed
        } else {
            ProjectileVelocityX = ProjectileBaseSpeed
            ProjectileVelocityY = (mySprite.y - ProjectileDestinationY) / (mySprite.x - ProjectileDestinationX) * ProjectileBaseSpeed
        }
        newProjectile = sprites.createProjectileFromSprite(assets.image`Cannonball`, mySprite, ProjectileVelocityX, ProjectileVelocityY)
        sprites.setDataNumber(newProjectile, "DestinationX", ProjectileDestinationX)
        sprites.setDataNumber(newProjectile, "DestinationY", ProjectileDestinationY)
        Projectiles.push(newProjectile)
        music.pewPew.play()
    }
}
info.onLifeZero(function () {
	
})
function InitPlayerSprite () {
    info.setScore(0)
    controller.moveSprite(Cursor, 100, 100)
    Cursor.setStayInScreen(true)
}
function InitGame () {
    InitSpriteVariables()
    InitLevels()
    LoadLevel()
}
function InitSpriteVariables () {
    SpriteTemplates = []
    EnemySprites = []
    NeutralSprites = []
    Projectiles = []
    mySprite = sprites.create(assets.image`Base`, SpriteKind.Player)
    Cursor = sprites.create(assets.image`Crosshair`, SpriteKind.Player)
    ProjectileBaseSpeed = -25
    MaxActiveProjectiles = 3
    InitPlayerSprite()
}
let NeutralSprites: number[] = []
let EnemySprites: number[] = []
let SpriteTemplates: number[] = []
let newProjectile: Sprite = null
let ProjectileVelocityY = 0
let ProjectileBaseSpeed = 0
let ProjectileVelocityX = 0
let ProjectileDestinationY = 0
let ProjectileDestinationX = 0
let Projectiles: Sprite[] = []
let MaxActiveProjectiles = 0
let Cursor: Sprite = null
let mySprite: Sprite = null
let CurrentLevelIndex = 0
let Levels: number[] = []
InitGame()
game.onUpdate(function () {
    for (let value of Projectiles) {
        if (Math.round(value.x) == Math.round(sprites.readDataNumber(value, "DestinationX")) && Math.round(value.y) == Math.round(sprites.readDataNumber(value, "DestinationY"))) {
            value.setVelocity(0, 0)
            value.destroy(effects.fire, 500)
            music.smallCrash.play()
            Projectiles.removeAt(Projectiles.indexOf(value))
        }
    }
})
