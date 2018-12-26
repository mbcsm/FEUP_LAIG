var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;


/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.matCounter = 0;


        this.referenceLength;
        this.root;
        this.views = [];
        this.near;
        this.far;
        this.ambient = [];
        this.background = [];
        this.lights = [];
        this.spot = [];
        this.omni = [];
        this.textures = [];
        this.materials = [];
        this.animations = [];
        this.primitives = [];
        this.transforms = [];
        this.components = [];

        this.pieces = [];

        this.game = [[1,1,1,1,1,1,1,1],
                    [0,0,0,2,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,4,0,0,0],
                    [3,3,3,3,3,3,3,3]];



        this.textTest = new CGFtexture(this.scene, "./scenes/images/court_text.jpg");

        this.nodes = [];

        this.texture_united_states = new CGFtexture(this.scene, "scenes/images/united_states.png");
        this.texture_shit = new CGFtexture(this.scene, "scenes/images/shit.jpg");

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();

    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";


        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }
        //<views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }
        //<ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        //<lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        //textures
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }
        //<material>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        //transformations
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <tranformations> out of order");
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        //<Animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        //<primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        //<components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <Scene> block.
     */
    parseScene(sceneNode) {
        this.root = this.reader.getString(sceneNode, 'root');
        this.referenceLength = this.reader.getFloat(sceneNode, 'axis_length');

        this.scene.referenceLength = this.referenceLength;

        this.log("Scene Parsed");

        return null;
    }
    /**
     * Parses the <views> block.
     */
    parseViews(viewsNodes) {

        var perspectiveElements = viewsNodes.getElementsByTagName('perspective');
        var orthoElements = viewsNodes.getElementsByTagName('ortho');


        for (let perspectiveElement of perspectiveElements) {
            var idVal = this.reader.getString(perspectiveElement, 'id');
            var nearVal = this.reader.getFloat(perspectiveElement, 'near');
            var farVal = this.reader.getFloat(perspectiveElement, 'far');
            var angleVal = this.reader.getFloat(perspectiveElement, 'angle');

            //TODO: Write geCoords Function
            var fromVal = this.getCoords(perspectiveElement.getElementsByTagName('from')[0]);
            var toVal = this.getCoords(perspectiveElement.getElementsByTagName('to')[0]);

            var vecFromVal = new vec3.fromValues(fromVal.xCoord, fromVal.yCoord, fromVal.zCoord);
            var vecToVal = new vec3.fromValues(toVal.xCoord, toVal.yCoord, toVal.zCoord);

            var cameraVal = new CGFcamera(angleVal * DEGREE_TO_RAD,
                nearVal,
                farVal,
                vecFromVal,
                vecToVal);

            cameraVal.fov = 1;

            var mCamera = {
                id: idVal,
                camera: cameraVal
            };
            this.views.push(mCamera);
        }
        for (let orthoElement of orthoElements) {

            var idVal = this.reader.getString(orthoElement, 'id');
            var nearVal = this.reader.getFloat(orthoElement, 'near');
            var farVal = this.reader.getFloat(orthoElement, 'far');
            var bottomVal = this.reader.getFloat(orthoElement, 'bottom');
            var topVal = this.reader.getFloat(orthoElement, 'top');
            var rightVal = this.reader.getFloat(orthoElement, 'right');
            var leftVal = this.reader.getFloat(orthoElement, 'left');

            var upVal = new vec3.fromValues(0, 1, 0);
            var positionVal = new vec3.fromValues(6, 0, 0);
            var targetVal = new vec3.fromValues(0, 0, 0);

            var cameraVal = new CGFcameraOrtho(leftVal,
                rightVal,
                bottomVal,
                topVal,
                nearVal,
                farVal,
                positionVal,
                targetVal,
                upVal);

            cameraVal.fov = 1;

            var mCamera = {
                id: idVal,
                camera: cameraVal
            };
            this.views.push(mCamera);
        }


        this.log("views parsed");
    }

    /* parses the <ambient> block */
    parseAmbient(ambientNodes) {

        var ambientChild = ambientNodes.getElementsByTagName('ambient')[0];
        var backgroundChild = ambientNodes.getElementsByTagName('background')[0];

        this.background = this.getRGBArray(ambientChild);
        this.ambient = this.getRGBArray(backgroundChild);

        this.log("ambient Parsed");
    }
    /* parses the <lights> block */
    parseLights(LightNodes) {

        var i = 0;

        var omniNodes = LightNodes.getElementsByTagName('omni');
        var spotNodes = LightNodes.getElementsByTagName('spot');

        for (let omni of omniNodes) {

            var typeVal = 'omni';

            var idVal = this.reader.getString(omni, 'id');
            var enabledVal = this.reader.getBoolean(omni, 'enabled');

            var ambientVal = this.getRGBArray(omni.getElementsByTagName('ambient')[0]);
            var diffuseVal = this.getRGBArray(omni.getElementsByTagName('diffuse')[0]);
            var specularVal = this.getRGBArray(omni.getElementsByTagName('specular')[0]);
            var locationVal = this.getCoords(omni.getElementsByTagName('location')[0])

            var omniArray = {
                key: i,
                id: idVal,
                enabled: enabledVal,
                ambient: ambientVal,
                diffuse: diffuseVal,
                specular: specularVal,
                location: locationVal,
                type: typeVal
            }

            i++;

            this.lights.push(omniArray);
        }


        for (let spot of spotNodes) {

            var typeVal = 'spot';

            var idVal = this.reader.getString(spot, 'id');
            var enabledVal = this.reader.getBoolean(spot, 'enabled');
            var exponentVal = this.reader.getFloat(spot, 'exponent');
            var angleVal = this.reader.getFloat(spot, 'angle');


            var ambientVal = this.getRGBArray(spot.getElementsByTagName('ambient')[0]);
            var diffuseVal = this.getRGBArray(spot.getElementsByTagName('diffuse')[0]);
            var specularVal = this.getRGBArray(spot.getElementsByTagName('specular')[0]);
            var locationVal = this.getCoords(spot.getElementsByTagName('location')[0]);
            var targetVal = this.getCoords(spot.getElementsByTagName('target')[0]);

            var spotArray = {
                key: i,
                id: idVal,
                enabled: enabledVal,
                angle: (angleVal * DEGREE_TO_RAD),
                exponent: exponentVal,
                ambient: ambientVal,
                diffuse: diffuseVal,
                specular: specularVal,
                location: locationVal,
                target: targetVal,
                type: typeVal
            }

            i++;

            this.lights.push(spotArray);
        }
        this.log("light Parsed");
    }

    /**
     * Parses the <TEXTURES> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // TODO: Parse block
        var textureElements = texturesNode.getElementsByTagName('texture');


        for (let textureElem of textureElements) {
            var idVal = this.reader.getString(textureElem, 'id');
            var urlVal = this.reader.getString(textureElem, 'file');

            var textureVal = new CGFtexture(this.scene, "./scenes/" + urlVal);

            var textureArray = {
                id: idVal,
                texture: textureVal
            }

            this.textures.push(textureArray);

        }

        console.log("Parsed textures");

        return null;
    }

    /* parses the <materials> block */
    parseMaterials(materialsNodes) {

        var materialNodes = materialsNodes.getElementsByTagName('material');

        for (let material of materialNodes) {


            var idVal = this.reader.getString(material, 'id');
            var shininessVal = this.reader.getFloat(material, 'shininess');

            var emissionVal = this.getRGBArray(material.getElementsByTagName('emission')[0]);
            var ambientVal = this.getRGBArray(material.getElementsByTagName('ambient')[0]);
            var diffuseVal = this.getRGBArray(material.getElementsByTagName('diffuse')[0]);
            var specularVal = this.getRGBArray(material.getElementsByTagName('specular')[0]);

            var appearanceVal = new CGFappearance(this.scene);
            appearanceVal.setEmission(emissionVal.r, emissionVal.g, emissionVal.b, emissionVal.a);
            appearanceVal.setAmbient(ambientVal.r, ambientVal.g, ambientVal.b, ambientVal.a);
            appearanceVal.setDiffuse(diffuseVal.r, diffuseVal.g, diffuseVal.b, diffuseVal.a);
            appearanceVal.setSpecular(specularVal.r, specularVal.g, specularVal.b, specularVal.a);
            appearanceVal.setShininess(shininessVal);
            appearanceVal.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

            var materialArray = {
                id: idVal,
                appearance: appearanceVal
            }

            this.materials.push(materialArray);

        }

        this.log("material Parsed");
    }
    parseTransformations(transformationsNodes) {

        var transformationsElements = transformationsNodes.getElementsByTagName('transformation');


        for (let transformation of transformationsElements) {
            var idVal = this.reader.getString(transformation, 'id');

            this.transforms.push(this.transformationBuilder(transformation, idVal));

        }
        this.log("Parsed transformations");
    }
    transformationBuilder(transformation, idVal) {
        var mat = mat4.create();
        mat4.identity(mat);



        var transformsRead = [];

        for (let t of transformation.children) {

            var attributeArray = [];

            for (let transfAttributes of t.attributes) {
                var attribute = {
                    name: transfAttributes.nodeName,
                    val: transfAttributes.nodeValue
                };
                attributeArray.push(attribute);
            }

            var trfTag = {
                name: t.nodeName,
                attributes: attributeArray
            };


            transformsRead.push(trfTag);
        }


        for (var i = transformsRead.length - 1; i >= 0; i--) {
            var trf = transformsRead[i];
            if (trf.name == 'translate') {
                var x = trf.attributes[0].val;
                var y = trf.attributes[1].val;
                var z = trf.attributes[2].val;

                mat4.translate(mat, mat, [x, y, z]);

                //fazer check que a translation foi introduzida corretamente no xml

            } else if (trf.name == 'rotate') {

                var axis = trf.attributes[0].val;
                var angle = trf.attributes[1].val;

                var rotArray = [];

                if (axis == 'x') {
                    rotArray.push(1);
                    rotArray.push(0);
                    rotArray.push(0);
                } else if (axis == 'y') {
                    rotArray.push(0);
                    rotArray.push(1);
                    rotArray.push(0);
                } else if (axis == 'z') {
                    rotArray.push(0);
                    rotArray.push(0);
                    rotArray.push(1);
                }


                mat4.rotate(mat, mat, DEGREE_TO_RAD * parseFloat(angle), rotArray);

            } else if (trf.name == 'scale') {
                var x = trf.attributes[0].val;
                var y = trf.attributes[1].val;
                var z = trf.attributes[2].val;

                mat4.scale(mat, mat, [x, y, z]);

            }
        }

        var object = {
            id: idVal,
            mat: mat
        };

        return object;
    }

    /* parses the <animations> block */
    parseAnimations(animationsNodes) {

        var linearAnimations = animationsNodes.getElementsByTagName('linear');
        var circularAnimations = animationsNodes.getElementsByTagName('circular');


        for (let linear of linearAnimations) {
            var idVal = this.reader.getString(linear, 'id');
            var spanVal = this.reader.getFloat(linear, 'span');

            var controlPointsArray = [];
            var controlPoints = animationsNodes.getElementsByTagName('controlpoint');
            for (let point of controlPoints) {
                var xVal = this.reader.getFloat(point, 'xx');
                var yVal = this.reader.getFloat(point, 'yy');
                var zVal = this.reader.getFloat(point, 'zz');
                controlPointsArray.push(new vec3.fromValues(xVal, yVal, zVal));
            }

            var object = {
                id: idVal,
                type: "linear",
                span: spanVal,
                points: controlPointsArray
            };

            this.animations.push(object);
        }
        for (let circular of circularAnimations) {
            var idVal = this.reader.getString(circular, 'id');
            var spanVal = this.reader.getFloat(circular, 'span');
            var centerVal = this.reader.getString(circular, 'center');
            var radiusVal = this.reader.getFloat(circular, 'radius');
            var startangVal = this.reader.getFloat(circular, 'startang');
            var rotangVal = this.reader.getFloat(circular, 'rotang');


            var coord = centerVal.split(" ");
            var x = parseFloat(coord[0]);
            var centerVal = new vec3.fromValues(parseFloat(coord[0]), parseFloat(coord[1]), parseFloat(coord[2]));

            var object = {
                id: idVal,
                type: "circular",
                span: spanVal,
                center: centerVal,
                radius: radiusVal,
                startang: startangVal,
                rotang: rotangVal
            };

            this.animations.push(object);
        }
        this.log("Parsed animations");
    }
    /* parses the <primitives> block */
    parsePrimitives(primitivesNodes) {

        var primitiveNodes = primitivesNodes.getElementsByTagName('primitive');

        for (let primitive of primitiveNodes) {

            var idVal = this.reader.getString(primitive, 'id');

            var prim = primitive.children[0];

            var attributeArray = [];

            for (let primAttributes of prim.attributes) {
                var attribute = {
                    name: primAttributes.nodeName,
                    val: parseFloat(primAttributes.nodeValue)
                };
                attributeArray.push(attribute)
            }

            var primitiveObject = {
                id: idVal,
                name: prim.nodeName,
                attributes: attributeArray
            };

            var primitiveBuilt = {
                id: idVal,
                object: this.primitiveBuilder(primitiveObject, primitive)
            }
            this.primitives.push(primitiveBuilt);
        }

        this.log("primitives Parsed");
    }

    primitiveBuilder(object, primitive) {
        var primitiveBuilt;

        switch (object.name) {
            case "rectangle":
                var x1 = object.attributes[0].val;
                var y1 = object.attributes[1].val;
                var x2 = object.attributes[2].val;
                var y2 = object.attributes[3].val;

                primitiveBuilt = new MyQuad(this.scene, x1, y1, x2, y2, 0.0, 1.0, 0.0, 1.0);

                break;

            case "triangle":
                var x1 = object.attributes[0].val;
                var y1 = object.attributes[1].val;
                var z1 = object.attributes[2].val;
                var x2 = object.attributes[3].val;
                var y2 = object.attributes[4].val;
                var z2 = object.attributes[5].val;
                var x3 = object.attributes[6].val;
                var y3 = object.attributes[7].val;
                var z3 = object.attributes[8].val;

                primitiveBuilt = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3, 0.0, 1.0, 0.0, 1.0);

                break;

            case "cylinder":
                var base = object.attributes[0].val;
                var top = object.attributes[1].val;
                var height = object.attributes[2].val;
                var slices = object.attributes[3].val;
                var stacks = object.attributes[4].val;;
                primitiveBuilt = new MyCylinder(this.scene, base, top, height, slices, stacks);
                break;

            case "sphere":
                var radius = object.attributes[0].val;
                var slices = object.attributes[1].val;
                var stacks = object.attributes[2].val;

                primitiveBuilt = new MySphere(this.scene, radius, slices, stacks);
                break;

            case "torus":
                var inner = object.attributes[0].val;
                var outer = object.attributes[1].val;
                var slices = object.attributes[2].val;
                var loops = object.attributes[3].val;

                primitiveBuilt = new MyTorus(this.scene, inner, outer, slices, loops);
                break;
            case 'plane':
                var partsX = object.attributes[0].val;
                var partsY = object.attributes[1].val;

                primitiveBuilt = new MyPlane(this.scene, partsX, partsY);
                break;

            case 'patch':

                var primitiveTag = primitive.getElementsByTagName('controlpoint');


                var orderU = object.attributes[0].val;
                var orderV = object.attributes[1].val;
                var partsU = object.attributes[2].val;
                var partsV = object.attributes[3].val;

              
                var controlPoints = [];
                for (let controlPoint of primitiveTag) {
                    var xVal = controlPoint.attributes[0].nodeValue;
                    var yVal = controlPoint.attributes[1].nodeValue;
                    var zVal = controlPoint.attributes[2].nodeValue;

                    controlPoints.push(new vec3.fromValues(xVal, yVal, zVal));
                }

                primitiveBuilt = new MyPatch(this.scene, orderU, orderV, partsU, partsV, controlPoints);
                
                break;
            case 'cylinder2':
                var base = object.attributes[0].val;
                var top = object.attributes[1].val;
                var height = object.attributes[2].val;
                var slices = object.attributes[3].val;
                var stacks = object.attributes[4].val;;
                primitiveBuilt = new MyCylinder2(this.scene, base, top, height, slices, stacks);
                break;
            case 'terrain':
                var idtexture = primitive.childNodes[1].attributes[0].nodeValue;
                var idheightmap = primitive.childNodes[1].attributes[1].nodeValue;
                var parts = object.attributes[2].val;
                var heightscale = object.attributes[3].val;

                var texture;
                var heightmap;
                for (let text of this.textures) {
                    if (text.id == idtexture) {
                        texture = text.texture;
                    }
                    if (text.id == idheightmap) {
                        heightmap = text.texture;
                    }
                }

                primitiveBuilt = new MyTerrain(this.scene, texture, heightmap, parts, heightscale);
                break;
            case 'water':
                var idtexture = primitive.childNodes[1].attributes[0].nodeValue;
                var idheightmap = primitive.childNodes[1].attributes[1].nodeValue;
                var parts = object.attributes[2].val;
                var heightscale = object.attributes[3].val;

                var texture;
                var heightmap;

                for (let text of this.textures) {
                    if (text.id == idtexture) {
                        texture = text.texture;
                    }
                    if (text.id == idheightmap) {
                        heightmap = text.texture;
                    }
                }

                primitiveBuilt = new MyWater(this.scene, texture, heightmap, parts, heightscale);
                break;
        }


        return primitiveBuilt;

    }

    /* parses the <component> block */
    parseComponents(componentNodes) {

        var componentNodes = componentNodes.getElementsByTagName('component');

        for (let component of componentNodes) {


            var transformationBuilt;
            var materialBuilt = [];
            var textureBuilt;
            var childrenArray = [];
            var animationsArray = [];


            var idVal = this.reader.getString(component, 'id');


            var transformationNode = component.getElementsByTagName('transformation')[0];
            var materialsNode = component.getElementsByTagName('materials')[0];
            var animationsNode = component.getElementsByTagName('animations')[0];
            var textureNode = component.getElementsByTagName('texture')[0];
            var childrenNode = component.getElementsByTagName('children')[0];


            //Transformation         
            if (transformationNode.children.length > 0) {
                if (transformationNode.children[0].nodeName == "transformationref") {
                    var transformationRef = transformationNode.children[0].attributes[0].nodeValue;

                    for (var i = 0; i < this.transforms.length; i++) {
                        if (this.transforms[i].id == transformationRef) {
                            transformationBuilt = this.transforms[i];
                        }
                    }

                } else {
                    transformationBuilt = this.transformationBuilder(transformationNode, "null");
                }
            }




            //animation
            if (animationsNode != null) {
                var time = 0;
                for (let animation of animationsNode.children) {
                    var animationRef = animation.attributes[0].nodeValue;
                    for (var i = 0; i < this.animations.length; i++) {
                        if (this.animations[i].id == animationRef) {
                            switch (this.animations[i].type) {
                                case "linear":
                                    animationsArray.push(new LinearAnimation(this.scene, this.animations[i].points, this.animations[i].span * 1000, time * 1000));
                                    time += this.animations[i].span;
                                    break;
                                case "circular":
                                    animationsArray.push(new CircularAnimation(this.scene, this.animations[i].center, this.animations[i].radius, this.animations[i].startang, this.animations[i].rotang, this.animations[i].span * 1000, time * 1000));
                                    time += this.animations[i].span;
                                    break;
                            }
                        }
                    }
                }
            }
            var animationObj = {
                index: 0,
                anim: animationsArray
            };


            var n = 0;
            //material
            for (let k of materialsNode.children) {
                var materialRef = k.attributes[0].nodeValue;
                if (materialRef == "inherit")
                    materialBuilt[n] = materialRef;
                for (let mat of this.materials) {
                    if (mat.id == materialRef) {
                        materialBuilt[n] = mat.appearance;
                    }
                }
                n++;
            }




            //texture
            var lengthSRef;
            var lengthTRef;
            var textureRef = textureNode.attributes[0].nodeValue;
            if (textureRef == "inherit" || textureRef == "none") {
                textureBuilt = textureRef;
            } else {
                if (textureNode.attributes.length > 1) {
                    lengthSRef = textureNode.attributes[1].nodeValue;
                    lengthTRef = textureNode.attributes[2].nodeValue;
                }
                var textureVal;
                for (let text of this.textures) {
                    if (text.id == textureRef) {
                        textureVal = text.texture;
                    }
                }
                var materialObj = {
                    id: textureRef,
                    texture: textureVal,
                    length_s: lengthSRef,
                    length_t: lengthTRef
                };
                textureBuilt = materialObj;
            }


            //children
            for (let childrenChild of childrenNode.children) {
                var childrenRef = this.reader.getString(childrenChild, "id");
                var childrenType = childrenChild.nodeName;
                var childrenObj = {
                    type: childrenType,
                    ref: childrenRef
                };

                childrenArray.push(childrenObj);
            }

            var pickingVal = false;
            if(idVal.charAt(0) == "s")
                pickingVal = true;

            var componentArray = {
                id: idVal,
                transformation: transformationBuilt,
                material: materialBuilt,
                texture: textureBuilt,
                animation: animationObj,
                picking: pickingVal,
                children: childrenArray
            }
            console.log(componentArray);

            this.components.push(componentArray);

        }

        this.log("components Parsed");
    }




    /*
     * Translate Element Coords into an usable x,y,z object
     * @param {string} element coords
     */
    getRGBArray(xmlRGB) {
        var rVal = this.reader.getFloat(xmlRGB, 'r');
        var gVal = this.reader.getFloat(xmlRGB, 'g');
        var bVal = this.reader.getFloat(xmlRGB, 'b');
        var aVal = this.reader.getFloat(xmlRGB, 'a');

        var rgb = {
            r: rVal,
            g: gVal,
            b: bVal,
            a: aVal
        };
        return rgb;
    }
    /*
     * Translate Element Coords into an usable x,y,z object
     * @param {string} element coords
     */
    getCoords(xmlCoords) {
        var x = this.reader.getFloat(xmlCoords, 'x');
        var y = this.reader.getFloat(xmlCoords, 'y');
        var z = this.reader.getFloat(xmlCoords, 'z');
        if (xmlCoords.attributes.length == 4)
            var w = this.reader.getFloat(xmlCoords, 'w');

        var coords = {
            xCoord: x,
            yCoord: y,
            zCoord: z,
            wCoord: w
        };
        return coords;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }



    createPieces(){
        this.pieces = [];
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){

                if(this.game[i][j] == 0){
                    var piece = {
                        id: "blank_" + i + "_" + j,
                        transformation: null,
                        selected : false,
                        moving: false,
                        animation: null,
                        x: i,
                        y:j,
                        object: null
                    }
                    continue;
                }

                var object;
                var pieceVal;
                switch(this.game[i][j]){
                    case 1:
                        object = new MyPawn(this.scene,this.texture_united_states);
                        pieceVal = 1;
                        break;
                    case 2:
                        object = new MyKing(this.scene,this.texture_united_states);
                        pieceVal = 2;
                        break;
                    case 3:
                        object = new MyPawn(this.scene,this.texture_shit);
                        pieceVal = 3;
                        break;
                    case 4:
                        object = new MyKing(this.scene,this.texture_shit);
                        pieceVal = 4;
                        break;
                }


                var idVal = "piece" + i + "_" + j;

                var x = 0.15*i - 0.53;
                var y = 0;
                var z = 0.15*j - 0.52;


                var piece = {
                    id: idVal,
                    transformation: [x, y, z],
                    transformationAfterAnim: null,
                    selected : false,
                    moving: false,
                    animation: null,
                    x: i,
                    y:j,
                    pieceVal: pieceVal,
                    object: object
                }
                this.pieces.push(piece);
            }
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene(startTime) {
        this.pickingIndex = 0;
        this.startTime = startTime;
        this.graphLoop(this.root, null, null, null, startTime);
        this.showPieces();
    }


    graphLoop(root, text, mat, anim) {        
        var component;
        var texture = text;
        var material = mat;
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i].id == root) {
                component = this.components[i];
            }
        }
        if (component == null) {
            console.error("The component " + root + " does not exist");
            return 1;
        }

        if (component.transformation != null)
            this.scene.multMatrix(component.transformation.mat);


        
        if (component.texture != null && component.texture != "inherit")
            texture = component.texture;
        if (component.material[this.matCounter] != null && component.material[this.matCounter] != "inherit")
            material = component.material[this.matCounter];
        if (texture != "none" && texture != null && material != null)
            material.setTexture(texture.texture);
        if (component.texture != null && component.texture == "none")
            material.setTexture(null);



        this.scene.pushMatrix();
        if (component.animation.anim.length > 0) {
            for (let animation of component.animation.anim) {
                var currentTime = new Date().getTime();
                animation.apply(currentTime - this.startTime);
            }
        }

        for (let children of component.children) {
            this.scene.pushMatrix();

            if (children.type == 'primitiveref') {
                for (var i = 0; i < this.primitives.length; i++) {
                    if (this.primitives[i].id == component.children[0].ref) {
                        if (material != null)
                            material.apply();


                        if(this.scene.pickMode){
                            if(component.picking){
                                this.pickingIndex++;
                                this.scene.registerForPick(this.pickingIndex, this.primitives[i]);
                                this.primitives[i].object.display();
                            }
                        }
                        else if(!component.picking)
                            this.primitives[i].object.display();

                    }
                }
            } else {
                this.graphLoop(children.ref, texture, material);
            }

            this.scene.popMatrix();
        }
        this.scene.popMatrix();
        return 0;
    }

    showPieces(){
        for (let piece of this.pieces) {
            this.scene.pushMatrix();
            this.scene.translate(piece.transformation[0], piece.transformation[1], piece.transformation[2]);

            if (piece.animation!= null) {
                var ended = piece.animation.apply(new Date().getTime() - this.startTime);
                if(ended){
                    piece.transformation = piece.transformationAfterAnim;
                    piece.animation = null;
                }
            }
    
            if(!this.scene.pickMode)
                piece.object.display();
            this.scene.popMatrix();
        }
    }
}