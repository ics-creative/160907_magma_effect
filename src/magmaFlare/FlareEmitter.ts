import Flare from './Flare';

/**
 * フレアエミッタークラスです。
 */
export default class FlareEmiiter extends THREE.Object3D {

  /** フレアの数 */
  private _flareNum:number = 10;
  /** フレアリスト */
  private _flareList:Flare[] = [];

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    let perAngle = 360 / this._flareNum;
    for(let i = 0; i < this._flareNum; i++) {
      let rad = perAngle * i * Math.PI / 180;
      let flare = new Flare();
      flare.rotation.x = rad;
      flare.rotation.y = rad;
      flare.rotation.z = rad / 2;
      this.add(flare);
      this._flareList.push(flare);
    }
  }

  /**
   * フレーム毎の更新です。
   */
  public update() {
    this._flareList.forEach((flare) => {
      flare.update();
    });
  }
}
