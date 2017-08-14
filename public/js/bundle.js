(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        _super.call(this, 45, window.innerWidth / window.innerHeight, 1, 1000);
        this._angle = 0;
        this._radius = 20;
        this.position.set(this._radius, 4, 0);
        Camera._instance = this;
    }
    Camera.getInstance = function () {
        return Camera._instance || new Camera();
    };
    Camera.prototype.rotate = function (direction) {
        if (direction == "left") {
            this._angle -= 0.5;
        }
        else if (direction == "right") {
            this._angle += 0.5;
        }
    };
    Camera.prototype.update = function () {
        this._angle += 0.3;
        var lad = this._angle * Math.PI / 180;
        this.position.x = this._radius * Math.sin(lad);
        this.position.z = this._radius * Math.cos(lad);
        this.lookAt(new THREE.Vector3(0, 0, 0));
    };
    return Camera;
}(THREE.PerspectiveCamera));
exports.__esModule = true;
exports["default"] = Camera;

},{}],2:[function(require,module,exports){
"use strict";
var Camera_1 = require('./Camera');
var Plane_1 = require('./Plane');
var MagmaFlare_1 = require('./magmaFlare/MagmaFlare');
var Main = (function () {
    function Main() {
        this._frame = 0;
        this._scene = new THREE.Scene();
        this._camera = Camera_1["default"].getInstance();
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setClearColor(0x000000);
        this._renderer.setPixelRatio(1);
        this._resize();
        document.body.appendChild(this._renderer.domElement);
        var plane = new Plane_1["default"]();
        plane.position.y = -3;
        this._scene.add(plane);
        this._magmaFlare = new MagmaFlare_1["default"]();
        this._scene.add(this._magmaFlare);
        this._stats = new Stats();
        document.body.appendChild(this._stats.dom);
        this._tick();
        this._onResize = this._onResize.bind(this);
        window.addEventListener('resize', this._onResize);
    }
    Main.prototype._tick = function () {
        var _this = this;
        requestAnimationFrame(function () { _this._tick(); });
        this._frame++;
        this._camera.update();
        this._magmaFlare.update();
        if (this._frame % 2) {
            return;
        }
        this._stats.begin();
        this._renderer.render(this._scene, this._camera);
        this._stats.end();
    };
    Main.prototype._onResize = function (event) {
        this._resize();
    };
    Main.prototype._resize = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this._renderer.domElement.setAttribute('width', String(width));
        this._renderer.domElement.setAttribute('height', String(height));
        this._renderer.setSize(width, height);
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
    };
    return Main;
}());
window.addEventListener('load', function () {
    new Main();
});

},{"./Camera":1,"./Plane":3,"./magmaFlare/MagmaFlare":9}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plane = (function (_super) {
    __extends(Plane, _super);
    function Plane() {
        _super.call(this);
        var gridHelper = new THREE.GridHelper(10, 20);
        this.add(gridHelper);
        var axisHelper = new THREE.AxisHelper(2);
    }
    return Plane;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = Plane;

},{}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Aura = (function (_super) {
    __extends(Aura, _super);
    function Aura() {
        _super.call(this);
        this._geometry = new THREE.SphereGeometry(2.05, 20, 20);
        var loader = new THREE.TextureLoader();
        this._map = loader.load('./assets/texture/aura3_type2.png');
        this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;
        this._material = new THREE.MeshBasicMaterial({
            map: this._map,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this._mesh = new THREE.Mesh(this._geometry, this._material);
        this.add(this._mesh);
    }
    Aura.prototype.update = function () {
        if (this._map) {
            this._map.offset.x -= 0.005;
            this._map.offset.y -= 0.005;
        }
    };
    return Aura;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = Aura;

},{}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Flare = (function (_super) {
    __extends(Flare, _super);
    function Flare() {
        _super.call(this);
        this._offset = new THREE.Vector2();
        this._randomRatio = Math.random() + 1;
        this._speed = Math.random() * 0.05 + 0.01;
        this._topRadius = 6;
        this._bottomRadius = 2;
        this._diameter = this._topRadius - this._bottomRadius;
        this._geometry = new THREE.CylinderGeometry(this._topRadius, this._bottomRadius, 0, 30, 3, true);
        var loader = new THREE.TextureLoader();
        this._map = loader.load('./assets/texture/aura3_type2.png');
        this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;
        this._map.repeat.set(10, 10);
        this._material = this._createMaterial();
        this._mesh = new THREE.Mesh(this._geometry, this._material);
        this.add(this._mesh);
    }
    Flare.prototype._createMaterial = function () {
        var material = new THREE.ShaderMaterial({
            uniforms: {
                map: {
                    type: 't',
                    value: this._map
                },
                offset: {
                    type: 'v2',
                    value: this._offset
                },
                opacity: {
                    type: 'f',
                    value: 0.15
                },
                innerRadius: {
                    type: 'f',
                    value: this._bottomRadius
                },
                diameter: {
                    type: 'f',
                    value: this._diameter
                }
            },
            vertexShader: "\n        varying vec2 vUv;       // \u30D5\u30E9\u30B0\u30E1\u30F3\u30C8\u30B7\u30A7\u30FC\u30C0\u30FC\u306B\u6E21\u3059UV\u5EA7\u6A19\n        varying float radius;   // \u30D5\u30E9\u30B0\u30E1\u30F3\u30C8\u30B7\u30A7\u30FC\u30C0\u30FC\u306B\u6E21\u3059\u534A\u5F84\n        uniform vec2 offset;    // \u30AB\u30E9\u30FC\u30DE\u30C3\u30D7\u306E\u30BA\u30EC\u4F4D\u7F6E\n\n        void main()\n        {\n          // \u672C\u6765\u306E\u4E00\u304B\u3089uv\u3092\u305A\u3089\u3059\n          vUv = uv + offset;\n          // \u4E2D\u5FC3\u304B\u3089\u9802\u70B9\u5EA7\u6A19\u307E\u3067\u306E\u8DDD\u96E2\n          radius = length(position);\n          // 3\u6B21\u5143\u4E0A\u9802\u70B9\u5EA7\u6A19\u3092\u753B\u9762\u4E0A\u306E\u4E8C\u6B21\u5143\u5EA7\u6A19\u306B\u5909\u63DB(\u304A\u6C7A\u307E\u308A)\n          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        }\n      ",
            fragmentShader: "\n        uniform sampler2D map;      // \u30C6\u30AF\u30B9\u30C1\u30E3\n        uniform float opacity;      // \u900F\u660E\u5EA6\n        uniform float diameter;     // \u30C9\u30FC\u30CA\u30C4\u306E\u592A\u3055\n        uniform float innerRadius;  // \u5185\u5186\u306E\u534A\u5F84\n        varying vec2 vUv;           // UV\u5EA7\u6A19\n        varying float radius;       // \u4E2D\u5FC3\u30C9\u30C3\u30C8\u307E\u3067\u306E\u8DDD\u96E2\n        const float PI = 3.1415926; // \u5186\u5468\u7387\n\n        void main() {\n          // UV\u306E\u4F4D\u7F6E\u304B\u3089\u30C6\u30AF\u30B9\u30C1\u30E3\u306E\u8272\u3092\u53D6\u5F97\n          vec4 tColor = texture2D(map, vUv);\n          // \u63CF\u753B\u4F4D\u7F6E\u304C\u30C9\u30FC\u30CA\u30C4\u306E\u5E45\u306E\u4F55\u5272\u306E\u4F4D\u7F6E\u306B\u306A\u308B\u304B\n          float ratio = (radius - innerRadius) / diameter;\n          float opacity = opacity * sin(PI * ratio);\n          // \u30D9\u30FC\u30B9\u30AB\u30E9\u30FC\n          vec4 baseColor = (tColor + vec4(0.0, 0.0, 0.3, 1.0));\n          // \u900F\u660E\u5EA6\u3092\u53CD\u6620\u3055\u305B\u308B\n          gl_FragColor = baseColor * vec4(1.0, 1.0, 1.0, opacity);\n        }\n      ",
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        return material;
    };
    Flare.prototype.update = function () {
        this._offset.x += 0.004 * this._randomRatio;
        this._offset.y -= 0.015 * this._randomRatio;
    };
    return Flare;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = Flare;

},{}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Flare_1 = require('./Flare');
var FlareEmiiter = (function (_super) {
    __extends(FlareEmiiter, _super);
    function FlareEmiiter() {
        _super.call(this);
        this._flareNum = 10;
        this._flareList = [];
        var perAngle = 360 / this._flareNum;
        for (var i = 0; i < this._flareNum; i++) {
            var rad = perAngle * i * Math.PI / 180;
            var flare = new Flare_1["default"]();
            flare.rotation.x = rad;
            flare.rotation.y = rad;
            flare.rotation.z = rad / 2;
            this.add(flare);
            this._flareList.push(flare);
        }
    }
    FlareEmiiter.prototype.update = function () {
        this._flareList.forEach(function (flare) {
            flare.update();
        });
    };
    return FlareEmiiter;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = FlareEmiiter;

},{"./Flare":5}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Camera_1 = require('../Camera');
var InGlow = (function (_super) {
    __extends(InGlow, _super);
    function InGlow() {
        _super.call(this);
        this._geometry = new THREE.SphereGeometry(2.07, 20, 20);
        var camera = Camera_1["default"].getInstance();
        this._material = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { type: "c", value: new THREE.Color(0x96ecff) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: "\n        uniform vec3 viewVector;    // \u30AB\u30E1\u30E9\u4F4D\u7F6E\n        varying float opacity;      // \u900F\u660E\u5EA6\n        void main()\n        {\n          // \u9802\u70B9\u6CD5\u7DDA\u30D9\u30AF\u30C8\u30EB x\n          vec3 nNomal = normalize(normal);\n          vec3 nViewVec = normalize(viewVector);\n\n          // \u900F\u660E\u5EA6\n          opacity = dot(nNomal, nViewVec);\n          // \u53CD\u8EE2\n          opacity = 1.0 - opacity;\n\n          // \u304A\u6C7A\u307E\u308A\n          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        }\n      ",
            fragmentShader: "\n        uniform vec3 glowColor;\n        varying float opacity;\n        void main()\n        {\n          gl_FragColor = vec4(glowColor, opacity);\n        }\n      ",
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this._mesh = new THREE.Mesh(this._geometry, this._material);
        this.add(this._mesh);
    }
    return InGlow;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = InGlow;

},{"../Camera":1}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Magma = (function (_super) {
    __extends(Magma, _super);
    function Magma() {
        _super.call(this);
        this._geometry = new THREE.SphereGeometry(2, 20, 20);
        var loader = new THREE.TextureLoader();
        this._map = loader.load('./assets/texture/magma.png');
        this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;
        this._material = new THREE.MeshBasicMaterial({
            map: this._map
        });
        this._mesh = new THREE.Mesh(this._geometry, this._material);
        this.add(this._mesh);
    }
    Magma.prototype.update = function () {
        if (this._map) {
            this._map.offset.x += 0.007;
            this._map.offset.y += 0.008;
        }
    };
    return Magma;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = Magma;

},{}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Magma_1 = require('./Magma');
var Aura_1 = require('./Aura');
var InGlow_1 = require('./InGlow');
var FlareEmitter_1 = require('./FlareEmitter');
var SparkEmitter_1 = require('./SparkEmitter');
var OutGlow_1 = require('./OutGlow');
var MagmaFlare = (function (_super) {
    __extends(MagmaFlare, _super);
    function MagmaFlare() {
        _super.call(this);
        this._magma = new Magma_1["default"]();
        this._aura = new Aura_1["default"]();
        this._inGlow = new InGlow_1["default"]();
        this._flareEmitter = new FlareEmitter_1["default"]();
        this._sparkEmitter = new SparkEmitter_1["default"]();
        this._outGlow = new OutGlow_1["default"]();
        this.add(this._magma);
        this.add(this._aura);
        this.add(this._inGlow);
        this.add(this._flareEmitter);
        this.add(this._sparkEmitter);
        this.add(this._outGlow);
    }
    MagmaFlare.prototype.update = function () {
        this._magma.update();
        this._aura.update();
        this._flareEmitter.update();
        this._sparkEmitter.update();
    };
    return MagmaFlare;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = MagmaFlare;

},{"./Aura":4,"./FlareEmitter":6,"./InGlow":7,"./Magma":8,"./OutGlow":10,"./SparkEmitter":12}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutGlow = (function (_super) {
    __extends(OutGlow, _super);
    function OutGlow() {
        _super.call(this);
        var loader = new THREE.TextureLoader();
        var map = loader.load('./assets/texture/Particle01.png');
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xffffff,
            blending: THREE.AdditiveBlending,
            opacity: 0.8,
            transparent: true
        });
        this._sprite = new THREE.Sprite(material);
        this._sprite.scale.multiplyScalar(11);
        this.add(this._sprite);
    }
    return OutGlow;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = OutGlow;

},{}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Spark = (function (_super) {
    __extends(Spark, _super);
    function Spark() {
        _super.call(this);
        this._speed = Math.random() * 0.2 + 0.2;
        this._opacity = 0.5;
        this._geometry = new THREE.PlaneGeometry(0.15, 2);
        var loader = new THREE.TextureLoader();
        this._map = loader.load('./assets/texture/Burst01.png');
        this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;
        this._material = new THREE.MeshBasicMaterial({
            map: this._map,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            opacity: this._opacity
        });
        this._mesh = new THREE.Mesh(this._geometry, this._material);
        this._mesh.position.y = Math.random() * 5;
        this._mesh.rotation.y = Math.random() * 2;
        this.add(this._mesh);
    }
    Spark.prototype.update = function () {
        this._mesh.position.y -= this._speed;
        this._mesh.material.opacity -= 0.05;
        if (this._mesh.position.y < 0) {
            this._mesh.position.y = 6;
            this._mesh.material.opacity = this._opacity;
        }
    };
    return Spark;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = Spark;

},{}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Spark_1 = require('./Spark');
var SparkEmitter = (function (_super) {
    __extends(SparkEmitter, _super);
    function SparkEmitter() {
        _super.call(this);
        this._sparkList = [];
        this._sparkNum = 50;
        var perAngle = 360 / this._sparkNum;
        for (var i = 0; i < this._sparkNum; i++) {
            var rad = perAngle * i * Math.PI / 180;
            var spark = new Spark_1["default"]();
            spark.rotation.x = 360 * Math.sin(rad);
            spark.rotation.z = rad;
            this.add(spark);
            this._sparkList.push(spark);
        }
    }
    SparkEmitter.prototype.update = function () {
        this._sparkList.forEach(function (spark) {
            spark.update();
        });
    };
    return SparkEmitter;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = SparkEmitter;

},{"./Spark":11}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2FtZXJhLnRzIiwic3JjL01haW4udHMiLCJzcmMvUGxhbmUudHMiLCJzcmMvbWFnbWFGbGFyZS9BdXJhLnRzIiwic3JjL21hZ21hRmxhcmUvRmxhcmUudHMiLCJzcmMvbWFnbWFGbGFyZS9GbGFyZUVtaXR0ZXIudHMiLCJzcmMvbWFnbWFGbGFyZS9Jbkdsb3cudHMiLCJzcmMvbWFnbWFGbGFyZS9NYWdtYS50cyIsInNyYy9tYWdtYUZsYXJlL01hZ21hRmxhcmUudHMiLCJzcmMvbWFnbWFGbGFyZS9PdXRHbG93LnRzIiwic3JjL21hZ21hRmxhcmUvU3BhcmsudHMiLCJzcmMvbWFnbWFGbGFyZS9TcGFya0VtaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNHQTtJQUFvQywwQkFBdUI7SUFnQnpEO1FBQ0Usa0JBQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUcsSUFBSSxDQUFDLENBQUM7UUFUdEQsV0FBTSxHQUFVLENBQUMsQ0FBQztRQUVsQixZQUFPLEdBQVUsRUFBRSxDQUFDO1FBUzFCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFuQmEsa0JBQVcsR0FBekI7UUFDRSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxJQUFJLE1BQU0sRUFBRSxDQUFDO0lBQzFDLENBQUM7SUF1Qk0sdUJBQU0sR0FBYixVQUFjLFNBQWdCO1FBQzVCLEVBQUUsQ0FBQSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLElBQUUsR0FBRyxDQUFDO1FBQ25CLENBQUM7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QUFFLEVBQUUsQ0FBQztZQUN2QyxJQUFJLEdBQUcsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBQ3ZDLElBQUksS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFDSCxDQUFDO0lBS00sNkJBQU0sR0FBYjtRQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVztZQUNsQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQWpDQSxBQWlDQyxDQWpDeUMsS0FBSyxDQUFDLFFBQVEsR0FpQ3ZEO0FBakNEO2lDQWlDQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICog44Kr44Oh44Op44Gu44Kv44Op44K544Gn44GZ44CCXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbWVyYSBleHRlbmRzIFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHtcblxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6Q2FtZXJhO1xuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6Q2FtZXJhIHtcbiAgICByZXR1cm4gQ2FtZXJhLl9pbnN0YW5jZSB8fCBuZXcgQ2FtZXJhKCk7XG4gIH1cblxuICAvKiog44Ki44OL44Oh44O844K344On44Oz44Gr55So44GE44KL6KeS5bqm44Gu5YCk44Gn44GZ44CCICovXG4gIHByaXZhdGUgX2FuZ2xlOm51bWJlciA9IDA7XG4gIC8qKiDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjga7lhobou4zpgZPjga7ljYrlvoTjgafjgZnjgIIgKi9cbiAgcHJpdmF0ZSBfcmFkaXVzOm51bWJlciA9IDIwO1xuXG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr/jg7zjgafjgZnjgIJcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcig0NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDEsICAxMDAwKTtcblxuICAgIHRoaXMucG9zaXRpb24uc2V0KHRoaXMuX3JhZGl1cywgNCwgMCk7XG5cbiAgICBDYW1lcmEuX2luc3RhbmNlID0gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDlm57ou6LjgZXjgZvjgb7jgZnjgIJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRpcmVjdGlvblxuICAgKi9cbiAgcHVibGljIHJvdGF0ZShkaXJlY3Rpb246c3RyaW5nKSB7XG4gICAgaWYoZGlyZWN0aW9uID09IFwibGVmdFwiKSB7XG4gICAgICB0aGlzLl9hbmdsZS09MC41O1xuICAgIH0gZWxzZSBpZihkaXJlY3Rpb24gPT0gXCJyaWdodFwiKSB7XG4gICAgICB0aGlzLl9hbmdsZSs9MC41O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDmr47jg5Xjg6zjg7zjg6Djga7mm7TmlrDjgpLjgYvjgZHjgb7jgZnjgIJcbiAgICovXG4gIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgdGhpcy5fYW5nbGUrPTAuMztcbiAgICBsZXQgbGFkID0gdGhpcy5fYW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xuICAgIHRoaXMucG9zaXRpb24ueCA9IHRoaXMuX3JhZGl1cyAqIE1hdGguc2luKGxhZCk7XG4gICAgdGhpcy5wb3NpdGlvbi56ID0gdGhpcy5fcmFkaXVzICogTWF0aC5jb3MobGFkKTtcbiAgICB0aGlzLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XG4gIH1cblxufVxuIiwiaW1wb3J0IENhbWVyYSBmcm9tICcuL0NhbWVyYSc7XG5pbXBvcnQgUGxhbmUgZnJvbSAnLi9QbGFuZSc7XG5pbXBvcnQgTWFnbWFGbGFyZSBmcm9tICcuL21hZ21hRmxhcmUvTWFnbWFGbGFyZSc7XG5cbi8qKlxuICog44OH44Oi44Gu44Oh44Kk44Oz44Kv44Op44K544Gn44GZ44CCXG4gKi9cbmNsYXNzIE1haW4ge1xuXG4gIC8qKiDjgrfjg7zjg7Pjgqrjg5bjgrjjgqfjgq/jg4jjgafjgZnjgIIgKi9cbiAgcHJpdmF0ZSBfc2NlbmU6VEhSRUUuU2NlbmU7XG4gIC8qKiDjgqvjg6Hjg6njgqrjg5bjgrjjgqfjgq/jg4jjgafjgZnjgIIgKi9cbiAgcHJpdmF0ZSBfY2FtZXJhOkNhbWVyYTtcbiAgLyoqIOODrOODs+ODgOODqeODvOOCquODluOCuOOCp+OCr+ODiOOBp+OBmeOAgiAqL1xuICBwcml2YXRlIF9yZW5kZXJlcjpUSFJFRS5XZWJHTFJlbmRlcmVyO1xuICAvKiogRlBT6KGo56S6ICovXG4gIHByaXZhdGUgX3N0YXRzOlN0YXRzO1xuXG4gIC8qKiDjg5Xjg6zjg7zjg6Djgqvjgqbjg7Pjg4ggKi9cbiAgcHJpdmF0ZSBfZnJhbWU6bnVtYmVyID0gMDtcbiAgLyoqIOOCq+ODoeODqeOBruenu+WLleWQkeOBjSAqL1xuICBwcml2YXRlIF9tb3ZlRGlyZWN0aW9uOnN0cmluZztcblxuICAvKiog44Oe44Kw44Oe44OV44Os44KiICovXG4gIHByaXZhdGUgX21hZ21hRmxhcmU6TWFnbWFGbGFyZTtcblxuICAvKipcbiAgICog44Kz44Oz44K544OI44Op44Kv44K/44O844Gn44GZ44CCXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAvLyDjgrfjg7zjg7NcbiAgICB0aGlzLl9zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgLy8g44Kr44Oh44OpXG4gICAgdGhpcy5fY2FtZXJhID0gQ2FtZXJhLmdldEluc3RhbmNlKCk7XG5cbiAgICAvLyDjg6zjg7Pjg4Djg6njg7xcbiAgICB0aGlzLl9yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHthbnRpYWxpYXM6IHRydWV9KTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQaXhlbFJhdGlvKDEpO1xuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5fcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAvLyDlnLDpnaJcbiAgICBsZXQgcGxhbmUgPSBuZXcgUGxhbmUoKTtcbiAgICBwbGFuZS5wb3NpdGlvbi55ID0gLTM7XG4gICAgdGhpcy5fc2NlbmUuYWRkKHBsYW5lKTtcblxuICAgIC8vIOODnuOCsOODnuODleODrOOColxuICAgIHRoaXMuX21hZ21hRmxhcmUgPSBuZXcgTWFnbWFGbGFyZSgpO1xuICAgIHRoaXMuX3NjZW5lLmFkZCh0aGlzLl9tYWdtYUZsYXJlKTtcblxuICAgIC8vIOW3puS4iuOBq+ihqOekuuOBmeOCi+OCiOOBhkNTU+OCkuiomOi/sOOBl+OBpmJvZHnnm7TkuIvjgavooajnpLpcbiAgICB0aGlzLl9zdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5fc3RhdHMuZG9tKTtcblxuICAgIHRoaXMuX3RpY2soKTtcblxuICAgIC8vIOODquOCteOCpOOCuuOCkuebo+imllxuICAgIHRoaXMuX29uUmVzaXplID0gdGhpcy5fb25SZXNpemUuYmluZCh0aGlzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25SZXNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODleODrOODvOODoOavjuOBruOCouODi+ODoeODvOOCt+ODp+ODs+OBruabtOaWsOOCkuOBi+OBkeOBvuOBmeOAglxuICAgKi9cbiAgcHJpdmF0ZSBfdGljaygpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyB0aGlzLl90aWNrKCkgfSk7XG5cbiAgICAvLyDjg5Xjg6zjg7zjg6Djgqvjgqbjg7Pjg4jjgpLjgqTjg7Pjgq/jg6rjg6Hjg7Pjg4hcbiAgICB0aGlzLl9mcmFtZSsrO1xuXG4gICAgLy8g44Kr44Oh44Op44Gu5pu05pawXG4gICAgdGhpcy5fY2FtZXJhLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5fbWFnbWFGbGFyZS51cGRhdGUoKTtcblxuICAgIC8vIEZQU+OCkjMw44GrXG4gICAgaWYodGhpcy5fZnJhbWUgJSAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU3RhdHPjga7oqIjmuKzjgpLplovlp4tcbiAgICB0aGlzLl9zdGF0cy5iZWdpbigpO1xuICAgIC8vIOaPj+eUu1xuICAgIHRoaXMuX3JlbmRlcmVyLnJlbmRlcih0aGlzLl9zY2VuZSwgdGhpcy5fY2FtZXJhKTtcbiAgICAvLyBTdGF0c+OBruioiOa4rOe1guS6hlxuICAgIHRoaXMuX3N0YXRzLmVuZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODquOCteOCpOOCuuaZguOBruODj+ODs+ODieODqeODvOOBp+OBmeOAglxuICAgKi9cbiAgcHJvdGVjdGVkIF9vblJlc2l6ZShldmVudDpFdmVudCk6dm9pZCB7XG4gICAgdGhpcy5fcmVzaXplKCk7XG4gIH1cblxuICAvKipcbiAgICog44Oq44K144Kk44K65Yem55CGXG4gICAqL1xuICBwcml2YXRlIF9yZXNpemUoKSB7XG4gICAgbGV0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBTdHJpbmcod2lkdGgpKTtcbiAgICB0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKGhlaWdodCkpO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5fY2FtZXJhLmFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xuICAgIHRoaXMuX2NhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gIG5ldyBNYWluKCk7XG59KTtcbiIsIi8qKlxuICog5Zyw6Z2i44Kv44Op44K5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYW5lIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Qge1xuXG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr/jg7xcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8g44Kw44Oq44OD44OJ44OY44Or44OR44O8XG4gICAgdmFyIGdyaWRIZWxwZXIgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcigxMCwgMjApO1xuICAgIHRoaXMuYWRkKGdyaWRIZWxwZXIpO1xuXG4gICAgLy8g6Lu444OY44Or44OR44O8XG4gICAgdmFyIGF4aXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhpc0hlbHBlcigyKTtcbiAgICAvL3RoaXMuYWRkKGF4aXNIZWxwZXIpO1xuICB9XG5cbn1cbiIsIi8qKlxuICog44Kq44O844Op55CD44Kv44Op44K544Gn44GZ44CCXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1cmEgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRCB7XG5cbiAgLyoqIOOCuOOCquODoeODiOODqiAqL1xuICBwcml2YXRlIF9nZW9tZXRyeTpUSFJFRS5TcGhlcmVHZW9tZXRyeTtcbiAgLyoqIOOCq+ODqeODvOODnuODg+ODlyAqL1xuICBwcml2YXRlIF9tYXA6VEhSRUUuVGV4dHVyZTtcbiAgLyoqIOODnuODhuODquOCouODqyAqL1xuICBwcml2YXRlIF9tYXRlcmlhbDpUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbDtcbiAgLyoqIOODoeODg+OCt+ODpSAqL1xuICBwcml2YXRlIF9tZXNoOlRIUkVFLk1lc2g7XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv+ODvFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyDjgrjjgqrjg6Hjg4jjg6pcbiAgICB0aGlzLl9nZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgyLjA1LCAyMCwgMjApO1xuXG4gICAgLy8g44Kr44Op44O844Oe44OD44OXXG4gICAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgdGhpcy5fbWFwID0gbG9hZGVyLmxvYWQoJy4vYXNzZXRzL3RleHR1cmUvYXVyYTNfdHlwZTIucG5nJyk7XG4gICAgdGhpcy5fbWFwLndyYXBTID0gdGhpcy5fbWFwLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG5cbiAgICAvLyDjg57jg4bjg6rjgqLjg6tcbiAgICB0aGlzLl9tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICBtYXA6IHRoaXMuX21hcCxcbiAgICAgIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nLFxuICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgICB9KTtcblxuICAgIC8vIOODoeODg+OCt+ODpVxuICAgIHRoaXMuX21lc2ggPSBuZXcgVEhSRUUuTWVzaChcbiAgICAgIHRoaXMuX2dlb21ldHJ5LFxuICAgICAgdGhpcy5fbWF0ZXJpYWxcbiAgICApO1xuICAgIHRoaXMuYWRkKHRoaXMuX21lc2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODleODrOODvOODoOavjuOBruabtOaWsFxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpIHtcbiAgICBpZih0aGlzLl9tYXApIHtcbiAgICAgIHRoaXMuX21hcC5vZmZzZXQueCAtPSAwLjAwNTtcbiAgICAgIHRoaXMuX21hcC5vZmZzZXQueSAtPSAwLjAwNTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICog44OV44Os44Ki44Kv44Op44K544Gn44GZ44CCXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsYXJlIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Qge1xuXG4gIC8qKiDjgrjjgqrjg6Hjg4jjg6ogKi9cbiAgcHJpdmF0ZSBfZ2VvbWV0cnk6VEhSRUUuQ3lsaW5kZXJHZW9tZXRyeTtcbiAgLyoqIOOCq+ODqeODvOODnuODg+ODlyAqL1xuICBwcml2YXRlIF9tYXA6VEhSRUUuVGV4dHVyZTtcbiAgLyoqIOODnuODhuODquOCouODqyAqL1xuICBwcml2YXRlIF9tYXRlcmlhbDpUSFJFRS5TaGFkZXJNYXRlcmlhbDtcbiAgLyoqIOODoeODg+OCt+ODpSAqL1xuICBwcml2YXRlIF9tZXNoOlRIUkVFLk1lc2g7XG4gIC8qKiDjgrnjg5Tjg7zjg4kgKi9cbiAgcHJpdmF0ZSBfc3BlZWQ6bnVtYmVyO1xuICAvKiog44Kq44OV44K744OD44OIICovXG4gIHByaXZhdGUgX29mZnNldDpUSFJFRS5WZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgLyoqIOS4iumdouOBruWNiuW+hCAqL1xuICBwcml2YXRlIF90b3BSYWRpdXM6bnVtYmVyO1xuICAvKiog5LiL6Z2i44Gu5Y2K5b6EICovXG4gIHByaXZhdGUgX2JvdHRvbVJhZGl1czpudW1iZXI7XG4gIC8qKiDjg4njg7zjg4rjg4Tjga7lpKrjgZUgKi9cbiAgcHJpdmF0ZSBfZGlhbWV0ZXI6bnVtYmVyO1xuXG4gIC8qKiDjg6njg7Pjg4Djg6Dkv4LmlbAgKi9cbiAgcHJpdmF0ZSBfcmFuZG9tUmF0aW86bnVtYmVyID0gTWF0aC5yYW5kb20oKSArIDE7XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv+ODvFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9zcGVlZCA9IE1hdGgucmFuZG9tKCkgKiAwLjA1ICsgMC4wMTtcblxuICAgIHRoaXMuX3RvcFJhZGl1cyA9IDY7XG4gICAgdGhpcy5fYm90dG9tUmFkaXVzID0gMjtcbiAgICB0aGlzLl9kaWFtZXRlciA9IHRoaXMuX3RvcFJhZGl1cyAtIHRoaXMuX2JvdHRvbVJhZGl1cztcblxuICAgIC8vIOOCuOOCquODoeODiOODqlxuICAgIHRoaXMuX2dlb21ldHJ5ID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkodGhpcy5fdG9wUmFkaXVzLCB0aGlzLl9ib3R0b21SYWRpdXMsIDAsIDMwLCAzLCB0cnVlKTtcblxuICAgIC8vIOOCq+ODqeODvOODnuODg+ODl1xuICAgIGxldCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgIHRoaXMuX21hcCA9IGxvYWRlci5sb2FkKCcuL2Fzc2V0cy90ZXh0dXJlL2F1cmEzX3R5cGUyLnBuZycpO1xuICAgIHRoaXMuX21hcC53cmFwUyA9IHRoaXMuX21hcC53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgIHRoaXMuX21hcC5yZXBlYXQuc2V0KDEwLCAxMCk7XG5cbiAgICAvLyDjg57jg4bjg6rjgqLjg6tcbiAgICB0aGlzLl9tYXRlcmlhbCA9IHRoaXMuX2NyZWF0ZU1hdGVyaWFsKCk7XG5cbiAgICAvLyDjg6Hjg4Pjgrfjg6VcbiAgICB0aGlzLl9tZXNoID0gbmV3IFRIUkVFLk1lc2goXG4gICAgICB0aGlzLl9nZW9tZXRyeSxcbiAgICAgIHRoaXMuX21hdGVyaWFsXG4gICAgKTtcbiAgICB0aGlzLmFkZCh0aGlzLl9tZXNoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg57jg4bjg6rjgqLjg6vjgpLnlJ/miJDjgZfjgb7jgZnjgIJcbiAgICogQHJldHVybiBUSFJFRS5TaGFkZXJNYXRlcmlhbFxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlTWF0ZXJpYWwoKTpUSFJFRS5TaGFkZXJNYXRlcmlhbCB7XG4gICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKHtcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIG1hcDoge1xuICAgICAgICAgIHR5cGU6ICd0JyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5fbWFwXG4gICAgICAgIH0sXG4gICAgICAgIG9mZnNldDoge1xuICAgICAgICAgIHR5cGU6ICd2MicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuX29mZnNldFxuICAgICAgICB9LFxuICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgdHlwZTogJ2YnLFxuICAgICAgICAgIHZhbHVlOiAwLjE1XG4gICAgICAgIH0sXG4gICAgICAgIGlubmVyUmFkaXVzOiB7XG4gICAgICAgICAgdHlwZTogJ2YnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLl9ib3R0b21SYWRpdXNcbiAgICAgICAgfSxcbiAgICAgICAgZGlhbWV0ZXI6IHtcbiAgICAgICAgICB0eXBlOiAnZicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuX2RpYW1ldGVyXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2ZXJ0ZXhTaGFkZXI6IGBcbiAgICAgICAgdmFyeWluZyB2ZWMyIHZVdjsgICAgICAgLy8g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44O844Gr5rih44GZVVbluqfmqJlcbiAgICAgICAgdmFyeWluZyBmbG9hdCByYWRpdXM7ICAgLy8g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44O844Gr5rih44GZ5Y2K5b6EXG4gICAgICAgIHVuaWZvcm0gdmVjMiBvZmZzZXQ7ICAgIC8vIOOCq+ODqeODvOODnuODg+ODl+OBruOCuuODrOS9jee9rlxuXG4gICAgICAgIHZvaWQgbWFpbigpXG4gICAgICAgIHtcbiAgICAgICAgICAvLyDmnKzmnaXjga7kuIDjgYvjgol1duOCkuOBmuOCieOBmVxuICAgICAgICAgIHZVdiA9IHV2ICsgb2Zmc2V0O1xuICAgICAgICAgIC8vIOS4reW/g+OBi+OCiemggueCueW6p+aomeOBvuOBp+OBrui3nembolxuICAgICAgICAgIHJhZGl1cyA9IGxlbmd0aChwb3NpdGlvbik7XG4gICAgICAgICAgLy8gM+asoeWFg+S4iumggueCueW6p+aomeOCkueUu+mdouS4iuOBruS6jOasoeWFg+W6p+aomeOBq+WkieaPmyjjgYrmsbrjgb7jgoopXG4gICAgICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNChwb3NpdGlvbiwgMS4wKTtcbiAgICAgICAgfVxuICAgICAgYCxcbiAgICAgIGZyYWdtZW50U2hhZGVyOiBgXG4gICAgICAgIHVuaWZvcm0gc2FtcGxlcjJEIG1hcDsgICAgICAvLyDjg4bjgq/jgrnjg4Hjg6NcbiAgICAgICAgdW5pZm9ybSBmbG9hdCBvcGFjaXR5OyAgICAgIC8vIOmAj+aYjuW6plxuICAgICAgICB1bmlmb3JtIGZsb2F0IGRpYW1ldGVyOyAgICAgLy8g44OJ44O844OK44OE44Gu5aSq44GVXG4gICAgICAgIHVuaWZvcm0gZmxvYXQgaW5uZXJSYWRpdXM7ICAvLyDlhoXlhobjga7ljYrlvoRcbiAgICAgICAgdmFyeWluZyB2ZWMyIHZVdjsgICAgICAgICAgIC8vIFVW5bqn5qiZXG4gICAgICAgIHZhcnlpbmcgZmxvYXQgcmFkaXVzOyAgICAgICAvLyDkuK3lv4Pjg4njg4Pjg4jjgb7jgafjga7ot53pm6JcbiAgICAgICAgY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5MjY7IC8vIOWGhuWRqOeOh1xuXG4gICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgICAvLyBVVuOBruS9jee9ruOBi+OCieODhuOCr+OCueODgeODo+OBruiJsuOCkuWPluW+l1xuICAgICAgICAgIHZlYzQgdENvbG9yID0gdGV4dHVyZTJEKG1hcCwgdlV2KTtcbiAgICAgICAgICAvLyDmj4/nlLvkvY3nva7jgYzjg4njg7zjg4rjg4Tjga7luYXjga7kvZXlibLjga7kvY3nva7jgavjgarjgovjgYtcbiAgICAgICAgICBmbG9hdCByYXRpbyA9IChyYWRpdXMgLSBpbm5lclJhZGl1cykgLyBkaWFtZXRlcjtcbiAgICAgICAgICBmbG9hdCBvcGFjaXR5ID0gb3BhY2l0eSAqIHNpbihQSSAqIHJhdGlvKTtcbiAgICAgICAgICAvLyDjg5njg7zjgrnjgqvjg6njg7xcbiAgICAgICAgICB2ZWM0IGJhc2VDb2xvciA9ICh0Q29sb3IgKyB2ZWM0KDAuMCwgMC4wLCAwLjMsIDEuMCkpO1xuICAgICAgICAgIC8vIOmAj+aYjuW6puOCkuWPjeaYoOOBleOBm+OCi1xuICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IGJhc2VDb2xvciAqIHZlYzQoMS4wLCAxLjAsIDEuMCwgb3BhY2l0eSk7XG4gICAgICAgIH1cbiAgICAgIGAsXG4gICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICBkZXB0aFRlc3Q6IGZhbHNlLFxuICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gbWF0ZXJpYWw7XG4gIH1cblxuICAvKipcbiAgICog44OV44Os44O844Og5q+O44Gu5pu05pawXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlKCkge1xuICAgIHRoaXMuX29mZnNldC54ICs9IDAuMDA0ICogdGhpcy5fcmFuZG9tUmF0aW87XG4gICAgdGhpcy5fb2Zmc2V0LnkgLT0gMC4wMTUgKiB0aGlzLl9yYW5kb21SYXRpbztcbiAgfVxufVxuIiwiaW1wb3J0IEZsYXJlIGZyb20gJy4vRmxhcmUnO1xuXG4vKipcbiAqIOODleODrOOCouOCqOODn+ODg+OCv+ODvOOCr+ODqeOCueOBp+OBmeOAglxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbGFyZUVtaWl0ZXIgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRCB7XG5cbiAgLyoqIOODleODrOOCouOBruaVsCAqL1xuICBwcml2YXRlIF9mbGFyZU51bTpudW1iZXIgPSAxMDtcbiAgLyoqIOODleODrOOCouODquOCueODiCAqL1xuICBwcml2YXRlIF9mbGFyZUxpc3Q6RmxhcmVbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr/jg7xcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgbGV0IHBlckFuZ2xlID0gMzYwIC8gdGhpcy5fZmxhcmVOdW07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX2ZsYXJlTnVtOyBpKyspIHtcbiAgICAgIGxldCByYWQgPSBwZXJBbmdsZSAqIGkgKiBNYXRoLlBJIC8gMTgwO1xuICAgICAgbGV0IGZsYXJlID0gbmV3IEZsYXJlKCk7XG4gICAgICBmbGFyZS5yb3RhdGlvbi54ID0gcmFkO1xuICAgICAgZmxhcmUucm90YXRpb24ueSA9IHJhZDtcbiAgICAgIGZsYXJlLnJvdGF0aW9uLnogPSByYWQgLyAyO1xuICAgICAgdGhpcy5hZGQoZmxhcmUpO1xuICAgICAgdGhpcy5fZmxhcmVMaXN0LnB1c2goZmxhcmUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDjg5Xjg6zjg7zjg6Dmr47jga7mm7TmlrDjgafjgZnjgIJcbiAgICovXG4gIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgdGhpcy5fZmxhcmVMaXN0LmZvckVhY2goKGZsYXJlKSA9PiB7XG4gICAgICBmbGFyZS51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IENhbWVyYSBmcm9tICcuLi9DYW1lcmEnO1xuXG4vKipcbiAqIOOCpOODs+OCsOODreODvOOCr+ODqeOCueOBp+OBmeOAglxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbkdsb3cgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRCB7XG5cbiAgLyoqIOOCuOOCquODoeODiOODqiAqL1xuICBwcml2YXRlIF9nZW9tZXRyeTpUSFJFRS5TcGhlcmVHZW9tZXRyeTtcbiAgLyoqIOODnuODhuODquOCouODqyAqL1xuICBwcml2YXRlIF9tYXRlcmlhbDpUSFJFRS5TaGFkZXJNYXRlcmlhbDtcbiAgLyoqIOODoeODg+OCt+ODpSAqL1xuICBwcml2YXRlIF9tZXNoOlRIUkVFLk1lc2g7XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv+ODvFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyDjgrjjgqrjg6Hjg4jjg6pcbiAgICB0aGlzLl9nZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgyLjA3LCAyMCwgMjApO1xuXG4gICAgLy8g44Kr44Oh44OpXG4gICAgbGV0IGNhbWVyYSA9IENhbWVyYS5nZXRJbnN0YW5jZSgpO1xuXG4gICAgLy8g44Oe44OG44Oq44Ki44OrXG4gICAgdGhpcy5fbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgZ2xvd0NvbG9yOiB7dHlwZTogXCJjXCIsIHZhbHVlOiBuZXcgVEhSRUUuQ29sb3IoMHg5NmVjZmYpfSxcbiAgICAgICAgdmlld1ZlY3Rvcjoge3R5cGU6IFwidjNcIiwgdmFsdWU6IGNhbWVyYS5wb3NpdGlvbn1cbiAgICAgIH0sXG4gICAgICB2ZXJ0ZXhTaGFkZXI6IGBcbiAgICAgICAgdW5pZm9ybSB2ZWMzIHZpZXdWZWN0b3I7ICAgIC8vIOOCq+ODoeODqeS9jee9rlxuICAgICAgICB2YXJ5aW5nIGZsb2F0IG9wYWNpdHk7ICAgICAgLy8g6YCP5piO5bqmXG4gICAgICAgIHZvaWQgbWFpbigpXG4gICAgICAgIHtcbiAgICAgICAgICAvLyDpoILngrnms5Xnt5rjg5njgq/jg4jjg6sgeFxuICAgICAgICAgIHZlYzMgbk5vbWFsID0gbm9ybWFsaXplKG5vcm1hbCk7XG4gICAgICAgICAgdmVjMyBuVmlld1ZlYyA9IG5vcm1hbGl6ZSh2aWV3VmVjdG9yKTtcblxuICAgICAgICAgIC8vIOmAj+aYjuW6plxuICAgICAgICAgIG9wYWNpdHkgPSBkb3Qobk5vbWFsLCBuVmlld1ZlYyk7XG4gICAgICAgICAgLy8g5Y+N6LuiXG4gICAgICAgICAgb3BhY2l0eSA9IDEuMCAtIG9wYWNpdHk7XG5cbiAgICAgICAgICAvLyDjgYrmsbrjgb7jgopcbiAgICAgICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KHBvc2l0aW9uLCAxLjApO1xuICAgICAgICB9XG4gICAgICBgLFxuICAgICAgZnJhZ21lbnRTaGFkZXI6IGBcbiAgICAgICAgdW5pZm9ybSB2ZWMzIGdsb3dDb2xvcjtcbiAgICAgICAgdmFyeWluZyBmbG9hdCBvcGFjaXR5O1xuICAgICAgICB2b2lkIG1haW4oKVxuICAgICAgICB7XG4gICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChnbG93Q29sb3IsIG9wYWNpdHkpO1xuICAgICAgICB9XG4gICAgICBgLFxuICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICB0cmFuc3BhcmVudDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgLy8g44Oh44OD44K344OlXG4gICAgdGhpcy5fbWVzaCA9IG5ldyBUSFJFRS5NZXNoKFxuICAgICAgdGhpcy5fZ2VvbWV0cnksXG4gICAgICB0aGlzLl9tYXRlcmlhbFxuICAgICk7XG4gICAgdGhpcy5hZGQodGhpcy5fbWVzaCk7XG4gIH1cbn1cbiIsIi8qKlxuICog44Oe44Kw44Oe55CD44Kv44Op44K544Gn44GZ44CCXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hZ21hIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Qge1xuXG4gIC8qKiDjgrjjgqrjg6Hjg4jjg6ogKi9cbiAgcHJpdmF0ZSBfZ2VvbWV0cnk6VEhSRUUuU3BoZXJlR2VvbWV0cnk7XG4gIC8qKiDjgqvjg6njg7zjg57jg4Pjg5cgKi9cbiAgcHJpdmF0ZSBfbWFwOlRIUkVFLlRleHR1cmU7XG4gIC8qKiDjg57jg4bjg6rjgqLjg6sgKi9cbiAgcHJpdmF0ZSBfbWF0ZXJpYWw6VEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWw7XG4gIC8qKiDjg6Hjg4Pjgrfjg6UgKi9cbiAgcHJpdmF0ZSBfbWVzaDpUSFJFRS5NZXNoO1xuXG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr/jg7xcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8g44K444Kq44Oh44OI44OqXG4gICAgdGhpcy5fZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMiwgMjAsIDIwKTtcblxuICAgIC8vIOOCq+ODqeODvOODnuODg+ODl1xuICAgIGxldCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgIHRoaXMuX21hcCA9IGxvYWRlci5sb2FkKCcuL2Fzc2V0cy90ZXh0dXJlL21hZ21hLnBuZycpO1xuICAgIHRoaXMuX21hcC53cmFwUyA9IHRoaXMuX21hcC53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuXG4gICAgLy8g44Oe44OG44Oq44Ki44OrXG4gICAgdGhpcy5fbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgbWFwOiB0aGlzLl9tYXBcbiAgICB9KTtcblxuICAgIC8vIOODoeODg+OCt+ODpVxuICAgIHRoaXMuX21lc2ggPSBuZXcgVEhSRUUuTWVzaChcbiAgICAgIHRoaXMuX2dlb21ldHJ5LFxuICAgICAgdGhpcy5fbWF0ZXJpYWxcbiAgICApO1xuICAgIHRoaXMuYWRkKHRoaXMuX21lc2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODleODrOODvOODoOavjuOBruabtOaWsFxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpIHtcbiAgICBpZih0aGlzLl9tYXApIHtcbiAgICAgIHRoaXMuX21hcC5vZmZzZXQueCArPSAwLjAwNztcbiAgICAgIHRoaXMuX21hcC5vZmZzZXQueSArPSAwLjAwODtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBNYWdtYSBmcm9tICcuL01hZ21hJztcbmltcG9ydCBBdXJhIGZyb20gJy4vQXVyYSc7XG5pbXBvcnQgSW5HbG93IGZyb20gJy4vSW5HbG93JztcbmltcG9ydCBGbGFyZUVtaXR0ZXIgZnJvbSAnLi9GbGFyZUVtaXR0ZXInO1xuaW1wb3J0IFNwYXJrRW1pdHRlciBmcm9tICcuL1NwYXJrRW1pdHRlcic7XG5pbXBvcnQgT3V0R2xvdyBmcm9tICcuL091dEdsb3cnO1xuXG4vKipcbiAqIOODnuOCsOODnuODleODrOOCouOCr+ODqeOCueOBp+OBmeOAglxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWdtYUZsYXJlIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Qge1xuXG4gIC8qKiDjg57jgrDjg54gKi9cbiAgcHJpdmF0ZSBfbWFnbWE6TWFnbWE7XG4gIC8qKiDjgqrjg7zjg6nnkIMgKi9cbiAgcHJpdmF0ZSBfYXVyYTpBdXJhO1xuICAvKiog44Kk44Oz44Kw44Ot44O8ICovXG4gIHByaXZhdGUgX2luR2xvdzpJbkdsb3c7XG4gIC8qKiDjg5Xjg6zjgqLjgqjjg5/jg4Pjgr/jg7wgKi9cbiAgcHJpdmF0ZSBfZmxhcmVFbWl0dGVyOkZsYXJlRW1pdHRlcjtcbiAgLyoqIOOCueODkeODvOOCr+OCqOODn+ODg+OCv+ODvCAqL1xuICBwcml2YXRlIF9zcGFya0VtaXR0ZXI6U3BhcmtFbWl0dGVyO1xuICAvKiog6IOM5pmv44Kw44Ot44O8ICovXG4gIHByaXZhdGUgX291dEdsb3c6T3V0R2xvdztcblxuICAvKipcbiAgICog44Kz44Oz44K544OI44Op44Kv44K/44O8XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIOODnuOCsOODnlxuICAgIHRoaXMuX21hZ21hID0gbmV3IE1hZ21hKCk7XG5cbiAgICAvLyDjgqrjg7zjg6lcbiAgICB0aGlzLl9hdXJhID0gbmV3IEF1cmEoKTtcblxuICAgIC8vIOOCpOODs+OCsOODreODvFxuICAgIHRoaXMuX2luR2xvdyA9IG5ldyBJbkdsb3coKTtcblxuICAgIC8vIOODleODrOOColxuICAgIHRoaXMuX2ZsYXJlRW1pdHRlciA9IG5ldyBGbGFyZUVtaXR0ZXIoKTtcblxuICAgIC8vIOOCueODkeODvOOCr1xuICAgIHRoaXMuX3NwYXJrRW1pdHRlciA9IG5ldyBTcGFya0VtaXR0ZXIoKTtcblxuICAgIC8vIOOCouOCpuODiOOCsOODreODvFxuICAgIHRoaXMuX291dEdsb3cgPSBuZXcgT3V0R2xvdygpO1xuXG4gICAgdGhpcy5hZGQodGhpcy5fbWFnbWEpO1xuICAgIHRoaXMuYWRkKHRoaXMuX2F1cmEpO1xuICAgIHRoaXMuYWRkKHRoaXMuX2luR2xvdyk7XG4gICAgdGhpcy5hZGQodGhpcy5fZmxhcmVFbWl0dGVyKTtcbiAgICB0aGlzLmFkZCh0aGlzLl9zcGFya0VtaXR0ZXIpO1xuICAgIHRoaXMuYWRkKHRoaXMuX291dEdsb3cpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODleODrOODvOODoOavjuOBruabtOaWsFxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpIHtcbiAgICB0aGlzLl9tYWdtYS51cGRhdGUoKTtcbiAgICB0aGlzLl9hdXJhLnVwZGF0ZSgpO1xuICAgIHRoaXMuX2ZsYXJlRW1pdHRlci51cGRhdGUoKTtcbiAgICB0aGlzLl9zcGFya0VtaXR0ZXIudXBkYXRlKCk7XG4gIH1cbn1cbiIsIi8qKlxuICog44Ki44Km44OI44Kw44Ot44O844Kv44Op44K544Gn44GZ44CCXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE91dEdsb3cgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRCB7XG5cbiAgLyoqIOOCueODl+ODqeOCpOODiCAqL1xuICBwcml2YXRlIF9zcHJpdGU6VEhSRUUuU3ByaXRlO1xuXG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr/jg7xcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8g44OG44Kv44K544OB44OjXG4gICAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgbGV0IG1hcCA9IGxvYWRlci5sb2FkKCcuL2Fzc2V0cy90ZXh0dXJlL1BhcnRpY2xlMDEucG5nJyk7XG5cbiAgICAvLyDjg57jg4bjg6rjgqLjg6tcbiAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlTWF0ZXJpYWwoe1xuICAgICAgbWFwOiBtYXAsXG4gICAgICBjb2xvcjogMHhmZmZmZmYsXG4gICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgIG9wYWNpdHk6IDAuOCxcbiAgICAgIHRyYW5zcGFyZW50OiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyDjgrnjg5fjg6njgqTjg4hcbiAgICB0aGlzLl9zcHJpdGUgPSBuZXcgVEhSRUUuU3ByaXRlKG1hdGVyaWFsKTtcbiAgICB0aGlzLl9zcHJpdGUuc2NhbGUubXVsdGlwbHlTY2FsYXIoMTEpO1xuICAgIHRoaXMuYWRkKHRoaXMuX3Nwcml0ZSk7XG4gIH1cbn1cbiIsImltcG9ydCBDYW1lcmEgZnJvbSAnLi4vQ2FtZXJhJztcblxuLyoqXG4gKiDjgrnjg5Hjg7zjgq/jgq/jg6njgrlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhcmsgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRCB7XG5cbiAgLyoqIOOCuOOCquODoeODiOODqiAqL1xuICBwcml2YXRlIF9nZW9tZXRyeTpUSFJFRS5QbGFuZUdlb21ldHJ5O1xuICAvKiog44Kr44Op44O844Oe44OD44OXICovXG4gIHByaXZhdGUgX21hcDpUSFJFRS5UZXh0dXJlO1xuICAvKiog44Oe44OG44Oq44Ki44OrICovXG4gIHByaXZhdGUgX21hdGVyaWFsOlRIUkVFLk1hdGVyaWFsO1xuICAvKiog44Oh44OD44K344OlICovXG4gIHByaXZhdGUgX21lc2g6VEhSRUUuTWVzaDtcblxuICAvKiog44K544OU44O844OJICovXG4gIHByaXZhdGUgX3NwZWVkOm51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAwLjIgKyAwLjI7XG4gIC8qKiDpgI/mmI7luqYgKi9cbiAgcHJpdmF0ZSBfb3BhY2l0eTpudW1iZXIgPSAwLjU7XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv+ODvFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyDjgrjjgqrjg6Hjg4jjg6pcbiAgICB0aGlzLl9nZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDAuMTUsIDIpO1xuXG4gICAgLy8g44Kr44Op44O844Oe44OD44OXXG4gICAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgdGhpcy5fbWFwID0gbG9hZGVyLmxvYWQoJy4vYXNzZXRzL3RleHR1cmUvQnVyc3QwMS5wbmcnKTtcbiAgICB0aGlzLl9tYXAud3JhcFMgPSB0aGlzLl9tYXAud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcblxuICAgIC8vIOODnuODhuODquOCouODq1xuICAgIHRoaXMuX21hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgIG1hcDogdGhpcy5fbWFwLFxuICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgICAgZGVwdGhXcml0ZTogZmFsc2UsXG4gICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgIG9wYWNpdHk6IHRoaXMuX29wYWNpdHlcbiAgICB9KTtcblxuICAgIC8vIOODoeODg+OCt+ODpVxuICAgIHRoaXMuX21lc2ggPSBuZXcgVEhSRUUuTWVzaChcbiAgICAgIHRoaXMuX2dlb21ldHJ5LFxuICAgICAgdGhpcy5fbWF0ZXJpYWxcbiAgICApO1xuICAgIHRoaXMuX21lc2gucG9zaXRpb24ueSA9IE1hdGgucmFuZG9tKCkgKiA1O1xuICAgIHRoaXMuX21lc2gucm90YXRpb24ueSA9IE1hdGgucmFuZG9tKCkgKiAyO1xuICAgIHRoaXMuYWRkKHRoaXMuX21lc2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODleODrOODvOODoOavjuOBruabtOaWsFxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpIHtcbiAgICB0aGlzLl9tZXNoLnBvc2l0aW9uLnkgLT0gdGhpcy5fc3BlZWQ7XG4gICAgdGhpcy5fbWVzaC5tYXRlcmlhbC5vcGFjaXR5IC09IDAuMDU7XG4gICAgaWYodGhpcy5fbWVzaC5wb3NpdGlvbi55IDwgMCkge1xuICAgICAgdGhpcy5fbWVzaC5wb3NpdGlvbi55ID0gNjtcbiAgICAgIHRoaXMuX21lc2gubWF0ZXJpYWwub3BhY2l0eSA9IHRoaXMuX29wYWNpdHk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU3BhcmsgZnJvbSAnLi9TcGFyayc7XG5cbi8qKlxuICog44K544OR44O844Kv44Gu44Ko44Of44OD44K/44O844Kv44Op44K5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwYXJrRW1pdHRlciBleHRlbmRzIFRIUkVFLk9iamVjdDNEIHtcblxuICAvKiog44K544OR44O844Kv44Oq44K544OIICovXG4gIHByaXZhdGUgX3NwYXJrTGlzdDpTcGFya1tdID0gW107XG4gIC8qKiDjgrnjg5Hjg7zjgq/jga7mlbAgKi9cbiAgcHJpdmF0ZSBfc3BhcmtOdW06bnVtYmVyID0gNTA7XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv+ODvFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBsZXQgcGVyQW5nbGUgPSAzNjAgLyB0aGlzLl9zcGFya051bTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5fc3BhcmtOdW07IGkrKykge1xuICAgICAgbGV0IHJhZCA9IHBlckFuZ2xlICogaSAqIE1hdGguUEkgLyAxODA7XG4gICAgICBsZXQgc3BhcmsgPSBuZXcgU3BhcmsoKTtcbiAgICAgIHNwYXJrLnJvdGF0aW9uLnggPSAzNjAgKiBNYXRoLnNpbihyYWQpO1xuICAgICAgc3Bhcmsucm90YXRpb24ueiA9IHJhZDtcbiAgICAgIHRoaXMuYWRkKHNwYXJrKTtcbiAgICAgIHRoaXMuX3NwYXJrTGlzdC5wdXNoKHNwYXJrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog44OV44Os44O844Og5q+O44Gu5pu05pawXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlKCkge1xuICAgIHRoaXMuX3NwYXJrTGlzdC5mb3JFYWNoKChzcGFyazpTcGFyaykgPT4ge1xuICAgICAgc3BhcmsudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
